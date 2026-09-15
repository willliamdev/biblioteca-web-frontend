import { Button, Group, Title } from '@mantine/core';

interface UsersPageProps {
  onAddUser: () => void;
}

export function UsersPage({ onAddUser }: UsersPageProps) {
  return (
    <Group justify="space-between" align="center">
      <Title order={1}>Usuários</Title>
      <Button onClick={onAddUser} color="blue">
        + Cadastrar Usuário
      </Button>
    </Group>
  );
}
