import { useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconButton, List, useTheme } from 'react-native-paper';

import type { TodoDto } from '@/types/todo';

type TodoListItemProps = {
  todo: TodoDto;
  onToggleCompleted: (todo: TodoDto) => void;
  onDeleteRequest: (todo: TodoDto) => void;
  disabled?: boolean;
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleString();
}

function formatListDescription(todo: TodoDto) {
  const createdAt = formatCreatedAt(todo.createdAt);

  if (todo.description?.trim()) {
    return `${todo.description.trim()}\n${createdAt}`;
  }

  return createdAt;
}

export function TodoListItem({
  todo,
  onToggleCompleted,
  onDeleteRequest,
  disabled = false,
}: TodoListItemProps) {
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const handleDeletePress = () => {
    swipeableRef.current?.close();
    onDeleteRequest(todo);
  };

  const renderRightActions = () => (
    <Pressable
      style={[styles.deleteAction, { backgroundColor: theme.colors.error }]}
      onPress={handleDeletePress}
    >
      <IconButton icon="delete" iconColor={theme.colors.onError} />
    </Pressable>
  );

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} friction={2}>
      <List.Item
        title={todo.title}
        description={formatListDescription(todo)}
        descriptionNumberOfLines={3}
        style={{ backgroundColor: theme.colors.surface }}
        titleStyle={todo.completed ? { textDecorationLine: 'line-through' } : undefined}
        left={() => (
          <IconButton
            icon={todo.completed ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            onPress={() => onToggleCompleted(todo)}
            disabled={disabled}
          />
        )}
      />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
