import customTheme from '../App/theme';

export const getLayoutGeneralPadding = (size) => {
  return {
    horizontal: customTheme.global.layout.padding.horizontal[size] || 'medium',
    vertical: customTheme.global.layout.padding.vertical[size] || 'medium',
  };
};
