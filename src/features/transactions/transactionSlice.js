import { createSlice } from '@reduxjs/toolkit'
import transactionsData from '../../data/transactions.json'

const initialState = {
  transactions: transactionsData,
  filter: {
    tur: 'hepsi',       // 'gelir' | 'gider' | 'hepsi'
    kategori: 'hepsi',
    baslangic: '',
    bitis: '',
  },
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const newItem = { id: Date.now().toString(), ...action.payload }
      state.transactions.push(newItem)
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload)
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) state.transactions[index] = action.payload
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    resetFilter: (state) => {
      state.filter = initialState.filter
    },
  },
})

export const { addTransaction, deleteTransaction, updateTransaction, setFilter, resetFilter } = transactionSlice.actions
export default transactionSlice.reducer