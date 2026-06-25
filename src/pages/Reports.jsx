import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  const trendData = [
    { month: "Eki", gelir: 42000, gider: 33000 },
    { month: "Kas", gelir: 45000, gider: 36000 },
    { month: "Ara", gelir: 52000, gider: 46000 },
    { month: "Oca", gelir: 39000, gider: 31000 },
    { month: "Şub", gelir: 43000, gider: 35000 },
    { month: "Mar", gelir: 48000, gider: 38000 },
    { month: "Nis", gelir: 40000, gider: 49000 },
    { month: "May", gelir: 47000, gider: 37000 },
    { month: "Haz", gelir: 52000, gider: 42000 },
    { month: "Tem", gelir: 49000, gider: 40000 },
    { month: "Ağu", gelir: 46000, gider: 36000 },
    { month: "Eyl", gelir: 55000, gider: 43000 },
  ];

  const categoryData = [
    { name: "Konut", value: 35, color: "#4330ad" },
    { name: "Market", value: 22, color: "#1d7898" },
    { name: "Eğlence", value: 15, color: "#5b4cc4" },
    { name: "Diğer", value: 28, color: "#d7d7e3" },
  ];

  const performanceData = [
    {
      month: "Eylül",
      income: "₺52,400.00",
      expense: "₺42,150.00",
      difference: "+₺10,250",
    },
    {
      month: "Ağustos",
      income: "₺48,200.00",
      expense: "₺39,800.00",
      difference: "+₺8,400",
    },
    {
      month: "Temmuz",
      income: "₺49,150.00",
      expense: "₺41,200.00",
      difference: "+₺7,950",
    },
    {
      month: "Haziran",
      income: "₺47,000.00",
      expense: "₺45,500.00",
      difference: "+₺1,500",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="reports-chart-tooltip">
        <strong>{label}</strong>
        {payload.map((item) => (
          <p key={item.dataKey}>
            <span className={`tooltip-dot tooltip-dot-${item.dataKey}`} />
            {item.name}: ₺{item.value.toLocaleString("tr-TR")}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="reports-page">
      <div className="reports-actions-row">
        <div className="reports-filter-actions">
          <button type="button" className="report-light-button">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 3V6" />
              <path d="M17 3V6" />
              <path d="M4.5 9H19.5" />
              <path d="M5.5 5.5H18.5C19.05 5.5 19.5 5.95 19.5 6.5V18.5C19.5 19.05 19.05 19.5 18.5 19.5H5.5C4.95 19.5 4.5 19.05 4.5 18.5V6.5C4.5 5.95 4.95 5.5 5.5 5.5Z" />
            </svg>
            Son 12 Ay
          </button>

          <button type="button" className="report-light-button">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20" />
              <path d="M7 12H17" />
              <path d="M10 18H14" />
            </svg>
            Filtrele
          </button>
        </div>

        <div className="reports-export-actions">
          <button type="button" className="report-primary-button">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 3.5H15L19 7.5V20.5H6V3.5Z" />
              <path d="M15 3.5V8H19" />
              <path d="M9 14H15" />
              <path d="M9 17H13" />
            </svg>
            PDF Dışa Aktar
          </button>

          <button type="button" className="report-light-button report-excel-button">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 4H19V20H5V4Z" />
              <path d="M8 8H16" />
              <path d="M8 12H16" />
              <path d="M8 16H13" />
            </svg>
            Excel İndir
          </button>
        </div>
      </div>

      <section className="reports-trend-card">
        <div className="report-card-header">
          <div>
            <h2>Gelir vs Gider Trendi</h2>
            <p>Son 12 aylık finansal performans karşılaştırması</p>
          </div>

          <div className="report-chart-legend">
            <span>
              <i className="legend-dot-income" />
              Gelir
            </span>
            <span>
              <i className="legend-dot-expense" />
              Gider
            </span>
          </div>
        </div>

        <div className="reports-bar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} barGap={10}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#5f6675", fontSize: 13, fontWeight: 500 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(83, 74, 183, 0.04)" }} />
              <Bar dataKey="gelir" name="Gelir" fill="#36b58b" radius={[8, 8, 8, 8]} barSize={11} />
              <Bar dataKey="gider" name="Gider" fill="#df7656" radius={[8, 8, 8, 8]} barSize={11} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="reports-bottom-grid">
        <section className="reports-category-card">
          <div className="reports-category-top">
            <h2>Kategori Dağılımı</h2>

            <button type="button">
              Eylül 2024
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" />
              </svg>
            </button>
          </div>

          <div className="reports-category-content">
            <div className="reports-pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={48}
                    outerRadius={76}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="reports-pie-center">
                <strong>₺42k</strong>
                <span>Toplam</span>
              </div>
            </div>

            <div className="reports-category-list">
              {categoryData.map((item) => (
                <div className="reports-category-item" key={item.name}>
                  <div>
                    <span style={{ background: item.color }} />
                    <p>{item.name}</p>
                  </div>
                  <strong>%{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reports-performance-card">
          <h2>Aylık Performans Özeti</h2>

          <div className="performance-table">
            <div className="performance-table-head">
              <span>Ay</span>
              <span>Gelir</span>
              <span>Gider</span>
              <span>Net Fark</span>
            </div>

            {performanceData.map((item) => (
              <div className="performance-table-row" key={item.month}>
                <span>{item.month}</span>
                <strong>{item.income}</strong>
                <b>{item.expense}</b>
                <em>{item.difference}</em>
              </div>
            ))}
          </div>

          <button type="button" className="performance-view-all">
            Tümünü Görüntüle
            <span>→</span>
          </button>
        </section>
      </div>
    </section>
  );
};

export default Reports;
