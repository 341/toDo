import { useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconButton, List, useTheme } from 'react-native-paper';

import type { TodoDto } from '@/types/todo';
import { formatCreatedAt } from '@/utils/formatCreatedAt';

type TodoListItemProps = {
  todo: TodoDto;
  onToggleCompleted: (todo: TodoDto) => void;
  onDeleteRequest: (todo: TodoDto) => void;
  onPress: (todo: TodoDto) => void;
  disabled?: boolean;
};

export function TodoListItem({
  todo,
  onToggleCompleted,
  onDeleteRequest,
  onPress,
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

  const checkbox = () => (
    <IconButton
      icon={todo.completed ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
      onPress={() => onToggleCompleted(todo)}
      disabled={disabled}
    />
  );

  const itemStyle = { backgroundColor: theme.colors.surface };
  const titleStyle = todo.completed ? { textDecorationLine: 'line-through' as const } : undefined;

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} friction={2}>
      <List.Item
        title={todo.title}
        description={formatCreatedAt(todo.createdAt)}
        style={itemStyle}
        titleStyle={titleStyle}
        left={checkbox}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => onPress(todo)}
      />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    width: 96,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
