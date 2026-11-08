import {
  Alert,
  AppShell,
  Burger,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import {
  ArrowClockwise,
  ArrowsLeftRight,
  Books,
  House,
  Moon,
  Sun,
  Trash,
  UserFocus,
  UsersThree,
  X,
} from '@phosphor-icons/react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { AuthorFormModal } from './components/AuthorFormModal';
import { BookFormModal } from './components/BookFormModal';
import { LoanFormModal } from './components/LoanFormModal';
import { ReturnLoanModal } from './components/ReturnLoanModal';
import { UserFormModal } from './components/UserFormModal';
import { useLibraryData, type LibraryResource } from './hooks/useLibraryData';
import { AuthorsPage } from './pages/AuthorsPage';
import { BooksPage } from './pages/BooksPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoansPage } from './pages/LoansPage';
import { UsersPage } from './pages/UsersPage';
import { isOutdatedDataError } from './services/api';
import { authorService } from './services/authorService';
import { bookService } from './services/bookService';
import { userService } from './services/userService';
import type { Author, Book } from './types/book';
import type { Loan } from './types/loan';
import type { User } from './types/user';
import { notifyError, notifySuccess } from './utils/feedback';

type View = 'dashboard' | 'books' | 'authors' | 'users' | 'loans';

const NAV_LINKS: { label: string; view: View; icon: typeof House }[] = [
  { label: 'Dashboard', view: 'dashboard', icon: House },
  { label: 'Livros', view: 'books', icon: Books },
  { label: 'Autores', view: 'authors', icon: UserFocus },
  { label: 'Usuários', view: 'users', icon: UsersThree },
  { label: 'Empréstimos', view: 'loans', icon: ArrowsLeftRight },
];

// Dados a recarregar após cada tipo de mutação
const BOOK_RESOURCES: LibraryResource[] = ['books', 'authors', 'genres', 'loans'];
const AUTHOR_RESOURCES: LibraryResource[] = ['authors', 'books', 'loans'];
const USER_RESOURCES: LibraryResource[] = ['users', 'loans'];
const LOAN_RESOURCES: LibraryResource[] = ['loans', 'books', 'users'];

interface DeleteOptions {
  confirmMessage: string;
  remove: () => Promise<void>;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  resources: LibraryResource[];
}

export default function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [navbarOpened, { close: closeNavbar, toggle }] = useDisclosure(false);
  const [bookModalOpened, { open: openBookModal, close: closeBookModal }] = useDisclosure(false);
  const [authorModalOpened, { open: openAuthorModal, close: closeAuthorModal }] =
    useDisclosure(false);
  const [userModalOpened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);
  const [loanModalOpened, { open: openLoanModal, close: closeLoanModal }] = useDisclosure(false);
  const [returnModalOpened, { open: openReturnModal, close: closeReturnModal }] =
    useDisclosure(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [returningLoan, setReturningLoan] = useState<Loan | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DeleteOptions | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const { authors, genres, books, users, loans, loading, error, retry, refresh } = useLibraryData();

  // Exclusão padrão: confirma, chama a API, notifica e recarrega os dados afetados
  const confirmAndDelete = (options: DeleteOptions) => setPendingDelete(options);

  const handleConfirmDelete = async () => {
    if (!pendingDelete || deleteInProgress) {
      return;
    }

    setDeleteInProgress(true);
    try {
      await pendingDelete.remove();
      notifySuccess(pendingDelete.successTitle, pendingDelete.successMessage);
      await refresh(pendingDelete.resources);
    } catch (deleteError) {
      notifyError(deleteError, pendingDelete.errorTitle);

      // Ex.: o registro já foi excluído ou ganhou vínculos em outra aba; atualiza a lista
      if (isOutdatedDataError(deleteError)) {
        await refresh(pendingDelete.resources);
      }
    } finally {
      setPendingDelete(null);
      setDeleteInProgress(false);
    }
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

  const handleDeleteBook = (book: Book) => {
    // Regra do acervo: todo autor deve ter ao menos um livro. Avisa quando este é o último dele.
    const bookAuthor = authors.find((author) => author.id === book.author.id);
    const lastBookWarning =
      bookAuthor?.bookCount === 1
        ? `\n\nAtenção: o autor "${bookAuthor.name}" ficará sem livros cadastrados.`
        : '';

    return confirmAndDelete({
      confirmMessage: `Tem certeza de que deseja excluir "${book.title}"?${lastBookWarning}`,
      remove: () => bookService.remove(book.id),
      successTitle: 'Livro excluído',
      successMessage: `O livro "${book.title}" foi excluído.`,
      errorTitle: 'Não foi possível excluir o livro',
      resources: BOOK_RESOURCES,
    });
  };

  const handleAddAuthor = () => {
    setEditingAuthor(null);
    openAuthorModal();
  };

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    openAuthorModal();
  };

  const handleCloseAuthorModal = () => {
    closeAuthorModal();
    setEditingAuthor(null);
  };

  const handleDeleteAuthor = (author: Author) =>
    confirmAndDelete({
      confirmMessage: `Tem certeza de que deseja excluir o autor "${author.name}"?`,
      remove: () => authorService.remove(author.id),
      successTitle: 'Autor excluído',
      successMessage: `O autor "${author.name}" foi excluído.`,
      errorTitle: 'Não foi possível excluir o autor',
      resources: AUTHOR_RESOURCES,
    });

  const handleAddUser = () => {
    setEditingUser(null);
    openUserModal();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    openUserModal();
  };

  const handleCloseUserModal = () => {
    closeUserModal();
    setEditingUser(null);
  };

  const handleDeleteUser = (user: User) =>
    confirmAndDelete({
      confirmMessage: `Tem certeza de que deseja excluir o usuário "${user.name}"?`,
      remove: () => userService.remove(user.id),
      successTitle: 'Usuário excluído',
      successMessage: `O usuário "${user.name}" foi excluído.`,
      errorTitle: 'Não foi possível excluir o usuário',
      resources: USER_RESOURCES,
    });

  // A devolução abre um modal para informar a data efetiva (padrão: hoje). Por ser modal,
  // só uma devolução fica em andamento por vez.
  const handleReturnLoan = (loan: Loan) => {
    setReturningLoan(loan);
    openReturnModal();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Loader />
            <Text c="dimmed" size="sm">
              Carregando dados da biblioteca...
            </Text>
          </Stack>
        </Center>
      );
    }

    if (error) {
      return (
        <Alert color="red" title="Não foi possível carregar os dados">
          <Stack gap="sm" align="flex-start">
            <Text size="sm">{error}</Text>
            <Button color="red" variant="light" onClick={retry}>
              <ArrowClockwise size={16} aria-hidden="true" />
              Tentar novamente
            </Button>
          </Stack>
        </Alert>
      );
    }

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
      case 'authors':
        return (
          <AuthorsPage
            authors={authors}
            onAddAuthor={handleAddAuthor}
            onEditAuthor={handleEditAuthor}
            onDeleteAuthor={handleDeleteAuthor}
          />
        );
      case 'users':
        return (
          <UsersPage
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'loans':
        return (
          <LoansPage loans={loans} onAddLoan={openLoanModal} onReturnLoan={handleReturnLoan} />
        );
      default:
        return (
          <DashboardPage
            books={books}
            authors={authors}
            loans={loans}
            onAddBook={handleAddBook}
            onAddAuthor={handleAddAuthor}
            onAddLoan={openLoanModal}
          />
        );
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
            {NAV_LINKS.map((link) => (
              <Button
                key={link.view}
                variant={activeView === link.view ? 'filled' : 'subtle'}
                onClick={() => {
                  closeNavbar();
                  setActiveView(link.view);
                }}
                justify="left"
                fullWidth
                leftSection={<link.icon size={18} aria-hidden="true" />}
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
            leftSection={
              colorScheme === 'dark' ? (
                <Sun size={16} aria-hidden="true" />
              ) : (
                <Moon size={16} aria-hidden="true" />
              )
            }
          >
            {colorScheme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          </Button>
        </Group>
      </AppShell.Footer>

      <BookFormModal
        opened={bookModalOpened}
        onClose={handleCloseBookModal}
        onSaved={() => void refresh(BOOK_RESOURCES)}
        onOutdatedData={() => void refresh(BOOK_RESOURCES)}
        bookToEdit={editingBook}
        authors={authors}
        genres={genres}
      />
      <AuthorFormModal
        opened={authorModalOpened}
        onClose={handleCloseAuthorModal}
        onSaved={() => void refresh(AUTHOR_RESOURCES)}
        onOutdatedData={() => void refresh(AUTHOR_RESOURCES)}
        authorToEdit={editingAuthor}
      />
      <UserFormModal
        opened={userModalOpened}
        onClose={handleCloseUserModal}
        onSaved={() => void refresh(USER_RESOURCES)}
        onOutdatedData={() => void refresh(USER_RESOURCES)}
        userToEdit={editingUser}
      />
      <LoanFormModal
        opened={loanModalOpened}
        onClose={closeLoanModal}
        onSaved={() => void refresh(LOAN_RESOURCES)}
        onOutdatedData={() => void refresh(LOAN_RESOURCES)}
        users={users}
        books={books}
      />
      <ReturnLoanModal
        opened={returnModalOpened}
        onClose={closeReturnModal}
        onSaved={() => void refresh(LOAN_RESOURCES)}
        onOutdatedData={() => void refresh(LOAN_RESOURCES)}
        loan={returningLoan}
      />
      <Modal
        opened={pendingDelete !== null}
        onClose={() => {
          if (!deleteInProgress) {
            setPendingDelete(null);
          }
        }}
        title="Confirmar exclusão"
        centered
        closeOnEscape={!deleteInProgress}
        closeOnClickOutside={!deleteInProgress}
      >
        <Text style={{ whiteSpace: 'pre-line' }}>{pendingDelete?.confirmMessage}</Text>
        <Group justify="flex-end" mt="lg">
          <Button
            variant="default"
            onClick={() => setPendingDelete(null)}
            disabled={deleteInProgress}
            leftSection={<X size={16} aria-hidden="true" />}
          >
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={() => void handleConfirmDelete()}
            loading={deleteInProgress}
            leftSection={<Trash size={16} aria-hidden="true" />}
          >
            Excluir
          </Button>
        </Group>
      </Modal>
    </AppShell>
  );
}
