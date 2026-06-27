import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, login } from "../features/auth/authSlice";

export default function Login() {
  const [email, setEmail] = useState("furkan@root.com");
  const [password, setPassword] = useState("123456");
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (!email.trim()) {
      errors.email = "E-posta alanı boş bırakılamaz.";
    }

    if (!password.trim()) {
      errors.password = "Şifre alanı boş bırakılamaz.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    dispatch(clearError());
    dispatch(login({ email, password }));

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5.5 5.25C5.5 4.42157 6.17157 3.75 7 3.75H17C17.8284 3.75 18.5 4.42157 18.5 5.25V18.75C18.5 19.5784 17.8284 20.25 17 20.25H7C6.17157 20.25 5.5 19.5784 5.5 18.75V5.25Z"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M8.25 7.5H15.75"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M8.25 10.5H15.75"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M8.25 13.5H12.25"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M14.25 13.25H17.75V16.75H14.25V13.25Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="login-brand">
          <h1>Bütçe360</h1>
          <p>Finansal Özgürlüğe İlk Adım</p>
        </div>

        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && (
              <p className="login-error">{formErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password">Şifre</label>
              <button type="button" className="forgot-button">
                Şifremi Unuttum
              </button>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && (
              <p className="login-error">{formErrors.password}</p>
            )}
          </div>

          {error && <p className="login-error">{error}</p>}

          <label className="remember-area">
            <input type="checkbox" />
            <span>Beni hatırla</span>
          </label>

          <button type="submit" className="login-submit">
            <span>Giriş Yap</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </section>

      <div className="register-pill">
        <span>Henüz bir hesabınız yok mu?</span>
        <button type="button"
        onClick={()=>navigate("/register") }
        >Kayıt Ol</button>
      </div>
    </main>
  );
}
