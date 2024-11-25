import { Box, Text } from 'grommet';
import React from 'react';
import {CalendarIcon, ClockIcon, HomeIcon, ScheduleIcon, TransactionIcon} from '#shared/icons';
import {ActionButton} from "#app/MyTalks/TalkTable/components/ActionsColumn/ActionButton.jsx";

export function ScheduleColumn(props) {
  return (
    <Box direction="row">
      {props.datum.state === 'Presentada' ? (
        <ActionButton
          onClick={()=>{}}
          tooltipText="Agendar"
          icon={<ScheduleIcon />}
        />
      ) : (
        <ActionButton
          onClick={()=>{}}
          tooltipText="Reagendar"
          icon={<TransactionIcon />}
        />
      )}
      {props.datum.talkDate && (
        <Box direction="column">
          <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
            <CalendarIcon size="small" />
            <Text weight="bold" size="xsmall">
              {props.datum.talkDate}
            </Text>
          </Box>
          <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
            <ClockIcon size="small" />
            <Text weight="bold" size="xsmall">
              {props.datum.talkStartTime}hs
            </Text>
            <HomeIcon size="small" />
            <Text weight="bold" size="small" truncate>
              {props.datum.room}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
