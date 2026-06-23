import { render, type RenderOptions } from '@testing-library/react-native';
import { type ReactElement, type ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';

function TestProviders({ children }: { children: ReactNode }) {
  return <PaperProvider>{children}</PaperProvider>;
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: TestProviders, ...options });
}

export { act, fireEvent, userEvent, waitFor } from '@testing-library/react-native';
