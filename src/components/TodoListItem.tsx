import { IconButton, List } from 'react-native-paper';

import type { TodoDto } from '@/types/todo';

type TodoListItemProps = {
  todo: TodoDto;
  onToggleCompleted: (todo: TodoDto) => void;
  disabled?: boolean;
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleString();
}

export function TodoListItem({ todo, onToggleCompleted, disabled = false }: TodoListItemProps) {
  return (
    <List.Item
      title={todo.title}
      description={formatCreatedAt(todo.createdAt)}
      titleStyle={todo.completed ? { textDecorationLine: 'line-through' } : undefined}
      left={() => (
        <IconButton
          icon={todo.completed ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
          onPress={() => onToggleCompleted(todo)}
          disabled={disabled}
        />
      )}
    />
  );
}
