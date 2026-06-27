import { createSlice, createSelector } from '@reduxjs/toolkit'
import transactionsData from '../../data/transactions.json'

const getMonthPrefix = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const initialState = {
  transactions: transactionsData,
  filter: {
    tur: 'hepsi',
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
      state.transactions.push({ id: Date.now().toString(), ...action.payload })
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload)
    },
    updateTransaction: (state, action) => {
      const idx = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) state.transactions[idx] = action.payload
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    resetFilter: (state) => {
      state.filter = initialState.filter
    },
  },
})



export const selectTransactions = (state) => state.transactions.transactions
export const selectFilter = (state) => state.transactions.filter



export const selectUserTransactions = createSelector(
  [selectTransactions, (_, userId) => userId],
  (txs, userId) => txs.filter((t) => !t.userId || t.userId === userId),
)



export const selectUserMonthlyIncome = createSelector(
  [selectUserTransactions],
  (txs) => {
    const prefix = getMonthPrefix()
    return txs
      .filter((t) => t.tur === 'gelir' && t.tarih.startsWith(prefix))
      .reduce((s, t) => s + t.tutar, 0)
  },
)

export const selectUserTotalIncome = createSelector(
  [selectUserTransactions],
  (txs) => txs.filter((t) => t.tur === 'gelir').reduce((s, t) => s + t.tutar, 0),
)



export const selectUserMonthlyExpense = createSelector(
  [selectUserTransactions],
  (txs) => {
    const prefix = getMonthPrefix()
    return txs
      .filter((t) => t.tur === 'gider' && t.tarih.startsWith(prefix))
      .reduce((s, t) => s + t.tutar, 0)
  },
)

export const selectUserTotalExpense = createSelector(
  [selectUserTransactions],
  (txs) => txs.filter((t) => t.tur === 'gider').reduce((s, t) => s + t.tutar, 0),
)



export const selectFilteredTransactions = createSelector(
  [selectUserTransactions, selectFilter],
  (txs, filter) => {
    let f = [...txs]
    if (filter.tur !== 'hepsi') f = f.filter((t) => t.tur === filter.tur)
    if (filter.kategori !== 'hepsi') f = f.filter((t) => t.kategori === filter.kategori)
    if (filter.baslangic) f = f.filter((t) => t.tarih >= filter.baslangic)
    if (filter.bitis) f = f.filter((t) => t.tarih <= filter.bitis)
    return f.sort((a, b) => new Date(b.tarih) - new Date(a.tarih))
  },
)

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  setFilter,
  resetFilter,
} = transactionSlice.actions

export default transactionSlice.reducer
