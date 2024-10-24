import React from 'react';
import { Button as GrommetButton, Text } from 'grommet';

// TODO:
// - [X] Add blackAndWhite option
// - [X] Add label option (children)
// - [X] Add button variant (normal, circular, square)
//    - [X] normal
//    - [X] circular
//    - [X] square
// - [X] add option for change width to fit-content called autoWidth
// - [X] Add icon option
// - [ ] Add onClick option
// - [ ] Add disabled option
// - [ ] Add loading option

const Button = ({
  children = 'Boton',
  secondary = false,
  blackAndWhite = false,
  variant = 'normal', // normal, circular, square
  autoWidth = false,
  icon,
  ...props
}) => {
  const blackAndWhiteColor = '#35270D';

  if (typeof children !== 'string') throw new Error('Children must be a string');

  const styledIcon = icon
    ? React.cloneElement(icon, {
        color: secondary ? (!blackAndWhite ? 'primary' : blackAndWhiteColor) : undefined,
      })
    : undefined;

  return (
    <GrommetButton
      primary={!secondary}
      secondary={secondary}
      label={
        variant !== 'circular' && (
          <Text
            color={
              secondary ? (!blackAndWhite ? 'primary' : blackAndWhiteColor) : 'white'
            }
            style={{
              textWrap: 'nowrap',
            }}
          >
            {children}
          </Text>
        )
      }
      color={!blackAndWhite ? 'primary' : blackAndWhiteColor}
      icon={styledIcon}
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
