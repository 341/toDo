import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import { todoService } from '@/services/todoService';
import type { TodoDto } from '@/types/todo';

type DeleteTodoDialogProps = {
  todo: TodoDto | null;
  onDismiss: () => void;
  onDeleted: (id: string) => void;
};

export function DeleteTodoDialog({ todo, onDismiss, onDeleted }: DeleteTodoDialogProps) {
  const theme = useTheme();
  const [deleting, setDeleting] = useState(false);

  const handleDismiss = useCallback(() => {
    if (!deleting) {
      onDismiss();
    }
  }, [deleting, onDismiss]);

  const handleConfirmDelete = useCallback(async () => {
    if (!todo) {
      return;
    }

    setDeleting(true);

    try {
      await todoService.delete(todo.id);
      onDeleted(todo.id);
      onDismiss();
    } finally {
      setDeleting(false);
    }
  }, [onDeleted, onDismiss, todo]);

  return (
    <Portal>
      <Dialog visible={todo !== null} onDismiss={handleDismiss}>
        <Dialog.Title>Delete todo?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to delete &quot;{todo?.title}&quot;?
          </Text>
          {todo?.description?.trim() ? (
            <Text variant="bodySmall" style={styles.description}>
              {todo.description.trim()}
            </Text>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss} disabled={deleting}>
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
  );
}

const styles = StyleSheet.create({
  description: {
    marginTop: 8,
    opacity: 0.8,
  },
});
