import MyForm from '#shared/MyForm';
import React from 'react';
import { FormField, TextArea } from 'grommet';

const emptyReview = { grade: '', comment: '' };

export const ReviewForm = ({ onSubmit }) => {
  return (
    <MyForm
      initialValue={emptyReview}
      onSubmit={onSubmit}
      resetOnSubmit
      primaryLabel="Dar feedback"
    >
      <MyForm.Select
        label="Puntuación"
        name="grade"
        options={['1', '2', '3', '4', '5']}
      />
      <FormField
        label="Comentario"
        required={false}
        style={{ fontFamily: 'monospace' }}
        placeholder="Deja un comentarío"
        name="comment"
        component={(props) => <TextArea {...props} />}
      />
    </MyForm>
  );
};
