export type Category = 'medical' | 'entertainment' | 'food' | 'utility' | 'shopping' | 'loans' | 'gifts' | 'misc' | 'income' |'total';

export type Transaction = {
  category: Category;
  transactionName: string;
  amount: number;
  date: Date;
}

export type Budget = {
  category: Category;
  spent: number;
  budget: number;
}