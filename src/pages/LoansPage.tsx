import { Badge, Button, Group, SegmentedControl, Stack, Table, Text, Title } from '@mantine/core';
import { ArrowUUpLeft, Plus } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { SortableTableHeader } from '../components/SortableTableHeader';
import { useSortableData } from '../hooks/useSortableData';
import type { Loan, LoanStatus } from '../types/loan';
import { formatDate } from '../utils/format';

type LoanSortKey = 'book' | 'user' | 'startDate' | 'endDate' | 'returnDate' | 'status';
type LoanFilter = LoanStatus | 'TODOS';

const STATUS_BADGES: Record<LoanStatus, { label: string; color: string }> = {
  ATIVO: { label: 'Ativo', color: 'blue' },
  ATRASADO: { label: 'Atrasado', color: 'red' },
  CONCLUIDO: { label: 'Concluído', color: 'green' },
};

const FILTER_OPTIONS: { label: string; value: LoanFilter }[] = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Ativos', value: 'ATIVO' },
  { label: 'Atrasados', value: 'ATRASADO' },
  { label: 'Concluídos', value: 'CONCLUIDO' },
];

interface LoansPageProps {
  loans: Loan[];
  onAddLoan: () => void;
  onReturnLoan: (loan: Loan) => void;
}

export function LoansPage({ loans, onAddLoan, onReturnLoan }: LoansPageProps) {
  const [filter, setFilter] = useState<LoanFilter>('TODOS');
  const filteredLoans = useMemo(
    () => (filter === 'TODOS' ? loans : loans.filter((loan) => loan.status === filter)),
    [filter, loans]
  );
  const getSortValue = useCallback((loan: Loan, key: LoanSortKey) => {
    switch (key) {
      case 'book':
        return loan.book.title;
      case 'user':
        return loan.user.name;
      case 'startDate':
        return loan.startDate;
      case 'endDate':
        return loan.endDate;
      case 'returnDate':
        return loan.returnDate ?? null;
      case 'status':
        return STATUS_BADGES[loan.status].label;
    }
  }, []);
  const {
    sortedData: sortedLoans,
    sortKey,
    direction,
    requestSort,
  } = useSortableData(filteredLoans, getSortValue);
  const header = (key: LoanSortKey, label: string) => (
    <SortableTableHeader
      label={label}
      active={sortKey === key}
      direction={direction}
      onSort={() => requestSort(key)}
    />
  );

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={1}>Empréstimos</Title>
        <Button
          onClick={onAddLoan}
          color="bibliotecaOrange"
          leftSection={<Plus size={16} aria-hidden="true" />}
        >
          Novo Empréstimo
        </Button>
      </Group>

      <Group>
        <SegmentedControl<LoanFilter> value={filter} onChange={setFilter} data={FILTER_OPTIONS} />
      </Group>

      <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {header('book', 'Livro')}
              {header('user', 'Usuário')}
              {header('startDate', 'Início')}
              {header('endDate', 'Devolução prevista')}
              {header('returnDate', 'Devolvido em')}
              {header('status', 'Status')}
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredLoans.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" size="sm">
                    Nenhum empréstimo encontrado.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}
            {sortedLoans.map((loan) => (
              <Table.Tr key={loan.id}>
                <Table.Td>{loan.book.title}</Table.Td>
                <Table.Td>{loan.user.name}</Table.Td>
                <Table.Td>{formatDate(loan.startDate)}</Table.Td>
                <Table.Td>{formatDate(loan.endDate)}</Table.Td>
                <Table.Td>{formatDate(loan.returnDate)}</Table.Td>
                <Table.Td>
                  <Badge color={STATUS_BADGES[loan.status].color} variant="light">
                    {STATUS_BADGES[loan.status].label}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {loan.returnDate ? (
                    <Text c="dimmed" size="sm">
                      —
                    </Text>
                  ) : (
                    <Button
                      size="compact-xs"
                      variant="light"
                      onClick={() => onReturnLoan(loan)}
                      aria-label={`Registrar devolução de ${loan.book.title}`}
                      leftSection={<ArrowUUpLeft size={14} aria-hidden="true" />}
                    >
                      Registrar devolução
                    </Button>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}
