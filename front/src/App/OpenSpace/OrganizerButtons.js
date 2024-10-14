import React from 'react';
import { Box, Button } from 'grommet';
import { EditIcon } from '#shared/icons';
import { ButtonToSwitchCallForPapers } from './buttons/ButtonToSwitchCallForPapers';
import { ButtonToToggleVoting } from './buttons/ButtonToToggleVoting';
import { ButtonToToggleShowSpeakerName } from './buttons/ButtonToToggleShowSpeakerName';

const OrganizerButtons = ({
  id,
  setData,
  isActiveCallForPapers,
  isActiveVoting,
  showSpeakerName,
  pushToEditOS,
}) => (
  <Box direction="column" gap="medium" wrap>
    <Button icon={<EditIcon />} color="accent-4" label="Editar" onClick={pushToEditOS} />
    <ButtonToSwitchCallForPapers
      openSpaceID={id}
      setData={setData}
      isActiveCallForPapers={isActiveCallForPapers}
    />
    <ButtonToToggleVoting
      openSpaceID={id}
      setData={setData}
      isActiveVoting={isActiveVoting}
    />
    <ButtonToToggleShowSpeakerName
      openSpaceID={id}
      setData={setData}
      showSpeakerName={showSpeakerName}
    />
  </Box>
);

export default OrganizerButtons;
