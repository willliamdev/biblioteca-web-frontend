import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { FloppyDisk, X } from '@phosphor-icons/react';
import { useEffect } from 'react';
import type { Loan } from '../types/loan';
import { formatDate, todayIso } from '../utils/format';
import { GenericModal } from './GenericModal';
import {
  getDefaultReturnLoanValues,
  useReturnLoanForm,
  type ReturnLoanFormData,
} from './useReturnLoanForm';

interface ReturnLoanModalProps {
  opened: boolean;
  onClose: () => void;
  onSaved: () => void;
  // Chamado quando a API indica que o empréstimo exibido está desatualizado (404/409)
  onOutdatedData?: () => void;
  loan: Loan | null;
}

export function ReturnLoanModal({
  opened,
  onClose,
  onSaved,
  onOutdatedData,
  loan,
}: ReturnLoanModalProps) {
  const { form, resetForm, submitForm } = useReturnLoanForm(loan);
  const { reset, setValues } = form;

  useEffect(() => {
    if (!opened) {
      return;
    }

    // Sugere a data de hoje sempre que o modal abre
    reset();
    setValues(getDefaultReturnLoanValues());
  }, [opened, reset, setValues]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: ReturnLoanFormData) =>
    submitForm(
      values,
      () => {
        onSaved();
        handleClose();
      },
      () => {
        // O empréstimo já foi devolvido ou removido: fecha o modal e recarrega a lista
        onOutdatedData?.();
        handleClose();
      }
    );

  return (
    <GenericModal opened={opened} onClose={handleClose} title="Registrar Devolução">
      {loan ? (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Text size="sm">
              Livro "{loan.book.title}" emprestado para {loan.user.name} em{' '}
              {formatDate(loan.startDate)}, com devolução prevista para {formatDate(loan.endDate)}.
            </Text>

            <TextInput
              label="Data da devolução"
              description="Informe a data em que o livro foi efetivamente devolvido"
              type="date"
              min={loan.startDate}
              max={todayIso()}
              withAsterisk
              {...form.getInputProps('returnDate')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                onClick={handleClose}
                type="button"
                leftSection={<X size={16} aria-hidden="true" />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="blue"
                loading={form.submitting}
                leftSection={<FloppyDisk size={16} aria-hidden="true" />}
              >
                Registrar devolução
              </Button>
            </Group>
          </Stack>
        </form>
      ) : null}
    </GenericModal>
  );
}
