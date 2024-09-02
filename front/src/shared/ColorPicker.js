import { Select } from 'grommet';
import { CircleIcon } from '#shared/icons';
import React from 'react';
import PropTypes from 'prop-types';

export const ColorPicker = ({ setColor, initialColor, colors }) => {
  // TODO: Workaround due to an issue with actual grommet version and Select bug using JSX components
  // TODO: Delete this maps and use direct hexa color option with JSX icon component when it's fixed

  const emptyColorMapper = { hexToName: {}, nameToHex: {} };
  const colorMapper = colors.reduce(
    ({ hexToName, nameToHex }, color) => ({
      hexToName: { [color.hex]: color.name, ...hexToName },
      nameToHex: { [color.name]: color.hex, ...nameToHex },
    }),
    emptyColorMapper
  );

  const createIconColor = (c) => <CircleIcon size="large" color={c} />;

  const getObjectOption = (c) => ({
    nameValue: colorMapper.hexToName[c],
    // NOT WORKING with actual version of grommet
    iconValue: createIconColor(c),
  });

  return (
    <Select
      options={colors.map((colorObj) => getObjectOption(colorObj.hex))}
      value={createIconColor(initialColor)}
      onChange={(objOption) =>
        setColor(colorMapper.nameToHex[objOption.option.nameValue])
      }
    />
  );
};

ColorPicker.propTypes = {
  setColor: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      hex: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired, // required due to workaround
    })
  ).isRequired,
};
