import { createSlice } from '@reduxjs/toolkit'
import usersData from '../../data/users.json'

// LocalStorage'daki giriş yapan kullanıcı bilgisi okunur.
const savedUser = JSON.parse(localStorage.getItem('currentUser'))

// LocalStorage'daki güncel kullanıcı listesi okunur.
const savedUsers = JSON.parse(localStorage.getItem('users'))

// Kullanıcı listesini localStorage'a kaydeder.
const saveUsersToStorage = (users) => {
  localStorage.setItem('users', JSON.stringify(users))
}

// Yeni kullanıcı için u1, u2, u3 şeklinde sıradaki id üretilir.
const createUserId = (users) => {
  const lastNumber = users.reduce((max, user) => {
    const number = Number(String(user.id).replace('u', ''))
    return number > max ? number : max
  }, 0)

  return `u${lastNumber + 1}`
}

const initialState = {
  currentUser: savedUser || null,  // giriş yapan kullanıcı bilgisi
  users: savedUsers || usersData, // kullanıcı bilgisi localstorage de yoksa jsondan gelir
  isAuthenticated: !!savedUser,  //kullanıcının giriş yapıp yapmadığı kontrol edilir.
  error: null, 
}

// Auth işlemleri için slice oluşturulur.
const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload //verileri aldık
      //eşleşen kullanıcı kontrolü
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      )

      if (user) {
        state.currentUser = user
        state.isAuthenticated = true
        state.error = null
        // kullanıcıyı localstorage ye kaydetme
        localStorage.setItem('currentUser', JSON.stringify(user))
      } else {
        state.currentUser = null
        state.isAuthenticated = false
        state.error = 'E-posta veya şifre hatalı.'

        localStorage.removeItem('currentUser')
      }
    },

    // kullanıcı çıkış yaptığında çalışır
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null

      localStorage.removeItem('currentUser')
    },

    // Yeni kullanıcı kaydı oluşturur.
    register: (state, action) => {
      const exists = state.users.find(
        (u) => u.email === action.payload.email
      )

      if (exists) {
        state.error = 'Bu e-posta zaten kayıtlı.'
      } else {
        const newUser = {
          id: createUserId(state.users),
          role: 'user',
          paraBirimi: 'TRY',
          ...action.payload,
        }

        state.users.push(newUser)
        state.error = null

        saveUsersToStorage(state.users)
      }
    },

    //  kullanıcının profil bilgilerini günceller.
    updateProfile: (state, action) => {
      if (!state.currentUser) return
      //giriş yapan kullanıcı aranır
      const index = state.users.findIndex(
        (u) => u.id === state.currentUser.id
      )
      //kullanıcıyı bulursa işlemi yapar
      if (index !== -1) {
        state.users[index] = {
          ...state.users[index],
          ...action.payload,
        }
        // giriş yapan kullanıcı bilgileri de güncellenir
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        }

        state.error = null

        saveUsersToStorage(state.users)
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
      }
    },

    // Yeni kullanıcı ekler.
    addUser: (state, action) => {
      const exists = state.users.find(
        (u) => u.email === action.payload.email
      )
      // girilen eposta mevcut mu diye kontrol edilir
      if (exists) {
        state.error = 'Bu e-posta zaten kayıtlı.'
        return
      }

      const newUser = {
        id: createUserId(state.users),
        role: 'user',
        paraBirimi: 'TRY',
        ...action.payload,
      }

      state.users.push(newUser)
      state.error = null

      saveUsersToStorage(state.users)
    },

    // Kullanıcı bilgilerini günceller.
    updateUser: (state, action) => {
      const { id, updatedUser } = action.payload

      const exists = state.users.find(
        (u) => u.email === updatedUser.email && u.id !== id
      )

      if (exists) {
        state.error = 'Bu e-posta başka bir kullanıcıda kayıtlı.'
        return
      }

      const index = state.users.findIndex((u) => u.id === id)

      if (index !== -1) {
        state.users[index] = {
          ...state.users[index],
          ...updatedUser,
        }

        if (state.currentUser && state.currentUser.id === id) {
          state.currentUser = {
            ...state.currentUser,
            ...updatedUser,
          }

          localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
        }

        state.error = null

        saveUsersToStorage(state.users)
      }
    },

    // Kullanıcı siler.
    deleteUser: (state, action) => {
      if (state.currentUser && state.currentUser.id === action.payload) {
        state.error = 'Kendi kullanıcınızı silemezsiniz.'
        return
      }

      state.users = state.users.filter((u) => u.id !== action.payload)

      if (state.currentUser && state.currentUser.id === action.payload) {
        state.currentUser = null
        state.isAuthenticated = false
        localStorage.removeItem('currentUser')
      }

      state.error = null

      saveUsersToStorage(state.users)
    },

    // Hata mesajını temizler.
    clearError: (state) => {
      state.error = null
    },
  },
})

// Action'lar dışa aktarılır.
export const {
  login,
  logout,
  register,
  updateProfile,
  addUser,
  updateUser,
  deleteUser,
  clearError,
} = authSlice.actions

// Reducer store'a eklenmesi için dışa aktarılır.
export default authSlice.reducer
