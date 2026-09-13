import { Button, Checkbox, Group, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { GenericModal } from './GenericModal';
import { useUserForm, type UserFormData } from './useUserForm';

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
}

interface UserFormContentProps {
  form: UseFormReturnType<UserFormData>;
  onSubmit: (values: UserFormData) => void;
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
          placeholder="Ex: 12345678901"
          withAsterisk
          {...form.getInputProps('cpf')}
        />

        <Checkbox
          label="Sem pendências"
          {...form.getInputProps('debtFree', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="md">
          {onCancel ? (
            <Button variant="default" onClick={onCancel} type="button">
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" color="blue">
            Salvar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function UserFormModal({ opened, onClose }: UserFormModalProps) {
  const { form, resetForm, submitForm } = useUserForm();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (values: UserFormData) => {
    submitForm(values, handleClose);
  };

  return (
    <GenericModal opened={opened} onClose={handleClose} title="Cadastrar Novo Usuário">
      <UserFormContent form={form} onSubmit={handleSubmit} onCancel={handleClose} />
    </GenericModal>
  );
}
