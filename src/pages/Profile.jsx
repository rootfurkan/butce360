import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../features/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();

  const { currentUser, users } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    ad: currentUser?.ad || "",
    soyad: currentUser?.soyad || "",
    email: currentUser?.email || "",
    paraBirimi: currentUser?.paraBirimi || "TRY",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = () => {
    dispatch(updateProfile(formData));
    alert("Profil güncellendi.");
  };

  const handlePasswordChange = () => {
    if (!newPassword.trim()) {
      alert("Yeni şifre giriniz.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    dispatch(
      updateProfile({
        password: newPassword,
      })
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    alert("Şifre güncellendi.");
  };

  return (
    <section className="profile-page">
      {/* HEADER */}
      <div className="profile-page-header">
        <h1>Profil Ayarları</h1>
        <p>Hesap bilgilerinizi ve güvenliğinizi buradan yönetebilirsiniz.</p>
      </div>

      {/* KİŞİSEL BİLGİLER */}
      <section className="profile-card">
        <div className="profile-card-title">
          <h2>Kişisel Bilgiler</h2>
        </div>

        <div className="profile-form-grid">
          <div className="profile-field">
            <label>Ad</label>
            <input
              type="text"
              name="ad"
              value={formData.ad}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Soyad</label>
            <input
              type="text"
              name="soyad"
              value={formData.soyad}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field full">
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Para Birimi</label>
            <select
              name="paraBirimi"
              value={formData.paraBirimi}
              onChange={handleChange}
            >
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div className="profile-save-area">
            <button
              type="button"
              className="profile-save-button"
              onClick={handleProfileUpdate}
            >
              Kaydet
            </button>
          </div>
        </div>
      </section>

      {/* ŞİFRE */}
      <section className="profile-card">
        <h2>Şifre Değiştir</h2>

        <div className="password-form">
          <div className="profile-field">
            <label>Mevcut Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="password-update-button"
            onClick={handlePasswordChange}
          >
            Şifreyi Güncelle
          </button>
        </div>
      </section>

      {/* KULLANICI LİSTESİ */}
      <section className="profile-card">
        <h2>Kullanıcılar</h2>

        <div className="profile-user-table">
          <div className="profile-user-head">
            <span>Kullanıcı</span>
            <span>Rol</span>
            <span>İşlemler</span>
          </div>

          {users?.map((user) => (
            <div
              className="profile-user-row"
              key={user.email}
            >
              <div className="profile-user-info">
                <span className="profile-avatar">
                  {user.ad?.[0]}
                  {user.soyad?.[0]}
                </span>

                <div>
                  <strong>
                    {user.ad} {user.soyad}
                  </strong>
                  <p>{user.email}</p>
                </div>
              </div>

              <div>
                <em className="profile-role">
                  {user.role}
                </em>
              </div>

              <div className="profile-user-actions">
                <button type="button">✏️</button>
                <button type="button">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}