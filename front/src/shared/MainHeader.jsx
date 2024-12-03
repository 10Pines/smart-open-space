import React from 'react';

import PropTypes from 'prop-types';
import { Box, Text, Paragraph, Button as GrommetButton, Markdown } from 'grommet';

import MyProps from '#helpers/MyProps';
import useSize from '#helpers/useSize';
import ButtonNew from './ButtonNew';
import ButtonLoading from './ButtonLoading';
import Row from './Row';
import RowBetween from './RowBetween';
import Title from './Title';
import {scrollToSection} from "#helpers/scrollUtils.js";
import Button from "#components/atom/Button.jsx";
import {TALKS_WITHOUT_TRACKS_TITLE} from "#shared/constants.js";

const useTextAlign = () => (useSize() === 'small' ? 'center' : 'start');

const MyTitle = ({ children, icon: Icon, label, ...props }) => (
  <Title level="2" alignSelf={useTextAlign()} {...props}>
    <Row>
      {Icon && <Icon />}
      {label}
      {children}
    </Row>
  </Title>
);
MyTitle.propTypes = {
  children: MyProps.children,
  icon: PropTypes.func,
  label: PropTypes.string,
};

const MyTitleLink = (props) => (
  <MyTitle style={{ textDecoration: 'underline' }}>
    <GrommetButton hoverIndicator plain {...props} />
  </MyTitle>
);

const MySubTitle = ({ children, icon: Icon, label, ...props }) => (
  <Text color="dark-5" size="large" textAlign={useTextAlign()} {...props}>
    <Row>
      {Icon && <Icon color="dark-5" />}
      {label}
      {children}
    </Row>
  </Text>
);
MySubTitle.propTypes = {
  children: MyProps.children,
  icon: PropTypes.func,
  label: PropTypes.string,
};

const Description = ({ children, description, ...props }) => (
  <Box margin={{ bottom: '20px' }}>
    <Markdown components={{ p: (props) => <Paragraph {...props} fill /> }}>
      {description}
    </Markdown>
  </Box>
);

const Tracks = ({ children, tracks, talks, setSelectedTrack, ...props }) => {
  const talksWithoutTrack = talks && talks.filter((talk) => !talk.track);

  return (
    <Box gap={"medium"} direction={"row-responsive"} wrap>
      {tracks.map((track, index) => (
        <Button key={index} color={track.color} textColor={"dark-2"} style={{width: "fit-content", marginTop: "10px"}} onClick={(e) => {
          scrollToSection(e, track.name)
          setSelectedTrack(track.name)
        }}>
          {track.name}
        </Button>
      ))}
      {talks && talksWithoutTrack.length > 0 &&
        <Button color={"#e4e4e4"} textColor={"dark-2"} style={{width: "fit-content", marginTop: "10px"}} onClick={(e) => {
          scrollToSection(e, TALKS_WITHOUT_TRACKS_TITLE)
          setSelectedTrack(TALKS_WITHOUT_TRACKS_TITLE)
        }}>
          {TALKS_WITHOUT_TRACKS_TITLE}
        </Button>
      }
    </Box>
  );
};

Description.propTypes = {
  children: MyProps.children,
  description: PropTypes.string,
};

const MyButton = (props) => <GrommetButton primary {...props} />;

const getByType = (childs, type) => childs.find((c) => c.type === type);
const getAllByTypes = (childs, ...types) =>
  childs.filter((c) => types.find((t) => t === c.type));

const Buttons = ({ children }) => <Box gap="medium">{children}</Box>;
Buttons.propTypes = { children: MyProps.children };

const MainHeader = ({ children, ...props }) => {
  const isSmall = useSize() === 'small';
  const theChildren = React.Children.toArray(children);
  const titles = getAllByTypes(theChildren, MyTitle, MyTitleLink, MySubTitle);
  const button = getByType(theChildren, MyButton);
  const description = getByType(theChildren, Description);
  const tracks = getByType(theChildren, Tracks);
  const buttons = getByType(theChildren, Buttons);
  return (
    <>
      <RowBetween
        direction={isSmall ? 'column' : 'row'}
        margin={{ vertical: isSmall ? 'large' : 'medium' }}
      >
        <Box
          align={isSmall ? 'center' : undefined}
          margin={{ bottom: isSmall ? 'large' : undefined }}
          {...props}
        >
          {titles}
          <Box width="250px">{button}</Box>
        </Box>
        {buttons}
      </RowBetween>
      {description}
      {tracks}
    </>
  );
};
MainHeader.propTypes = { children: MyProps.children.isRequired };

MainHeader.Title = MyTitle;
MainHeader.TitleLink = MyTitleLink;
MainHeader.SubTitle = MySubTitle;
MainHeader.Description = Description;
MainHeader.Tracks = Tracks;
MainHeader.Button = MyButton;
MainHeader.ButtonNew = ButtonNew;
MainHeader.ButtonLoading = ButtonLoading;
MainHeader.Buttons = Buttons;

export default MainHeader;
