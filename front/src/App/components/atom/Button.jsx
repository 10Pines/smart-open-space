import React from 'react';
import { Box, Button as GrommetButton, Spinner, Text } from 'grommet';
import customTheme from '../../../App/theme';

const Button = ({
  children = 'Boton',
  secondary = false,
  blackAndWhite = false,
  textColor,
  variant = 'normal', // normal, circular, square
  autoWidth = false,
  icon,
  onClick = () => {},
  loading = false,
  logicHover = false,
  wrap = false,
  style,
  ...props
}) => {
  const blackAndWhiteColor = customTheme.global.colors.typography.light;

  if (typeof children !== 'string') throw new Error('Children must be a string');

  const getColorForIcon = () => {
    return variant === 'circular'
      ? secondary && blackAndWhite
        ? blackAndWhiteColor
        : 'white'
      : secondary
      ? blackAndWhite
        ? blackAndWhiteColor
        : 'primary'
      : undefined;
  };

  const styledIcon = icon
    ? React.cloneElement(icon, {
        color: getColorForIcon(),
        'data-testid': 'so-button-icon',
      })
    : undefined;

  const renderLoadingLabel = () => (
    <Box width="100%" align="center">
      <Spinner
        data-testid="so-button-spinner"
        color={secondary ? (!blackAndWhite ? 'primary' : blackAndWhiteColor) : 'white'}
      />
    </Box>
  );

  const renderTextLabel = () => (
    <Text
      data-testid="so-button-label-text"
      color={textColor ? textColor : (secondary ? (!blackAndWhite ? 'primary' : blackAndWhiteColor) : 'white')}
      style={{
        textWrap: wrap ? 'wrap' : 'nowrap',
      }}
    >
      {children}
    </Text>
  );

  const renderIconLabel = () => styledIcon;

  const renderLabel = () =>
    loading
      ? renderLoadingLabel()
      : variant === 'circular'
      ? renderIconLabel()
      : renderTextLabel();

  const getStyles = {
    ...styles.base({ secondary, logicHover }),
    ...styles[variant]({ autoWidth, secondary, logicHover, props }),
    ...style,
  };

  return (
    <GrommetButton
      data-testid="so-button"
      primary={!secondary}
      secondary={secondary}
      label={renderLabel(wrap)}
      onClick={onClick}
      color={!blackAndWhite ? 'primary' : blackAndWhiteColor}
      icon={!loading && variant !== 'circular' && styledIcon}
      style={getStyles}
      {...props}
    />
  );
};

const circularSize = {
  xxsmall: '1.5rem',
  xsmall: '2rem',
  small: '2.5rem',
  medium: '3rem',
  large: '3.5rem',
};

const styles = {
  base: ({ secondary, logicHover }) => ({
    lineHeight: '1rem',
    color: secondary && 'primary',
    boxShadow: logicHover ? 'rgb(63, 136, 128) 0px 0px 0px 2px' : undefined,
  }),
  circular: ({ secondary, props }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: props.size ? circularSize[props.size] : '3rem',
    height: props.size ? circularSize[props.size] : '3rem',
    minWidth: props.width?.min ?? undefined,
    padding: '0',
    borderRadius: '50%',
    border: secondary ? '2px solid rgb(53, 39, 13)' : null,
  }),
  square: () => ({
    borderRadius: '0.5rem',
  }),
  normal: ({ autoWidth }) => ({
    width: autoWidth ? 'fit-content' : '100%',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
  }),
};

export default Button;
