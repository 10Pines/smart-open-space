import {Box, Text, Tip} from "grommet";
import Switch from "react-switch";
import {Button as GrommetButton} from "grommet/components/Button/index.js";
import {VideoIcon} from "#shared/icons.jsx";
import React from "react";

const MarketPlaceSwitch = ({ onChange, checked, disabled, activeQueue, finishedQueue, pushToProjector }) => {
  return (
    <Box direction={"row"} gap="xsmall" align={"center"} width={"max-content"} style={{maxWidth: "25rem"}}>
      <Tip content={finishedQueue ? "El marketplace se puede iniciar una única vez" : ""} >
        <Box>
          <Switch onChange={onChange} checked={checked} disabled={disabled}/>
        </Box>
      </Tip>
      <Text>{"Abrir marketplace"}</Text>
      <Tip content={"Proyector"}>
        {activeQueue && <GrommetButton onClick={pushToProjector} size={"2rem"} icon={<VideoIcon size={"1.5rem"}/>} margin={{left: 'small'}} style={{
          backgroundColor: "#ffebb4",
          border: "solid 1px gray",
          borderRadius: "30%",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}/>}
      </Tip>
    </Box>
  )
}

export default MarketPlaceSwitch;
