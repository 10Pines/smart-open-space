import { Select } from 'grommet';
import { CircleIcon } from '#shared/icons';
import React from 'react';

export const ColorPicker = ({ colors, setColor, initialColor }) => {
  // TODO: Workaround due to an issue with actual grommet version and Select bug using JSX components
  // TODO: Delete this maps and use direct hexa color option with JSX icon component when it's fixed
  const colorsTuples = colors.map((color) => [color.hex, color.name]);
  const mapColorHexToName = buildMapFromPairList(colorsTuples, true);
  const mapColorNameToHex = buildMapFromPairList(colorsTuples, false);

  const createIconColor = (c) => <CircleIcon size="large" color={c} />;

  const getObjectOption = (c) => ({
    nameValue: mapColorHexToName[c],
    // NOT WORKING with actual version of grommet
    iconValue: createIconColor(c),
  });

  return (
    <Select
      options={colors.map((colorObj) => getObjectOption(colorObj.hex))}
      value={createIconColor(initialColor)}
      onChange={(objOption) => setColor(mapColorNameToHex[objOption.option.nameValue])}
    />
  );
};

const buildMapFromPairList = (pairList, firstIsKey = true) => {
  return pairList.reduce((acc, elem) => {
    if (firstIsKey) {
      acc[elem[0]] = elem[1];
    } else {
      acc[elem[1]] = elem[0];
    }
    return acc;
  }, {});
};
