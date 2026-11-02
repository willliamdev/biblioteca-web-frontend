import { useForm } from '@mantine/form';
import { isOutdatedDataError } from '../services/api';
import { loanService } from '../services/loanService';
import type { CreateLoanDTO } from '../types/loan';
import { handleFormError, notifySuccess } from '../utils/feedback';
import { addDaysIso, todayIso } from '../utils/format';

// Prazo padrão de devolução, em dias
const DEFAULT_LOAN_DAYS = 14;

export interface LoanFormData {
  userId: string | null;
  bookId: string | null;
  startDate: string;
  endDate: string;
}

export function getDefaultLoanValues(): LoanFormData {
  const today = todayIso();

  return {
    userId: null,
    bookId: null,
    startDate: today,
    endDate: addDaysIso(today, DEFAULT_LOAN_DAYS),
  };
}

export function useLoanForm() {
  const form = useForm<LoanFormData>({
    initialValues: getDefaultLoanValues(),

    validate: {
      userId: (value) => (!value ? 'Selecione o usuário' : null),
      bookId: (value) => (!value ? 'Selecione o livro' : null),
      startDate: (value) => {
        if (!value) {
          return 'Informe a data de início';
        }

        // Início futuro deixaria o livro bloqueado: a devolução não pode ser anterior ao início
        return value > todayIso() ? 'A data de início não pode ser futura' : null;
      },
      endDate: (value, values) => {
        if (!value) {
          return 'Informe a data prevista de devolução';
        }

        return values.startDate && value < values.startDate
          ? 'A devolução prevista deve ser igual ou posterior à data de início'
          : null;
      },
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const submitForm = async (
    values: LoanFormData,
    onSuccess?: () => void,
    onOutdatedData?: () => void
  ) => {
    const payload: CreateLoanDTO = {
      userId: Number(values.userId),
      bookId: Number(values.bookId),
      startDate: values.startDate,
      endDate: values.endDate,
    };

    try {
      const savedLoan = await loanService.create(payload);

      notifySuccess(
        'Sucesso!',
        `O empréstimo do livro "${savedLoan.book.title}" para ${savedLoan.user.name} foi registrado.`
      );

      resetForm();
      onSuccess?.();
    } catch (error) {
      handleFormError(form, error, 'Não foi possível registrar o empréstimo');

      // Ex.: o usuário passou a ter atraso ou o livro foi emprestado depois que a tela carregou.
      // Recarrega os dados para as listas do formulário refletirem a situação atual.
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
