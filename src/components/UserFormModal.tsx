import { Button, Group, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo } from 'react';
import type { User } from '../types/user';
import { formatCpf } from '../utils/format';
import { GenericModal } from './GenericModal';
import { useUserForm, type UserFormData } from './useUserForm';

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSaved: () => void;
  // Chamado quando a API indica que os usuários exibidos estão desatualizados (404/409)
  onOutdatedData?: () => void;
  userToEdit: User | null;
}

interface UserFormContentProps {
  form: UseFormReturnType<UserFormData>;
  onSubmit: (values: UserFormData) => Promise<void>;
  onCancel?: () => void;
}

export function UserFormContent({ form, onSubmit, onCancel }: UserFormContentProps) {
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nome do Usuário"
          placeholder="Ex: Maria da Silva"
          withAsterisk
          {...form.getInputProps('name')}
        />

        <TextInput
          label="CPF"
          placeholder="Ex: 123.456.789-01"
          description="Pode ser informado com ou sem pontuação"
          withAsterisk
          {...form.getInputProps('cpf')}
        />

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

export function UserFormModal({
  opened,
  onClose,
  onSaved,
  onOutdatedData,
  userToEdit,
}: UserFormModalProps) {
  const { form, resetForm, submitForm } = useUserForm();
  const userFormValues = useMemo(
    () => (userToEdit ? { name: userToEdit.name, cpf: formatCpf(userToEdit.cpf) } : null),
    [userToEdit]
  );
  const { reset, setValues } = form;

  useEffect(() => {
    if (!opened) {
      return;
    }

    if (userFormValues) {
      setValues(userFormValues);
      return;
    }

    reset();
  }, [userFormValues, opened, reset, setValues]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: UserFormData) =>
    submitForm(
      values,
      userToEdit,
      () => {
        onSaved();
        handleClose();
      },
      onOutdatedData
    );

  return (
    <GenericModal
      opened={opened}
      onClose={handleClose}
      title={userToEdit ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
    >
      <UserFormContent form={form} onSubmit={handleSubmit} onCancel={handleClose} />
    </GenericModal>
  );
}
