import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAiForecast } from "../features/aiForecast/aiForecastSlice";
import {
  getCategoryReport,
  getMonthlyReport,
  getReportMonths,
  getUserTransactions,
} from "../features/transactions/transactionSlice";

const formatMoney = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "-";
  return `₺${Number(amount).toLocaleString("tr-TR")}`;
};

// kategori tahmini için uygun ikon tipi seçilir
const getCategoryIconType = (type, index) => {
  if (type) return type;

  const iconTypes = ["kitchen", "transport", "entertainment"];
  return iconTypes[index % iconTypes.length];
};

const AiForecast = () => {
  const dispatch = useDispatch();

  const forecast = useSelector((state) => state.aiForecast.forecast);
  const loading = useSelector((state) => state.aiForecast.loading);
  const error = useSelector((state) => state.aiForecast.error);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const transactions = useSelector((state) => state.transactions.transactions);
  const payments = useSelector((state) => state.payments.payments);

  // ai analizi için kullanıcının finans özeti hazırlanır
  const userId = currentUser?.id;
  const userTransactions = getUserTransactions(transactions, userId);
  const reportMonths = getReportMonths(userTransactions);
  const monthlyReport = getMonthlyReport(transactions, userId, reportMonths);
  const { categoryList } = getCategoryReport(transactions, userId, "all");
  const userPayments = payments.filter(
    (payment) => payment.userId === userId && payment.aktif,
  );

  // thunk içine gönderilecek veri tek objede toplanır
  const aiData = {
    userName: currentUser?.name,
    monthlyReport,
    categoryList,
    fixedPayments: userPayments.map((payment) => ({
      title: payment.baslik || payment.title,
      company: payment.firma || payment.company,
      amount: Number(payment.tutar || payment.amount || 0),
      paymentDay: new Date(payment.sonOdemeTarihi).getDate(),
    })),
  };

  const handleAiForecast = () => {
    dispatch(getAiForecast(aiData));
  };

  // üstteki küçük tahmin kartları hazırlanır
  const predictionCards = [
    {
      title: "Sabit Giderler",
      value: formatMoney(forecast?.fixedExpense),
    },
    {
      title: "Değişken Giderler",
      value: formatMoney(forecast?.variableExpense),
    },
    {
      title: "Beklenmedik",
      value: formatMoney(forecast?.unexpectedExpense),
    },
  ];

  // analiz yapılmadığında kategori alanları boş gösterilir
  const categoryPredictions = forecast?.categoryPredictions?.length
    ? forecast.categoryPredictions
    : [
        { title: "-", estimate: null, currentAmount: null, percent: 0 },
        { title: "-", estimate: null, currentAmount: null, percent: 0 },
        { title: "-", estimate: null, currentAmount: null, percent: 0 },
      ];

  // ai öneri dönmezse öneri kartları boş değerle gösterilir
  const defaultSuggestions = [
    { title: "-", text: "-", button: "-", type: "subscription" },
    { title: "-", text: "-", button: "-", type: "limit" },
    { title: "-", text: "-", button: "-", type: "saving" },
  ];

  const suggestions = forecast?.suggestions?.length
    ? [...forecast.suggestions, ...defaultSuggestions].slice(0, 3)
    : defaultSuggestions;

  const confidenceText = forecast?.confidence
    ? `%${forecast.confidence} Güven Aralığı`
    : "-";

  const changeText =
    forecast?.changeRate !== undefined && forecast?.changeRate !== null
      ? `${forecast.changeRate > 0 ? "+" : ""}%${forecast.changeRate}`
      : "-";

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
            <p>
              {forecast?.projectionText ||
                "Analiz başlatıldığında harcama alışkanlıklarınıza göre projeksiyon hazırlanır."}
            </p>
          </div>

          <div className="ai-header-actions">
            <button
              type="button"
              className="ai-analyze-button"
              onClick={handleAiForecast}
              disabled={loading}
            >
              {loading ? "Analiz ediliyor..." : "Analiz Et"}
            </button>

            <div className="ai-confidence">
              <span>{confidenceText}</span>
              <p>
                Geçen aya göre <strong>{changeText}</strong>
              </p>
            </div>
          </div>
        </div>

        {error && <p className="profile-field-error">{error}</p>}

        <div className="ai-main-estimate">
          <strong>{formatMoney(forecast?.nextMonthExpense)}</strong>
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
          </div>

          <div className="category-prediction-list">
            {categoryPredictions.map((item, index) => {
              const iconType = getCategoryIconType(item.type, index);
              const percent = item.percent || 0;
              const status = item.status || "normal";

              return (
                <article className="category-prediction-item" key={`${item.title}-${index}`}>
                  <div className={`category-prediction-icon ${iconType}`}>
                    {iconType === "kitchen" && (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M6 6H7.5L9 15H17.5L19 8H8" />
                        <path d="M10 19.5H10.01" />
                        <path d="M17 19.5H17.01" />
                      </svg>
                    )}

                    {iconType === "transport" && (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M6 11L8 6H16L18 11" />
                        <path d="M5 11H19V17H5V11Z" />
                        <path d="M8 17V19" />
                        <path d="M16 17V19" />
                        <path d="M8 14H8.01" />
                        <path d="M16 14H16.01" />
                      </svg>
                    )}

                    {iconType === "entertainment" && (
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
                        <h3>{item.title || "-"}</h3>
                        <p>Tahmin: {formatMoney(item.estimate)}</p>
                      </div>

                      <strong className={status}>
                        {formatMoney(item.currentAmount)} / {formatMoney(item.estimate)}
                      </strong>
                    </div>

                    <div className={`category-progress category-progress-${status}`}>
                      <span style={{ width: `${Math.min(100, percent)}%` }} />
                    </div>

                    {item.warning && <em>{item.warning}</em>}
                  </div>
                </article>
              );
            })}
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

          <p>{forecast?.trendText || "-"}</p>

          <div className="trend-saving-box">
            {forecast ? (
              <>
                Ay sonunda <strong>{formatMoney(forecast.savingAmount)} tasarruf</strong>{" "}
                potansiyeli görünüyor.
              </>
            ) : (
              "-"
            )}
          </div>

          <button type="button" onClick={handleAiForecast} disabled={loading}>
            {loading ? "Analiz ediliyor..." : "Detaylı Analiz Al"}
          </button>
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
          {suggestions.map((item, index) => (
            <article className="ai-suggestion-card" key={`${item.title}-${index}`}>
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

              <h3>{item.title || "-"}</h3>
              <p>{item.text || "-"}</p>

              <button type="button">
                {item.button || "-"}
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
