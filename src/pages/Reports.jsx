import React, { useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  getCategoryReport,
  getMonthlyReport,
  getReportMonths,
  getUserTransactions,
} from "../features/transactions/transactionSlice";
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

// ay isimleri grafik ve tablo için kullanılır
const monthNames = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

const formatMoney = (amount) => {
  return `₺${amount.toLocaleString("tr-TR")}`;
};

const formatMonthName = (dateKey) => {
  const [year, month] = dateKey.split("-");
  return `${monthNames[Number(month) - 1]} ${year}`;
};

const formatShortMonthName = (dateKey) => {
  const [year, month] = dateKey.split("-");
  return `${monthNames[Number(month) - 1]} ${year.slice(2, 4)}`;
};

const Reports = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const transactions = useSelector((state) => state.transactions.transactions);

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [categoryPage, setCategoryPage] = useState(1);
  const [performancePage, setPerformancePage] = useState(1);

  // giriş yapan kullanıcının rapora girecek işlemleri hazırlanır
  const userId = currentUser?.id;
  const userTransactions = getUserTransactions(transactions, userId);
  const reportMonths = getReportMonths(userTransactions);
  const reportMonthsDesc = [...reportMonths].reverse();

  // aylık rapor verisi grafik ve tablo için hazırlanır
  const monthlyReport = getMonthlyReport(transactions, userId, reportMonths);
  const performanceReport = [...monthlyReport].reverse();

  const chartData = monthlyReport.map((item) => ({
    month: formatShortMonthName(item.month),
    gelir: item.income,
    gider: item.expense,
  }));

  // seçilen aya göre kategori dağılımı alınır
  const { categoryList, totalExpense } = getCategoryReport(
    transactions,
    userId,
    selectedMonth,
  );

  // kategori listesi sayfalama için bölünür
  const categoryPageCount = Math.ceil(categoryList.length / 5);
  const visibleCategories = categoryList.slice(
    (categoryPage - 1) * 5,
    categoryPage * 5,
  );

  // performans listesi sayfalama için bölünür
  const performancePageCount = Math.ceil(performanceReport.length / 5);
  const visiblePerformance = performanceReport.slice(
    (performancePage - 1) * 5,
    performancePage * 5,
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setCategoryPage(1);
  };

  // excel çıktısı için aylık rapor verisi hazırlanır
  const excelMonthlyData = monthlyReport.map((item) => ({
    Ay: formatMonthName(item.month),
    Gelir: item.income,
    Gider: item.expense,
    "Net Fark": item.balance,
  }));

  // excel dosyası iki ayrı sayfa olarak oluşturulur
  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const monthlySheet = XLSX.utils.json_to_sheet(excelMonthlyData);
    const categorySheet = XLSX.utils.json_to_sheet(excelCategoryData);

    XLSX.utils.book_append_sheet(workbook, monthlySheet, "Aylik Rapor");
    XLSX.utils.book_append_sheet(workbook, categorySheet, "Kategori Raporu");

    XLSX.writeFile(workbook, "butce360-rapor.xlsx");
  };

  // pdf çıktısı için türkçe destekli font tanıtılır
  const exportPdf = async () => {
    const doc = new jsPDF();

    const font = await fetch("/fonts/Roboto-Medium.ttf");
    const fontBuffer = await font.arrayBuffer();
    const fontBytes = new Uint8Array(fontBuffer);

    let fontBinary = "";
    fontBytes.forEach((byte) => {
      fontBinary += String.fromCharCode(byte);
    });

    const fontBase64 = btoa(fontBinary);

    doc.addFileToVFS("Roboto-Medium.ttf", fontBase64);
    doc.addFont("Roboto-Medium.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    doc.text("Bütçe360 Raporu", 14, 15);
    autoTable(doc, {
      startY: 25,
      styles: {
        font: "Roboto",
      },
      head: [["Ay", "Gelir", "Gider", "Net Fark"]],
      body: monthlyReport.map((item) => [
        formatMonthName(item.month),
        formatMoney(item.income),
        formatMoney(item.expense),
        formatMoney(item.balance),
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      styles: {
        font: "Roboto",
      },
      head: [["Kategori", "Tutar", "Yüzde"]],
      body: categoryList.map((item) => [
        item.name,
        formatMoney(item.value),
        `${Math.round(item.percent)}%`,
      ]),
    });

    doc.save("butce360-rapor.pdf");
  };

  // excel çıktısı için kategori rapor verisi hazırlanır
  const excelCategoryData = categoryList.map((item) => ({
    Kategori: item.name,
    Tutar: item.value,
    Yuzde: `${Math.round(item.percent)}%`,
  }));

  // grafik üzerine gelince gösterilecek tooltip hazırlanır
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="reports-chart-tooltip">
        <strong>{label}</strong>
        {payload.map((item) => (
          <p key={item.dataKey}>
            <span className={`tooltip-dot tooltip-dot-${item.dataKey}`} />
            {item.name}: {formatMoney(item.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="reports-page">
      <div className="reports-actions-row">
        <div className="reports-export-actions">
          <button
            type="button"
            className="report-primary-button"
            onClick={exportPdf}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 3.5H15L19 7.5V20.5H6V3.5Z" />
              <path d="M15 3.5V8H19" />
              <path d="M9 14H15" />
              <path d="M9 17H13" />
            </svg>
            PDF Dışa Aktar
          </button>

          <button
            type="button"
            className="report-light-button report-excel-button"
            onClick={exportExcel}
          >
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
            <BarChart data={chartData} barGap={10}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#5f6675", fontSize: 13, fontWeight: 500 }}
              />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(83, 74, 183, 0.04)" }}
              />
              <Bar
                dataKey="gelir"
                name="Gelir"
                fill="#36b58b"
                radius={[8, 8, 8, 8]}
                barSize={11}
              />
              <Bar
                dataKey="gider"
                name="Gider"
                fill="#df7656"
                radius={[8, 8, 8, 8]}
                barSize={11}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="reports-bottom-grid">
        <section className="reports-category-card">
          <div className="reports-category-top">
            <div>
              <h2>Giderler Kategori Dağılımı</h2>
            </div>

            <select
              className="reports-category-month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="all">Tüm Aylar</option>
              {reportMonthsDesc.map((dateKey) => (
                <option key={dateKey} value={dateKey}>
                  {formatMonthName(dateKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="reports-category-content">
            <div className="reports-pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryList}
                    innerRadius={62}
                    outerRadius={98}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryList.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="reports-pie-center">
                <strong>{formatMoney(totalExpense)}</strong>
                <span>Toplam</span>
              </div>
            </div>

            <div className="reports-category-list">
              {visibleCategories.map((item) => (
                <div className="reports-category-item" key={item.name}>
                  <div>
                    <span style={{ background: item.color }} />
                    <p>{item.name}</p>
                  </div>
                  <strong>{Math.round(item.percent)}%</strong>
                </div>
              ))}

              {categoryPageCount > 1 && (
                <div className="reports-category-pagination">
                  {Array.from({ length: categoryPageCount }).map((_, index) => (
                    <button
                      key={index + 1}
                      type="button"
                      className={`category-page-button ${categoryPage === index + 1 ? "active" : ""}`}
                      onClick={() => setCategoryPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
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

            {visiblePerformance.map((item) => (
              <div
                className={`performance-table-row ${item.balance < 0 ? "performance-table-row-negative" : ""}`}
                key={item.month}
              >
                <span>{formatMonthName(item.month)}</span>
                <strong>{formatMoney(item.income)}</strong>
                <b>{formatMoney(item.expense)}</b>
                <em>
                  {item.balance >= 0 ? "+" : "-"}
                  {formatMoney(Math.abs(item.balance))}
                </em>
              </div>
            ))}
          </div>

          {performancePageCount > 1 && (
            <div className="reports-category-pagination">
              {Array.from({ length: performancePageCount }).map((_, index) => (
                <button
                  key={index + 1}
                  type="button"
                  className={`category-page-button ${performancePage === index + 1 ? "active" : ""}`}
                  onClick={() => setPerformancePage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Reports;
