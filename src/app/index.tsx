import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import { CreateTodoFab } from '@/components/CreateTodoFab';
import { DeleteTodoDialog } from '@/components/DeleteTodoDialog';
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

  const handleTodoCreated = useCallback((created: TodoDto) => {
    setTodos((current) => [created, ...current]);
  }, []);

  const handleTodoDeleted = useCallback((id: string) => {
    setTodos((current) => current.filter((item) => item.id !== id));
  }, []);

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
                onDeleteRequest={setTodoToDelete}
                disabled={updatingId === item.id}
              />
            )}
          />
        )}
        {!loading && !error ? <CreateTodoFab onCreated={handleTodoCreated} /> : null}
      </View>
      <DeleteTodoDialog
        todo={todoToDelete}
        onDismiss={() => setTodoToDelete(null)}
        onDeleted={handleTodoDeleted}
      />
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
    paddingBottom: 88,
  },
  emptyListContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 88,
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
