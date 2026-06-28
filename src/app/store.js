import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import transactionReducer from '../features/transactions/transactionSlice'
import paymentReducer from '../features/payments/paymentSlice'
import aiForecastReducer from '../features/aiForecast/aiForecastSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    payments: paymentReducer,
    aiForecast: aiForecastReducer,
  },
})
