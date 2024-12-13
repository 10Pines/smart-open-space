import React, {useState} from 'react';
import { Form, FormField } from 'grommet';
import PropTypes from 'prop-types';

import MyProps from '#helpers/MyProps';
import useLoading from '#helpers/useLoading';
import { EmailIcon, PasswordIcon, TextAreaIcon } from '#shared/icons';
import { TinySpinner } from '#shared/Spinner';
import RowBetween from './RowBetween';
import { validateUrl } from '#helpers/validateUrl';

import { TextAreaWithCharacterCounter } from '#shared/TextAreaWithCharacterCounter';
import Input from "#components/atom/Input.jsx";
import SelectDropdown from "#components/atom/SelectDropdown.jsx";
import Button from "#components/atom/Button.jsx";

const MyField = ({ icon, ...props }) => (
  <FormField
    required
    {...props}
  />
);
MyField.propTypes = { icon: PropTypes.node};

const MyFieldText = ({ id, label, initialValue, formValueName, ...props }) => {
  const [text, setText] = useState(initialValue);
  return (
      <MyField
          name={formValueName}
          htmlFor={`text-input-${id}`}
          {...props}
      >
        <Input id={`text-input-${id}`} label={label} value={text} onChange={(e)=> setText(e)} name={formValueName} {...props} />
      </MyField>)
};

MyFieldText.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  formValueName: PropTypes.string,
};

const LinkField = (props) => (
  <MyField
    name="meetingLink"
    component={(props)=><Input formLabel={"Link"} {...props} />}
    validate={validateUrl}
    required={false}
    {...props}
  />
);

const MyFieldTextArea = ({ label = "Descripción", initialValue, ...props}) => {
  return (
      <MyField
          name="description"
          required={false}
          component={(props)=><Input formLabel={label} multiline {...props} />}
          {...props}
      />
  )
};

TextAreaWithCharacterCounter.propTypes = { props: PropTypes.any };
const MyFieldTextAreaWithCounter = (props) => (
  <MyField
    icon={<TextAreaIcon />}
    label="Descripción"
    name="description"
    component={(props) => <TextAreaWithCharacterCounter {...props} />}
    required={false}
    {...props}
  />
);

const MyFieldEmail = (props) => (
  <MyField icon={<EmailIcon />} label="Email" name="email" type="email" {...props} />
);

const MyFieldPassword = (props) => (
  <MyField
    icon={<PasswordIcon />}
    label="Contraseña"
    name="password"
    type="password"
    {...props}
  />
);

const MyFieldConfirmPassword = (props) => (
  <MyField
    icon={<PasswordIcon />}
    label="Confirmar contraseña"
    name="confirmPassword"
    type="password"
    {...props}
  />
);

const MyFieldSelect = ({ icon, label, name, ...props }) => {
  return (
      <FormField
          name={name}
          required
      >
        <SelectDropdown name={name} {...props} />
      </FormField>
  )
};
MyFieldSelect.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  name: PropTypes.string,
};

const Footer = ({ children }) => (
  <RowBetween margin={{ vertical: 'medium' }} justify="evenly">
    {children}
  </RowBetween>
);
Footer.propTypes = { children: MyProps.children.isRequired };

const MyForm = ({
  children,
  onSecondary,
  onSubmit,
  primaryLabel = 'Aceptar',
  secondaryLabel = 'Cancelar',
  initialValue = {},
  externalOnChange = () => {},
  ...props
}) => {
  const [loading, withLoading] = useLoading();
  const [value, setValue] = React.useState(initialValue);

  const useResetValue = () => setValue(initialValue);

  return (
    <Form
      value={value}
      messages={{ invalid: 'Inválido', required: 'Obligatorio' }}
      onChange={(nextValue) => {
        externalOnChange(nextValue);
        setValue(nextValue);
      }}
      onSubmit={(event) => {
        event = { ...event, useResetValue };
        withLoading(onSubmit)(event.value);
      }}
      {...props}
    >
      {children}
      <Footer>
        {onSecondary && (
          <Button disabled={loading} secondary label={secondaryLabel} style={{width: "10rem"}} onClick={onSecondary} />
        )}
        <Button
          disabled={loading}
          icon={loading ? <TinySpinner /> : undefined}
          label={primaryLabel}
          primary
          style={{width: "10rem"}}
          type="submit"
        />
      </Footer>
    </Form>
  );
};
MyForm.propTypes = {
  children: MyProps.children,
  onSecondary: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.string,
  initialValue: PropTypes.object,
  externalOnChange: PropTypes.func,
};

MyForm.Text = MyFieldText;
MyForm.TextArea = MyFieldTextArea;
MyForm.TextAreaWithCharacterCounter = MyFieldTextAreaWithCounter;
MyForm.Email = MyFieldEmail;
MyForm.Field = MyField;
MyForm.Password = MyFieldPassword;
MyForm.ConfirmPassword = MyFieldConfirmPassword;
MyForm.Select = MyFieldSelect;
MyForm.Link = LinkField;

export default MyForm;
