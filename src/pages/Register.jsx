import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { error } = useSelector(
    (state) => state.auth
  )

  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    password: '',
    paraBirimi: 'TRY',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(register(formData))

    navigate('/login')
  }

  return (
    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h2>Kayıt Ol</h2>

        {error && (
          <p>{error}</p>
        )}

        <input
          name="ad"
          placeholder="Ad"
          onChange={handleChange}
        />

        <input
          name="soyad"
          placeholder="Soyad"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="E-posta"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Şifre"
          onChange={handleChange}
        />

        <button type="submit">
          Kayıt Ol
        </button>

      </form>

    </div>
  )
}

export default Register