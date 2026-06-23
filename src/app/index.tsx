import { StyleSheet, View } from 'react-native';
import { SegmentedButtons, Surface, Text, useTheme } from 'react-native-paper';

import { type ThemePreference, useThemePreference } from '@/theme/ThemeContext';

const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const satisfies readonly {
  value: ThemePreference;
  label: string;
}[];

export default function Index() {
  const theme = useTheme();
  const { colorScheme, preference, setPreference } = useThemePreference();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.card} elevation={1}>
        <Text variant="headlineSmall" style={styles.title}>
          toDo
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          React Native Paper is configured with {colorScheme} theme colors.
        </Text>
        <Text variant="labelLarge" style={styles.label}>
          Theme
        </Text>
        <SegmentedButtons
          value={preference}
          onValueChange={(value) => setPreference(value as ThemePreference)}
          buttons={themeOptions.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderRadius: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  label: {
    marginTop: 8,
  },
});
