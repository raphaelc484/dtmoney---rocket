import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { api } from '../../services/api';

interface Transaction{
  id: number,
  title: string,
  type: string,
  category: string,
  amount: number,
  createdAt: Date
}

// modo 1
// type TransactionInput = Omit<Transaction,'id'|'createdAt'>;

// modo 2
type TransactionInput = Pick<Transaction,'title'|'amount'|'type'|'category'>; 

interface TransactiosProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const  TransactiosContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactiosProvider({children}:TransactiosProviderProps) {
  const [transactions,setTransactions] = useState<Transaction[]>([]);

  useEffect(()=>{
    api.get('/transactions')
      .then(response => setTransactions(response.data.transactions))
  },[])

  async function createTransaction(transactionInput:TransactionInput) {
   const response = await api.post('/transactions',{
    ...transactionInput,
    createdAt:new Date()
   });
   const {transaction} = response.data;

   setTransactions([
     ...transactions,
     transaction
   ])
  }

  return (
    <TransactiosContext.Provider value={{transactions,createTransaction}}>
      {children}
    </TransactiosContext.Provider>
  )
}

export function useTrasactions() {
  const context = useContext(TransactiosContext);

  return context
}