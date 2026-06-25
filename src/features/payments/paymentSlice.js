import { createSlice } from '@reduxjs/toolkit'
import paymentsData from '../../data/payments.json'

const initialState = {
  payments: paymentsData,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      const newItem = { id: Date.now().toString(), aktif: true, ...action.payload }
      state.payments.push(newItem)
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) state.payments[index] = action.payload
    },
    deletePayment: (state, action) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload)
    },
    togglePayment: (state, action) => {
      const item = state.payments.find((p) => p.id === action.payload)
      if (item) item.aktif = !item.aktif
    },
    processAutoPayments: (state, action) => {
      // Her giriş/gün kontrolünde çağrılır
      // action.payload: { transactions, addTransaction }
      const bugun = new Date().toISOString().split('T')[0]
      state.payments.forEach((payment) => {
        if (!payment.aktif) return
        const sonOdeme = new Date(payment.sonOdemeTarihi)
        const bugunDate = new Date(bugun)
        if (bugunDate >= sonOdeme) {
          // Bir sonraki ödeme tarihini hesapla (30 gün)
          const yeniTarih = new Date(sonOdeme)
          yeniTarih.setMonth(yeniTarih.getMonth() + 1)
          payment.sonOdemeTarihi = yeniTarih.toISOString().split('T')[0]
        }
      })
    },
  },
})

export const { addPayment, updatePayment, deletePayment, togglePayment, processAutoPayments } = paymentSlice.actions
export default paymentSlice.reducer