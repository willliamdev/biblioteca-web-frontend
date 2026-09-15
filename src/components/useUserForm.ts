import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export interface UserFormData {
  name: string;
  cpf: string;
  debtFree: boolean;
}

export function useUserForm() {
  const form = useForm<UserFormData>({
    initialValues: {
      name: '',
      cpf: '',
      debtFree: true,
    },

    validate: {
      name: (value) => (value.trim().length < 2 ? 'Informe o nome completo do usuário' : null),
      cpf: (value) => (value.trim().length < 11 ? 'CPF inválido' : null),
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = (values: UserFormData, onSuccess?: () => void) => {
    console.log('Submit user payload:', values);

    notifications.show({
      title: 'Sucesso!',
      message: `O usuário "${values.name}" foi cadastrado com sucesso.`,
      color: 'green',
    });

    resetForm();
    onSuccess?.();
  };

  return {
    form,
    resetForm,
    submitForm,
  };
}
