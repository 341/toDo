import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, FAB, HelperText, Portal, TextInput } from 'react-native-paper';

import { todoService } from '@/services/todoService';
import type { TodoDto } from '@/types/todo';

type CreateTodoFabProps = {
  onCreated: (todo: TodoDto) => void;
};

export function CreateTodoFab({ onCreated }: CreateTodoFabProps) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const resetForm = useCallback(() => {
    setVisible(false);
    setTitle('');
    setDescription('');
    setTitleError(null);
  }, []);

  const handleOpen = useCallback(() => {
    setTitleError(null);
    setVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    if (!saving) {
      resetForm();
    }
  }, [resetForm, saving]);

  const handleSave = useCallback(async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError('Title is required');
      return;
    }

    setSaving(true);

    try {
      const created = await todoService.create({
        title: trimmedTitle,
        description: description.trim(),
      });
      onCreated(created);
      resetForm();
    } finally {
      setSaving(false);
    }
  }, [description, onCreated, resetForm, title]);

  return (
    <>
      <FAB icon="plus" style={styles.fab} onPress={handleOpen} />
      <Portal>
        <Dialog visible={visible} onDismiss={handleDismiss}>
          <Dialog.Title>New todo</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <TextInput
              testID="create-todo-title"
              label="Title"
              accessibilityLabel="Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
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
            <TextInput
              testID="create-todo-description"
              label="Description"
              accessibilityLabel="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDismiss} disabled={saving}>
              Cancel
            </Button>
            <Button onPress={handleSave} loading={saving} disabled={saving}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
  },
  dialogContent: {
    gap: 8,
  },
});
