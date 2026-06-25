import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const summaryCards = [
    {
      label: "Toplam Bakiye",
      value: "₺45.250",
      detail: "↗ +%2.4 geçen aydan",
      type: "balance",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 6.5H19V17.5H5V6.5Z" />
          <path d="M15 10H19V14H15V10Z" />
          <path d="M17 12H17.01" />
        </svg>
      ),
    },
    {
      label: "Bu Ay Gelir",
      value: "₺12.400",
      detail: "Maaş ve Ek Gelirler",
      type: "income",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 4V20" />
          <path d="M6 14L12 20L18 14" />
        </svg>
      ),
    },
    {
      label: "Bu Ay Gider",
      value: "₺6.850",
      detail: "3 Planlanmış Ödeme",
      type: "expense",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 20V4" />
          <path d="M6 10L12 4L18 10" />
        </svg>
      ),
    },
    {
      label: "Tasarruf",
      value: "₺5.550",
      detail: "Hedefin %65’i tamamlandı",
      type: "saving",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 11.5C7 8.46 9.46 6 12.5 6H15.5C17.43 6 19 7.57 19 9.5V15.5H16.5L15 18H10L8.5 15.5H6V13H4.5V10H6.2C6.55 9.1 7.1 8.32 7.8 7.7" />
          <path d="M15 9.5H15.01" />
          <path d="M19 11H21" />
        </svg>
      ),
      progress: true,
    },
  ];

  const transactions = [
    {
      date: "12 Haz 2024",
      description: "Migros Market",
      category: "Mutfak",
      amount: "-₺840,50",
      amountType: "negative",
      badge: "gray",
    },
    {
      date: "10 Haz 2024",
      description: "Aylık Kira",
      category: "Ev",
      amount: "-₺4.500,00",
      amountType: "negative",
      badge: "gray",
    },
    {
      date: "05 Haz 2024",
      description: "Şirket Maaş Ödemesi",
      category: "Gelir",
      amount: "+₺12.400,00",
      amountType: "positive",
      badge: "blue",
    },
    {
      date: "03 Haz 2024",
      description: "Netflix Abonelik",
      category: "Eğlence",
      amount: "-₺159,90",
      amountType: "negative",
      badge: "gray",
    },
    {
      date: "01 Haz 2024",
      description: "Starbucks Coffee",
      category: "Gıda",
      amount: "-₺85,00",
      amountType: "negative",
      badge: "gray",
    },
  ];

  const categories = [
    { name: "Kira", value: "%65", color: "purple" },
    { name: "Market", value: "%15", color: "blue" },
    { name: "Ulaşım", value: "%12", color: "red" },
    { name: "Diğer", value: "%8", color: "violet" },
  ];

  return (
    <section className="dashboard-content">
          <div className="dashboard-summary-grid">
            {summaryCards.map((card) => (
              <article
                className={`dashboard-summary-card dashboard-summary-card-${card.type}`}
                key={card.label}
              >
                <div className="summary-card-top">
                  <span>{card.label}</span>
                  <div className="summary-card-icon">{card.icon}</div>
                </div>

                <strong>{card.value}</strong>

                {card.progress ? (
                  <div className="saving-progress-area">
                    <div className="saving-progress-track">
                      <span />
                    </div>
                    <p>{card.detail}</p>
                  </div>
                ) : (
                  <p>{card.detail}</p>
                )}
              </article>
            ))}
          </div>

          <div className="dashboard-main-grid">
            <section className="recent-transactions-card">
              <div className="dashboard-card-header">
                <h2>Son İşlemler</h2>
                <button type="button">Tümünü Gör</button>
              </div>

              <div className="transactions-table">
                <div className="transactions-table-head">
                  <span>Tarih</span>
                  <span>Açıklama</span>
                  <span>Kategori</span>
                  <span>Tutar</span>
                </div>

                {transactions.map((item) => (
                  <div
                    className="transactions-table-row"
                    key={item.description}
                  >
                    <span>{item.date}</span>
                    <strong>{item.description}</strong>
                    <span>
                      <em
                        className={`category-badge category-badge-${item.badge}`}
                      >
                        {item.category}
                      </em>
                    </span>
                    <b className={`transaction-amount ${item.amountType}`}>
                      {item.amount}
                    </b>
                  </div>
                ))}
              </div>
            </section>

            <aside className="category-card">
              <div className="category-card-title">
                <h2>Kategori Dağılımı</h2>
                <p>Bu ayki gider dağılımı</p>
              </div>

              <div className="donut-chart">
                <div className="donut-center">
                  <span>Toplam Gider</span>
                  <strong>₺6.850</strong>
                </div>
              </div>

              <div className="category-list">
                {categories.map((category) => (
                  <div className="category-list-item" key={category.name}>
                    <div>
                      <span
                        className={`category-dot category-dot-${category.color}`}
                      />
                      <p>{category.name}</p>
                    </div>
                    <strong>{category.value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <footer className="dashboard-footer">
            <p>© 2024 Bütçe360. Securely Fluid.</p>

            <nav>
              <button type="button">Security</button>
              <button type="button">Privacy</button>
              <button type="button">Terms</button>
              <button type="button">Support</button>
            </nav>
          </footer>

          <button
            type="button"
            className="dashboard-floating-button"
            aria-label="Yeni işlem ekle"
          >
            +
          </button>
    </section>
  );
};

export default Dashboard;
