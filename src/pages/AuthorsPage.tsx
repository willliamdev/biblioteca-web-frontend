import { Badge, Button, Group, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { MagnifyingGlass, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { SortableTableHeader } from '../components/SortableTableHeader';
import { useSortableData } from '../hooks/useSortableData';
import styles from './TableRow.module.css';
import type { AuthorWithBookCount } from '../types/book';

type AuthorSortKey = 'name' | 'bookCount';

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
  const [searchTerm, setSearchTerm] = useState('');
  const getSortValue = useCallback(
    (author: AuthorWithBookCount, key: AuthorSortKey) => author[key],
    []
  );
  const filteredAuthors = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR');

    if (!normalizedSearch) return authors;

    return authors.filter((author) =>
      author.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearch)
    );
  }, [authors, searchTerm]);
  const { sortedData, sortKey, direction, requestSort } = useSortableData(
    filteredAuthors,
    getSortValue
  );
  const header = (key: AuthorSortKey, label: string) => (
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
        <Title order={1}>Autores</Title>
        <Button
          onClick={onAddAuthor}
          color="bibliotecaOrange"
          leftSection={<Plus size={16} aria-hidden="true" />}
        >
          Cadastrar Autor
        </Button>
      </Group>

      <TextInput
        placeholder="Buscar autor pelo nome"
        aria-label="Buscar autor pelo nome"
        leftSection={<MagnifyingGlass size={16} aria-hidden="true" />}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        maw={400}
      />

      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {header('name', 'Nome')}
              {header('bookCount', 'Qtde. de livros')}
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
            ) : filteredAuthors.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text c="dimmed" ta="center" size="sm">
                    Nenhum autor encontrado.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : null}
            {sortedData.map((author) => (
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
                      leftSection={<PencilSimple size={14} aria-hidden="true" />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      onClick={() => onDeleteAuthor(author)}
                      aria-label={`Excluir ${author.name}`}
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
