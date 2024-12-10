import { Box, Text } from 'grommet';
import {CloseIcon} from '#shared/icons';
import React, {useState} from 'react';
import { validateUrl } from '#helpers/validateUrl';
import Carousel from "#components/molecule/Carousel.jsx";
import Badge from "#components/molecule/Badge.jsx";
import RoomPickerForm from "#components/molecule/RoomPickerForm.jsx";
import AddElementBox from "#components/molecule/AddElementBox.jsx";

const Documents = ({ value, onChange }) => {
  let initialDocument = { name: '', link: '' };
  const [document, setDocument] = useState(initialDocument);

  const cardsAnimation = {
    type: 'fadeIn',
    delay: 1,
    duration: 800,
  };

  const badgeProps = {
    icon: <CloseIcon size="small" />,
    position: 'top-right',
    buttonProps: {
      size: 'xxsmall',
    },
  };


  return (
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
                }} icon={<CloseIcon/>} {...badgeProps}>
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
            height: value.length > 0 ? 'auto' : '146px',
            width: '300px',
          }}
          width={{ min: '300px' }}
      />
    </Carousel>
  </Box>
  );
};

export default Documents;
