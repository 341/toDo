import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Text, useTheme } from 'react-native-paper';

import { DeleteTodoDialog } from '@/components/DeleteTodoDialog';
import { todoService } from '@/services/todoService';
import type { TodoDto } from '@/types/todo';
import { formatCreatedAt } from '@/utils/formatCreatedAt';

export default function TodoDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [todo, setTodo] = useState<TodoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadTodo = useCallback(async () => {
    if (!id) {
      setError('Todo not found');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      setError(null);
      const data = await todoService.getById(id);
      setTodo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todo');
      setTodo(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  const handleToggleCompleted = useCallback(async () => {
    if (!todo) {
      return;
    }

    setUpdating(true);

    try {
      const updated = await todoService.update(todo.id, {
        completed: !todo.completed,
      });
      setTodo(updated);
    } finally {
      setUpdating(false);
    }
  }, [todo]);

  const handleDeleted = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: todo?.title ?? 'Task details' }} />
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
            <Button mode="contained" onPress={loadTodo}>
              Retry
            </Button>
          </View>
        ) : todo ? (
          <ScrollView contentContainerStyle={styles.content}>
            <Chip
              icon={todo.completed ? 'check-circle-outline' : 'clock-outline'}
              style={styles.statusChip}
            >
              {todo.completed ? 'Completed' : 'Active'}
            </Chip>

            <Text variant="headlineSmall" style={styles.title}>
              {todo.title}
            </Text>

            <Text variant="labelLarge" style={styles.label}>
              Created
            </Text>
            <Text variant="bodyLarge">{formatCreatedAt(todo.createdAt)}</Text>

            <Text variant="labelLarge" style={styles.label}>
              Description
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {todo.description?.trim() ? todo.description.trim() : 'No description provided.'}
            </Text>

            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleToggleCompleted}
                loading={updating}
                disabled={updating}
              >
                {todo.completed ? 'Mark as active' : 'Mark as completed'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowDeleteDialog(true)}
                disabled={updating}
                textColor={theme.colors.error}
              >
                Delete task
              </Button>
            </View>
          </ScrollView>
        ) : null}
      </View>
      <DeleteTodoDialog
        todo={showDeleteDialog ? todo : null}
        onDismiss={() => setShowDeleteDialog(false)}
        onDeleted={handleDeleted}
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
  content: {
    padding: 24,
    gap: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    opacity: 0.8,
  },
  description: {
    lineHeight: 24,
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
