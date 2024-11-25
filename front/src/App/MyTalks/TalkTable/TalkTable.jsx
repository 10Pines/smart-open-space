import { DataTable, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { usePushToOpenSpace, usePushToSchedule, usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';
import { deleteTalk, enqueueTalk, exchangeTalk, scheduleTalk } from '#api/os-client';
import SelectSlot from '../Talk/SelectSlot';
import { ScheduleColumn } from './components/ScheduleColumn.jsx';
import { TitleColumn } from './components/TitleColumn';
import { TrackColumn } from './components/TrackColumn.jsx';
import { VotesColumn } from './components/VotesColumn';
import { ActionsColumn } from './components/ActionsColumn/ActionsColumn';
import { DeleteModal } from '../components/DeleteModal';
import { useUser } from '#helpers/useAuth';

const TalkTable = ({
  activeQueue,
  talks,
  reloadTalks,
  openSpaceId,
  roomsWithFreeSlots,
  dates,
  roomsWithAssignableSlots,
}) => {
  const user = useUser();
  const [selectedToEditTalkId, setSelectedToEditTalkId] = useState(null);
  const [selectedToDeleteTalkId, setSelectedToDeleteTalkId] = useState(null);
  const [confirmDeleteSelectedTalkId, setConfirmDeleteSelectedTalkId] = useState(false);
  const [selectedToScheduleTalkInfo, setSelectedToScheduleTalkInfo] = useState({
    talkId: null,
    talkName: null,
  });
  const [selectedToRescheduleTalkInfo, setSelectedToRescheduleTalkInfo] = useState({
    talkId: null,
    talkName: null,
  });
  const [showModals, setShowModals] = useState({
    deleteModal: false,
    scheduleModal: false,
    exchangeModal: false,
  });

  const pushToSchedule = usePushToSchedule();
  const pushToOpenSpace = usePushToOpenSpace();
  const pushToTalk = usePushToTalk(useParams().id, selectedToEditTalkId);

  const onSubmitSchedule = ({ slot, room }) =>
    scheduleTalk(selectedToScheduleTalkInfo.talkId, user.id, slot.id, room.id).then(
      pushToSchedule
    );
  const onSubmitExchange = ({ slot, room }) =>
    exchangeTalk(selectedToRescheduleTalkInfo.talkId, slot.id, room.id).then(
      pushToOpenSpace
    );

  const assignedTalks = talks
    ? talks[0].slots.map((slot) => {
        return {
          id: slot.talk.id,
          startTime: slot.slot.startTime,
          date: slot.slot.date,
          room: slot.room.name,
        };
      })
    : [];

  useEffect(() => {
    if (selectedToEditTalkId) {
      pushToTalk();
    }
  }, [pushToTalk, selectedToEditTalkId]);

  useEffect(() => {
    if (confirmDeleteSelectedTalkId) {
      deleteTalk(openSpaceId, selectedToDeleteTalkId).then(reloadTalks);
      setConfirmDeleteSelectedTalkId(false);
    }
  }, [confirmDeleteSelectedTalkId, openSpaceId, reloadTalks, selectedToDeleteTalkId]);

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
            render: (datum) => <TitleColumn datum={datum} />,
          },
          {
            property: 'track',
            header: (
              <Text weight="bold" size="medium" color="black">
                Eje temático
              </Text>
            ),
            size: 'medium',
            align: 'center',
            render: (datum) => <TrackColumn datum={datum} />,
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
            render: (datum) => <VotesColumn datum={datum} />,
          },
          {
            property: 'schedule',
            header: (
              <Text weight="bold" size="medium" color="black">
                Agendar
              </Text>
            ),
            size: 'small',
            align: 'center',
            render: (datum) => <ScheduleColumn datum={datum} />,
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
                <ActionsColumn
                  datum={datum}
                  activeQueue={activeQueue}
                  onClickScheduleButton={() => {
                    setSelectedToScheduleTalkInfo({
                      talkId: datum.id,
                      talkName: datum.name,
                    });
                    setShowModals({ ...showModals, scheduleModal: true });
                  }}
                  onClickRescheduleButton={() => {
                    setSelectedToRescheduleTalkInfo({
                      talkId: datum.id,
                      talkName: datum.name,
                    });
                    setShowModals({ ...showModals, exchangeModal: true });
                  }}
                  onClickDeleteButton={() => {
                    setSelectedToDeleteTalkId(datum.id);
                    setShowModals({ ...showModals, deleteModal: true });
                  }}
                  onClickInQueueButton={() => {}}
                  onClickQueueButton={() => enqueueTalk(datum.id).then(reloadTalks)}
                  onClickEditButton={() => {
                    setSelectedToEditTalkId(datum.id);
                  }}
                />
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
            trackName: talk.track?.name,
            trackColor: talk.track?.color,
            votes: talk.votes,
            state: talkSchedule ? 'Agendada' : 'Presentada',
            talkDate: talkSchedule?.date,
            talkStartTime: talkSchedule?.startTime,
            room: talkSchedule?.room,
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
        <DeleteModal
          onEsc={() => {
            setSelectedToDeleteTalkId(null);
            setShowModals({ ...showModals, deleteModal: false });
          }}
          onConfirmDelete={() => {
            setConfirmDeleteSelectedTalkId(true);
            setShowModals({ ...showModals, deleteModal: false });
          }}
        />
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
