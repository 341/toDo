import 'react-native-gesture-handler/jestSetup';

// React 19 reads this global to decide whether automatic act() batching applies in tests.
// RNTL toggles it around nested act() calls; keep it enabled for the whole run to avoid noise.
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  get: () => true,
  set: () => undefined,
  configurable: true,
});

// Reanimated's Jest mock is published as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- required by react-native-reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
