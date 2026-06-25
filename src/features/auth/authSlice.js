import { createSlice } from '@reduxjs/toolkit'
import usersData from '../../data/users.json'


const initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  users: usersData,
  isAuthenticated: !!localStorage.getItem('currentUser'),
  error: null,
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      )
      if (user) {
        state.currentUser = user
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        state.error = 'E-posta veya şifre hatalı.'
      }
    },

    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      localStorage.removeItem('currentUser')
    },

    register: (state, action) => {
      const exists = state.users.find((u) => u.email === action.payload.email)
      if (exists) {
        state.error = 'Bu e-posta zaten kayıtlı.'
      } else {
        const newUser = { id: Date.now().toString(), role: 'user', ...action.payload }
        state.users.push(newUser)
        state.error = null
      }
    },

    updateProfile: (state, action) => {
      const index = state.users.findIndex((u) => u.id === state.currentUser.id)
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload }
        state.currentUser = { ...state.currentUser, ...action.payload }
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
      }
    },

    addUser: (state, action) => {
      const newUser = { id: Date.now().toString(), role: 'user', ...action.payload }
      state.users.push(newUser)
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { login, logout, register, updateProfile, addUser, deleteUser, clearError } = authSlice.actions
export default authSlice.reducer