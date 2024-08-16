export type Category = 'medical' | 'entertainment' | 'travel' | 'food' | 'utility' | 'shopping' | 'loans' | 'gifts' | 'misc';
export type IncomeCategory = 'salary' | 'business' | 'freelance' | 'gifts' | 'misc';

export type Transaction = {
  category: Category | IncomeCategory;
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