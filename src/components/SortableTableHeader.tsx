import { ArrowDown, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react';
import { Group, Table, Text, UnstyledButton } from '@mantine/core';
import type { SortDirection } from '../hooks/useSortableData';

interface SortableTableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onSort: () => void;
}

export function SortableTableHeader({
  label,
  active,
  direction,
  onSort,
}: SortableTableHeaderProps) {
  const SortIcon = !active ? ArrowsDownUp : direction === 'asc' ? ArrowUp : ArrowDown;

  return (
    <Table.Th aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <UnstyledButton type="button" onClick={onSort} aria-label={`Ordenar por ${label}`}>
        <Group gap={4} wrap="nowrap">
          <Text size="sm" fw={700}>
            {label}
          </Text>
          <SortIcon size={14} aria-hidden="true" />
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
