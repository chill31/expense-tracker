export type Category = 'medical' | 'entertainment' | 'food' | 'utility' | 'shopping' | 'loans' | 'gifts' | 'misc';

export type Transaction = {
  category: Category;
  transactionName: string;
  amount: number;
  date: Date;
  type: 'expense' | 'income';
}

export type Budget = {
  category: Category;
  spent: number;
  budget: number;
}