import { Box } from 'grommet';
import React from 'react';
import {CalendarIcon, ClockIcon, HomeIcon, ScheduleIcon, TransactionIcon} from '#shared/icons';
import {ScheduleButton} from "#app/MyTalks/TalkTable/components/ScheduleButton.jsx";
import ScheduleItem from "#app/MyTalks/TalkTable/components/ScheduleItem.jsx";

export function ScheduleColumn(props) {
  return (
    <Box direction="row-reverse" gap={"xlarge"} alignSelf={"center"}>
      {props.datum.state === 'Presentada' ? (
        <ScheduleButton
          onClick={props.onClickScheduleButton}
          label={"Agendar"}
          icon={<ScheduleIcon size={"medium"} color={"#56248c"}/>}
        />
      ) : (
        <ScheduleButton
          onClick={props.onClickRescheduleButton}
          tooltipText="Reagendar"
          icon={<TransactionIcon size={"medium"} color={"#56248c"}/>}
        />
      )}
      {props.datum.talkDate && (
        <Box direction="column" align={"start"} style={{minHeight: "4.5rem"}}>
          <ScheduleItem Icon={CalendarIcon}>
            {props.datum.talkDate}
          </ScheduleItem>
          <ScheduleItem Icon={ClockIcon}>
            {props.datum.talkStartTime}hs
          </ScheduleItem>
          <ScheduleItem Icon={HomeIcon}>
            {props.datum.room}
          </ScheduleItem>
        </Box>
      )}
    </Box>
  );
}
