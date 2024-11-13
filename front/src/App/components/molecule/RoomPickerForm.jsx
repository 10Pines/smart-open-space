import {Box, Text, Card as GrommetCard,} from "grommet";
import Input from "../atom/Input.jsx";
import customTheme from "#app/theme.js";

const RoomPickerForm = ({
  room = {
    name: '',
    link: '',
  },
  onChange,
  ...props
}) => {
  const { name, link } = room;

  const onChangeName = (name) => onChange({ ...room, name: name });
  const onChangeLink = (link) => onChange({ ...room, link: link });

  return (
    <GrommetCard
      style={{ padding: '20px 15px', borderRadius: '10px' }}
      background={customTheme.global.colors.primary.light}
      direction={'column'}
      width={'300px'}
      gap={'small'}
      {...props}
    >
      <Input
        primary={false}
        label={'Nombre de la sala'}
        placeholder={'Ingrese el nombre de la sala'}
        value={name}
        onChange={onChangeName}
      />
      <Input
        primary={false}
        label={'Link sala virtual'}
        placeholder={'Ingrese link a la sala virtual'}
        value={link}
        onChange={onChangeLink}
      />
    </GrommetCard>
  );
};

export default RoomPickerForm;
