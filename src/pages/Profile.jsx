import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearError, deleteUser, updateUser } from "../features/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.auth.users); // Kullanıcı listesi store'dan alınır.
  const currentUser = useSelector((state) => state.auth.currentUser); // Giriş yapan kullanıcı alınır.

  const [selectedUser, setSelectedUser] = useState(null); // Düzenlenecek kullanıcı tutulur.
  const [userToDelete, setUserToDelete] = useState(null); // Silinecek kullanıcı tutulur.

  const [name, setName] = useState(""); // Ad bilgisi tutulur.
  const [surname, setSurname] = useState(""); // Soyad bilgisi tutulur.
  const [email, setEmail] = useState(""); // E-posta bilgisi tutulur.
  const [role, setRole] = useState("user"); // Rol bilgisi tutulur.
  const [currency, setCurrency] = useState("TRY"); // Para birimi bilgisi tutulur.
  const [password, setPassword] = useState(""); // Şifre bilgisi tutulur.
  const [passwordRepeat, setPasswordRepeat] = useState(""); // Şifre tekrar bilgisi tutulur.

  const [formErrors, setFormErrors] = useState({}); // Form hata mesajları tutulur.
  const [successMessage, setSuccessMessage] = useState(""); // Toast mesajı tutulur.

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(""); // Toast mesajı kısa süre sonra kapanır.
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const resetForm = () => {
    setSelectedUser(null); // Düzenleme modu kapatılır.
    setName(""); // Ad inputu temizlenir.
    setSurname(""); // Soyad inputu temizlenir.
    setEmail(""); // E-posta inputu temizlenir.
    setRole("user"); // Rol varsayılana döner.
    setCurrency("TRY"); // Para birimi varsayılana döner.
    setPassword(""); // Şifre inputu temizlenir.
    setPasswordRepeat(""); // Şifre tekrar inputu temizlenir.
    setFormErrors({}); // Hata mesajları temizlenir.
    dispatch(clearError()); // Store hata mesajı temizlenir.
  };

  const handleEditClick = (user) => {
    setSelectedUser(user); // Kullanıcı düzenleme için seçilir.
    setName(user.ad || ""); // Kullanıcının adı inputa yazılır.
    setSurname(user.soyad || ""); // Kullanıcının soyadı inputa yazılır.
    setEmail(user.email || ""); // Kullanıcının e-postası inputa yazılır.
    setRole(user.role || "user"); // Kullanıcının rolü inputa yazılır.
    setCurrency(user.paraBirimi || "TRY"); // Kullanıcının para birimi inputa yazılır.
    setPassword(""); // Şifre alanı boş bırakılır.
    setPasswordRepeat(""); // Şifre tekrar alanı boş bırakılır.
    setFormErrors({}); // Eski hatalar temizlenir.
  };

  const validateForm = () => {
    const errors = {}; // Hatalar bu objede toplanır.

    if (!name.trim()) errors.name = "Ad alanı boş bırakılamaz.";
    if (!surname.trim()) errors.surname = "Soyad alanı boş bırakılamaz.";
    if (!email.trim()) errors.email = "E-posta alanı boş bırakılamaz.";

    const emailExists = userList.some(
      (user) => user.email === email && user.id !== selectedUser?.id
    ); // Aynı e-posta başka kullanıcıda var mı bakılır.

    if (emailExists) errors.email = "Bu e-posta başka kullanıcıda kayıtlı.";

    if (password && password !== passwordRepeat) {
      errors.passwordRepeat = "Şifreler eşleşmiyor.";
    }

    setFormErrors(errors); // Hatalar ekrana basılır.

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesi engellenir.

    if (!validateForm()) return;

    const userData = {
      ad: name,
      soyad: surname,
      email,
      role,
      paraBirimi: currency,
    }; // Kaydedilecek kullanıcı bilgisi hazırlanır.

    if (password.trim()) {
      userData.password = password; // Şifre girildiyse kayda eklenir.
    }

    if (selectedUser) {
      dispatch(updateUser({ id: selectedUser.id, updatedUser: userData })); // Kullanıcı güncellenir.
      setSuccessMessage("Kullanıcı bilgileri güncellendi.");
    } else {
      dispatch(addUser({ ...userData, password: password || "123456" })); // Yeni kullanıcı eklenir.
      setSuccessMessage("Yeni kullanıcı eklendi.");
    }

    resetForm();
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUser(userToDelete.id)); // Kullanıcı silinir.
    setUserToDelete(null); // Silme onayı kapatılır.
    setSuccessMessage("Kullanıcı silindi.");
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "90px",
    },
    {
      name: "Kullanıcı",
      selector: (row) => `${row.ad} ${row.soyad}`,
      sortable: true,
      cell: (row) => (
        <div className="profile-user-info">
          <span className="profile-avatar">
            {row.ad?.[0]}
            {row.soyad?.[0]}
          </span>

          <div>
            <strong>
              {row.ad} {row.soyad}
            </strong>
            <p>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Rol",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => <em className="profile-role">{row.role}</em>,
      width: "140px",
    },
    {
      name: "Para Birimi",
      selector: (row) => row.paraBirimi,
      sortable: true,
      width: "150px",
    },
    {
      name: "İşlemler",
      right: true,
      cell: (row) => (
        <div className="profile-user-actions">
          <button type="button" onClick={() => handleEditClick(row)}>
            Düzenle
          </button>

          <button type="button" onClick={() => setUserToDelete(row)}>
            Sil
          </button>
        </div>
      ),
    },
  ]; // DataTable kolonları tanımlanır.

  return (
    <section className="profile-page">
      {successMessage && <div className="profile-toast">{successMessage}</div>}

      <div className="profile-page-header">
        <h1>Profil Ayarları</h1>
        <p>Kullanıcı ekleme, düzenleme ve silme işlemlerini buradan yapabilirsiniz.</p>
      </div>

      <section className="profile-card">
        <div className="profile-card-title-row">
          <div className="profile-card-title">
            <h2>{selectedUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</h2>
          </div>

          {selectedUser && (
            <button type="button" className="new-user-button" onClick={resetForm}>
              Vazgeç
            </button>
          )}
        </div>

        <form className="profile-form-grid" onSubmit={handleSubmit}>
          <div className="profile-field">
            <label>Ad</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            {formErrors.name && <p className="profile-field-error">{formErrors.name}</p>}
          </div>

          <div className="profile-field">
            <label>Soyad</label>
            <input value={surname} onChange={(e) => setSurname(e.target.value)} />
            {formErrors.surname && <p className="profile-field-error">{formErrors.surname}</p>}
          </div>

          <div className="profile-field full">
            <label>E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {formErrors.email && <p className="profile-field-error">{formErrors.email}</p>}
          </div>

          <div className="profile-field">
            <label>Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="user">Kullanıcı</option>
            </select>
          </div>

          <div className="profile-field">
            <label>Para Birimi</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div className="profile-field">
            <label>Yeni Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={selectedUser ? "Boş kalırsa değişmez" : "Boş kalırsa 123456 olur"}
            />
          </div>

          <div className="profile-field">
            <label>Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            {formErrors.passwordRepeat && (
              <p className="profile-field-error">{formErrors.passwordRepeat}</p>
            )}
          </div>

          <div className="profile-save-area">
            <button type="submit" className="profile-save-button">
              {selectedUser ? "Değişiklikleri Kaydet" : "Kullanıcı Ekle"}
            </button>
          </div>
        </form>
      </section>

      <section className="profile-card">
        <div className="profile-card-title-row">
          <div className="profile-card-title">
            <h2>Kullanıcı Listesi</h2>
          </div>

          <span className="profile-role">
            Aktif kullanıcı: {currentUser?.ad}
          </span>
        </div>

        <DataTable
          className="profile-data-table"
          columns={columns}
          data={userList}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10]}
          highlightOnHover
          pointerOnHover
          noDataComponent="Kayıtlı kullanıcı bulunamadı."
        />
      </section>

      {userToDelete && (
        <section className="profile-card">
          <div className="profile-card-title-row">
            <div>
              <h2>Kullanıcı Silme Onayı</h2>
              <p>
                {userToDelete.ad} {userToDelete.soyad} isimli kullanıcıyı silmek
                istediğinize emin misiniz?
              </p>
            </div>

            <div className="profile-user-actions">
              <button type="button" onClick={handleConfirmDelete}>
                Evet, Sil
              </button>

              <button type="button" onClick={() => setUserToDelete(null)}>
                Vazgeç
              </button>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
