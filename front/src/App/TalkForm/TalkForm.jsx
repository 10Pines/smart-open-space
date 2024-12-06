import { useHistory } from 'react-router-dom';
import MainHeader from '#shared/MainHeader';
import {HomeIcon, TalkIcon, TextAreaIcon} from '#shared/icons';
import MyForm from '#shared/MyForm';
import React from 'react';
import Documents from './Documents';
import {Box, Text} from "grommet";
import customTheme from "#app/theme.js";
import Input from "#components/atom/Input.jsx";
import SelectDropdown from "#components/atom/SelectDropdown.jsx";
import FormTitle from "#components/atom/FormTitle.jsx";
import Carousel from "#components/molecule/Carousel.jsx";
import Badge from "#components/molecule/Badge.jsx";
import RoomPickerForm from "#components/molecule/RoomPickerForm.jsx";
import AddElementBox from "#components/molecule/AddElementBox.jsx";
import Button from "#components/atom/Button.jsx";

const emptyTalk = {
  name: '',
  description: '',
  meetingLink: '',
  track: undefined,
  documents: [],
};

const cardsAnimation = {
  type: 'fadeIn',
  delay: 1,
  duration: 800,
};

export const TalkForm = ({
  onSubmit,
  openSpace,
  subtitle,
  title,
  amTheOrganizer,
  initialValues = emptyTalk,
}) => {
  const history = useHistory();
  const nullTrackOption = { id: null, name: 'Sin track' }; // Customize the name as needed
  const trackOptionsWithNull = [nullTrackOption, ...(openSpace?.tracks || [])];
  console.log('DOCUMENTS:', openSpace)

  return (
    <Box  pad={"10px"} style={{border: `1px solid ${customTheme.global.colors.primary.light}`, borderRadius: "5px"}}>

      <Box direction={"row"} align={"center"} justify={"between"} margin={{bottom: "medium"}}>
        <MainHeader.Title label={title} style={{fontSize: "1.6rem"}} />
        <Box width={"30%"}>
          <SelectDropdown
              defaultMessage={"Seleccionar eje temático"}
              name="track"
              options={trackOptionsWithNull.map((option) => option.name)}
              width={"30%"}
          />
        </Box>
      </Box>

      <Box direction={"column"} gap={"small"}>
        <Input
          id="talk-title-id"
          label="Título"
          placeholder="¿Cómo querés nombrar tu charla?"
        />
        <Input
            id="talk-title-description"
            label="Descripción"
            placeholder="Agregá la descripción acerca de lo que se va a tratar tu charla"
            multiline
        />
        <Input
            id="talk-title-link"
            label="Link"
            placeholder="Link a la reunión virtual (meet/zoom)"
        />

        <Box>
          <Text>Documentos</Text>
          <Carousel >
            {initialValues.documents &&
                initialValues.documents.map((document, index) => (
                    <Box
                        style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                        animation={cardsAnimation}
                    >
                      <Badge key={index} onClick={() => {}}>
                        <RoomPickerForm
                            room={document}
                            onChange={(roomChanged) => {}}
                            width={{ min: '300px' }}
                            animation={cardsAnimation}
                        />
                      </Badge>
                    </Box>
                ))}
            <AddElementBox
                onClick={()=>{}}
                size={{
                  height: initialValues.documents > 0 ? 'auto' : '146px',
                  width: '300px',
                }}
                width={{ min: '300px' }}
            />
          </Carousel>
        </Box>
        {amTheOrganizer && (
            <Input
                id="talk-title-link"
                label="Nombre del Orador"
                placeholder="En caso de ser un orador que pitcheó en el marketplace, ingresa el nombre completo"
            />
        )}
        <Box direction={"row"} align={"center"} justify={"center"} gap={"large"} margin={{top: "medium"}}>
          <Button style={{width: "10rem"}} secondary label={"Cancelar"}/>
          <Button style={{width: "10rem"}} label={"Crear"}/>
        </Box>
      </Box>
    </Box>
  );
};
