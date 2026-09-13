import { AppShell, Burger, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { BookFormModal } from './components/BookFormModal';
import { UserFormModal } from './components/UserFormModal';
import { LoansPage } from './pages/LoansPage';
import { BooksPage } from './pages/BooksPage';
import { UsersPage } from './pages/UsersPage';
import { StatsContainer } from './components/StatusContainer';
import { mockDashboardStatsData } from './services/mockData';

type View = 'dashboard' | 'books' | 'users' | 'loans';

export default function App() {
  const [navbarOpened, { close: closeNavbar, toggle }] = useDisclosure(false);
  const [bookModalOpened, { open: openBookModal, close: closeBookModal }] = useDisclosure(false);
  const [userModalOpened, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);
  const [activeView, setActiveView] = useState<View>('dashboard');

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
        return <BooksPage onAddBook={openBookModal} />;
      case 'users':
        return <UsersPage onAddUser={openUserModal} />;
      case 'loans':
        return <LoansPage />;
      default:
        return (
          <Stack gap="lg">
            <Title order={1}>Dashboard</Title>
            <Button onClick={openBookModal} color="blue" style={{ alignSelf: 'flex-start' }}>
              Cadastrar Novo Livro
            </Button>
            <StatsContainer data={mockDashboardStatsData} />
          </Stack>
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
        <Group h="100%" px="md">
          <Burger opened={navbarOpened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Stack gap={2}>
            <Title order={2}>Sistema de Gestão Biblioteca</Title>
            <Text c="dimmed" size="sm">
              Bem vindo ao sistema de gerenciamento da biblioteca!
            </Text>
          </Stack>
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

      <AppShell.Main>
        <div style={{ width: '100%', maxWidth: 1100, margin: '20px auto 0px' }}>{renderContent()}</div>
      </AppShell.Main>

      <BookFormModal opened={bookModalOpened} onClose={closeBookModal} />
      <UserFormModal opened={userModalOpened} onClose={closeUserModal} />
    </AppShell>
  );
}
