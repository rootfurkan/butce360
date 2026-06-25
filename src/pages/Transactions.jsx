import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const transactions = [
  { id: 1, dateValue: "2024-01-15", date: "15 Oca\n2024", description: "Migros Market\nAlışverişi", category: "Market", categoryType: "market", type: "GİDER", amount: "-1.240,50 ₺", amountType: "expense" },
  { id: 2, dateValue: "2024-01-05", date: "05 Oca\n2024", description: "Aylık Maaş Ödemesi", category: "Maaş", categoryType: "salary", type: "GELİR", amount: "+42.000,00\n₺", amountType: "income" },
  { id: 3, dateValue: "2024-01-02", date: "02 Oca\n2024", description: "Ev Kirası - Ocak", category: "Kira", categoryType: "rent", type: "GİDER", amount: "-15.500,00 ₺", amountType: "expense" },
  { id: 4, dateValue: "2024-01-01", date: "01 Oca\n2024", description: "Netflix Aboneliği", category: "Eğlence", categoryType: "entertainment", type: "GİDER", amount: "-149,90 ₺", amountType: "expense" },
  { id: 5, dateValue: "2023-12-30", date: "30 Ara\n2023", description: "Shell Akaryakıt", category: "Ulaşım", categoryType: "transport", type: "GİDER", amount: "-1.850,00 ₺", amountType: "expense" },
];

const CategoryIcon = ({ type }) => {
  const icons = { market: "🛒", salary: "₺", rent: "⌂", entertainment: "▶", transport: "◉" };
  return <span className={`transaction-category-icon ${type}`}>{icons[type]}</span>;
};

export default function Transactions() {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categories = [...new Set(transactions.map((transaction) => transaction.category))];

  const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = transactions.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <section className="transactions-page">
      <div className="transactions-filter-card">
        <div className="filter-group filter-date">
          <span>Tarih Aralığı:</span>
          <div className="date-filter-wrapper">
            <button type="button" className="filter-select-button" aria-expanded={isDatePickerOpen} aria-controls="date-range-picker" onClick={() => setIsDatePickerOpen((open) => !open)}>
              <span aria-hidden="true">▣</span>
              <strong>01 Oca 2024 - 31 Oca 2024</strong>
            </button>
            {isDatePickerOpen && (
              <div className="date-range-popover" id="date-range-picker">
                <label>Başlangıç<input type="date" defaultValue="2024-01-01" /></label>
                <label>Bitiş<input type="date" defaultValue="2024-01-31" /></label>
                <button type="button" onClick={() => setIsDatePickerOpen(false)}>Uygula</button>
              </div>
            )}
          </div>
        </div>

        <div className="filter-group filter-category">
          <span>Kategori:</span>
          <select className="filter-select-button filter-category-select" defaultValue="all" aria-label="Kategori seçin">
            <option value="all">Tüm Kategoriler</option>
            {categories.map((category) => <option value={category} key={category}>{category}</option>)}
          </select>
        </div>

        <button type="button" className="filter-action-button">Filtrele</button>
        <button type="button" className="export-action-button">Dışa Aktar</button>
      </div>

      <div className="transactions-list-card">
        <div className="transactions-list-head"><span>Tarih</span><span>Açıklama</span><span>Kategori</span><span>Tür</span><span>Tutar</span></div>
        <div className="transactions-list-body">
          {pageItems.map((transaction) => (
            <div className="transactions-list-row" key={transaction.id}>
              <div className="transaction-date">{transaction.date.split("\n").map((line) => <span key={line}>{line}</span>)}</div>
              <div className="transaction-description">{transaction.description.split("\n").map((line) => <strong key={line}>{line}</strong>)}</div>
              <div className="transaction-category"><CategoryIcon type={transaction.categoryType} /><span>{transaction.category}</span></div>
              <div><span className={`transaction-type ${transaction.amountType}`}>{transaction.type}</span></div>
              <div className={`transaction-list-amount ${transaction.amountType}`}>{transaction.amount.split("\n").map((line) => <strong key={line}>{line}</strong>)}</div>
            </div>
          ))}
        </div>

        <div className="transactions-pagination">
          <p className="transactions-count">{transactions.length ? `${(safePage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(safePage * ITEMS_PER_PAGE, transactions.length)}` : "0-0"} / {transactions.length} işlem gösteriliyor</p>
          <div className="pagination-buttons">
            <button type="button" className="pagination-arrow" aria-label="Önceki sayfa" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>‹</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" className={`pagination-number ${safePage === page ? "active" : ""}`} aria-current={safePage === page ? "page" : undefined} key={page} onClick={() => setCurrentPage(page)}>{page}</button>)}
            <button type="button" className="pagination-arrow" aria-label="Sonraki sayfa" disabled={safePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
