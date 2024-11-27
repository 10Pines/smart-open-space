import {Box, Button, Heading} from "grommet";
import {FormDown, FormUp} from "grommet-icons";
import React from "react";

const TrackDropdown = ({ openTalks, title, color, id, toggleDropdown, children }) => {
  return (
    <Box direction={"column"}>
      <Box id={title}
           direction={"row"}
           align={"center"}
           justify={"between"}
           margin={{top: "medium"}}
           gap={"large"}
           onClick={toggleDropdown}
           style={{
             outline: "none",
             backgroundColor: "#F4F4F4",
             borderTopRightRadius: "5px",
             borderTopLeftRadius: "5px"
           }}>
        <Heading color={color} size={"1.5rem"} margin={{bottom: "xxsmall", top: "xxsmall", left: "small"}}>{title}</Heading>
        <Button icon={openTalks ? <FormUp size={"medium"}/> : <FormDown size={"medium"}/>}/>
      </Box>
      <Box width="100%"
           height="5px"
           background={color}
           style={{
             borderBottomRightRadius: "5px",
             borderBottomLeftRadius: "5px"
           }}/>
      {openTalks &&
        children}
    </Box>
  )
}

export default TrackDropdown;
