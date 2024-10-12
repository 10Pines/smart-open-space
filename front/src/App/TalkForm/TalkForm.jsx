import { useHistory } from 'react-router-dom';
import MainHeader from '#shared/MainHeader';
import { TalkIcon, TextAreaIcon } from '#shared/icons';
import MyForm from '#shared/MyForm';
import React from 'react';
import Documents from './Documents';

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

  return (
    <>
      <MainHeader>
        <MainHeader.Title icon={TalkIcon} label={title} />
        <MainHeader.SubTitle>{subtitle}</MainHeader.SubTitle>
      </MainHeader>
      <MyForm
        onSecondary={history.goBack}
        onSubmit={onSubmit}
        initialValue={initialValues}
      >
        <MyForm.Text
          id="talk-title-id"
          label="Título"
          formValueName="name"
          placeholder="¿Como querés nombrar tu charla?"
        />
        <MyForm.TextArea
          style={{ fontFamily: 'monospace' }}
          placeholder="Describí tu charla con mas detalle. Podés usar Markdown"
        />
        <MyForm.Link label="Link" placeholder="Link a la reunión virtual (meet/zoom)" />
        <MyForm.Select
          label="Track"
          name="track"
          options={trackOptionsWithNull}
          labelKey="name"
          valueKey="id"
        />
        <MyForm.Field
          component={Documents}
          icon={<TextAreaIcon />}
          label="Documentos"
          name="documents"
          labelKey="name"
          valueKey="id"
          required={false}
        />
        {amTheOrganizer && (
          <MyForm.Text
            id="talk-speaker-name"
            label="Nombre del Orador"
            name="speakerName"
            placeholder="En caso de ser un orador que pitcheó en el marketplace, ingresa el nombre completo"
            required={false}
          />
        )}
      </MyForm>
    </>
  );
};
