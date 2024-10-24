import React from 'react';
import { Box, Button as GrommetButton, Spinner, Text } from 'grommet';
import customTheme from '../../../App/theme';

const Button = ({
  children = 'Boton',
  secondary = false,
  blackAndWhite = false,
  variant = 'normal', // normal, circular, square
  autoWidth = false,
  icon,
  onClick = () => {},
  loading = false,
  ...props
}) => {
  const blackAndWhiteColor = customTheme.global.colors.typography.light;

  if (typeof children !== 'string') throw new Error('Children must be a string');

  const styledIcon = icon
    ? React.cloneElement(icon, {
        color:
          variant === 'circular'
            ? secondary && blackAndWhite
              ? blackAndWhiteColor
              : 'white'
            : secondary
            ? !blackAndWhite
              ? 'primary'
              : blackAndWhiteColor
            : undefined,
        'data-testid': 'so-button-icon',
      })
    : undefined;

  return (
    <GrommetButton
      data-testid="so-button"
      primary={!secondary}
      secondary={secondary}
      label={
        loading ? (
          <Box width="100%" align="center">
            <Spinner
              data-testid="so-button-spinner"
              color={
                secondary ? (!blackAndWhite ? 'primary' : blackAndWhiteColor) : 'white'
              }
            />
          </Box>
        ) : variant !== 'circular' ? (
          <Text
            data-testid="so-button-label-text"
            color={
              secondary ? (!blackAndWhite ? 'primary' : blackAndWhiteColor) : 'white'
            }
            style={{
              textWrap: 'nowrap',
            }}
          >
            {children}
          </Text>
        ) : (
          styledIcon
        )
      }
      onClick={onClick}
      color={!blackAndWhite ? 'primary' : blackAndWhiteColor}
      icon={!loading && variant != 'circular' && styledIcon}
      style={{
        display: variant === 'circular' ? 'flex' : undefined,
        alignItems: variant === 'circular' ? 'center' : undefined,
        justifyContent: variant === 'circular' ? 'center' : undefined,
        width: variant === 'circular' ? '3rem' : !autoWidth ? '100%' : 'fit-content',
        height: variant === 'circular' ? '3rem' : 'fit-content',
        minWidth: props.width?.min ?? (variant === 'circular' ? '3rem' : 'auto'),
        color: secondary && 'primary',
        padding: variant === 'circular' ? '0' : `0.5rem 1rem`,
        lineHeight: '1rem',
        borderRadius:
          variant === 'square' ? '0.5rem' : variant === 'circular' ? '50%' : '2rem',
        border: variant === 'circular' && secondary ? '2px solid rgb(53, 39, 13)' : null,
      }}
      {...props}
    />
  );
};

export default Button;
