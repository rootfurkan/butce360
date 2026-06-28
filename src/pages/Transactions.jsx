import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredTransactions,
  deleteTransaction,
  setFilter,
  resetFilter,
} from "../features/transactions/transactionSlice";
import { selectUserPaymentsAsItems } from "../features/payments/paymentSlice";

const ITEMS_PER_PAGE = 10;

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

const formatDateText = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTL = (v) =>
  `${Math.abs(v).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
  })} ₺`;

export default function Transactions() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.currentUser?.id);
  const filter = useSelector((state) => state.transactions.filter);

  const txItems = useSelector((state) =>
    selectFilteredTransactions(state, userId)
  ).map((item) => ({ ...item, source: "transaction" }));
  const paymentItems = useSelector((state) =>
    selectUserPaymentsAsItems(state, userId)
  );

  const allCategories = useMemo(() => {
    const all = [...txItems, ...paymentItems];
    return [...new Set(all.map((i) => i.kategori))];
  }, [txItems, paymentItems]);

  const allItems = useMemo(() => {
    let items = [...txItems, ...paymentItems];
    if (filter.kategori !== "hepsi") {
      items = items.filter((i) => i.kategori === filter.kategori);
    }
    if (filter.tur !== "hepsi") {
      items = items.filter((i) => i.tur === filter.tur);
    }
    if (filter.baslangic) {
      items = items.filter((i) => i.tarih >= filter.baslangic);
    }
    if (filter.bitis) {
      items = items.filter((i) => i.tarih <= filter.bitis);
    }
    return items.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
  }, [txItems, paymentItems, filter.kategori, filter.tur, filter.baslangic, filter.bitis]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showDateModal, setShowDateModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginationItems = getPaginationItems(safePage, totalPages);
  const pageItems = allItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
    setCurrentPage(1);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTransaction(transactionToDelete.id));
    setTransactionToDelete(null);
  };

  const dateRangeText =
    filter.baslangic && filter.bitis
      ? `${formatDateText(filter.baslangic)} - ${formatDateText(filter.bitis)}`
      : "Tarih seçin";

  return (
    <section className="transactions-page">
      <div className="transactions-filter-card">
        <div className="filter-group filter-date-range">
          <span className="filter-label">Tarih Aralığı:</span>

          <div className="date-range-wrapper">
            <button
              type="button"
              className="date-range-button"
              onClick={() => setShowDateModal(!showDateModal)}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 3V6" />
                <path d="M17 3V6" />
                <path d="M4.5 9H19.5" />
                <path d="M5.5 5.5H18.5C19.05 5.5 19.5 5.95 19.5 6.5V18.5C19.5 19.05 19.05 19.5 18.5 19.5H5.5C4.95 19.5 4.5 19.05 4.5 18.5V6.5C4.5 5.95 4.95 5.5 5.5 5.5Z" />
              </svg>
              <strong>{dateRangeText}</strong>
            </button>

            {showDateModal && (
              <div className="date-range-modal">
                <label>
                  <span>Başlangıç Tarihi</span>
                  <input
                    type="date"
                    value={filter.baslangic}
                    onChange={(e) => handleFilterChange("baslangic", e.target.value)}
                  />
                </label>

                <label>
                  <span>Bitiş Tarihi</span>
                  <input
                    type="date"
                    value={filter.bitis}
                    onChange={(e) => handleFilterChange("bitis", e.target.value)}
                  />
                </label>

                <button type="button" onClick={() => setShowDateModal(false)}>
                  Uygula
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="filter-group">
          <span>Tür:</span>
          <select
            value={filter.tur}
            onChange={(e) => handleFilterChange("tur", e.target.value)}
            className="filter-select-button"
          >
            <option value="hepsi">Hepsi</option>
            <option value="gelir">Gelir</option>
            <option value="gider">Gider</option>
          </select>
        </div>

        <div className="filter-group">
          <span>Kategori:</span>
          <select
            value={filter.kategori}
            onChange={(e) => handleFilterChange("kategori", e.target.value)}
            className="filter-select-button"
          >
            <option value="hepsi">Tüm Kategoriler</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="filter-action-button"
          onClick={() => {
            dispatch(resetFilter());
            setCurrentPage(1);
            setShowDateModal(false);
          }}
        >
          Sıfırla
        </button>
      </div>

      <div className="transactions-list-card">
        <div className="transactions-list-head">
          <span>Tarih</span>
          <span>Açıklama</span>
          <span>Kategori</span>
          <span>Tür</span>
          <span>Tutar</span>
          <span>İşlem</span>
        </div>

        <div className="transactions-list-body">
          {pageItems.map((item) => (
            <div className="transactions-list-row" key={item.id}>
              <div className="transaction-date">
                {new Date(item.tarih).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div className="transaction-description">
                <strong>{item.aciklama}</strong>
                {item.source === "payment" && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#a78bfa",
                      marginLeft: 6,
                    }}
                  >
                    (Otomatik Ödeme)
                  </span>
                )}
              </div>

              <div className="transaction-category">
                <span>{item.kategori}</span>
              </div>

              <div>
                <span
                  className={`transaction-type ${
                    item.tur === "gelir" ? "income" : "expense"
                  }`}
                >
                  {item.tur === "gelir" ? "GELİR" : "GİDER"}
                </span>
              </div>

              <div
                className={`transaction-list-amount ${
                  item.tur === "gelir" ? "income" : "expense"
                }`}
              >
                <strong>
                  {item.tur === "gelir" ? "+" : "-"}
                  {formatTL(item.tutar)}
                </strong>
              </div>

              <div>
                {item.source === "transaction" && (
                  <button
                    type="button"
                    className="btn-table-action-danger"
                    aria-label="İşlemi sil"
                    onClick={() => setTransactionToDelete(item)}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 7H18" />
                      <path d="M9 7V5H15V7" />
                      <path d="M9 10V18" />
                      <path d="M15 10V18" />
                      <path d="M8 7L8.6 20H15.4L16 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {allItems.length === 0 && (
            <p
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              İşlem bulunamadı.
            </p>
          )}
        </div>

        <div className="transactions-pagination">
          <p className="transactions-count">
            {allItems.length
              ? `${(safePage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                  safePage * ITEMS_PER_PAGE,
                  allItems.length
                )}`
              : "0-0"}{" "}
            / {allItems.length} işlem gösteriliyor
          </p>

          <div className="pagination-buttons">
            <button
              type="button"
              className="pagination-arrow"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              ‹
            </button>

            {paginationItems.map((page, index) =>
              page === "..." ? (
                <span className="pagination-dots" key={`dots-${index}`}>
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  className={`pagination-number ${
                    safePage === page ? "active" : ""
                  }`}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              className="pagination-arrow"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {transactionToDelete && (
        <div className="profile-modal-backdrop">
          <div className="profile-delete-modal">
            <h2>İşlem Silme Onayı</h2>
            <p>
              <strong>{transactionToDelete.aciklama}</strong> isimli işlemi
              silmek istediğinize emin misiniz?
            </p>

            <div className="profile-modal-actions">
              <button type="button" className="profile-modal-delete" onClick={handleConfirmDelete}>
                Evet, Sil
              </button>

              <button
                type="button"
                className="profile-modal-cancel"
                onClick={() => setTransactionToDelete(null)}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
