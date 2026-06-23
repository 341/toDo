# toDo

A cross-platform todo app built with [Expo](https://expo.dev) (SDK 56), [Expo Router](https://docs.expo.dev/router/introduction/), and [React Native Paper](https://callstack.github.io/react-native-paper/). Todos are stored on a remote [MockAPI](https://mockapi.io) backend.

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Run on a specific platform:

```bash
npm run ios      # iOS simulator or device (development build)
npm run android  # Android emulator or device (development build)
npm run web      # web browser
```

## Using the app

When you open the app, the home screen loads your todo list from the API.

### View todos

- Each row shows the **title** and **created date**.
- **Pull down** on the list to refresh.
- If loading fails, tap **Retry** to try again.

### Create a todo

1. Tap the **+** floating button in the bottom-right corner.
2. Enter a **title** (required).
3. Optionally enter a **description**.
4. Tap **Save** to create the todo, or **Cancel** to close without saving.

New todos are created with `completed` set to `false`.

### Mark complete or incomplete

- Tap the **checkbox** on the left of a row to toggle completion.
- Completed todos show a checked icon and strikethrough title.
- The change is saved to the API immediately.

### Read the description

- If a todo has a description, tap the row to expand or collapse it accordion-style.
- A **chevron** on the right indicates whether the row is expanded.
- Todos without a description do not expand.

### Delete a todo

1. **Swipe left** on a row to reveal the delete action.
2. Tap the delete button.
3. Confirm in the dialog, or tap **Cancel** to keep the todo.

### Theme

The app follows your device **light or dark** system theme automatically. UI colors use Material Design 3 via React Native Paper.

## Development

Run type checking, linting, and formatting:

```bash
npm run check
```

Other useful scripts:

```bash
npm run lint:fix     # fix ESLint issues
npm run format:write # format with Prettier
npm run typecheck    # TypeScript only
```

CI runs `npm run check` on pushes and pull requests to `main`.

## Project structure

```
src/
  app/           # Expo Router screens and layout
  components/    # UI components (list item, create FAB, delete dialog)
  services/      # MockAPI client (todoService)
  theme/         # Paper light/dark themes and theme preference
  types/         # Todo DTO types
```

## API

Todos are fetched from:

`https://6a3ad3fe917c7b14c74e2173.mockapi.io/todo`

Each todo has:

| Field         | Type    | Description              |
| ------------- | ------- | ------------------------ |
| `id`          | string  | Unique identifier        |
| `title`       | string  | Todo title               |
| `description` | string  | Optional details         |
| `completed`   | boolean | Completion status        |
| `createdAt`   | string  | ISO creation timestamp   |

Supported operations: list, get by id, create, update, delete.
