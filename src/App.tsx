import {
  AppShell,
  Burger,
  Button,
  Group,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { BookFormModal } from './components/BookFormModal';
import type { Book } from './types/book';
import type { BookFormData } from './components/useBookForm';
import { UserFormModal } from './components/UserFormModal';
import { BooksPage } from './pages/BooksPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoansPage } from './pages/LoansPage';
import { UsersPage } from './pages/UsersPage';
import { mockLivros } from './services/mockData';

type View = 'dashboard' | 'books' | 'users' | 'loans';

export default function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [navbarOpened, { close: closeNavbar, toggle }] = useDisclosure(false);
  const [bookModalOpened, { open: openBookModal, close: closeBookModal }] = useDisclosure(false);
  const [userModalOpened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [books, setBooks] = useState<Book[]>(mockLivros);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleCreateBook = (values: BookFormData) => {
    setBooks((currentBooks) => {
      const authorName = values.author.trim();
      const genreName = values.category.trim();
      const author = currentBooks.find(
        (book) => book.author.name.toLowerCase() === authorName.toLowerCase()
      )?.author ?? {
        id: Math.max(0, ...currentBooks.map((book) => book.author.id)) + 1,
        name: authorName,
      };
      const genre = currentBooks.find(
        (book) => book.genre.name.toLowerCase() === genreName.toLowerCase()
      )?.genre ?? {
        id: Math.max(0, ...currentBooks.map((book) => book.genre.id)) + 1,
        name: genreName,
      };

      return [
        ...currentBooks,
        {
          id: Math.max(0, ...currentBooks.map((book) => book.id)) + 1,
          title: values.title.trim(),
          author,
          genre,
          publicationDate: values.publicationDate,
          publisher: values.publisher.trim(),
        },
      ];
    });
  };

  const handleUpdateBook = (bookId: number, values: BookFormData) => {
    setBooks((currentBooks) => {
      const authorName = values.author.trim();
      const genreName = values.category.trim();
      const author = currentBooks.find(
        (book) => book.author.name.toLowerCase() === authorName.toLowerCase()
      )?.author ?? {
        id: Math.max(0, ...currentBooks.map((book) => book.author.id)) + 1,
        name: authorName,
      };
      const genre = currentBooks.find(
        (book) => book.genre.name.toLowerCase() === genreName.toLowerCase()
      )?.genre ?? {
        id: Math.max(0, ...currentBooks.map((book) => book.genre.id)) + 1,
        name: genreName,
      };

      return currentBooks.map((book) =>
        book.id === bookId
          ? {
              ...book,
              title: values.title.trim(),
              author,
              genre,
              publicationDate: values.publicationDate,
              publisher: values.publisher.trim(),
            }
          : book
      );
    });
  };

  const handleDeleteBook = (book: Book) => {
    if (!window.confirm(`Tem certeza de que deseja excluir "${book.title}"?`)) {
      return;
    }

    setBooks((currentBooks) => currentBooks.filter((currentBook) => currentBook.id !== book.id));
    notifications.show({
      title: 'Livro excluído',
      message: `O livro "${book.title}" foi excluído.`,
      color: 'green',
    });
  };

  const handleAddBook = () => {
    setEditingBook(null);
    openBookModal();
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    openBookModal();
  };

  const handleCloseBookModal = () => {
    closeBookModal();
    setEditingBook(null);
  };

  const navLinks = [
    {
      label: 'Dashboard',
      onClick: () => {
        closeNavbar();
        setActiveView('dashboard');
      },
    },
    {
      label: 'Livros',
      onClick: () => {
        closeNavbar();
        setActiveView('books');
      },
    },
    {
      label: 'Usuários',
      onClick: () => {
        closeNavbar();
        setActiveView('users');
      },
    },
    {
      label: 'Empréstimos',
      onClick: () => {
        closeNavbar();
        setActiveView('loans');
      },
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'books':
        return (
          <BooksPage
            books={books}
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
          />
        );
      case 'users':
        return <UsersPage onAddUser={openUserModal} />;
      case 'loans':
        return <LoansPage />;
      default:
        return <DashboardPage onAddBook={openBookModal} />;
    }
  };

  return (
    <AppShell
      withBorder={false}
      transitionDuration={500}
      transitionTimingFunction="ease"
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !navbarOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="flex-start">
          <Burger opened={navbarOpened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title size="h2">Gestão da Biblioteca</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar hidden={!navbarOpened}>
        <AppShell.Section p="md">
          <Stack gap="sm">
            {navLinks.map((link) => (
              <Button
                key={link.label}

                variant={
                  activeView === 'dashboard' && link.label === 'Dashboard' ? 'filled' : 'subtle'
                }
                onClick={link.onClick}
                justify="left"
                fullWidth
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main flex={1}>
        <div style={{ width: '100%', height: '100%', maxWidth: 1100, margin: '20px auto 0px' }}>
          {renderContent()}
        </div>
      </AppShell.Main>

      <AppShell.Footer p="sm">
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            © 2026 Biblioteca
          </Text>

          <Button
            variant={colorScheme === 'dark' ? 'light' : 'default'}
            onClick={() => toggleColorScheme()}
            size="compact-sm"
          >
            {colorScheme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          </Button>
        </Group>
      </AppShell.Footer>

      <BookFormModal
        opened={bookModalOpened}
        onClose={handleCloseBookModal}
        onCreateBook={handleCreateBook}
        onUpdateBook={handleUpdateBook}
        bookToEdit={editingBook}
      />
      <UserFormModal opened={userModalOpened} onClose={closeUserModal} />
    </AppShell>
  );
}
