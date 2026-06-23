import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import { TodoListItem } from '@/components/TodoListItem';
import { todoService } from '@/services/todoService';
import type { TodoDto } from '@/types/todo';

export default function Index() {
  const theme = useTheme();
  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<TodoDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError(null);
      const data = await todoService.getAll();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleToggleCompleted = useCallback(async (todo: TodoDto) => {
    setUpdatingId(todo.id);

    try {
      const updated = await todoService.update(todo.id, {
        completed: !todo.completed,
      });

      setTodos((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const handleDeleteRequest = useCallback((todo: TodoDto) => {
    setTodoToDelete(todo);
  }, []);

  const handleDismissDelete = useCallback(() => {
    if (!deleting) {
      setTodoToDelete(null);
    }
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!todoToDelete) {
      return;
    }

    setDeleting(true);

    try {
      await todoService.delete(todoToDelete.id);
      setTodos((current) => current.filter((item) => item.id !== todoToDelete.id));
      setTodoToDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [todoToDelete]);

  return (
    <>
      <Stack.Screen options={{ title: 'toDo' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator animating size="large" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text variant="bodyLarge" style={styles.message}>
              {error}
            </Text>
            <Button mode="contained" onPress={() => loadTodos()}>
              Retry
            </Button>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadTodos(true)} />
            }
            contentContainerStyle={
              todos.length === 0 ? styles.emptyListContent : styles.listContent
            }
            ListEmptyComponent={
              <Text variant="bodyLarge" style={styles.message}>
                No todos yet.
              </Text>
            }
            renderItem={({ item }) => (
              <TodoListItem
                todo={item}
                onToggleCompleted={handleToggleCompleted}
                onDeleteRequest={handleDeleteRequest}
                disabled={updatingId === item.id}
              />
            )}
          />
        )}
      </View>
      <Portal>
        <Dialog visible={todoToDelete !== null} onDismiss={handleDismissDelete}>
          <Dialog.Title>Delete todo?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete &quot;{todoToDelete?.title}&quot;?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDismissDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button
              onPress={handleConfirmDelete}
              loading={deleting}
              disabled={deleting}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
