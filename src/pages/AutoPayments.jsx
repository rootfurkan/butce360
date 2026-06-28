import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addPayment,
  deletePayment,
  togglePayment,
  updatePayment,
} from "../features/payments/paymentSlice";

const getPaymentIconType = (payment) => {
  const text = `${payment.baslik} ${payment.kategori}`.toLowerCase();

  if (text.includes("kira") || text.includes("ev")) return "home";
  if (text.includes("telefon") || text.includes("fatura")) return "phone";

  return "calendar";
};

const formatAmount = (amount) => {
  return Number(amount || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AutoPayments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paymentList = useSelector((state) => state.payments.payments);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDay, setPaymentDay] = useState("1");
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", type: "success" }), 2500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  const userPayments = paymentList.filter(
    (payment) => !payment.userId || payment.userId === currentUser?.id
  );

  const paymentCards = [...userPayments].reverse();

  const resetForm = () => {
    setSelectedPayment(null);
    setShowForm(false);
    setTitle("");
    setCompany("");
    setAmount("");
    setPaymentDay("1");
    setFormErrors({});
  };

  const openNewPaymentForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setShowForm(true);
    setTitle(payment.baslik || "");
    setCompany(payment.firma || payment.kategori || "");
    setAmount(String(payment.tutar || ""));
    setPaymentDay(String(payment.gunSayisi || "1"));
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) errors.title = "Ödeme başlığı boş bırakılamaz.";
    if (!company.trim()) errors.company = "Ödenecek firma boş bırakılamaz.";
    if (!amount || Number(amount) <= 0) errors.amount = "Geçerli bir tutar giriniz.";
    if (!paymentDay || Number(paymentDay) < 1 || Number(paymentDay) > 31) {
      errors.paymentDay = "Ödeme günü 1 ile 31 arasında olmalıdır.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: "İşlem gerçekleşmedi. Lütfen alanları kontrol edin.", type: "error" });
      return;
    }

    const now = new Date();
    const paymentData = {
      userId: currentUser?.id,
      baslik: title,
      firma: company,
      kategori: company,
      tutar: Number(amount),
      gunSayisi: Number(paymentDay),
      sonOdemeTarihi: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(paymentDay).padStart(2, "0")}`,
    };

    if (selectedPayment) {
      dispatch(updatePayment({ ...paymentData, id: selectedPayment.id }));
      setToast({ message: "Ödeme talimatı güncellendi.", type: "success" });
    } else {
      dispatch(addPayment(paymentData));
      setToast({ message: "Yeni ödeme talimatı eklendi.", type: "success" });
    }

    resetForm();
  };

  const handleDelete = (id) => {
    dispatch(deletePayment(id));
    setToast({ message: "Ödeme talimatı silindi.", type: "success" });
  };

  const calendarItems = userPayments
    .sort((a, b) => Number(a.gunSayisi) - Number(b.gunSayisi))
    .slice(0, 5);

  return (
    <section className="payments-page">
      {toast.message && <div className={`profile-toast${toast.type === "error" ? " error" : ""}`}>{toast.message}</div>}

      <div className="payments-page-header">
        <div>
          <h1>Ödeme Talimatları</h1>
          <p>Düzenli ödemelerinizi buradan yönetebilirsiniz.</p>
        </div>

        <button type="button" className="new-payment-button" onClick={openNewPaymentForm}>
          <span>+</span>
          Yeni Talimat Ekle
        </button>
      </div>

      {showForm && (
        <section className="payment-form-card">
          <div className="payment-form-header">
            <h2>{selectedPayment ? "Talimat Düzenle" : "Yeni Talimat Ekle"}</h2>
            <button type="button" onClick={resetForm}>
              Vazgeç
            </button>
          </div>

          <form className="payment-form-grid" onSubmit={handleSubmit}>
            <div className="payment-field">
              <label>Ödeme Başlığı</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
              {formErrors.title && <p>{formErrors.title}</p>}
            </div>

            <div className="payment-field">
              <label>Ödenecek Firma</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} />
              {formErrors.company && <p>{formErrors.company}</p>}
            </div>

            <div className="payment-field">
              <label>Tutar</label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {formErrors.amount && <p>{formErrors.amount}</p>}
            </div>

            <div className="payment-field">
              <label>Ayın Kaçında Ödenecek?</label>
              <input
                type="number"
                min="1"
                max="31"
                value={paymentDay}
                onChange={(e) => setPaymentDay(e.target.value)}
              />
              {formErrors.paymentDay && <p>{formErrors.paymentDay}</p>}
            </div>

            <div className="payment-form-actions">
              <button type="submit" className="new-payment-button">
                {selectedPayment ? "Talimatı Güncelle" : "Talimatı Kaydet"}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="payments-grid">
        {paymentCards.map((payment) => {
          const iconType = getPaymentIconType(payment);

          return (
            <article className="payment-card" key={payment.id}>
              <div className="payment-card-top">
                <div className={`payment-icon payment-icon-${iconType}`}>
                  {iconType === "phone" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M8 3.5H16C16.55 3.5 17 3.95 17 4.5V19.5C17 20.05 16.55 20.5 16 20.5H8C7.45 20.5 7 20.05 7 19.5V4.5C7 3.95 7.45 3.5 8 3.5Z" />
                      <path d="M11 17.5H13" />
                    </svg>
                  )}

                  {iconType === "calendar" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7 3V6" />
                      <path d="M17 3V6" />
                      <path d="M4.5 9H19.5" />
                      <path d="M5.5 5.5H18.5C19.05 5.5 19.5 5.95 19.5 6.5V18.5C19.5 19.05 19.05 19.5 18.5 19.5H5.5C4.95 19.5 4.5 19.05 4.5 18.5V6.5C4.5 5.95 4.95 5.5 5.5 5.5Z" />
                    </svg>
                  )}

                  {iconType === "home" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 11L12 5L19 11" />
                      <path d="M7 10.5V19H17V10.5" />
                      <path d="M10 19V14H14V19" />
                    </svg>
                  )}
                </div>

                <div className="payment-title">
                  <h3>{payment.baslik}</h3>
                  <p>{payment.firma || payment.kategori}</p>
                </div>

                <div className="payment-card-actions">
                  <button type="button" aria-label="Düzenle" onClick={() => handleEditClick(payment)}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 19L8.5 18.3L18.4 8.4L15.6 5.6L5.7 15.5L5 19Z" />
                      <path d="M14.5 6.7L17.3 9.5" />
                    </svg>
                  </button>

                  <button type="button" aria-label="Sil" onClick={() => handleDelete(payment.id)}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 7H18" />
                      <path d="M9 7V5H15V7" />
                      <path d="M9 10V18" />
                      <path d="M15 10V18" />
                      <path d="M8 7L8.6 20H15.4L16 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="payment-info-row">
                <span>Tutar</span>
                <strong>{formatAmount(payment.tutar)} ₺</strong>
              </div>

              <div className="payment-info-row">
                <span>Ödeme Günü</span>
                <b>Her ayın {payment.gunSayisi}'i</b>
              </div>

              <div className="payment-card-bottom">
                <em>{payment.aktif ? "Aktif" : "Pasif"}</em>
                <button
                  type="button"
                  className={`payment-toggle ${payment.aktif ? "active" : ""}`}
                  aria-label={`${payment.baslik} talimatını aç veya kapat`}
                  aria-pressed={payment.aktif}
                  onClick={() => dispatch(togglePayment(payment.id))}
                >
                  <span />
                </button>
              </div>
            </article>
          );
        })}

        <button type="button" className="create-payment-card" onClick={openNewPaymentForm}>
          <span>+</span>
          <strong>Yeni Talimat Oluştur</strong>
        </button>
      </div>

      <div className="payments-bottom-grid">
        <section className="payment-calendar-card">
          <h2>Gelecek Ödeme Takvimi</h2>

          <div className="payment-calendar-list">
            {calendarItems.map((item) => (
              <div className="payment-calendar-item" key={item.id}>
                <span>{String(item.gunSayisi).padStart(2, "0")}</span>
                <p>{item.baslik}</p>
                <strong>{formatAmount(item.tutar)} ₺</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="saving-tip-card">
          <div className="saving-tip-content">
            <h2>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3.5C8.95 3.5 6.5 5.86 6.5 8.82C6.5 10.58 7.35 12.13 8.68 13.1C9.5 13.7 10 14.52 10 15.5H14C14 14.52 14.5 13.7 15.32 13.1C16.65 12.13 17.5 10.58 17.5 8.82C17.5 5.86 15.05 3.5 12 3.5Z" />
                <path d="M10 18H14" />
                <path d="M10.5 20.5H13.5" />
              </svg>
              Akıllı Tasarruf İpucu
            </h2>

            <p>
              Otomatik ödeme talimatlarınızı düzenli kontrol ederek gereksiz
              abonelikleri azaltabilir ve aylık bütçenizi daha rahat yönetebilirsiniz.
            </p>

            <button type="button" onClick={() => navigate("/ai-forecast")}>
              AI Raporunu İncele
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AutoPayments;
