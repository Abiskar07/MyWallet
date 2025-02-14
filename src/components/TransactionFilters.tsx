import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, Button } from 'react-native-paper';
import { TransactionType } from '../services/transaction';
import type { SortOption } from '../types/transaction';

interface TransactionFiltersProps {
  typeFilter: TransactionType | 'ALL';
  onTypeFilterChange: (type: TransactionType | 'ALL') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={typeFilter}
        onValueChange={value => onTypeFilterChange(value as TransactionType | 'ALL')}
        buttons={[
          { value: 'ALL', label: 'All' },
          { value: 'INCOME', label: 'Income' },
          { value: 'EXPENSE', label: 'Expense' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.sortButtons}>
        <Button
          mode={sortBy === 'date-desc' ? 'contained' : 'outlined'}
          onPress={() => onSortChange('date-desc')}
          style={styles.sortButton}
        >
          Latest
        </Button>
        <Button
          mode={sortBy === 'date-asc' ? 'contained' : 'outlined'}
          onPress={() => onSortChange('date-asc')}
          style={styles.sortButton}
        >
          Oldest
        </Button>
        <Button
          mode={sortBy === 'amount-desc' ? 'contained' : 'outlined'}
          onPress={() => onSortChange('amount-desc')}
          style={styles.sortButton}
        >
          Highest
        </Button>
        <Button
          mode={sortBy === 'amount-asc' ? 'contained' : 'outlined'}
          onPress={() => onSortChange('amount-asc')}
          style={styles.sortButton}
        >
          Lowest
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    minWidth: '45%',
  },
}); 