import { Box, Button, Collapsible, TextInput, Text } from 'grommet';
import {CloseIcon, DownIcon, UpIcon} from '#shared/icons';
import React, {useCallback, useState} from 'react';
import ListWithRemoveButton from '#shared/ListWithRemoveButton';
import RowBetween from '#shared/RowBetween';
import { PlusButton } from '#shared/PlusButton';
import { validateUrl } from '#helpers/validateUrl';
import Carousel from "#components/molecule/Carousel.jsx";
import Badge from "#components/molecule/Badge.jsx";
import RoomPickerForm from "#components/molecule/RoomPickerForm.jsx";
import AddElementBox from "#components/molecule/AddElementBox.jsx";

const Documents = ({ value, onChange }) => {
  let initialDocument = { name: '', link: '' };
  const [document, setDocument] = useState(initialDocument);
  const [isOpen, setIsOpen] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);

/*  const removeRoom = useCallback(
      (index) => {
        const updatedRooms = removeItemAtIndex(openSpace.rooms, index);
        setOpenSpace((prev) => ({ ...prev, rooms: updatedRooms }));
      },
      [openSpace, setOpenSpace]
  );
  const addRoom = useCallback(() => {
    const newRooms = [...openSpace.rooms, { name: '', link: '' }];
    setOpenSpace({ ...openSpace, rooms: newRooms });

  }, [openSpace, setOpenSpace]);
  const changeRoom = useCallback(
      (room, index) => {
        const newRooms = [...openSpace.rooms];
        newRooms[index] = room;
        setOpenSpace({ ...openSpace, rooms: newRooms });
      },
      [openSpace, setOpenSpace]
  );*/

  const hasNoDocumentName = document.name.trim().length < 1;
  const hasNoDocumentLink = document.link.trim().length < 1;

  const updateUrl = (link) => {
    setDocument({ ...document, link });
    setInvalidUrl(validateUrl(link));
  };

  console.log("VALUEE", value)
  const cardsAnimation = {
    type: 'fadeIn',
    delay: 1,
    duration: 800,
  };


  return (
      <>
{/*    <Box>
      <Button
        alignSelf="center"
        icon={isOpen ? <UpIcon /> : <DownIcon />}
        onClick={() => setIsOpen(!isOpen)}
      />
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
      <ListWithRemoveButton items={value} onChange={onChange} />
    </Box>*/}
  <Box>
    <Text>Documentos</Text>
    <Carousel >
      {value &&
          value.map((document, index) => (
              <Box
                  style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                  animation={cardsAnimation}
              >
                <Badge key={index} onClick={() => {
                  value.splice(index, 1);
                  onChange({value: [...value]});
                }} icon={<CloseIcon />}>
                  <RoomPickerForm
                      room={document}
                      onChange={(updatedDocument) => {
                        value[index] = updatedDocument;
                        onChange({value: [...value]})
                      }}
                      width={{ min: '300px' }}
                      animation={cardsAnimation}
                  />
                </Badge>
              </Box>
          ))}
      <AddElementBox
          onClick={()=> {
            onChange({value: [...value, document]})
            setDocument(initialDocument)
          }
      }
          size={{
            height: value > 0 ? 'auto' : '146px',
            width: '300px',
          }}
          width={{ min: '300px' }}
      />
    </Carousel>
  </Box>
  </>
  );
};

export default Documents;
