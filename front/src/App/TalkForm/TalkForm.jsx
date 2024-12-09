import { useHistory } from 'react-router-dom';
import MainHeader from '#shared/MainHeader';
import { TalkIcon, TextAreaIcon } from '#shared/icons';
import NewMyForm from '#shared/NewMyForm';
import React from 'react';
import Documents from './Documents';
import {isUrl, validateUrl} from "#helpers/validateUrl.js";

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
  subtitle,
  title,
  amTheOrganizer,
  initialValues = emptyTalk,
}) => {
  const history = useHistory();
  const nullTrackOption = { id: null, name: 'Sin track' }; // Customize the name as needed
  const trackOptionsWithNull = [nullTrackOption, ...(openSpace?.tracks || [])];

  const validateDocuments = (documents, _valueObj) => {
    const isValid = !documents.some(doc => doc.name.trim() === "" || !isUrl(doc.link));

    if (!isValid) {
      return "Verifique que los nombres y URL de los documentos sean válidas";
    }
  }

    return (
    <>
      <MainHeader>
        <MainHeader.Title icon={TalkIcon} label={title} />
        <MainHeader.SubTitle>{subtitle}</MainHeader.SubTitle>
      </MainHeader>
      <NewMyForm
        onSecondary={history.goBack}
        onSubmit={onSubmit}
        initialValue={initialValues}
      >
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
        <NewMyForm.Select
          label="Track"
          name="track"
          options={trackOptionsWithNull}
          labelKey="name"
          valueKey="id"
        />
        <NewMyForm.Field
          component={Documents}
          icon={<TextAreaIcon />}
          label="Documentos"
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
    </>
  );
};
