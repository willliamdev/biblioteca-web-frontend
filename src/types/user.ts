export interface User {
  id: number;
  name: string;
  cpf: string;
  // em caso de não ter devolvido o livro até a data final.
  debtFree: boolean;
}
