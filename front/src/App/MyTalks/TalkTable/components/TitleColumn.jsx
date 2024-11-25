import { Box, Text } from 'grommet';
import React from 'react';
import ButtonLoading from "#shared/ButtonLoading.jsx";
import {ClockIcon, QueueIcon} from "#shared/icons.jsx";

export function TitleColumn({ datum, activeQueue, onClick, onClickQueueButton }) {
  return (
    <Box direction={"row"} align={"center"} justify={"between"}>
      <Box direction="column">
        <Text weight="bold" color="dark-2"
          onClick={onClick}
          style={{
            cursor: 'pointer',
            transition: 'text-decoration 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          {datum.title}
        </Text>
        <Text weight="normal" color="gray">
          {datum.authorName}
        </Text>
      </Box>
      {datum.canBeQueued && !datum.isInQueue && activeQueue &&
        <ButtonLoading
          color={"accent-4"}
          label={"Encolar"}
          size={"small"}
          margin={{right: "1rem"}}
          style={{padding: "8px", height: "fit-content", cursor: "pointer"}}
          icon={<QueueIcon size={"20px"}/>}
          onClick={onClickQueueButton}
        />}
      {datum.isInQueue && activeQueue &&
        <ButtonLoading
          color={"#ffe3b0"}
          label={"Charla encolada"}
          size={"small"}
          margin={{right: "1rem"}}
          style={{padding: "8px", height: "fit-content"}}
          icon={<ClockIcon size={"20px"}/>}
          disabled={true}
          onClick={()=>{}}
        />}
    </Box>
  );
}
