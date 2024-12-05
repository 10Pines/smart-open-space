import {Avatar, Box, Text, Tip} from "grommet";
import HeadphonesIcon from "#assets/headphones.png";
import {HomeIcon} from "#shared/icons.jsx";
import React from "react";

const TalkData = ({room, talkLink, showSpeakerName, realSpeakerName, children}) => {
    return  <Box gap={"small"} direction="column" width={"100%"} align={"center"} margin={{top: "10px"}}>
        <Box direction={"row"} align={"start"} justify={showSpeakerName ? "between" : "end"} width={"100%"} height={"35px"} margin={{top: "30px"}}>
            {showSpeakerName &&
                <Box direction={"row"} gap={"small"} width={"80%"}>
                    <Avatar size="25px" src="https://cdn-icons-png.flaticon.com/512/149/149071.png"/>
                    <Text color={"dark-2"} size={"1rem"}>
                        {realSpeakerName}
                    </Text>
                </Box>
            }
            <Tip content={"Ir a la reunión"}>
                <Box>
                    {talkLink && <Avatar style={{border: "solid 1px gray", padding: "3px"}} size={"30px"} src={HeadphonesIcon} onClick={() => window.open(talkLink, '_blank')}/>}
                </Box>
            </Tip>
        </Box>
        <Box direction={"row"} gap={"medium"} width={"100%"} justify={"between"} margin={{top: "10px"}}>
            {room &&
                <Box direction={"row"} gap={"small"} align={"center"} justify={"center"}>
                    <HomeIcon size={"20px"}/>
                    <Text size="14px" color={"dark-2"}>
                        {room.name}
                    </Text>
                </Box>
            }
            {children}
        </Box>
    </Box>
}

export default TalkData;
