import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import { CreateTodoFab } from '@/components/CreateTodoFab';
import { DeleteTodoDialog } from '@/components/DeleteTodoDialog';
import { TodoListFilters } from '@/components/TodoListFilters';
import { TodoListItem } from '@/components/TodoListItem';
import { todoService } from '@/services/todoService';
import type { StatusFilter, TodoDto } from '@/types/todo';

function filterTodos(todos: TodoDto[], searchQuery: string, statusFilter: StatusFilter) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return todos.filter((todo) => {
    const matchesSearch =
      normalizedQuery.length === 0 || todo.title.toLowerCase().includes(normalizedQuery);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !todo.completed) ||
      (statusFilter === 'completed' && todo.completed);

    return matchesSearch && matchesStatus;
  });
}

export default function Index() {
  const theme = useTheme();
  const router = useRouter();
  const [todos, setTodos] = useState<TodoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<TodoDto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredTodos = useMemo(
    () => filterTodos(todos, searchQuery, statusFilter),
    [searchQuery, statusFilter, todos],
  );

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

  const handleTodoPress = useCallback(
    (todo: TodoDto) => {
      router.push(`/todo/${todo.id}`);
    },
    [router],
  );

  const emptyMessage =
    todos.length === 0 ? 'No todos yet.' : 'No todos match your search or filter.';

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
            data={filteredTodos}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadTodos(true)} />
            }
            {...(todos.length > 0
              ? {
                  ListHeaderComponent: (
                    <TodoListFilters
                      searchQuery={searchQuery}
                      onSearchQueryChange={setSearchQuery}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                    />
                  ),
                }
              : null)}
            contentContainerStyle={
              filteredTodos.length === 0 ? styles.emptyListContent : styles.listContent
            }
            ListEmptyComponent={
              <Text variant="bodyLarge" style={styles.message}>
                {emptyMessage}
              </Text>
            }
            renderItem={({ item }) => (
              <TodoListItem
                todo={item}
                onToggleCompleted={handleToggleCompleted}
                onDeleteRequest={setTodoToDelete}
                onPress={handleTodoPress}
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
