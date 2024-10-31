import { AddIcon, EditIcon, HaltIcon, UpIcon } from '#shared/icons';
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

const Card = ({
  title,
  description,
  buttons,
  color = 'card-blue',
  showVotes = false,
  width = '300px',
}) => {
  return (
    <GrommetCard
      background={color}
      pad="medium"
      gap="1rem"
      height="fit-content"
      width={width}
      round="xsmall"
    >
      <CardHeader>
        <Text as="h2" size="large" weight="normal" margin="0" color="black">
          {title}
        </Text>
      </CardHeader>
      {description && (
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
      )}
      <CardFooter direction="row" justify="between">
        <Box direction="row" align="center" gap="0.5rem">
          <Avatar
            size="30px"
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          />
          <Text size="small" color="black">
            Autor del evento
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
          <IconButton
            size="xsmall"
            icon={<HaltIcon size="1rem" />}
            secondary
            blackAndWhite
          />
          <IconButton size="xsmall" icon={<EditIcon size="1rem" />} blackAndWhite />
          <IconButton size="xsmall" icon={<AddIcon size="1rem" />} blackAndWhite />
        </Box>
      )}
    </GrommetCard>
  );
};

export default Card;
