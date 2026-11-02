import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import type { Book } from '../types/book';
import type { User } from '../types/user';
import { todayIso } from '../utils/format';
import { GenericModal } from './GenericModal';
import { getDefaultLoanValues, useLoanForm, type LoanFormData } from './useLoanForm';

interface LoanFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSaved: () => void;
  // Chamado quando a API indica que usuários/livros exibidos estão desatualizados (404/409)
  onOutdatedData?: () => void;
  users: User[];
  books: Book[];
}

interface LoanFormContentProps {
  form: UseFormReturnType<LoanFormData>;
  users: User[];
  books: Book[];
  onSubmit: (values: LoanFormData) => Promise<void>;
  onCancel?: () => void;
}

export function LoanFormContent({ form, users, books, onSubmit, onCancel }: LoanFormContentProps) {
  // Usuários com pendências aparecem, mas não podem ser selecionados
  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        value: String(user.id),
        label: user.debtFree ? user.name : `${user.name} (com pendências)`,
        disabled: !user.debtFree,
      })),
    [users]
  );
  const bookOptions = useMemo(
    () =>
      books
        .filter((book) => book.available)
        .map((book) => ({ value: String(book.id), label: `${book.title} — ${book.author.name}` })),
    [books]
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <Select
          label="Usuário"
          placeholder="Selecione o usuário"
          data={userOptions}
          searchable
          nothingFoundMessage="Nenhum usuário encontrado"
          withAsterisk
          {...form.getInputProps('userId')}
        />

        <Select
          label="Livro"
          placeholder="Selecione o livro"
          description="Somente livros disponíveis são exibidos"
          data={bookOptions}
          searchable
          nothingFoundMessage="Nenhum livro disponível"
          withAsterisk
          {...form.getInputProps('bookId')}
        />

        <Group grow align="flex-start">
          <TextInput
            label="Data de início"
            type="date"
            max={todayIso()}
            withAsterisk
            {...form.getInputProps('startDate')}
          />

          <TextInput
            label="Devolução prevista"
            type="date"
            withAsterisk
            {...form.getInputProps('endDate')}
          />
        </Group>

        <Group justify="flex-end" mt="md">
          {onCancel ? (
            <Button variant="default" onClick={onCancel} type="button">
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" color="blue" loading={form.submitting}>
            Salvar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function LoanFormModal({
  opened,
  onClose,
  onSaved,
  onOutdatedData,
  users,
  books,
}: LoanFormModalProps) {
  const { form, resetForm, submitForm } = useLoanForm();
  const { reset, setValues } = form;

  useEffect(() => {
    if (!opened) {
      return;
    }

    // Recalcula as datas padrão (hoje e hoje + prazo) sempre que o modal abre
    reset();
    setValues(getDefaultLoanValues());
  }, [opened, reset, setValues]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: LoanFormData) =>
    submitForm(
      values,
      () => {
        onSaved();
        handleClose();
      },
      onOutdatedData
    );

  return (
    <GenericModal opened={opened} onClose={handleClose} title="Novo Empréstimo">
      <LoanFormContent
        form={form}
        users={users}
        books={books}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </GenericModal>
  );
}
