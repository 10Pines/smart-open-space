import { Box, Button, Collapsible, TextInput, Text } from 'grommet';
import { DownIcon, UpIcon } from '#shared/icons';
import React, { useState } from 'react';
import ListWithRemoveButton from '#shared/ListWithRemoveButton';
import RowBetween from '#shared/RowBetween';
import { PlusButton } from '#shared/PlusButton';
import { validateUrl } from '#helpers/validateUrl';

const Documents = ({ value, onChange }) => {
  let initialDocument = { name: '', link: '' };
  const [document, setDocument] = useState(initialDocument);
  const [isOpen, setIsOpen] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  const hasNoDocumentName = document.name.trim().length < 1;
  const hasNoDocumentLink = document.link.trim().length < 1;

  const updateUrl = (link) => {
    setDocument({ ...document, link });
    setInvalidUrl(validateUrl(link));
  };

  return (
    <Box>
      <Button
        alignSelf="center"
        icon={isOpen ? <UpIcon /> : <DownIcon />}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Collapsible open={isOpen}>
        <Box justify="around" direction="column" height="small">
          <RowBetween>
            <TextInput
              onChange={(event) => setDocument({ ...document, name: event.target.value })}
              placeholder="Titulo"
              value={document.name}
            />
          </RowBetween>
          <Box>
            <TextInput
              onChange={(event) => updateUrl(event.target.value)}
              placeholder="Link"
              value={document.link}
            />
            {invalidUrl && <Text color={'Red'}>{invalidUrl}</Text>}
          </Box>
        </Box>
        <PlusButton
          conditionToDisable={hasNoDocumentName || hasNoDocumentLink || !!invalidUrl}
          onChange={onChange}
          value={value}
          item={document}
          initialItem={initialDocument}
          setItem={setDocument}
          alignSelf="end"
        />
      </Collapsible>
      <ListWithRemoveButton items={value} onChange={onChange} />
    </Box>
  );
};

export default Documents;
