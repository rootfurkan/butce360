import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectUserMonthlyIncome,
  selectUserMonthlyExpense as selectTxMonthlyExpense,
  selectUserTotalIncome,
  selectUserTotalExpense as selectTxTotalExpense,
  selectUserTransactions,
} from "../features/transactions/transactionSlice";
import {
  selectUserMonthlyPaymentTotal,
  selectUserTotalPayment,
  selectUserPaymentsAsItems,
} from "../features/payments/paymentSlice";

const formatTL = (v) =>
  `₺${Math.abs(v).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const CATEGORIES_PER_PAGE = 5;

const Dashboard = () => {
  const userId = useSelector((state) => state.auth.currentUser?.id);
  const [categoryPage, setCategoryPage] = useState(1);

  /* ============ TRANSACTIONS ============ */
  const txMonthlyIncome = useSelector((state) =>
    selectUserMonthlyIncome(state, userId)
  );
  const txMonthlyExpense = useSelector((state) =>
    selectTxMonthlyExpense(state, userId)
  );
  const txTotalIncome = useSelector((state) =>
    selectUserTotalIncome(state, userId)
  );
  const txTotalExpense = useSelector((state) =>
    selectTxTotalExpense(state, userId)
  );

  /* ============ PAYMENTS ============ */
  const monthlyPaymentTotal = useSelector((state) =>
    selectUserMonthlyPaymentTotal(state, userId)
  );
  const totalPayment = useSelector((state) =>
    selectUserTotalPayment(state, userId)
  );
  const paymentItems = useSelector((state) =>
    selectUserPaymentsAsItems(state, userId)
  );

  /* ============ BIRLESTIRME ============ */
  const monthlyExpense = txMonthlyExpense + monthlyPaymentTotal;
  const totalExpense = txTotalExpense + totalPayment;
  const totalBalance = txTotalIncome - totalExpense;

  const saving = totalBalance - monthlyExpense;
  const savingPercent =
    totalBalance > 0
      ? Math.min(100, Math.round((saving / totalBalance) * 100))
      : 0;

  /* ============ SON ISLEMLER ============ */
  const txItems = useSelector((state) => selectUserTransactions(state, userId))
    .filter((t) => t.tur === "gelir" || t.tur === "gider")
    .map((t) => ({ ...t, source: "transaction" }));

  const recentTransactions = useMemo(
    () =>
      [...txItems, ...paymentItems]
        .sort((a, b) => new Date(b.tarih) - new Date(a.tarih))
        .slice(0, 5),
    [txItems, paymentItems]
  );

  /* ============ KATEGORI DAGILIMI ============ */
  const categories = useMemo(() => {
    const all = [
      ...txItems.filter((t) => t.tur === "gider"),
      ...paymentItems,
    ];
    const toplam = all.reduce((s, i) => s + i.tutar, 0);
    const gruplar = {};
    all.forEach((i) => {
      gruplar[i.kategori] = (gruplar[i.kategori] || 0) + i.tutar;
    });
    return Object.entries(gruplar).map(([name, value]) => ({
      name,
      value: toplam > 0 ? Math.round((value / toplam) * 100) : 0,
    }));
  }, [txItems, paymentItems]);

  const categoryTotalPages = Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE));
  const safeCategoryPage = Math.min(categoryPage, categoryTotalPages);
  const visibleCategories = categories.slice(
    (safeCategoryPage - 1) * CATEGORIES_PER_PAGE,
    safeCategoryPage * CATEGORIES_PER_PAGE
  );

  /* ============ KARTLAR ============ */
  const summaryCards = [
    {
      label: "Toplam Bakiye",
      value: formatTL(totalBalance),
      detail:
        totalBalance >= 0
          ? "↗ Pozitif bakiyedesiniz"
          : "↘ Negatif bakiyedesiniz",
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
      value: formatTL(txMonthlyIncome),
      detail: txMonthlyIncome > 0 ? "Gelir var" : "Henüz gelir yok",
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
      value: formatTL(monthlyExpense),
      detail: `${categories.length} Kategoride Harcama`,
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
      value: formatTL(saving),
      detail: `Hedefin %${savingPercent}'i tamamlandı`,
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
                  <span style={{ width: `${savingPercent}%` }} />
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
          </div>

          <div className="transactions-table">
            <div className="transactions-table-head">
              <span>Tarih</span>
              <span>Açıklama</span>
              <span>Kategori</span>
              <span>Tutar</span>
            </div>

            {recentTransactions.map((item) => (
              <div className="transactions-table-row" key={item.id}>
                <span>
                  {new Date(item.tarih).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <strong>{item.aciklama}</strong>
                <span>
                  <em
                    className={`category-badge category-badge-${
                      item.source === "payment" ? "purple" : "gray"
                    }`}
                  >
                    {item.kategori}
                    {item.source === "payment" && " (O.Ö)"}
                  </em>
                </span>
                <b
                  className={`transaction-amount ${
                    item.tur === "gelir" ? "positive" : "negative"
                  }`}
                >
                  {item.tur === "gelir" ? "+" : "-"}
                  {formatTL(item.tutar)}
                </b>
              </div>
            ))}

            {recentTransactions.length === 0 && (
              <p
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Henüz işlem bulunmuyor.
              </p>
            )}
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
              <strong>{formatTL(monthlyExpense)}</strong>
            </div>
          </div>

          <div className="category-list">
            {visibleCategories.map((cat) => (
              <div className="category-list-item" key={cat.name}>
                <div>
                  <span className="category-dot category-dot-blue" />
                  <p>{cat.name}</p>
                </div>
                <strong>%{cat.value}</strong>
              </div>
            ))}

            {categories.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  padding: "1rem",
                }}
              >
                Gider verisi yok
              </p>
            )}

            {categoryTotalPages > 1 && (
              <div className="category-pagination">
                <button
                  type="button"
                  disabled={safeCategoryPage === 1}
                  onClick={() => setCategoryPage((p) => p - 1)}
                >
                  ‹
                </button>
                <span>{safeCategoryPage} / {categoryTotalPages}</span>
                <button
                  type="button"
                  disabled={safeCategoryPage === categoryTotalPages}
                  onClick={() => setCategoryPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            )}
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
