import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { PaperProvider, useTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { darkTheme, lightTheme } from '@/theme/paper';
import { ThemeProvider, useThemePreference } from '@/theme/ThemeContext';

function ThemedStack() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          color: theme.colors.onSurface,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );
}

function RootLayoutNav() {
  const { colorScheme } = useThemePreference();
  const paperTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider
        theme={paperTheme}
        settings={{
          icon: (props) => <MaterialDesignIcons {...props} />,
        }}
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ThemedStack />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
