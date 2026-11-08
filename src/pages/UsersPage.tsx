import { Badge, Button, Group, Stack, Table, Text, Title } from '@mantine/core';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import styles from './TableRow.module.css';
import type { User } from '../types/user';
import { formatCpf } from '../utils/format';

interface UsersPageProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UsersPage({ users, onAddUser, onEditUser, onDeleteUser }: UsersPageProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={1}>Usuários</Title>
        <Button
          onClick={onAddUser}
          color="blue"
          leftSection={<Plus size={16} aria-hidden="true" />}
        >
          Cadastrar Usuário
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={600}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>CPF</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" ta="center" size="sm">
                    Nenhum usuário cadastrado.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}
            {users.map((user) => (
              <Table.Tr key={user.id} className={styles.row}>
                <Table.Td>{user.name}</Table.Td>
                <Table.Td>{formatCpf(user.cpf)}</Table.Td>
                <Table.Td>
                  <Badge color={user.debtFree ? 'green' : 'red'} variant="light">
                    {user.debtFree ? 'Sem pendências' : 'Com pendências'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" className={styles.rowActions} wrap="nowrap">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      onClick={() => onEditUser(user)}
                      aria-label={`Editar ${user.name}`}
                      leftSection={<PencilSimple size={14} aria-hidden="true" />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      onClick={() => onDeleteUser(user)}
                      aria-label={`Excluir ${user.name}`}
                      leftSection={<Trash size={14} aria-hidden="true" />}
                    >
                      Excluir
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}
