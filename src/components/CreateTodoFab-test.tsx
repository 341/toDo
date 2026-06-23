import { CreateTodoFab } from '@/components/CreateTodoFab';
import { todoService } from '@/services/todoService';
import { fireEvent, renderWithProviders, userEvent, waitFor } from '@/test/test-utils';
import type { TodoDto } from '@/types/todo';

type RenderResult = Awaited<ReturnType<typeof renderWithProviders>>;

jest.mock('@/services/todoService', () => ({
  todoService: {
    create: jest.fn(),
  },
}));

const mockedCreate = todoService.create as jest.MockedFunction<typeof todoService.create>;

const createdTodo: TodoDto = {
  id: '99',
  title: 'New task',
  description: 'Details',
  createdAt: '2026-06-23T12:00:00.000Z',
  completed: false,
};

async function openCreateDialog(screen: Pick<RenderResult, 'getByTestId' | 'getByText'>) {
  fireEvent.press(screen.getByTestId('fab'));

  await waitFor(() => {
    expect(screen.getByText('New todo')).toBeTruthy();
  });
}

describe('<CreateTodoFab />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCreate.mockResolvedValue(createdTodo);
  });

  it('opens the create dialog when the FAB is pressed', async () => {
    const { getByLabelText, getByTestId, getByText } = await renderWithProviders(
      <CreateTodoFab onCreated={jest.fn()} />,
    );

    await openCreateDialog({ getByTestId, getByText });

    expect(getByText('New todo')).toBeTruthy();
    expect(getByLabelText('Title')).toBeTruthy();
    expect(getByLabelText('Description')).toBeTruthy();
  });

  it('shows validation when saving without a title', async () => {
    const onCreated = jest.fn();
    const { getByTestId, getByText } = await renderWithProviders(
      <CreateTodoFab onCreated={onCreated} />,
    );

    await openCreateDialog({ getByTestId, getByText });
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Title is required')).toBeTruthy();
    });
    expect(onCreated).not.toHaveBeenCalled();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('creates a todo and notifies the parent on save', async () => {
    const onCreated = jest.fn();
    const user = userEvent.setup();
    const { getByTestId, getByText } = await renderWithProviders(
      <CreateTodoFab onCreated={onCreated} />,
    );

    await openCreateDialog({ getByTestId, getByText });

    await user.type(getByTestId('create-todo-title'), 'New task');
    await user.type(getByTestId('create-todo-description'), 'Details');
    await user.press(getByText('Save'));

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith({
        title: 'New task',
        description: 'Details',
      });
    });

    expect(onCreated).toHaveBeenCalledWith(createdTodo);
  });
});
