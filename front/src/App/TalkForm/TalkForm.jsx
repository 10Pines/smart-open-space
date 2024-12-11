import { useHistory } from 'react-router-dom';
import MainHeader from '#shared/MainHeader';
import { TextAreaIcon } from '#shared/icons';
import NewMyForm from '#shared/NewMyForm';
import React from 'react';
import Documents from './Documents';
import {isUrl} from "#helpers/validateUrl.js";
import {Box, Text} from "grommet";
import useSize from '#helpers/useSize';
import customTheme from "#app/theme.js";

const emptyTalk = {
  name: '',
  description: '',
  meetingLink: '',
  track: undefined,
  documents: [],
};

export const TalkForm = ({
  onSubmit,
  openSpace,
  title,
  amTheOrganizer,
  initialValues = emptyTalk,
}) => {
  const history = useHistory();
  const nullTrackOption = { id: null, name: 'Sin track' }; // Customize the name as needed
  const trackOptionsWithNull = [nullTrackOption, ...(openSpace?.tracks || [])];

  const validateDocuments = (documents, _valueObj) => {
    const isValid = !documents.some(doc => (doc.name.trim() === "" || !isUrl(doc.link)) && !(doc.name.trim() === "" && doc.link.trim() === ""));

    if (!isValid) {
      return "Verifique que los nombres y URL de los documentos sean válidos";
    }
  }

    return (
        <>
        <MainHeader.Title margin={{bottom: "32px"}}>{openSpace.name}</MainHeader.Title>
        <Box width={useSize() === "small" ? "100%" : "70%"} pad={{right: "40px", left: "40px", bottom: "20px", top: "20px"}} alignSelf={"center"} style={{border: `1px solid ${customTheme.global.colors.primary.light}`, borderRadius: "5px"}}>
          <NewMyForm
              onSecondary={history.goBack}
              onSubmit={onSubmit}
              initialValue={initialValues}
              primaryLabel={"Crear"}
          >
          <Box direction={'row-responsive'} align={'center'} justify={'between'} style={{alignItems: "start"}}>
            <Box direction={'column'} align={'center'}>
              <Text size={"1.5rem"}>{title}</Text>
            </Box>
            <NewMyForm.Select
                label="Track"
                name="track"
                options={trackOptionsWithNull}
                labelKey="name"
                valueKey="id"
                defaultMessage={"Seleccionar eje temático"}
                style={{color: customTheme.global.colors.background.light}}
            />
          </Box>
            <NewMyForm.Text
              id="talk-title-id"
              label="Título"
              formValueName="name"
              initialValue={initialValues.name}
              placeholder="¿Cómo querés nombrar tu charla?"
            />
            <NewMyForm.TextArea
              label={"Descripción"}
              initialValue={initialValues.description}
              placeholder="Describí tu charla con mas detalle. Podés usar Markdown"
            />
            <NewMyForm.Link placeholder="Link a la reunión virtual (meet/zoom)" />
            <NewMyForm.Field
              component={Documents}
              icon={<TextAreaIcon />}
              name="documents"
              labelKey="name"
              valueKey="id"
              validate={validateDocuments}
              required={false}
            />
            {amTheOrganizer && (
              <NewMyForm.Text
                id="talk-speaker-name"
                label="Nombre del Orador"
                name="speakerName"
                placeholder="En caso de ser un orador que pitcheó en el marketplace, ingresa el nombre completo"
                required={false}
              />
            )}
          </NewMyForm>
        </Box>
    </>
  );
};
