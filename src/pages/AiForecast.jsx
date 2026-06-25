import React from "react";

const AiForecast = () => {
  const predictionCards = [
    {
      title: "Sabit Giderler",
      value: "₺4.500",
    },
    {
      title: "Değişken Giderler",
      value: "₺2.100",
    },
    {
      title: "Beklenmedik",
      value: "₺600",
    },
  ];

  const categoryPredictions = [
    {
      title: "Mutfak Harcaması",
      estimate: "Tahmin: ₺1.800",
      value: "₺1.240 / ₺1.800",
      percent: 72,
      type: "kitchen",
      status: "normal",
    },
    {
      title: "Ulaşım",
      estimate: "Tahmin: ₺950",
      value: "₺980 / ₺950",
      percent: 100,
      type: "transport",
      status: "danger",
      warning: "Tahmini aşıldı! Beklenmedik bir artış saptandı.",
    },
    {
      title: "Eğlence",
      estimate: "Tahmin: ₺1.200",
      value: "₺450 / ₺1.200",
      percent: 38,
      type: "entertainment",
      status: "normal",
    },
  ];

  const suggestions = [
    {
      title: "Abonelikleri Gözden Geçirin",
      text: "Son 3 aydır kullanmadığınız “Streaming X” üyeliği ayda ₺129 kayba neden oluyor.",
      button: "Şimdi Yönet",
      type: "subscription",
    },
    {
      title: "Haftalık Harcama Limiti",
      text: "Gelecek hafta dışarıda yemek harcamasını ₺400 ile limitlerseniz hedefinize ulaşırsınız.",
      button: "Limit Koy",
      type: "limit",
    },
    {
      title: "Otomatik Birikim",
      text: "Boşta duran ₺2.500 bakiyenizi “Altın Hesabı”na aktararak enflasyona karşı koruyun.",
      button: "Aktar",
      type: "saving",
    },
  ];

  return (
    <section className="ai-forecast-page">
      <div className="ai-prediction-card">
        <div className="ai-prediction-header">
          <div>
            <h1>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
                <path d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z" />
                <path d="M5 15L5.6 16.4L7 17L5.6 17.6L5 19L4.4 17.6L3 17L4.4 16.4L5 15Z" />
              </svg>
              Gelecek Ay Tahmini
            </h1>
            <p>Harcama alışkanlıklarınıza dayanarak Ocak 2025 projeksiyonu.</p>
          </div>

          <div className="ai-confidence">
            <span>%94 Güven Aralığı</span>
            <p>Geçen aya göre <strong>-%4.2</strong> daha düşük</p>
          </div>
        </div>

        <div className="ai-main-estimate">
          <strong>₺7.200</strong>
          <span>Tahmini Harcama</span>
        </div>

        <div className="ai-prediction-grid">
          {predictionCards.map((item) => (
            <div className="ai-mini-card" key={item.title}>
              <span>{item.title}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-middle-grid">
        <section className="category-prediction-card">
          <div className="ai-section-header">
            <h2>Kategori Bazlı Tahminler</h2>
            <button type="button">Detayları Gör</button>
          </div>

          <div className="category-prediction-list">
            {categoryPredictions.map((item) => (
              <article className="category-prediction-item" key={item.title}>
                <div className={`category-prediction-icon ${item.type}`}>
                  {item.type === "kitchen" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 6H7.5L9 15H17.5L19 8H8" />
                      <path d="M10 19.5H10.01" />
                      <path d="M17 19.5H17.01" />
                    </svg>
                  )}

                  {item.type === "transport" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 11L8 6H16L18 11" />
                      <path d="M5 11H19V17H5V11Z" />
                      <path d="M8 17V19" />
                      <path d="M16 17V19" />
                      <path d="M8 14H8.01" />
                      <path d="M16 14H16.01" />
                    </svg>
                  )}

                  {item.type === "entertainment" && (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 8H18V18H6V8Z" />
                      <path d="M9 5V10" />
                      <path d="M15 5V10" />
                      <path d="M9 13H15" />
                    </svg>
                  )}
                </div>

                <div className="category-prediction-content">
                  <div className="category-prediction-top">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.estimate}</p>
                    </div>

                    <strong className={item.status}>{item.value}</strong>
                  </div>

                  <div className={`category-progress category-progress-${item.status}`}>
                    <span style={{ width: `${item.percent}%` }} />
                  </div>

                  {item.warning && <em>{item.warning}</em>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="trend-analysis-card">
          <div className="trend-analysis-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 14L8.5 9.5L12.5 13.5L20 6" />
              <path d="M16 6H20V10" />
            </svg>
          </div>

          <h2>Trend Analizi</h2>

          <p>
            Harcama hızınız geçen haftaya göre <strong>yavaşladı.</strong>
          </p>

          <div className="trend-saving-box">
            Ay sonunda <strong>₺400 tasarruf</strong> potansiyeli görünüyor.
          </div>

          <button type="button">Detaylı Analiz Al</button>
        </aside>
      </div>

      <section className="ai-suggestions-section">
        <div className="ai-suggestions-title">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3.5C8.95 3.5 6.5 5.86 6.5 8.82C6.5 10.58 7.35 12.13 8.68 13.1C9.5 13.7 10 14.52 10 15.5H14C14 14.52 14.5 13.7 15.32 13.1C16.65 12.13 17.5 10.58 17.5 8.82C17.5 5.86 15.05 3.5 12 3.5Z" />
            <path d="M10 18H14" />
            <path d="M10.5 20.5H13.5" />
          </svg>
          <h2>Yapay Zeka Tasarruf Önerileri</h2>
        </div>

        <div className="ai-suggestions-grid">
          {suggestions.map((item) => (
            <article className="ai-suggestion-card" key={item.title}>
              <div className={`ai-suggestion-icon ${item.type}`}>
                {item.type === "subscription" && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 7H19V17H5V7Z" />
                    <path d="M9 11L12 13L15 11" />
                    <path d="M8 5V7" />
                    <path d="M16 5V7" />
                  </svg>
                )}

                {item.type === "limit" && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 7V12L15 15" />
                    <path d="M12 21A8 8 0 1 0 12 5A8 8 0 0 0 12 21Z" />
                    <path d="M9 3H15" />
                  </svg>
                )}

                {item.type === "saving" && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 6H19V18H5V6Z" />
                    <path d="M9 10H15" />
                    <path d="M9 14H13" />
                  </svg>
                )}
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <button type="button">
                {item.button}
                <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default AiForecast;
