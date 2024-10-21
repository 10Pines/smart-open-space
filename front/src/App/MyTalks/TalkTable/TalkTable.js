import { DataTable, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { usePushToOpenSpace, usePushToSchedule, usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';
import { deleteTalk, enqueueTalk, exchangeTalk, scheduleTalk } from '#api/os-client';
import SelectSlot from '../Talk/SelectSlot';
import { StateColumn } from './components/StateColumn';
import { TitleColumn } from './components/TitleColumn';
import { AuthorColumn } from './components/AuthorColumn';
import { VotesColumn } from './components/VotesColumn';
import * as PropTypes from 'prop-types';
import { ActionsColumn } from './components/ActionsColumn/ActionsColumn';
import { DeleteModal } from '../components/DeleteModal';

const TalkTable = ({
  activeQueue,
  talks,
  reloadTalks,
  openSpaceId,
  roomsWithFreeSlots,
  dates,
  roomsWithAssignableSlots,
}) => {
  const [selectedToEditTalkId, setSelectedToEditTalkId] = useState(null);
  const [selectedToDeleteTalkId, setSelectedToDeleteTalkId] = useState(null);
  const [confirmDeleteSelectedTalkId, setConfirmDeleteSelectedTalkId] = useState(false);
  const [selectedToScheduleTalkInfo, setSelectedToScheduleTalkInfo] = useState({
    talkId: null,
    userId: null,
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
    scheduleTalk(
      selectedToScheduleTalkInfo.talkId,
      selectedToScheduleTalkInfo.userId,
      slot.id,
      room.id
    ).then(pushToSchedule);
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
            render: (datum) => <TitleColumn datum={datum} />,
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
            render: (datum) => <AuthorColumn datum={datum} />,
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
            property: 'state',
            header: (
              <Text weight="bold" size="medium" color="black">
                Estado
              </Text>
            ),
            size: 'small',
            align: 'center',
            render: (datum) => <StateColumn datum={datum} />,
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
                      userId: datum.authorId,
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
        <DeleteModal
          onEsc={() => setShowModals({ ...showModals, deleteModal: false })}
          onClickOutside={() => {
            setSelectedToDeleteTalkId(null);
            setShowModals({ ...showModals, deleteModal: false });
          }}
          onConfirmDelete={() => {
            setConfirmDeleteSelectedTalkId(true);
            setShowModals({ ...showModals, deleteModal: false });
          }}
          onCancelDeletion={() => {
            setSelectedToDeleteTalkId(null);
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
