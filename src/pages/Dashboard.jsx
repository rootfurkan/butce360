import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectUserMonthlyIncome,
  selectUserMonthlyExpense,
  selectUserTotalIncome,
  selectUserTotalExpense,
  selectUserTransactions,
} from "../features/transactions/transactionSlice";
import {
  selectUserMonthlyPaymentTotal,
  selectUserTotalPayment,
  selectUserPaymentsAsItems,
} from "../features/payments/paymentSlice";

const CATEGORIES_PER_PAGE = 3;
const SAVING_GOAL = 200000;

// para değerleri tl formatına çevrilir
const formatTL = (amount) => {
  return `₺${Math.abs(amount).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// kategori adına göre sabit renk üretilir
const getCategoryColor = (categoryName) => {
  let colorNumber = 0;

  for (let index = 0; index < categoryName.length; index += 1) {
    colorNumber += categoryName.charCodeAt(index) * (index + 1);
  }

  return `hsl(${colorNumber % 360}, 70%, 48%)`;
};

const Dashboard = () => {
  const userId = useSelector((state) => state.auth.currentUser?.id);
  const [categoryPage, setCategoryPage] = useState(1);

  const monthlyIncome = useSelector((state) =>
    selectUserMonthlyIncome(state, userId),
  );
  const monthlyTransactionExpense = useSelector((state) =>
    selectUserMonthlyExpense(state, userId),
  );
  const totalIncome = useSelector((state) =>
    selectUserTotalIncome(state, userId),
  );
  const totalTransactionExpense = useSelector((state) =>
    selectUserTotalExpense(state, userId),
  );

  const monthlyPaymentExpense = useSelector((state) =>
    selectUserMonthlyPaymentTotal(state, userId),
  );
  const totalPaymentExpense = useSelector((state) =>
    selectUserTotalPayment(state, userId),
  );
  const paymentTransactions = useSelector((state) =>
    selectUserPaymentsAsItems(state, userId),
  );

  const transactionItems = useSelector((state) =>
    selectUserTransactions(state, userId),
  )
    .filter((transaction) => transaction.tur === "gelir" || transaction.tur === "gider")
    .map((transaction) => ({ ...transaction, source: "transaction" }));

  // otomatik ödemeler ve işlemler birleştirilerek toplamlar hesaplanır
  const monthlyExpense = monthlyTransactionExpense + monthlyPaymentExpense;
  const totalExpense = totalTransactionExpense + totalPaymentExpense;
  const totalBalance = totalIncome - totalExpense;
  const savingAmount = totalBalance - monthlyExpense;
  const savingPercent = Math.min(100, Math.round((savingAmount / SAVING_GOAL) * 100));

  // son işlemler tarih sırasına göre ilk 5 kayıt olacak şekilde hazırlanır
  const recentTransactions = useMemo(() => {
    return [...transactionItems, ...paymentTransactions]
      .sort((firstItem, secondItem) => new Date(secondItem.tarih) - new Date(firstItem.tarih))
      .slice(0, 5);
  }, [transactionItems, paymentTransactions]);

  // giderler kategori bazında gruplanır ve yüzdelik değerleri hesaplanır
  const categoryList = useMemo(() => {
    const expenseItems = [
      ...transactionItems.filter((transaction) => transaction.tur === "gider"),
      ...paymentTransactions,
    ];

    const totalCategoryExpense = expenseItems.reduce(
      (total, item) => total + Number(item.tutar || 0),
      0,
    );

    const categoryTotals = {};

    expenseItems.forEach((item) => {
      categoryTotals[item.kategori] =
        (categoryTotals[item.kategori] || 0) + Number(item.tutar || 0);
    });

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      value: totalCategoryExpense > 0 ? Math.round((amount / totalCategoryExpense) * 100) : 0,
      color: getCategoryColor(name),
    }));
  }, [transactionItems, paymentTransactions]);

  const categoryTotalPages = Math.max(1, Math.ceil(categoryList.length / CATEGORIES_PER_PAGE));
  const safeCategoryPage = Math.min(categoryPage, categoryTotalPages);
  const visibleCategories = categoryList.slice(
    (safeCategoryPage - 1) * CATEGORIES_PER_PAGE,
    safeCategoryPage * CATEGORIES_PER_PAGE,
  );

  // kategori yüzdelerine göre pie chart arka planı oluşturulur
  const donutBackground = useMemo(() => {
    if (categoryList.length === 0) {
      return "#e9ecf6";
    }

    let startPercent = 0;
    const colorParts = categoryList.map((category) => {
      const endPercent = startPercent + category.value;
      const colorPart = `${category.color} ${startPercent}% ${endPercent}%`;
      startPercent = endPercent;
      return colorPart;
    });

    return `conic-gradient(${colorParts.join(", ")})`;
  }, [categoryList]);

  // üstteki özet kartlarında gösterilecek veriler hazırlanır
  const summaryCards = [
    {
      label: "Toplam Bakiye",
      value: formatTL(totalBalance),
      detail: totalBalance >= 0 ? "↗ Pozitif bakiyedesiniz" : "↘ Negatif bakiyedesiniz",
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
      value: formatTL(monthlyIncome),
      detail: monthlyIncome > 0 ? "Gelir var" : "Henüz gelir yok",
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
      detail: `${categoryList.length} kategoride harcama`,
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
      value: formatTL(savingAmount),
      detail: `Hedefin %${savingPercent}'i tamamlandı`,
      type: "saving",
      progress: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 11.5C7 8.46 9.46 6 12.5 6H15.5C17.43 6 19 7.57 19 9.5V15.5H16.5L15 18H10L8.5 15.5H6V13H4.5V10H6.2C6.55 9.1 7.1 8.32 7.8 7.7" />
          <path d="M15 9.5H15.01" />
          <path d="M19 11H21" />
        </svg>
      ),
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

          <div className="donut-chart" style={{ background: donutBackground }}>
            <div className="donut-center">
              <span>Toplam Gider</span>
              <strong>{formatTL(monthlyExpense)}</strong>
            </div>
          </div>

          <div className="category-list">
            {visibleCategories.map((category) => (
              <div className="category-list-item" key={category.name}>
                <div>
                  <span
                    className="category-dot"
                    style={{ background: category.color }}
                  />
                  <p>{category.name}</p>
                </div>
                <strong>%{category.value}</strong>
              </div>
            ))}

            {categoryList.length === 0 && (
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
                  onClick={() => setCategoryPage((page) => page - 1)}
                >
                  ‹
                </button>
                <span>
                  {safeCategoryPage} / {categoryTotalPages}
                </span>
                <button
                  type="button"
                  disabled={safeCategoryPage === categoryTotalPages}
                  onClick={() => setCategoryPage((page) => page + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <footer className="dashboard-footer">
        <p>© 2026 Bütçe360. Tüm Hakları Saklıdır.</p>

        <nav>
          <button type="button">Security</button>
          <button type="button">Privacy</button>
          <button type="button">Terms</button>
          <button type="button">Support</button>
        </nav>
      </footer>
    </section>
  );
};

export default Dashboard;
