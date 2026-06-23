import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const brandPrimary = '#6050f0';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandPrimary,
    primaryContainer: '#E8E4FF',
    onPrimaryContainer: '#1F1580',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandPrimary,
    primaryContainer: '#4A3DB8',
    onPrimaryContainer: '#E8E4FF',
  },
};
