import { useForm } from '@mantine/form';
import { isOutdatedDataError } from '../services/api';
import { userService } from '../services/userService';
import type { CreateUserDTO, User } from '../types/user';
import { handleFormError, notifySuccess } from '../utils/feedback';
import { onlyDigits } from '../utils/format';

export interface UserFormData {
  name: string;
  cpf: string;
}

export function useUserForm() {
  const form = useForm<UserFormData>({
    initialValues: {
      name: '',
      cpf: '',
    },

    validate: {
      name: (value) => (value.trim().length < 2 ? 'Informe o nome completo do usuário' : null),
      cpf: (value) => (onlyDigits(value).length !== 11 ? 'O CPF deve conter 11 dígitos' : null),
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (
    values: UserFormData,
    userToEdit: User | null,
    onSuccess?: () => void,
    onOutdatedData?: () => void
  ) => {
    const payload: CreateUserDTO = {
      name: values.name.trim(),
      cpf: onlyDigits(values.cpf),
    };

    try {
      const savedUser = userToEdit
        ? await userService.update(userToEdit.id, payload)
        : await userService.create(payload);

      notifySuccess(
        'Sucesso!',
        userToEdit
          ? `O usuário "${savedUser.name}" foi atualizado com sucesso.`
          : `O usuário "${savedUser.name}" foi cadastrado com sucesso.`
      );

      resetForm();
      onSuccess?.();
    } catch (error) {
      handleFormError(
        form,
        error,
        userToEdit ? 'Não foi possível atualizar o usuário' : 'Não foi possível cadastrar o usuário'
      );

      // Ex.: o usuário foi excluído em outra aba ou o CPF já foi cadastrado; recarrega as listas
      if (isOutdatedDataError(error)) {
        onOutdatedData?.();
      }
    }
  };

  return {
    form,
    resetForm,
    submitForm,
  };
}
