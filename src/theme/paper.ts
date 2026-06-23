import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const brandPrimary = '#208AEF';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandPrimary,
    primaryContainer: '#D3E7FD',
    onPrimaryContainer: '#001B3D',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandPrimary,
    primaryContainer: '#004A8F',
    onPrimaryContainer: '#D3E7FD',
  },
};
