import React, { useState } from 'react';
import { Box, Button, Image, Layer, Grid, Text } from 'grommet';
import PropTypes from 'prop-types';

import { numbersToTime } from '#helpers/time';
import Card from '#shared/Card';
import Detail from '#shared/Detail';
import { CalendarIcon, ClockIcon } from '#shared/icons';
import Title from '#shared/Title';
import { usePushToOpenSpace } from '#helpers/routes';
import { DeleteIcon } from '#shared/icons';
import ButtonLoading from '#shared/ButtonLoading';

const ButtonAction = (props) => (
  <ButtonLoading alignSelf="center" margin={{ top: 'small' }} {...props} />
);

const OpenSpace = ({ deleteOS, startDate, endTime, id, name, startTime, urlImage }) => {
  const [hover, setHover] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const PushToOpenSpace = usePushToOpenSpace(id);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      fill
      plain
    >
      <Card
        borderColor={hover ? 'accent-1' : 'brand'}
        elevation={hover ? 'xlarge' : 'small'}
        fill
        justify="start"
        gap="small"
      >
        <Grid gap={'xsmall'}>
          <Button fill onClick={PushToOpenSpace} plain>
            <Box height="xsmall" round={{ corner: 'top' }}>
              <Image
                src={urlImage}
                fit="cover"
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              />
            </Box>
            <Box pad="small" justify="start" gap="small">
              <Title level="3">{name}</Title>
              <Detail
                icon={CalendarIcon}
                text={
                  startDate
                    ? new Date(startDate).toLocaleDateString('es')
                    : 'Sin fecha aún'
                }
              />
              <Detail
                icon={ClockIcon}
                text={
                  startTime && endTime
                    ? `${numbersToTime(startTime)} a ${numbersToTime(endTime)} hs`
                    : ''
                }
              />
            </Box>
          </Button>
          {showDeleteModal && (
            <Layer
              onEsc={() => setShowDeleteModal(false)}
              onClickOutside={() => setShowDeleteModal(false)}
            >
              <Box pad="medium" gap="medium">
                <Text>¿Estás seguro que querés eliminar esta conferencia?</Text>
                <Box justify="around" direction="row" pad="small">
                  <Button
                    label="Si"
                    onClick={() => {
                      deleteOS();
                      setShowDeleteModal(false);
                    }}
                  />
                  <Button label="No" onClick={() => setShowDeleteModal(false)} />
                </Box>
              </Box>
            </Layer>
          )}
        </Grid>
      </Card>
    </Box>
  );
};
OpenSpace.propTypes = {
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.instanceOf(Date),
  ]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]),
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]),
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  urlImage: PropTypes.string.isRequired,
};

export default OpenSpace;
