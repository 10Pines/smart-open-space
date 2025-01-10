import React, { useState } from 'react';

import {Box, Grid, Spinner, Text, Tip} from 'grommet';
import PropTypes from 'prop-types';

import {
  enqueueTalk,
  exchangeTalk,
  scheduleTalk,
  deleteTalk,
  useGetOpenSpace,
} from '#api/os-client';
import { useUser } from '#helpers/useAuth';
import ButtonLoading from '#shared/ButtonLoading';
import Card from '#shared/Card';
import {CalendarIcon, ClockIcon, DeleteIcon, ScheduleIcon, LocationIcon} from '#shared/icons';
import { useParams } from 'react-router-dom';
import SelectSlot from './SelectSlot';
import { usePushToOpenSpace, usePushToSchedule } from '#helpers/routes';
import { Room } from '../../model/room';
import { usePushToTalk } from '#helpers/routes';
import { DeleteModal } from '../components/DeleteModal';
import TalkTitle from "#app/OpenSpace/Talk/TalkTitle.jsx";
import Button from "#components/atom/Button.jsx";

const Badge = ({ color, text }) => (
  <Box alignSelf="center">
    <Text color={color} weight="bold">
      {text}
    </Text>
  </Box>
);
Badge.propTypes = { color: PropTypes.string, text: PropTypes.string };

const ButtonAction = (props) => (
  <ButtonLoading alignSelf="center" margin={{ top: 'small' }} {...props} />
);

const Talk = ({
  talk,
  activeQueue,
  roomsWithAssignableSlots,
  roomsWithFreeSlots,
  hasAnother,
  onEnqueue: reloadTalks,
  dates,
}) => {
  const pushToSchedule = usePushToSchedule();
  const pushToOpenSpace = usePushToOpenSpace();
  const pushToTalk = usePushToTalk(useParams().id, talk.id);
  const { data: openSpace } = useGetOpenSpace();
  const user = useUser();
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openExchange, setOpenExchange] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const shouldDisplayScheduleTalkButton = dates && talk.isToSchedule();

  const onSubmitSchedule = ({ slot, room }) =>
    scheduleTalk(talk.id, user.id, slot.id, room.id).then(pushToSchedule);

  const onSubmitExchange = ({ slot, room }) =>
    exchangeTalk(talk.id, slot.id, room.id).then(pushToOpenSpace);

  const shouldDisplayDeleteTalkButton = user ? talk.speaker.id === user.id : false;
  const backgroundColor = talk.track ? talk.track.color : '#e4e4e4';
  const talkSchedule = talk.getScheduleInfo();

  return (
    <Card pad={{top: "small", left: 'medium', right: "medium", bottom: 0}} borderColor={backgroundColor} gap={"xsmall"} justify={false} backgroundColor={backgroundColor} style={{width: "288px", height: "270px", borderRadius: "5px"}}>
      <TalkTitle name={talk.name} track={talk.track} pushToTalk={pushToTalk} />
      <Grid gap={'xsmall'}>
        { talkSchedule ? (
          <Box direction="column"
               justify="evenly"
               height={"30px"}
               gap="medium"
               onClick={() => setOpenExchange(true)}
          >
            <Box direction="row" gap={'xsmall'}>
              <LocationIcon size={"20px"}/>
              <Text>{talkSchedule.room.name}</Text>
            </Box>
            <Box direction="row" gap={'xsmall'}>
              <CalendarIcon size={"20px"}/>
              <Text>{talkSchedule.slot.date}</Text>
            </Box>
            <Box direction="row" gap={'xsmall'}>
              <ClockIcon size={"20px"}/>
              <Text>{talkSchedule.slot.startTime}</Text>
            </Box>
          </Box>
        ) : (
            <Box direction="column" height={"30px"}>
              {shouldDisplayScheduleTalkButton ?
                <Box
                  direction={"row"}
                  gap={"5px"}
                  style={{
                    cursor: "pointer",
                    transition: 'text-decoration 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  onClick={() => setOpenSchedule(true)}
                >
                  <ScheduleIcon size={"20px"}/>
                  <Text size={"16px"}>Agendá tu charla acá!</Text>
                </Box>
                :
                <Text size={"16px"}>Sin agendar</Text>
              }
            </Box>
        )}
        {talk.isInqueue() ? (
          <Box direction="row" gap={"5px"}>
            <Badge color={"dark-2"} text="Esperando turno" />
            <Spinner size={"2px"}/>
          </Box>
        ) : (
          talk.canBeQueued() &&
          activeQueue && (
            <ButtonAction
              color={"light-3"}
              disabled={hasAnother}
              label="Encolar"
              style={{width:'100px', border: "1px solid gray"}}
              onClick={() => enqueueTalk(talk.id).then(reloadTalks)}
            />
          )
        )}
        {shouldDisplayDeleteTalkButton && (
          <Box width={"100%"} style={{alignItems: "end"}}>
            <Tip content={<Text color={"black"}>Eliminar charla</Text>} color={"black"}>
              <Box alignSelf="end">
                <Button
                  icon={<DeleteIcon />}
                  color={backgroundColor}
                  label=""
                  style={{width: "fit-content", backgroundColor: "transparent"}}
                  onClick={() => setShowDeleteModal(true)}
                />
              </Box>
            </Tip>
          </Box>
        )}
      </Grid>
      {openSchedule && roomsWithFreeSlots && (
        <SelectSlot
          rooms={roomsWithFreeSlots}
          name={talk.name}
          dates={dates}
          onExit={() => setOpenSchedule(false)}
          onSubmit={onSubmitSchedule}
          title="Agendate!"
        />
      )}
      {openExchange && (
        <SelectSlot
          rooms={roomsWithAssignableSlots}
          name={talk.name}
          dates={dates}
          onExit={() => setOpenExchange(false)}
          onSubmit={onSubmitExchange}
          title="Mover a:"
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onEsc={() => setShowDeleteModal(false)}
          onConfirmDelete={() => {
            deleteTalk(openSpace.id, talk.id).then(reloadTalks);
            setShowDeleteModal(false);
          }}
        />
      )}
    </Card>
  );
};
Talk.propTypes = {
  activeQueue: PropTypes.bool.isRequired,
  roomsWithAssignableSlots: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  roomsWithFreeSlots: PropTypes.arrayOf(PropTypes.shape(Room).isRequired).isRequired,
  hasAnother: PropTypes.bool.isRequired,
  onEnqueue: PropTypes.func.isRequired,
};

export default Talk;
