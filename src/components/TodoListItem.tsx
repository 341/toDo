import { List } from 'react-native-paper';

import type { TodoDto } from '@/types/todo';

type TodoListItemProps = {
  todo: TodoDto;
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleString();
}

export function TodoListItem({ todo }: TodoListItemProps) {
  return (
    <List.Item
      title={todo.title}
      description={formatCreatedAt(todo.createdAt)}
      titleStyle={todo.completed ? { textDecorationLine: 'line-through' } : undefined}
      left={(props) => (
        <List.Icon
          {...props}
          icon={todo.completed ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
        />
      )}
    />
  );
}
