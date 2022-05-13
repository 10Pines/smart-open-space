import React, { useState } from 'react';

import { Anchor, Box, Button, Layer } from 'grommet';
import PropTypes from 'prop-types';

import Card from '#shared/Card';
import Detail from '#shared/Detail';
import { FormCloseIcon, HomeIcon, LinkIcon, UserIcon } from '#shared/icons';
import Row from '#shared/Row';
import Title from '#shared/Title';

const DescriptionInfo = ({ title, speaker, info, onClose, meeting }) => (
  <Layer onClickOutside={onClose} onEsc={onClose}>
    <Box gap="medium" pad={{ horizontal: 'medium', bottom: 'medium', top: 'small' }}>
      <Row justify="end">
        <Button icon={<FormCloseIcon />} onClick={onClose} plain />
      </Row>
      <Title level="2">{title}</Title>
      <Detail icon={UserIcon} text={speaker} />
      <Detail color="dark-1" text={info} />
      <Anchor icon={<LinkIcon />} color="dark-1" href={meeting} label={meeting} />
    </Box>
  </Layer>
);
DescriptionInfo.propTypes = {
  info: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  speaker: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  meeting: PropTypes.string.isRequired,
};

const ButtonMoreInfo = ({ onClick }) => (
  <Button
    alignSelf="center"
    color="accent-3"
    label="Mas Info"
    onClick={onClick}
    primary
  />
);
ButtonMoreInfo.propTypes = { onClick: PropTypes.func.isRequired };

const Talk = ({ talk: { description, name, speaker, meeting }, room }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card
        borderColor="accent-3"
        height={room ? '230px' : undefined}
        margin="xsmall"
        gap="small"
      >
        <Box>
          <Box overflow="hidden">
            <Title>{name}</Title>
          </Box>
          <Detail icon={UserIcon} text={speaker.name} />
          {room && <Detail icon={HomeIcon} text={room.name} />}
        </Box>
        {description && <ButtonMoreInfo onClick={() => setOpen(true)} />}
      </Card>
      {open && (
        <DescriptionInfo
          title={name}
          speaker={speaker.name}
          info={description}
          onClose={() => setOpen(false)}
          meeting={meeting}
        />
      )}
    </>
  );
};
Talk.propTypes = {
  room: PropTypes.shape(),
  talk: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    speaker: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export default Talk;
