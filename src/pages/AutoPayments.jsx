import React, { useState } from "react";

const AutoPayments = () => {
  const [activePayments, setActivePayments] = useState({
    phone: true,
    calendar: true,
    home: true,
  });

  const payments = [
    {
      title: "Telefon\nFaturası",
      subtitle: "Turkcell A.Ş.",
      amount: "400,00 ₺",
      day: "Her ayın 1'i",
      type: "phone",
    },
    {
      title: "Netflix",
      subtitle: "Eğlence Aboneliği",
      amount: "150,00 ₺",
      day: "Her ayın 15'i",
      type: "calendar",
    },
    {
      title: "Kira",
      subtitle: "Ev Ödemesi",
      amount: "15.000,00 ₺",
      day: "Her ayın 5'i",
      type: "home",
    },
  ];

  const calendarItems = [
    {
      day: "01",
      title: "Telefon Faturası",
      amount: "400 ₺",
    },
    {
      day: "05",
      title: "Kira",
      amount: "15.000 ₺",
    },
    {
      day: "15",
      title: "Netflix",
      amount: "150 ₺",
    },
  ];

  return (
    <section className="payments-page">
      <div className="payments-page-header">
        <div>
          <h1>Ödeme Talimatları</h1>
          <p>Düzenli ödemelerinizi buradan yönetebilirsiniz.</p>
        </div>

        <button type="button" className="new-payment-button">
          <span>+</span>
          Yeni Talimat Ekle
        </button>
      </div>

      <div className="payments-grid">
        {payments.map((payment) => (
          <article className="payment-card" key={payment.title}>
            <div className="payment-card-top">
              <div className={`payment-icon payment-icon-${payment.type}`}>
                {payment.type === "phone" && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 3.5H16C16.55 3.5 17 3.95 17 4.5V19.5C17 20.05 16.55 20.5 16 20.5H8C7.45 20.5 7 20.05 7 19.5V4.5C7 3.95 7.45 3.5 8 3.5Z" />
                    <path d="M11 17.5H13" />
                  </svg>
                )}

                {payment.type === "calendar" && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 3V6" />
                    <path d="M17 3V6" />
                    <path d="M4.5 9H19.5" />
                    <path d="M5.5 5.5H18.5C19.05 5.5 19.5 5.95 19.5 6.5V18.5C19.5 19.05 19.05 19.5 18.5 19.5H5.5C4.95 19.5 4.5 19.05 4.5 18.5V6.5C4.5 5.95 4.95 5.5 5.5 5.5Z" />
                  </svg>
                )}

                {payment.type === "home" && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 11L12 5L19 11" />
                    <path d="M7 10.5V19H17V10.5" />
                    <path d="M10 19V14H14V19" />
                  </svg>
                )}
              </div>

              <div className="payment-title">
                {payment.title.split("\n").map((line) => (
                  <h3 key={line}>{line}</h3>
                ))}
                <p>{payment.subtitle}</p>
              </div>

              <div className="payment-card-actions">
                <button type="button" aria-label="Düzenle">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 19L8.5 18.3L18.4 8.4L15.6 5.6L5.7 15.5L5 19Z" />
                    <path d="M14.5 6.7L17.3 9.5" />
                  </svg>
                </button>

                <button type="button" aria-label="Sil">
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
              <strong>{payment.amount}</strong>
            </div>

            <div className="payment-info-row">
              <span>Ödeme Günü</span>
              <b>{payment.day}</b>
            </div>

            <div className="payment-card-bottom">
              <em>{activePayments[payment.type] ? "Aktif" : "Pasif"}</em>
              <button
                type="button"
                className={`payment-toggle ${activePayments[payment.type] ? "active" : ""}`}
                aria-label={`${payment.title.replace("\n", " ")} talimatını aç veya kapat`}
                aria-pressed={activePayments[payment.type]}
                onClick={() => setActivePayments((current) => ({
                  ...current,
                  [payment.type]: !current[payment.type],
                }))}
              >
                <span />
              </button>
            </div>
          </article>
        ))}

        <button type="button" className="create-payment-card">
          <span>+</span>
          <strong>Yeni Talimat Oluştur</strong>
        </button>
      </div>

      <div className="payments-bottom-grid">
        <section className="payment-calendar-card">
          <h2>Gelecek Ödeme Takvimi</h2>

          <div className="payment-calendar-list">
            {calendarItems.map((item) => (
              <div className="payment-calendar-item" key={item.day}>
                <span>{item.day}</span>
                <p>{item.title}</p>
                <strong>{item.amount}</strong>
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
              Geçen aya göre abonelik harcamalarınız <strong>%12 azaldı.</strong>{" "}
              Gereksiz otomatik ödemeleri iptal ederek yılda ortalama{" "}
              <strong>2.400₺</strong> tasarruf edebilirsiniz.
            </p>

            <button type="button">AI Raporunu İncele</button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AutoPayments;

