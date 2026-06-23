import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconButton, List, Text, useTheme } from 'react-native-paper';

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

export function TodoListItem({
  todo,
  onToggleCompleted,
  onDeleteRequest,
  disabled = false,
}: TodoListItemProps) {
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const [expanded, setExpanded] = useState(false);
  const hasDescription = Boolean(todo.description?.trim());

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
      {hasDescription ? (
        <List.Accordion
          title={todo.title}
          description={formatCreatedAt(todo.createdAt)}
          expanded={expanded}
          onPress={() => setExpanded((current) => !current)}
          style={itemStyle}
          titleStyle={titleStyle}
          left={checkbox}
        >
          <View
            style={[styles.expandedContent, { backgroundColor: theme.colors.elevation.level1 }]}
          >
            <Text variant="bodyMedium">{todo.description.trim()}</Text>
          </View>
        </List.Accordion>
      ) : (
        <List.Item
          title={todo.title}
          description={formatCreatedAt(todo.createdAt)}
          style={itemStyle}
          titleStyle={titleStyle}
          left={checkbox}
        />
      )}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
