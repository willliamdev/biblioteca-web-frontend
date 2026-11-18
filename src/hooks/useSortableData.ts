import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

type SortValue = string | number | null;

export function useSortableData<T, K extends string>(
  data: readonly T[],
  getSortValue: (item: T, key: K) => SortValue
) {
  const [sortKey, setSortKey] = useState<K | null>(null);
  const [direction, setDirection] = useState<SortDirection>('asc');

  const sortedData = useMemo(() => {
    if (sortKey === null) {
      return data;
    }

    return data
      .map((item, index) => ({ item, index, value: getSortValue(item, sortKey) }))
      .sort((left, right) => {
        if (left.value === null) return right.value === null ? left.index - right.index : 1;
        if (right.value === null) return -1;

        const comparison =
          typeof left.value === 'number' && typeof right.value === 'number'
            ? left.value - right.value
            : String(left.value).localeCompare(String(right.value), 'pt-BR', {
                numeric: true,
                sensitivity: 'base',
              });

        return comparison === 0
          ? left.index - right.index
          : direction === 'asc'
            ? comparison
            : -comparison;
      })
      .map(({ item }) => item);
  }, [data, direction, getSortValue, sortKey]);

  function requestSort(key: K) {
    if (sortKey === key) {
      setDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setDirection('asc');
    }
  }

  return { sortedData, sortKey, direction, requestSort };
}
