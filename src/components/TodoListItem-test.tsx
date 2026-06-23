import { TodoListItem } from '@/components/TodoListItem';
import { fireEvent, renderWithProviders, waitFor } from '@/test/test-utils';
import type { TodoDto } from '@/types/todo';

type RenderResult = Awaited<ReturnType<typeof renderWithProviders>>;

const baseTodo: TodoDto = {
  id: '1',
  title: 'Buy milk',
  description: '',
  createdAt: '2026-06-23T12:00:00.000Z',
  completed: false,
};

function getEnabledIconButton(getAllByTestId: RenderResult['getAllByTestId']) {
  return getAllByTestId('icon-button').find((button) => {
    const props = button.props as { accessibilityState?: { disabled?: boolean } };
    return !props.accessibilityState?.disabled;
  });
}

describe('<TodoListItem />', () => {
  it('renders the todo title', async () => {
    const { getByText } = await renderWithProviders(
      <TodoListItem todo={baseTodo} onToggleCompleted={jest.fn()} onDeleteRequest={jest.fn()} />,
    );

    expect(getByText('Buy milk')).toBeTruthy();
  });

  it('calls onToggleCompleted when the checkbox is pressed', async () => {
    const onToggleCompleted = jest.fn();
    const { getAllByTestId } = await renderWithProviders(
      <TodoListItem
        todo={baseTodo}
        onToggleCompleted={onToggleCompleted}
        onDeleteRequest={jest.fn()}
      />,
    );

    const checkbox = getEnabledIconButton(getAllByTestId);
    fireEvent.press(checkbox!);

    expect(onToggleCompleted).toHaveBeenCalledWith(baseTodo);
  });

  it('expands the description when a row with description is pressed', async () => {
    const todoWithDescription = {
      ...baseTodo,
      description: 'Get organic whole milk',
    };
    const { getByRole, getByText } = await renderWithProviders(
      <TodoListItem
        todo={todoWithDescription}
        onToggleCompleted={jest.fn()}
        onDeleteRequest={jest.fn()}
      />,
    );

    fireEvent.press(getByRole('button', { expanded: false }));

    await waitFor(() => {
      expect(getByText('Get organic whole milk')).toBeTruthy();
    });
  });
});
