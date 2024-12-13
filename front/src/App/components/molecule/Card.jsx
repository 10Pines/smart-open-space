import React from 'react';
import { HaltIcon } from '#shared/icons';
import {
  Avatar,
  Box,
  CardBody,
  CardFooter,
  CardHeader,
  Card as GrommetCard,
  Text,
} from 'grommet';
import IconButton from '../atom/IconButton';
import PropTypes from 'prop-types';

const Card = ({
  title,
  description,
  buttons,
  color = 'card-blue',
  showVotes = false,
  width = '300px',
  footerDescription,
  author,
  ...props
}) => {
  return (
    <GrommetCard
      background={color}
      pad="medium"
      gap="1rem"
      height="fit-content"
      width={width}
      round={props.round ?? 'xsmall'}
      {...props}
    >
      <CardHeader>
        <Text as="h2" size="large" weight="normal" margin="0" color="black">
          {title}
        </Text>
      </CardHeader>
        <CardBody>
          <Text
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              lineHeight: '2rem',
              WebkitBoxOrient: 'vertical',
              minHeight: '12rem',
            }}
          >
            {description}
          </Text>
        </CardBody>
      <CardFooter direction="row" justify="between">
        <Box direction="row" align="center" gap="0.5rem">
          <Avatar
            size="30px"
            src={
              author?.avatar ?? 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
          />
          <Text size="small" color="black">
            {author?.name ?? 'Autor del evento'}
          </Text>
        </Box>
        {showVotes && (
          <Box
            direction="row"
            align="center"
            gap="0.4rem"
            background="typography"
            pad="3px 10px"
            round="xsmall"
          >
            <HaltIcon size="1rem" />
            {5}
          </Box>
        )}
      </CardFooter>
      {buttons && (
        <Box width="100%" direction="row" flex justify="end" gap="xsmall">
          {buttons.map(({ icon: Icon, ...button }) => (
            <IconButton
              size="xsmall"
              icon={<Icon size="1rem" />}
              secondary={button.secondary}
              blackAndWhite={button.blackAndWhite}
              onClick={button.onClick}
              {...button}
            />
          ))}
        </Box>
      )}
      {footerDescription && (
        <Box direction="row" gap="small" {...footerDescription.props}>
          {footerDescription.items
            ? footerDescription.items.map((item) => (
                <Box direction="row" align="center" gap="xsmall">
                  {item.icon &&
                    React.cloneElement(item.icon, {
                      size: 'small',
                      color: item.color ?? 'primary',
                    })}
                  <Text
                    size="small"
                    color={item.color ?? 'primary'}
                    weight={item.weight ?? 'normal'}
                  >
                    {item.text}
                  </Text>
                </Box>
              ))
            : null}
        </Box>
      )}
    </GrommetCard>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      secondary: PropTypes.bool,
      blackAndWhite: PropTypes.bool,
    })
  ),
  color: PropTypes.string,
  showVotes: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      width: PropTypes.string,
      min: PropTypes.string,
      max: PropTypes.string,
    }),
  ]),
  footer: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.element.isRequired,
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        color: PropTypes.string,
      })
    ),
    props: PropTypes.object,
  }),
  author: PropTypes.shape({
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default Card;
