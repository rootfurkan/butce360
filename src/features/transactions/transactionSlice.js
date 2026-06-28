import { createSlice, createSelector } from '@reduxjs/toolkit'
import transactionsData from '../../data/transactions.json'

//filtreleme kısmı için tarih fonksiyonu
const getMonthPrefix = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const initialState = {
  transactions: transactionsData,
  //filtre default değerleri
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
        id: Date.now().toString(), // yeni gider için tarihi baz alarak id üretir
        ...action.payload,
      }

      state.transactions.push(newItem) //state i güncelle
    },
    // işlem siler
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((item) => item.id !== action.payload)
    },
    // işlem günceller
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((item) => item.id === action.payload.id)

      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },
    // filtreleri günceller
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    // varsayılan haline resetler
    resetFilter: (state) => {
      state.filter = initialState.filter
    },
  },
})
// pie chart renk paleti
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
// işlem listesini state içinden alır
export const selectTransactions = (state) => state.transactions.transactions
export const selectFilter = (state) => state.transactions.filter

export const selectUserTransactions = createSelector(
  [selectTransactions, (_, userId) => userId], //state kullanmadığımız için _ koyduk userId yi parametre aldık dışarıdan geliyor
  (transactions, userId) => transactions.filter((item) => !item.userId || item.userId === userId), //seçili kullanıcıya ait işlemleri filtreler
)

export const selectUserMonthlyIncome = createSelector(
  [selectUserTransactions], // seçili kullanıyıca ait işlemler getir
  (transactions) => {
    const monthPrefix = getMonthPrefix() //mevcut ay bulunur

    return transactions
      .filter((item) => item.tur === 'gelir' && item.tarih.startsWith(monthPrefix)) //işlem gelir mi ve bu aya mı ait?
      .reduce((total, item) => total + Number(item.tutar || 0), 0)
  },
)
// seçili kullanıcının tüm gelirlerinin toplamı
export const selectUserTotalIncome = createSelector(
  [selectUserTransactions],
  (transactions) =>
    transactions
      .filter((item) => item.tur === 'gelir')
      .reduce((total, item) => total + Number(item.tutar || 0), 0),
)
// seçili kullanıcının bu ayki giderleri toplamı
export const selectUserMonthlyExpense = createSelector(
  [selectUserTransactions],
  (transactions) => {
    const monthPrefix = getMonthPrefix()

    return transactions
      .filter((item) => item.tur === 'gider' && item.tarih.startsWith(monthPrefix))
      .reduce((total, item) => total + Math.abs(Number(item.tutar || 0)), 0)
  },
)
// seçili kullanıcının tüm giderleri
export const selectUserTotalExpense = createSelector(
  [selectUserTransactions],
  (transactions) =>
    transactions
      .filter((item) => item.tur === 'gider')
      .reduce((total, item) => total + Math.abs(Number(item.tutar || 0)), 0), //abs ile negatif pozitife çevrilir
)

//filtereye göre listeleme
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

// RAPOR İÇİN kullanıcıya ait olan kayıtlar
export function getUserTransactions(transactions, userId) {
  return transactions.filter((item) => !item.userId || item.userId === userId)
}

// kullanıcıın işlemlerini gezerek 12 ayı çıkarır
export function getReportMonths(userTransactions) {
  const months = userTransactions.map((item) => item.tarih.slice(0, 7)) //tekrar eden ayları teke düşürür
  const uniqueMonths = [...new Set(months)]

  return uniqueMonths.sort().slice(-12) //ayları sıralayıp son 12 ayı alır
}
// son 12 ay için kullanıcıya ait gelir gider raporu oluşturma
export function getMonthlyReport(transactions, userId, months) {
  const userTransactions = getUserTransactions(transactions, userId)

  return months.map((month) => { // her ay için ayrı rapor hazırlanır
    const monthTransactions = userTransactions.filter((item) => // o aya ait işlemler seçilir
      item.tarih.startsWith(month), // o tarihten başlayan işlemler alınır
    )

    const income = monthTransactions
      .filter((item) => item.tur === 'gelir')
      .reduce((total, item) => total + Number(item.tutar || 0), 0) //gelirler bulunup toplanır

    const expense = monthTransactions
      .filter((item) => item.tur === 'gider')
      .reduce((total, item) => total + Math.abs(Number(item.tutar || 0)), 0) //giderler bulunup toplanır

    return {
      month,
      income,
      expense,
      balance: income - expense,
    }
  })
}
// kullanıcı giderlerini kategori kategori toplayıp rapora hazırlar
export function getCategoryReport(transactions, userId, selectedMonth = 'all') { 
  const userTransactions = getUserTransactions(transactions, userId) //hangi kullanıcının işlemleri alınacak
  const categoryTotals = {} // boş bir obje oluşturduk daha sonra kullanacağız

  //işlemleri gezip gider mi diye kontrol eder
  userTransactions.forEach((item) => {
    const isExpense = item.tur === 'gider'
    const isSelectedMonth = selectedMonth === 'all' || item.tarih.startsWith(selectedMonth) // seçili ay uygun mu diye kontrol eder

    if (isExpense && isSelectedMonth) { //sadece giderse ve seçili aya uygunsa
      const categoryName = item.kategori || 'Diğer' //kategori yoksa diğer olarak alır
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(Number(item.tutar || 0)) //kategori toplamına işlem tutarını ekler
    }
  })

  const totalExpense = Object.values(categoryTotals).reduce((total, amount) => total + amount, 0) // toplam gideri hesapla

  //pie chart için liste hazırlar
  const categoryList = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percent: totalExpense ? (value / totalExpense) * 100 : 0,
      color: reportColors[name] || reportColors.Diğer,
    }))
    .sort((firstItem, secondItem) => secondItem.value - firstItem.value) // en çok harcanan kategoriyi üste alır

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
