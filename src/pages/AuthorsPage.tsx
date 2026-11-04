import { Badge, Button, Group, Stack, Table, Text, Title, Tooltip } from '@mantine/core';
import styles from './TableRow.module.css';
import type { AuthorWithBookCount } from '../types/book';

// Regra do acervo (multiplicidade Livro 1..* — 1 Autor): o autor fica sinalizado, sem bloquear o cadastro
const NO_BOOKS_HINT =
  'Pela regra do acervo, todo autor deve ter ao menos um livro cadastrado. Cadastre um livro deste autor ou exclua o autor.';

interface AuthorsPageProps {
  authors: AuthorWithBookCount[];
  onAddAuthor: () => void;
  onEditAuthor: (author: AuthorWithBookCount) => void;
  onDeleteAuthor: (author: AuthorWithBookCount) => void;
}

export function AuthorsPage({
  authors,
  onAddAuthor,
  onEditAuthor,
  onDeleteAuthor,
}: AuthorsPageProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={1}>Autores</Title>
        <Button onClick={onAddAuthor} color="blue">
          + Cadastrar Autor
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Qtde. de livros</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {authors.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text c="dimmed" ta="center" size="sm">
                    Nenhum autor cadastrado.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}
            {authors.map((author) => (
              <Table.Tr key={author.id} className={styles.row}>
                <Table.Td>{author.name}</Table.Td>
                <Table.Td>
                  {author.bookCount === 0 ? (
                    <Group gap="xs" wrap="nowrap">
                      <Text size="sm">0</Text>
                      <Tooltip
                        label={NO_BOOKS_HINT}
                        multiline
                        w={280}
                        withArrow
                        events={{ hover: true, focus: false, touch: true }}
                      >
                        <Badge color="yellow" variant="light">
                          Sem livros
                        </Badge>
                      </Tooltip>
                    </Group>
                  ) : (
                    author.bookCount
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" className={styles.rowActions} wrap="nowrap">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      onClick={() => onEditAuthor(author)}
                      aria-label={`Editar ${author.name}`}
                    >
                      Editar
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      onClick={() => onDeleteAuthor(author)}
                      aria-label={`Excluir ${author.name}`}
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
