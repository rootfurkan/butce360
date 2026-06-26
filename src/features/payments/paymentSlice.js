import { createSlice } from '@reduxjs/toolkit'
import paymentsData from '../../data/payments.json'

// LocalStorage'da kayıtlı ödeme talimatları okunur.
const savedPayments = JSON.parse(localStorage.getItem('payments'))

// Ödeme talimatları localStorage'a kaydedilir.
const savePaymentsToStorage = (payments) => {
  localStorage.setItem('payments', JSON.stringify(payments))
}

// Yeni ödeme için p1, p2, p3 şeklinde sıradaki id üretilir.
const createPaymentId = (payments) => {
  const lastNumber = payments.reduce((max, payment) => {
    const number = Number(String(payment.id).replace('p', ''))
    return number > max ? number : max
  }, 0)

  return `p${lastNumber + 1}`
}

const initialState = {
  payments: savedPayments || paymentsData,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      const newItem = {
        id: createPaymentId(state.payments),
        aktif: true,
        ...action.payload,
      }

      state.payments.push(newItem)
      savePaymentsToStorage(state.payments)
    },

    updatePayment: (state, action) => {
      const index = state.payments.findIndex((p) => p.id === action.payload.id)

      if (index !== -1) {
        state.payments[index] = {
          ...state.payments[index],
          ...action.payload,
        }

        savePaymentsToStorage(state.payments)
      }
    },

    deletePayment: (state, action) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload)
      savePaymentsToStorage(state.payments)
    },

    togglePayment: (state, action) => {
      const item = state.payments.find((p) => p.id === action.payload)

      if (item) {
        item.aktif = !item.aktif
        savePaymentsToStorage(state.payments)
      }
    },

    processAutoPayments: (state) => {
      const bugun = new Date().toISOString().split('T')[0]

      state.payments.forEach((payment) => {
        if (!payment.aktif) return

        const sonOdeme = new Date(payment.sonOdemeTarihi)
        const bugunDate = new Date(bugun)

        if (bugunDate >= sonOdeme) {
          const yeniTarih = new Date(sonOdeme)
          yeniTarih.setMonth(yeniTarih.getMonth() + 1)
          payment.sonOdemeTarihi = yeniTarih.toISOString().split('T')[0]
        }
      })

      savePaymentsToStorage(state.payments)
    },
  },
})

export const {
  addPayment,
  updatePayment,
  deletePayment,
  togglePayment,
  processAutoPayments,
} = paymentSlice.actions

export default paymentSlice.reducer
