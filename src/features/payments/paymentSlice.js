import { createSelector, createSlice } from '@reduxjs/toolkit'
import paymentsData from '../../data/payments.json'
// bugünün tarihini gün ay yıl şeklinde alır
const getCurrentMonth = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}
// ödeme listesindeki en büyük id yi bulup yeni id üretir
const createPaymentId = (payments) => {
  const lastNumber = payments.reduce((maxNumber, payment) => {
    // id başındaki p yi silip kalanı number a çevirir
    const paymentNumber = Number(String(payment.id).replace('p', ''))
    return paymentNumber > maxNumber ? paymentNumber : maxNumber
  }, 0)
  // bulunan değere 1 ekle başına p yi geri ekle döndür
  return `p${lastNumber + 1}`
}

const initialState = {
  payments: paymentsData,
}
// yeni otomatik ödeme ekle
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      const newPayment = {
        id: createPaymentId(state.payments),
        aktif: true,
        ...action.payload,
      }

      state.payments.push(newPayment)
    },

    updatePayment: (state, action) => {
      // güncellenecek ödemenin id si aranır
      const paymentIndex = state.payments.findIndex(
        (payment) => payment.id === action.payload.id,
      )
      // bulunduysa güncelleme yapar
      if (paymentIndex !== -1) {
        state.payments[paymentIndex] = {
          ...state.payments[paymentIndex],
          ...action.payload,
        }
      }
    },
    // ödeme sil
    deletePayment: (state, action) => {
      state.payments = state.payments.filter(
        (payment) => payment.id !== action.payload,
      )
    },
    // aktif pasif toggle 
    togglePayment: (state, action) => {
      const selectedPayment = state.payments.find(
        (payment) => payment.id === action.payload,
      )

      if (selectedPayment) {
        selectedPayment.aktif = !selectedPayment.aktif
      }
    },

    processAutoPayments: (state) => {
      const today = new Date()

      state.payments.forEach((payment) => { // tüm ödemeleri gez
        if (!payment.aktif) return // ödeme aktif değilse es geçer

        const paymentDate = new Date(payment.sonOdemeTarihi) // ödeme tarihini date objesine çevirir

        if (today >= paymentDate) { 
          //bugünün tarihine eşitse veya zamanı geçmişse 1 ay ileri atar
          paymentDate.setMonth(paymentDate.getMonth() + 1)
          payment.sonOdemeTarihi = paymentDate.toISOString().split('T')[0]
        }
      })
    },
  },
})

export const selectPayments = (state) => state.payments.payments
// id ile kontrol edip kullanıcıya ait ödemeleri seçer
export const selectUserActivePayments = createSelector(
  [selectPayments, (_, userId) => userId], //burada state kullanmadıgımız için _ ile boş geçtik
  (payments, userId) =>
    payments.filter((payment) => !payment.userId || payment.userId === userId),
)
// kullanıcının bu ayki total ödemesini hesaplar
export const selectUserMonthlyPaymentTotal = createSelector(
  [selectUserActivePayments],
  (payments) => {
    const currentMonth = getCurrentMonth() //mevcut ayı bulur

    return payments
    //bu aya ait ödemeleri filtrele
      .filter((payment) => payment.sonOdemeTarihi.startsWith(currentMonth))
      //toplam tutarı hespala
      .reduce((total, payment) => total + Number(payment.tutar || 0), 0)
  },
)
// kullanıcının toplam tüm ödemelerini hesaplar
export const selectUserTotalPayment = createSelector(
  [selectUserActivePayments],
  (payments) =>
    payments.reduce((total, payment) => total + Number(payment.tutar || 0), 0),
)

export const selectUserPaymentsAsItems = createSelector(
  [selectUserActivePayments], //aktif ödemeleri aldık
  (payments) =>
    payments.map((payment) => ({ //her ödeme için bir obje oluşturduk
      id: `payment_${payment.id}`,
      userId: payment.userId,
      source: 'payment',
      tur: 'gider',
      tarih: payment.sonOdemeTarihi, //obje içeriği
      kategori: payment.kategori,
      tutar: payment.tutar,
      aciklama: payment.baslik,
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
