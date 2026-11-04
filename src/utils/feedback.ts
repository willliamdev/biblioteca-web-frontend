import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ApiError, getErrorMessage } from '../services/api';

export function notifySuccess(title: string, message: string) {
  notifications.show({ title, message, color: 'green' });
}

export function notifyError(error: unknown, title = 'Não foi possível concluir a operação') {
  notifications.show({ title, message: getErrorMessage(error), color: 'red' });
}

// Leva os erros de validação devolvidos pela API (fields) para os campos existentes no formulário
export function applyApiFieldErrors<Values>(
  form: UseFormReturnType<Values>,
  error: unknown,
  aliases: Record<string, string> = {}
) {
  if (!(error instanceof ApiError) || !error.fields) {
    return;
  }

  const values = form.getValues();

  Object.entries(error.fields).forEach(([field, message]) => {
    const formField = aliases[field] ?? field;

    if (Object.prototype.hasOwnProperty.call(values, formField)) {
      form.setFieldError(formField, message);
    }
  });
}

// Tratamento padrão de erro ao enviar um formulário: campos inválidos + notificação vermelha
export function handleFormError<Values>(
  form: UseFormReturnType<Values>,
  error: unknown,
  title: string,
  aliases?: Record<string, string>
) {
  applyApiFieldErrors(form, error, aliases);
  notifyError(error, title);
}
