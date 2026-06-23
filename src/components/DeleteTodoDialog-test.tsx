import { DeleteTodoDialog } from '@/components/DeleteTodoDialog';
import { todoService } from '@/services/todoService';
import { fireEvent, renderWithProviders, waitFor } from '@/test/test-utils';
import type { TodoDto } from '@/types/todo';

jest.mock('@/services/todoService', () => ({
  todoService: {
    delete: jest.fn(),
  },
}));

const mockedDelete = todoService.delete as jest.MockedFunction<typeof todoService.delete>;

const todoToDelete: TodoDto = {
  id: '1',
  title: 'Buy milk',
  description: 'Whole milk',
  createdAt: '2026-06-23T12:00:00.000Z',
  completed: false,
};

describe('<DeleteTodoDialog />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedDelete.mockResolvedValue(undefined);
  });

  it('shows the todo title and description when open', async () => {
    const { getByText } = await renderWithProviders(
      <DeleteTodoDialog todo={todoToDelete} onDismiss={jest.fn()} onDeleted={jest.fn()} />,
    );

    expect(getByText('Delete todo?')).toBeTruthy();
    expect(getByText(/Buy milk/)).toBeTruthy();
    expect(getByText('Whole milk')).toBeTruthy();
  });

  it('does not render when todo is null', async () => {
    const { queryByText } = await renderWithProviders(
      <DeleteTodoDialog todo={null} onDismiss={jest.fn()} onDeleted={jest.fn()} />,
    );

    expect(queryByText('Delete todo?')).toBeNull();
  });

  it('deletes the todo when confirmed', async () => {
    const onDismiss = jest.fn();
    const onDeleted = jest.fn();
    const { getByText } = await renderWithProviders(
      <DeleteTodoDialog todo={todoToDelete} onDismiss={onDismiss} onDeleted={onDeleted} />,
    );

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledWith('1');
    });

    expect(onDeleted).toHaveBeenCalledWith('1');
    expect(onDismiss).toHaveBeenCalled();
  });
});
