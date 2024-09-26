import React from 'react';
import { Box, Button } from 'grommet';
import RowBetween from '#shared/RowBetween';
import { TrashIcon } from '#shared/icons';
import PropTypes from 'prop-types';

const List = (props) => <Box as="ul" margin={{ vertical: 'small' }} {...props} />;

const ListItem = (props) => <RowBetween as="li" border="top" pad="xxsmall" {...props} />;

const Item = ({ color, itemName, onRemove }) => (
  <ListItem>
    <Box pad={{ horizontal: 'medium', vertical: 'small' }} background={color}>
      {itemName}
    </Box>
    <Button icon={<TrashIcon color="neutral-4" />} onClick={onRemove} />
  </ListItem>
);
Item.propTypes = {
  onRemove: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
};

const ListWithRemoveButton = ({
  items,
  onChange,
  displayName = (item) => item.name,
  onRemoveItem = (item) => {},
}) => {
  return (
    <List>
      {items.map((item, itemIndex) => (
        <Item
          color={item.color}
          key={itemIndex}
          itemName={displayName(item)}
          onRemove={() => {
            onRemoveItem(item);
            onChange({
              value: items.filter((_, index) => index !== itemIndex),
            });
          }}
        />
      ))}
    </List>
  );
};
ListWithRemoveButton.propTypes = {
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ListWithRemoveButton;
