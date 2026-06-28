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
      const newItem = {
        id: Date.now().toString(),
        ...action.payload,
      }

      state.transactions.push(newItem)
    },

    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((item) => item.id !== action.payload)
    },

    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((item) => item.id === action.payload.id)

      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },

    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },

    resetFilter: (state) => {
      state.filter = initialState.filter
    },
  },
})

const reportColors = {
  Market: '#4330ad',
  Fatura: '#1d7898',
  Kira: '#e76f51',
  Ulaşım: '#f2a54a',
  Eğlence: '#36b58b',
  Sağlık: '#d94b55',
  Eğitim: '#8b5cf6',
  Alışveriş: '#ec4899',
  Yemek: '#14b8a6',
  Diğer: '#7b8290',
  'Beyaz Eşya': '#0ea5e9',
  Tatil: '#22c55e',
  Elektronik: '#f97316',
  'Araç Bakımı': '#a855f7',
  Giyim: '#e11d48',
  'Ev Eşyası': '#06b6d4',
  Tamirat: '#ca8a04',
  Taşınma: '#2563eb',
}

export const selectTransactions = (state) => state.transactions.transactions
export const selectFilter = (state) => state.transactions.filter

export const selectUserTransactions = createSelector(
  [selectTransactions, (_, userId) => userId],
  (transactions, userId) => transactions.filter((item) => !item.userId || item.userId === userId),
)

export const selectUserMonthlyIncome = createSelector(
  [selectUserTransactions],
  (transactions) => {
    const monthPrefix = getMonthPrefix()

    return transactions
      .filter((item) => item.tur === 'gelir' && item.tarih.startsWith(monthPrefix))
      .reduce((total, item) => total + Number(item.tutar || 0), 0)
  },
)

export const selectUserTotalIncome = createSelector(
  [selectUserTransactions],
  (transactions) =>
    transactions
      .filter((item) => item.tur === 'gelir')
      .reduce((total, item) => total + Number(item.tutar || 0), 0),
)

export const selectUserMonthlyExpense = createSelector(
  [selectUserTransactions],
  (transactions) => {
    const monthPrefix = getMonthPrefix()

    return transactions
      .filter((item) => item.tur === 'gider' && item.tarih.startsWith(monthPrefix))
      .reduce((total, item) => total + Math.abs(Number(item.tutar || 0)), 0)
  },
)

export const selectUserTotalExpense = createSelector(
  [selectUserTransactions],
  (transactions) =>
    transactions
      .filter((item) => item.tur === 'gider')
      .reduce((total, item) => total + Math.abs(Number(item.tutar || 0)), 0),
)

export const selectFilteredTransactions = createSelector(
  [selectUserTransactions, selectFilter],
  (transactions, filter) => {
    let filteredTransactions = [...transactions]

    if (filter.tur !== 'hepsi') {
      filteredTransactions = filteredTransactions.filter((item) => item.tur === filter.tur)
    }

    if (filter.kategori !== 'hepsi') {
      filteredTransactions = filteredTransactions.filter((item) => item.kategori === filter.kategori)
    }

    if (filter.baslangic) {
      filteredTransactions = filteredTransactions.filter((item) => item.tarih >= filter.baslangic)
    }

    if (filter.bitis) {
      filteredTransactions = filteredTransactions.filter((item) => item.tarih <= filter.bitis)
    }

    return filteredTransactions.sort((firstItem, secondItem) => new Date(secondItem.tarih) - new Date(firstItem.tarih))
  },
)

export function getUserTransactions(transactions, userId) {
  return transactions.filter((item) => !item.userId || item.userId === userId)
}

export function getReportMonths(userTransactions) {
  const months = userTransactions.map((item) => item.tarih.slice(0, 7))
  const uniqueMonths = [...new Set(months)]

  return uniqueMonths.sort().slice(-12)
}

export function getMonthlyReport(transactions, userId, months) {
  const userTransactions = getUserTransactions(transactions, userId)

  return months.map((month) => {
    const monthTransactions = userTransactions.filter((item) =>
      item.tarih.startsWith(month),
    )

    const income = monthTransactions
      .filter((item) => item.tur === 'gelir')
      .reduce((total, item) => total + Number(item.tutar || 0), 0)

    const expense = monthTransactions
      .filter((item) => item.tur === 'gider')
      .reduce((total, item) => total + Math.abs(Number(item.tutar || 0)), 0)

    return {
      month,
      income,
      expense,
      balance: income - expense,
    }
  })
}

export function getCategoryReport(transactions, userId, selectedMonth = 'all') {
  const userTransactions = getUserTransactions(transactions, userId)
  const categoryTotals = {}

  userTransactions.forEach((item) => {
    const isExpense = item.tur === 'gider'
    const isSelectedMonth = selectedMonth === 'all' || item.tarih.startsWith(selectedMonth)

    if (isExpense && isSelectedMonth) {
      const categoryName = item.kategori || 'Diğer'
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(Number(item.tutar || 0))
    }
  })

  const totalExpense = Object.values(categoryTotals).reduce((total, amount) => total + amount, 0)

  const categoryList = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percent: totalExpense ? (value / totalExpense) * 100 : 0,
      color: reportColors[name] || reportColors.Diğer,
    }))
    .sort((firstItem, secondItem) => secondItem.value - firstItem.value)

  return {
    categoryList,
    totalExpense,
  }
}

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  setFilter,
  resetFilter,
} = transactionSlice.actions

export default transactionSlice.reducer
