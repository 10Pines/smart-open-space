import { Card as GrommetCard,} from "grommet";
import Input from "../atom/Input.jsx";
import customTheme from "#app/theme.js";

const LinkForm = ({
  item = {
    name: '',
    link: '',
  },
  onChange,
  nameLabel = 'Nombre de la sala',
  namePlaceholder = 'Ingrese el nombre de la sala',
  linkLabel = "Link sala virtual",
  linkPlaceholder = 'Ingrese link a la sala virtual',
  ...props
}) => {
  const { name, link } = item;

  const onChangeName = (name) => onChange({ ...item, name: name });
  const onChangeLink = (link) => onChange({ ...item, link: link });

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
        label={nameLabel}
        placeholder={namePlaceholder}
        value={name}
        onChange={onChangeName}
      />
      <Input
        primary={false}
        label={linkLabel}
        placeholder={linkPlaceholder}
        value={link}
        onChange={onChangeLink}
      />
    </GrommetCard>
  );
};

export default LinkForm;
