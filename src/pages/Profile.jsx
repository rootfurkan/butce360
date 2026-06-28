import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearError, deleteUser, updateUser } from "../features/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userList = useSelector((state) => state.auth.users);

  const isAdmin = currentUser?.role === "admin";
  const visibleUserList = isAdmin
    ? userList
    : userList.filter((user) => user.id === currentUser?.id);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [currency, setCurrency] = useState("TRY");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  // user rolündeki kullanıcı kendi bilgileriyle forma yerleştirilir
  useEffect(() => {
    if (isAdmin || !currentUser) return;

    setSelectedUser(currentUser);
    setName(currentUser.ad || "");
    setSurname(currentUser.soyad || "");
    setEmail(currentUser.email || "");
    setRole(currentUser.role || "user");
    setCurrency(currentUser.paraBirimi || "TRY");
  }, [currentUser, isAdmin]);

  // form alanları temizlenir ve düzenleme modu kapatılır
  const resetForm = () => {
    setSelectedUser(null);
    setName("");
    setSurname("");
    setEmail("");
    setRole("user");
    setCurrency("TRY");
    setPassword("");
    setPasswordRepeat("");
    setFormErrors({});
    dispatch(clearError());
  };

  // seçilen kullanıcının bilgileri forma yazılır
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setName(user.ad || "");
    setSurname(user.soyad || "");
    setEmail(user.email || "");
    setRole(user.role || "user");
    setCurrency(user.paraBirimi || "TRY");
    setPassword("");
    setPasswordRepeat("");
    setFormErrors({});
  };

  // form kaydedilmeden önce alanlar kontrol edilir
  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Ad alanı boş bırakılamaz.";
    if (!surname.trim()) errors.surname = "Soyad alanı boş bırakılamaz.";
    if (!email.trim()) errors.email = "E-posta alanı boş bırakılamaz.";

    const emailExists = userList.some(
      (user) => user.email === email && user.id !== selectedUser?.id,
    );

    if (emailExists) errors.email = "Bu e-posta başka kullanıcıda kayıtlı.";

    if (password && password !== passwordRepeat) {
      errors.passwordRepeat = "Şifreler eşleşmiyor.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // kullanıcı ekleme ve güncelleme işlemi yapılır
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
      ad: name,
      soyad: surname,
      email,
      role: isAdmin ? role : currentUser?.role || "user",
      paraBirimi: currency,
    };

    if (password.trim()) {
      userData.password = password;
    }

    if (selectedUser) {
      dispatch(updateUser({ id: selectedUser.id, updatedUser: userData }));
      setSuccessMessage("Kullanıcı bilgileri güncellendi.");
    } else {
      dispatch(addUser({ ...userData, password: password || "123456" }));
      setSuccessMessage("Yeni kullanıcı eklendi.");
    }

    resetForm();
  };

  // modal onayından sonra kullanıcı silinir
  const handleConfirmDelete = () => {
    dispatch(deleteUser(userToDelete.id));
    setUserToDelete(null);
    setSuccessMessage("Kullanıcı silindi.");
  };

  // kullanıcı tablosunda gösterilecek kolonlar hazırlanır
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
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 19L5.8 15.2L16.6 4.4C17.4 3.6 18.7 3.6 19.5 4.4C20.3 5.2 20.3 6.5 19.5 7.3L8.7 18.1L5 19Z" />
              <path d="M14.8 6.2L17.7 9.1" />
            </svg>
          </button>

          {row.id !== currentUser?.id && (
            <button type="button" onClick={() => setUserToDelete(row)}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 7H19" />
                <path d="M9 7V5H15V7" />
                <path d="M8 7L8.7 20H15.3L16 7" />
                <path d="M10.5 11V17" />
                <path d="M13.5 11V17" />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  // datatable görünümü için özel stiller verilir
  const tableStyles = {
    tableWrapper: {
      style: {
        borderRadius: "26px",
        overflow: "hidden",
      },
    },
    table: {
      style: {
        borderRadius: "26px",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.68)",
      },
    },
    headRow: {
      style: {
        borderTopLeftRadius: "26px",
        borderTopRightRadius: "26px",
        background: "rgba(248, 249, 253, 0.92)",
        borderBottomColor: "rgba(148, 163, 184, 0.14)",
      },
    },
    rows: {
      style: {
        background: "rgba(255, 255, 255, 0.32)",
        borderBottomColor: "rgba(148, 163, 184, 0.1)",
      },
      highlightOnHoverStyle: {
        background: "rgba(83, 74, 183, 0.06)",
      },
    },
    pagination: {
      style: {
        borderBottomLeftRadius: "26px",
        borderBottomRightRadius: "26px",
        background: "rgba(248, 249, 253, 0.92)",
        borderTopColor: "rgba(148, 163, 184, 0.16)",
      },
    },
  };

  return (
    <section className="profile-page">
      {successMessage && <div className="profile-toast">{successMessage}</div>}

      <div className="profile-page-header">
        <h1>Profil Ayarları</h1>
        <p>
          {isAdmin
            ? "Kullanıcı ekleme, düzenleme ve silme işlemlerini buradan yapabilirsiniz."
            : "Profil bilgilerinizi buradan güncelleyebilirsiniz."}
        </p>
      </div>

      <section className="profile-card">
        <div className="profile-card-title-row">
          <div className="profile-card-title">
            <h2>
              {isAdmin
                ? selectedUser
                  ? "Kullanıcı Düzenle"
                  : "Yeni Kullanıcı Ekle"
                : "Profilimi Düzenle"}
            </h2>
          </div>

          {isAdmin && selectedUser && (
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
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={!isAdmin}>
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
              {isAdmin
                ? selectedUser
                  ? "Değişiklikleri Kaydet"
                  : "Kullanıcı Ekle"
                : "Profilimi Güncelle"}
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
          data={visibleUserList}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10]}
          customStyles={tableStyles}
          highlightOnHover
          pointerOnHover
          noDataComponent="Kayıtlı kullanıcı bulunamadı."
        />
      </section>

      {userToDelete && (
        <div className="profile-modal-backdrop">
          <div className="profile-delete-modal">
            <h2>Kullanıcı Silme Onayı</h2>
            <p>
              <strong>
                {userToDelete.ad} {userToDelete.soyad}
              </strong>{" "}
              isimli kullanıcıyı silmek istediğinize emin misiniz?
            </p>

            <div className="profile-modal-actions">
              <button type="button" className="profile-modal-delete" onClick={handleConfirmDelete}>
                Evet, Sil
              </button>

              <button type="button" className="profile-modal-cancel" onClick={() => setUserToDelete(null)}>
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
