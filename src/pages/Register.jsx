import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
   const navigate = useNavigate();
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

        <form className="register-form">
          <div className="register-form-row">
            <div className="register-form-group">
              <label htmlFor="name">Ad</label>
              <input id="name" type="text" />
            </div>

            <div className="register-form-group">
              <label htmlFor="surname">Soyad</label>
              <input id="surname" type="text" />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input id="email" type="email" />
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Şifre</label>
            <input id="password" type="password" />
          </div>

          <div className="register-form-group">
            <label htmlFor="passwordRepeat">Şifre Tekrar</label>
            <input id="passwordRepeat" type="password" />
          </div>

          <label className="register-terms">
            <input type="checkbox" />
            <span>
              Kullanım Koşulları ve Gizlilik Politikası’nı okudum, kabul
              ediyorum.
            </span>
          </label>

          <button type="button" className="register-submit">
            <span>Kayıt Ol</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19" />
              <path d="M13 6L19 12L13 18" />
            </svg>
          </button>
        </form>

        <div className="register-login-link">
          <span>Zaten bir hesabınız var mı?</span>
          <button type="button"
          onClick={()=> navigate("/login")}
          >Giriş Yap</button>
        </div>
      </section>

      <div className="register-footer-pill">
        © 2026 Bütçe360 v1.0.2 • Güvenli Finans Altyapısı
      </div>
    </main>
  );
};

export default Register;