import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, register } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);

  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (!ad.trim()) errors.ad = "Ad alanı boş bırakılamaz.";
    if (!soyad.trim()) errors.soyad = "Soyad alanı boş bırakılamaz.";
    if (!email.trim()) errors.email = "E-posta alanı boş bırakılamaz.";
    if (!password.trim()) errors.password = "Şifre alanı boş bırakılamaz.";
    if (password !== passwordRepeat) errors.passwordRepeat = "Şifreler uyuşmuyor.";
    if (!isTermsAccepted) errors.terms = "Devam etmek için koşulları kabul etmelisiniz.";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    dispatch(clearError());
    dispatch(
      register({
        ad: ad.trim(),
        soyad: soyad.trim(),
        email: email.trim(),
        password,
      }),
    );

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = users.find((user) => user.email === email.trim());

    if (newUser) {
      navigate("/login");
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-logo">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5.5 5.25C5.5 4.42157 6.17157 3.75 7 3.75H17C17.8284 3.75 18.5 4.42157 18.5 5.25V18.75C18.5 19.5784 17.8284 20.25 17 20.25H7C6.17157 20.25 5.5 19.5784 5.5 18.75V5.25Z" />
            <path d="M8.25 7.5H15.75" />
            <path d="M8.25 10.5H15.75" />
            <path d="M8.25 13.5H12.25" />
            <path d="M14.25 13.25H17.75V16.75H14.25V13.25Z" />
          </svg>
        </div>

        <div className="register-brand">
          <h1>Bütçe360</h1>
          <p>Finansal Geleceğini Şekillendir</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form-row">
            <div className="register-form-group">
              <label htmlFor="name">Ad</label>
              <input id="name" type="text" value={ad} onChange={(e) => setAd(e.target.value)} />
              {formErrors.ad && <p className="login-error">{formErrors.ad}</p>}
            </div>

            <div className="register-form-group">
              <label htmlFor="surname">Soyad</label>
              <input id="surname" type="text" value={soyad} onChange={(e) => setSoyad(e.target.value)} />
              {formErrors.soyad && <p className="login-error">{formErrors.soyad}</p>}
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {formErrors.email && <p className="login-error">{formErrors.email}</p>}
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Şifre</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {formErrors.password && <p className="login-error">{formErrors.password}</p>}
          </div>

          <div className="register-form-group">
            <label htmlFor="passwordRepeat">Şifre Tekrar</label>
            <input
              id="passwordRepeat"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            {formErrors.passwordRepeat && <p className="login-error">{formErrors.passwordRepeat}</p>}
          </div>

          <label className="register-terms">
            <input
              type="checkbox"
              checked={isTermsAccepted}
              onChange={(e) => setIsTermsAccepted(e.target.checked)}
            />
            <span>
              Kullanım Koşulları ve Gizlilik Politikası’nı okudum, kabul
              ediyorum.
            </span>
          </label>
          {formErrors.terms && <p className="login-error">{formErrors.terms}</p>}
          {authError && <p className="login-error">{authError}</p>}

          <button type="submit" className="register-submit">
            <span>Kayıt Ol</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" />
              <path d="M13 6L19 12L13 18" />
            </svg>
          </button>
        </form>

        <div className="register-login-link">
          <span>Zaten bir hesabınız var mı?</span>
          <button type="button" onClick={() => navigate("/login")}>
            Giriş Yap
          </button>
        </div>
      </section>

      <div className="register-footer-pill">
        © 2026 Bütçe360 v1.0.2 • Güvenli Finans Altyapısı
      </div>
    </main>
  );
};

export default Register;
