import { createSlice, createSelector } from '@reduxjs/toolkit'
import paymentsData from '../../data/payments.json'

const createPaymentId = (payments) => {
  const lastNumber = payments.reduce((max, payment) => {
    const number = Number(String(payment.id).replace('p', ''))
    return number > max ? number : max
  }, 0)

  return `p${lastNumber + 1}`
}

const initialState = {
  payments: paymentsData,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.payments.push({
        id: createPaymentId(state.payments),
        aktif: true,
        ...action.payload,
      })
    },

    updatePayment: (state, action) => {
      const index = state.payments.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.payments[index] = { ...state.payments[index], ...action.payload }
      }
    },

    deletePayment: (state, action) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload)
    },

    togglePayment: (state, action) => {
      const item = state.payments.find((p) => p.id === action.payload)
      if (item) item.aktif = !item.aktif
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
    },
  },
})

/* ============= SELECTORS ============= */

export const selectPayments = (state) => state.payments.payments

export const selectUserActivePayments = createSelector(
  [selectPayments, (_, userId) => userId],
  (payments, userId) => payments.filter((p) => !p.userId || p.userId === userId),
)

export const selectUserMonthlyPaymentTotal = createSelector(
  [selectUserActivePayments],
  (payments) => {
    const prefix = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    return payments
      .filter((p) => p.sonOdemeTarihi.startsWith(prefix))
      .reduce((s, p) => s + p.tutar, 0)
  },
)

export const selectUserTotalPayment = createSelector(
  [selectUserActivePayments],
  (payments) => payments.reduce((s, p) => s + p.tutar, 0),
)

export const selectUserPaymentsAsItems = createSelector(
  [selectUserActivePayments],
  (payments) =>
    payments.map((p) => ({
      id: `payment_${p.id}`,
      userId: p.userId,
      source: 'payment',
      tur: 'gider',
      tarih: p.sonOdemeTarihi,
      kategori: p.kategori,
      tutar: p.tutar,
      aciklama: p.baslik,
    })),
)

export const {
  addPayment,
  updatePayment,
  deletePayment,
  togglePayment,
  processAutoPayments,
} = paymentSlice.actions

export default paymentSlice.reducer
