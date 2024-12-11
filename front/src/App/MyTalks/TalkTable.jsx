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
import { usePushToOpenSpace, usePushToSchedule, usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';
import { deleteTalk, exchangeTalk, scheduleTalk } from '#api/os-client';
import SelectSlot from './Talk/SelectSlot';

const TalkTable = ({
  talks,
  reloadTalks,
  openSpaceId,
  roomsWithFreeSlots,
  dates,
  roomsWithAssignableSlots,
}) => {
  const [selectedToEditTalkId, setSelectedToEditTalkId] = useState(null);

  const [selectedToDeleteTalkId, setSelectedToDeleteTalkId] = useState(null);

  const [selectedToScheduleTalkId, setSelectedToScheduleTalkId] = useState(null);
  const [selectedToScheduleUserId, setSelectedToScheduleUserId] = useState(null);
  const [selectedToScheduleTalkName, setSelectedToScheduleTalkName] = useState(null);

  const [selectedToExchangeTalkId, setSelectedToExchangeTalkId] = useState(null);
  const [selectedToExchangeTalkName, setSelectedToExchangeTalkName] = useState(null);

  const [confirmDeleteSelectedTalkId, setConfirmDeleteSelectedTalkId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState();

  const pushToSchedule = usePushToSchedule();
  const pushToOpenSpace = usePushToOpenSpace();
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openExchange, setOpenExchange] = useState(false);
  const onSubmitSchedule = ({ slot, room }) =>
    scheduleTalk(
      selectedToScheduleTalkId,
      selectedToScheduleUserId,
      slot.id,
      room.id
    ).then(pushToSchedule);
  const onSubmitExchange = ({ slot, room }) =>
    exchangeTalk(selectedToExchangeTalkId, slot.id, room.id).then(pushToOpenSpace);

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
    if (confirmDeleteSelectedTalkId) {
      deleteTalk(openSpaceId, selectedToDeleteTalkId).then(reloadTalks);
      setConfirmDeleteSelectedTalkId(false);
    }
  }, [confirmDeleteSelectedTalkId]);

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
                    Sin eje temático
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
                      onClick={() => {
                        setSelectedToScheduleTalkId(datum.id);
                        setSelectedToScheduleUserId(datum.authorId);
                        setSelectedToScheduleTalkName(datum.name);
                        setOpenSchedule(true);
                      }}
                      tooltipText={'Agendar'}
                    />
                  ) : (
                    <ButtonLoading
                      icon={<TransactionIcon />}
                      color={'transparent'}
                      onClick={() => {
                        setSelectedToExchangeTalkId(datum.id);
                        setSelectedToExchangeTalkName(datum.name);
                        setOpenExchange(true);
                      }}
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
            authorId: talk.speaker.id,
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
                  setConfirmDeleteSelectedTalkId(true);
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
      {openSchedule && roomsWithFreeSlots && (
        <SelectSlot
          rooms={roomsWithFreeSlots}
          name={selectedToScheduleTalkName}
          dates={dates}
          onExit={() => {
            setOpenSchedule(false);
          }}
          onSubmit={onSubmitSchedule}
          title="Agendate!"
        />
      )}
      {openExchange && (
        <SelectSlot
          rooms={roomsWithAssignableSlots}
          name={selectedToExchangeTalkName}
          dates={dates}
          onExit={() => setOpenExchange(false)}
          onSubmit={onSubmitExchange}
          title="Mover a:"
        />
      )}
    </>
  );
};

export default TalkTable;
