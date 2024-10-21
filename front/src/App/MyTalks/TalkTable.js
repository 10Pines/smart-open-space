import { Anchor, Box, Button, DataTable, Layer, Text } from 'grommet';
import ButtonLoading from '#shared/ButtonLoading';
import {
  CheckmarkIcon,
  DeleteIcon,
  EditIcon,
  QueueIcon,
  ScheduleIcon,
  TransactionIcon,
} from '#shared/icons';
import React, { useEffect, useState } from 'react';
import { usePushToOpenSpace, usePushToSchedule, usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';
import { deleteTalk, enqueueTalk, exchangeTalk, scheduleTalk } from '#api/os-client';
import SelectSlot from './Talk/SelectSlot';
import { InProgress } from 'grommet-icons';

const TalkTable = ({
  activeQueue,
  talks,
  reloadTalks,
  openSpaceId,
  roomsWithFreeSlots,
  dates,
  roomsWithAssignableSlots,
}) => {
  const pushToSchedule = usePushToSchedule();
  const pushToOpenSpace = usePushToOpenSpace();

  const [selectedToEditTalkId, setSelectedToEditTalkId] = useState(null);
  const [selectedToDeleteTalkId, setSelectedToDeleteTalkId] = useState(null);
  const [confirmDeleteSelectedTalkId, setConfirmDeleteSelectedTalkId] = useState(false);
  const [selectedToScheduleTalkInfo, setSelectedToScheduleTalkInfo] = useState({
    talkId: null,
    userId: null,
    talkName: null,
  });
  const [selectedToExchangeTalkInfo, setSelectedToExchangeTalkInfo] = useState({
    talkId: null,
    talkName: null,
  });
  const [showModals, setShowModals] = useState({
    deleteModal: false,
    scheduleModal: false,
    exchangeModal: false,
  });

  const onSubmitSchedule = ({ slot, room }) =>
    scheduleTalk(
      selectedToScheduleTalkInfo.talkId,
      selectedToScheduleTalkInfo.userId,
      slot.id,
      room.id
    ).then(pushToSchedule);
  const onSubmitExchange = ({ slot, room }) =>
    exchangeTalk(selectedToExchangeTalkInfo.talkId, slot.id, room.id).then(
      pushToOpenSpace
    );

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
                      onClick={() => {
                        setSelectedToScheduleTalkInfo({
                          talkId: datum.id,
                          userId: datum.authorId,
                          talkName: datum.name,
                        });
                        setShowModals({ ...showModals, scheduleModal: true });
                      }}
                      tooltipText={'Agendar'}
                    />
                  ) : (
                    <ButtonLoading
                      icon={<TransactionIcon />}
                      color={'transparent'}
                      onClick={() => {
                        setSelectedToExchangeTalkInfo({
                          talkId: datum.id,
                          talkName: datum.name,
                        });
                        setShowModals({ ...showModals, exchangeModal: true });
                      }}
                      tooltipText={'Reagendar'}
                    />
                  )}
                  <ButtonLoading
                    icon={<DeleteIcon />}
                    color={'transparent'}
                    onClick={() => {
                      setSelectedToDeleteTalkId(datum.id);
                      setShowModals({ ...showModals, deleteModal: true });
                    }}
                    tooltipText={'Eliminar'}
                  />
                  {datum.isInqueue ? (
                    <ButtonLoading
                      icon={<InProgress />}
                      color={'transparent'}
                      onClick={() => {}}
                      tooltipText={'Esperando turno'}
                      disabled
                    />
                  ) : (
                    datum.canBeQueued &&
                    activeQueue && (
                      <ButtonLoading
                        icon={<QueueIcon />}
                        color={'transparent'}
                        onClick={() => enqueueTalk(datum.id).then(reloadTalks)}
                        tooltipText={'Encolar'}
                      />
                    )
                  )}
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
          return {
            title: talk.name,
            id: talk.id,
            isInQueue: talk.isInqueue(),
            canBeQueued: talk.canBeQueued(),
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
      {showModals.deleteModal && (
        <Layer
          onEsc={() => setShowModals({ ...showModals, deleteModal: false })}
          onClickOutside={() => {
            setSelectedToDeleteTalkId(null);
            setShowModals({ ...showModals, deleteModal: false });
          }}
        >
          <Box pad="medium" gap="medium">
            <Text>¿Estás seguro que querés eliminar esta charla?</Text>
            <Box justify="around" direction="row" pad="small">
              <Button
                label="Si"
                onClick={() => {
                  setConfirmDeleteSelectedTalkId(true);
                  setShowModals({ ...showModals, deleteModal: false });
                }}
              />
              <Button
                label="No"
                onClick={() => {
                  setSelectedToDeleteTalkId(null);
                  setShowModals({ ...showModals, deleteModal: false });
                }}
              />
            </Box>
          </Box>
        </Layer>
      )}
      {showModals.scheduleModal && roomsWithFreeSlots && (
        <SelectSlot
          rooms={roomsWithFreeSlots}
          name={selectedToScheduleTalkInfo.talkName}
          dates={dates}
          onExit={() => {
            setShowModals({ ...showModals, scheduleModal: false });
          }}
          onSubmit={onSubmitSchedule}
          title="Agendate!"
        />
      )}
      {showModals.exchangeModal && (
        <SelectSlot
          rooms={roomsWithAssignableSlots}
          name={selectedToScheduleTalkInfo.talkName}
          dates={dates}
          onExit={() => setShowModals({ ...showModals, exchangeModal: false })}
          onSubmit={onSubmitExchange}
          title="Mover a:"
        />
      )}
    </>
  );
};

export default TalkTable;
