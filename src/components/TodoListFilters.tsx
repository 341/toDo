import { StyleSheet, View } from 'react-native';
import { Searchbar, SegmentedButtons } from 'react-native-paper';

import type { StatusFilter } from '@/types/todo';

type TodoListFiltersProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
};

export function TodoListFilters({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: TodoListFiltersProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={onSearchQueryChange}
        accessibilityLabel="Search todos by title"
      />
      <SegmentedButtons
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Done' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 12,
  },
});
