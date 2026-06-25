import React, { useState } from "react";

const EditUser = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedCurrency, setSelectedCurrency] = useState("try");

  return (
    <section className="edit-user-page">
      <div className="edit-user-header">
        <div>
          <h1>Kullanıcı Düzenle</h1>
          <p>Kullanıcı bilgilerini, rolünü ve hesap ayarlarını buradan güncelleyebilirsiniz.</p>
        </div>

        <button type="button" className="edit-user-back-button">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" />
          </svg>
          Kullanıcı Listesine Dön
        </button>
      </div>

      <div className="edit-user-layout">
        <aside className="edit-user-profile-card">
          <div className="edit-user-avatar-area">
            <div className="edit-user-avatar">MK</div>

            <button type="button" className="edit-avatar-button">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 19L8.5 18.3L18.4 8.4L15.6 5.6L5.7 15.5L5 19Z" />
                <path d="M14.5 6.7L17.3 9.5" />
              </svg>
            </button>
          </div>

          <h2>Mehmet Kaya</h2>
          <p>mehmet.kaya@example.com</p>

          <div className="edit-user-mini-info">
            <span>Rol</span>
            <strong>Admin</strong>
          </div>

          <div className="edit-user-mini-info">
            <span>Hesap Durumu</span>
            <strong className="active">Aktif</strong>
          </div>

          <div className="edit-user-mini-info">
            <span>Son Güncelleme</span>
            <strong>20 Haz 2024</strong>
          </div>
        </aside>

        <div className="edit-user-content">
          <section className="edit-user-card">
            <div className="edit-user-card-title">
              <span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
                  <path d="M5 20C5.8 16.8 8.45 15 12 15C15.55 15 18.2 16.8 19 20" />
                </svg>
              </span>

              <div>
                <h2>Temel Bilgiler</h2>
                <p>Kullanıcının kişisel hesap bilgileri</p>
              </div>
            </div>

            <div className="edit-user-form-grid">
              <div className="edit-user-field">
                <label>Ad</label>
                <input type="text" defaultValue="Mehmet" />
              </div>

              <div className="edit-user-field">
                <label>Soyad</label>
                <input type="text" defaultValue="Kaya" />
              </div>

              <div className="edit-user-field">
                <label>E-posta Adresi</label>
                <input type="email" defaultValue="mehmet.kaya@example.com" />
              </div>

              <div className="edit-user-field">
                <label>Telefon</label>
                <input type="text" defaultValue="+90 541 000 00 00" />
              </div>
            </div>
          </section>

          <section className="edit-user-card">
            <div className="edit-user-card-title">
              <span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L19 6.5V11.5C19 16 16.1 19.8 12 21C7.9 19.8 5 16 5 11.5V6.5L12 3Z" />
                  <path d="M9.5 12L11.2 13.7L15 9.8" />
                </svg>
              </span>

              <div>
                <h2>Rol ve Yetki</h2>
                <p>Kullanıcının sistem erişim seviyesini belirleyin</p>
              </div>
            </div>

            <div className="edit-user-options-grid">
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={
                  selectedRole === "admin"
                    ? "edit-user-option active"
                    : "edit-user-option"
                }
              >
                <span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L19 6.5V11.5C19 16 16.1 19.8 12 21C7.9 19.8 5 16 5 11.5V6.5L12 3Z" />
                    <path d="M12 8V13" />
                    <path d="M12 16H12.01" />
                  </svg>
                </span>

                <strong>Admin</strong>
                <p>Tüm kullanıcıları ve ayarları yönetebilir.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={
                  selectedRole === "user"
                    ? "edit-user-option active"
                    : "edit-user-option"
                }
              >
                <span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
                    <path d="M5 20C5.8 16.8 8.45 15 12 15C15.55 15 18.2 16.8 19 20" />
                  </svg>
                </span>

                <strong>Kullanıcı</strong>
                <p>Sadece kendi gelir, gider ve raporlarını yönetebilir.</p>
              </button>
            </div>
          </section>

          <section className="edit-user-card">
            <div className="edit-user-card-title">
              <span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 7H19V17H5V7Z" />
                  <path d="M8 11H16" />
                  <path d="M8 14H12" />
                </svg>
              </span>

              <div>
                <h2>Hesap Ayarları</h2>
                <p>Kullanıcının para birimi ve hesap durumunu güncelleyin</p>
              </div>
            </div>

            <div className="edit-user-form-grid">
              <div className="edit-user-field">
                <label>Para Birimi</label>

                <div className="edit-user-select">
                  <select
                    value={selectedCurrency}
                    onChange={(event) => setSelectedCurrency(event.target.value)}
                  >
                    <option value="try">Türk Lirası (₺)</option>
                    <option value="usd">Amerikan Doları ($)</option>
                    <option value="eur">Euro (€)</option>
                  </select>

                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 10L12 15L17 10" />
                  </svg>
                </div>
              </div>

              <div className="edit-user-field">
                <label>Hesap Durumu</label>

                <div className="edit-user-status-tabs">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus("active")}
                    className={selectedStatus === "active" ? "active" : ""}
                  >
                    Aktif
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus("passive")}
                    className={selectedStatus === "passive" ? "active passive" : ""}
                  >
                    Pasif
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="edit-user-card">
            <div className="edit-user-card-title">
              <span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10" />
                  <path d="M6 10H18V20H6V10Z" />
                  <path d="M12 14V16.5" />
                </svg>
              </span>

              <div>
                <h2>Şifre Sıfırlama</h2>
                <p>Kullanıcı için geçici yeni şifre oluşturun</p>
              </div>
            </div>

            <div className="edit-user-form-grid">
              <div className="edit-user-field">
                <label>Yeni Şifre</label>
                <input type="password" placeholder="Yeni şifre girin" />
              </div>

              <div className="edit-user-field">
                <label>Yeni Şifre Tekrar</label>
                <input type="password" placeholder="Yeni şifreyi tekrar girin" />
              </div>
            </div>
          </section>

          <div className="edit-user-actions">
            <button type="button" className="edit-user-cancel-button">
              İptal
            </button>

            <button type="button" className="edit-user-save-button">
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditUser;