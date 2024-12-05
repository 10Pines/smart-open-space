import {Box, Text} from "grommet";
import Title from "#shared/Title.jsx";
import React from "react";

const TalkTitle = ({name, track, pushToTalk}) => {
    return <>
        <Box align={"start"} height={"35px"} width={"100%"}>
            {track && <Text textAlign={"start"} style={{ lineHeight: "1rem", fontSize: "15px" }}>{track.name}</Text>}
        </Box>
        <Title style={{fontSize: "1.3rem", padding: 0, margin: 0, maxHeight: "120px", height: "120px", cursor: 'pointer', transition: 'text-decoration 0.2s ease', textWrap: "wrap"}}
               truncate
               textAlign={"start"}
               onClick={pushToTalk}
               onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
               onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
            {name}
        </Title>
    </>
}

export default TalkTitle;
