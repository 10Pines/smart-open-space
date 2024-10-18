import { Anchor, Box, Button, DataTable, Layer, Text } from 'grommet';
import ButtonLoading from '#shared/ButtonLoading';
import {
  DeleteIcon,
  EditIcon,
  QueueIcon,
  ScheduleIcon,
  TransactionIcon,
} from '#shared/icons';
import React, { useEffect, useState } from 'react';
import { usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';
import { deleteTalk } from '#api/os-client';

const TalkTable = ({ talks, reloadTalks, openSpaceId }) => {
  const [selectedToEditTalkId, setSelectedToEditTalkId] = useState(null);
  const [selectedToDeleteTalkId, setSelectedToDeleteTalkId] = useState(null);
  const [deleteSelectedTalkId, setDeleteSelectedTalkId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState();
  const pushToTalk = usePushToTalk(useParams().id, selectedToEditTalkId);

  const assignedTalks = talks
    ? talks[0].slots.map((slot) => {
        return {
          id: slot.talk.id,
          startTime: slot.slot.startTime,
          date: slot.slot.date,
        };
      })
    : [];

  useEffect(() => {
    if (selectedToEditTalkId) {
      pushToTalk();
    }
  }, [selectedToEditTalkId]);

  useEffect(() => {
    if (deleteSelectedTalkId) {
      deleteTalk(openSpaceId, selectedToDeleteTalkId).then(reloadTalks);
      setDeleteSelectedTalkId(false);
    }
  }, [deleteSelectedTalkId]);

  return (
    <>
      <DataTable
        columns={[
          {
            property: 'title',
            header: (
              <Text weight="bold" size="medium" color="black">
                Título
              </Text>
            ),
            primary: true,
            size: 'xlarge',
            render: (datum) => (
              <Box direction="column">
                <Text weight={'bold'} color={'dark-2'}>
                  {datum.title}
                </Text>
                {datum.trackName ? (
                  <Text weight="normal" color={datum.trackColor}>
                    {datum.trackName}
                  </Text>
                ) : (
                  <Text weight="normal" color={'gray'}>
                    Sin track
                  </Text>
                )}
              </Box>
            ),
          },
          {
            property: 'author',
            header: (
              <Text weight="bold" size="medium" color="black">
                Autor/a
              </Text>
            ),
            size: 'medium',
            align: 'center',
            render: (datum) => (
              <Box direction="column">
                <Text>{datum.authorName}</Text>
                <Anchor weight="normal" href={`mailto:${datum.authorEmail}`}>
                  {datum.authorEmail}
                </Anchor>
              </Box>
            ),
          },
          {
            property: 'votes',
            header: (
              <Text weight="bold" size="medium" color="black">
                Votos
              </Text>
            ),
            size: 'small',
            align: 'center',
            render: (datum) => (
              <Box
                align="center"
                justify="center"
                background={'#b4e6b4'}
                round="full"
                width="xxsmall"
                height="xxsmall"
              >
                <Text color="black">{datum.votes}</Text>
              </Box>
            ),
          },
          {
            property: 'state',
            header: (
              <Text weight="bold" size="medium" color="black">
                Estado
              </Text>
            ),
            size: 'small',
            align: 'center',
            render: (datum) => (
              <Box direction="column">
                <Box
                  align="center"
                  justify="center"
                  background={datum.state === 'Agendada' ? '#b4e6e2' : '#AFB8AF'}
                  round={'medium'}
                  pad="small"
                >
                  <Text color="black">{datum.state}</Text>
                </Box>
                {datum.talkDate && (
                  <Box direction={'row-responsive'} gap="small">
                    <Text weight="bold" size="xsmall">
                      {datum.talkDate}
                    </Text>
                    <Text weight="bold" size="xsmall">
                      {datum.talkStartTime}hs
                    </Text>
                  </Box>
                )}
              </Box>
            ),
          },
          {
            property: 'actions',
            header: (
              <Text weight="bold" size="medium" color="black">
                Acciones
              </Text>
            ),
            sortable: false,
            size: 'medium',
            align: 'center',
            render: (datum) => {
              return (
                <Box pad={{ vertical: 'xsmall' }} direction="row" gap="xsmall">
                  {datum.state == 'Presentada' ? (
                    <ButtonLoading
                      icon={<ScheduleIcon />}
                      color={'transparent'}
                      onClick={() => {}}
                      tooltipText={'Agendar'}
                    />
                  ) : (
                    <ButtonLoading
                      icon={<TransactionIcon />}
                      color={'transparent'}
                      onClick={() => {}}
                      tooltipText={'Reagendar'}
                    />
                  )}
                  <ButtonLoading
                    icon={<DeleteIcon />}
                    color={'transparent'}
                    onClick={() => {
                      setSelectedToDeleteTalkId(datum.id);
                      setShowDeleteModal(true);
                    }}
                    tooltipText={'Eliminar'}
                  />
                  <ButtonLoading
                    icon={<QueueIcon />}
                    color={'transparent'}
                    onClick={() => {}}
                    tooltipText={'Encolar'}
                  />
                  <ButtonLoading
                    icon={<EditIcon />}
                    color={'transparent'}
                    onClick={() => {
                      setSelectedToEditTalkId(datum.id);
                    }}
                    tooltipText={'Editar'}
                  />
                  {showDeleteModal && (
                    <Layer
                      onEsc={() => setShowDeleteModal(false)}
                      onClickOutside={() => {
                        setSelectedToDeleteTalkId(null);
                        setShowDeleteModal(false);
                      }}
                    >
                      <Box pad="medium" gap="medium">
                        <Text>¿Estás seguro que querés eliminar esta charla?</Text>
                        <Box justify="around" direction="row" pad="small">
                          <Button
                            label="Si"
                            onClick={() => {
                              setDeleteSelectedTalkId(true);
                              setShowDeleteModal(false);
                            }}
                          />
                          <Button
                            label="No"
                            onClick={() => {
                              setSelectedToDeleteTalkId(null);
                              setShowDeleteModal(false);
                            }}
                          />
                        </Box>
                      </Box>
                    </Layer>
                  )}
                </Box>
              );
            },
          },
        ]}
        data={talks.map((talk) => {
          const talkSchedule = assignedTalks.find(
            (assignedTalk) => assignedTalk.id === talk.id
          );
          console.log('talksh: ', talkSchedule);
          return {
            title: talk.name,
            id: talk.id,
            authorName: talk.speaker.name,
            authorEmail: talk.speaker.email,
            trackName: talk.track?.name,
            trackColor: talk.track?.color,
            votes: talk.votes,
            state: talkSchedule ? 'Agendada' : 'Presentada',
            talkDate: talkSchedule?.date,
            talkStartTime: talkSchedule?.startTime,
            actions: 'todo',
            openSpaceId: talk.openSpace.id,
          };
        })}
        border
        background={{
          header: '#a4bcaf',
          body: ['white', 'light-2'],
        }}
        sortable
      />
    </>
  );
};

export default TalkTable;
