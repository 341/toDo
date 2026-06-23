import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  FAB,
  HelperText,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

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
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const resetCreateDialog = useCallback(() => {
    setCreateDialogVisible(false);
    setNewTitle('');
    setTitleError(null);
  }, []);

  const handleDismissCreate = useCallback(() => {
    if (!saving) {
      resetCreateDialog();
    }
  }, [resetCreateDialog, saving]);

  const handleOpenCreate = useCallback(() => {
    setTitleError(null);
    setCreateDialogVisible(true);
  }, []);

  const handleSaveTodo = useCallback(async () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setTitleError('Title is required');
      return;
    }

    setSaving(true);

    try {
      const created = await todoService.create({ title: trimmedTitle });
      setTodos((current) => [created, ...current]);
      resetCreateDialog();
    } finally {
      setSaving(false);
    }
  }, [newTitle, resetCreateDialog]);

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
        {!loading && !error ? (
          <FAB icon="plus" style={styles.fab} onPress={handleOpenCreate} />
        ) : null}
      </View>
      <Portal>
        <Dialog visible={createDialogVisible} onDismiss={handleDismissCreate}>
          <Dialog.Title>New todo</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newTitle}
              onChangeText={(text) => {
                setNewTitle(text);
                if (titleError) {
                  setTitleError(null);
                }
              }}
              mode="outlined"
              error={!!titleError}
              autoFocus
            />
            <HelperText type="error" visible={!!titleError}>
              {titleError}
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDismissCreate} disabled={saving}>
              Cancel
            </Button>
            <Button onPress={handleSaveTodo} loading={saving} disabled={saving}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
