import { Box, Text } from 'grommet';
import React from 'react';
import {CalendarIcon, ClockIcon, HomeIcon, ScheduleIcon, TransactionIcon} from '#shared/icons';
import {ScheduleButton} from "#app/MyTalks/TalkTable/components/ScheduleButton.jsx";

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
        <Box direction="column" align={"start"} style={{minHeight: "fit-content"}}>
            <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
              <CalendarIcon size="15px" color={"rgb(125, 76, 219)"}/>
              <Text size="medium">
                {props.datum.talkDate}
              </Text>
            </Box>
            <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
              <ClockIcon size="15px" color={"rgb(125, 76, 219)"}/>
              <Text size="medium">
                {props.datum.talkStartTime}hs
              </Text>
            </Box>
          <Box direction={"row"} gap="xsmall" align="center" justify="center">
            <HomeIcon size="15px" color={"rgb(125, 76, 219)"}/>
            <Text size="medium" truncate>
              {props.datum.room}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
