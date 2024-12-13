import { Box, Text } from 'grommet';
import React, {useState} from 'react';
import Carousel from "#components/molecule/Carousel.jsx";
import Badge from "#components/molecule/Badge.jsx";
import LinkForm from "#components/molecule/LinkForm.jsx";
import AddElementBox from "#components/molecule/AddElementBox.jsx";
import globalStyles from "#shared/styles/styles.js";

const Documents = ({ value, onChange }) => {
  let initialDocument = { name: '', link: '' };
  const [document, setDocument] = useState(initialDocument);

  return (
  <Box>
    <Text>Documentos</Text>
    <Carousel >
      {value &&
          value.map((document, index) => (
              <Box
                  style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                  animation={globalStyles.cardsAnimation}
              >
                <Badge key={index} onClick={() => {
                  value.splice(index, 1);
                  onChange({value: [...value]});
                }}>
                  <LinkForm
                      item={document}
                      onChange={(updatedDocument) => {
                        value[index] = updatedDocument;
                        onChange({value: [...value]})
                      }}
                      nameLabel={"Nombre"}
                      namePlaceholder={"Ingrese el nombre del documento"}
                      linkLabel={"Link al documento"}
                      linkPlaceholder={"Ingrese el link al documento"}
                      width={{ min: '300px' }}
                      animation={globalStyles.cardsAnimation}
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
