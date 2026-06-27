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
  );
  const paymentItems = useSelector((state) =>
    selectUserPaymentsAsItems(state, userId)
  );

  const allItems = useMemo(
    () =>
      [...txItems, ...paymentItems].sort(
        (a, b) => new Date(b.tarih) - new Date(a.tarih)
      ),
    [txItems, paymentItems]
  );

  const categories = [...new Set(allItems.map((i) => i.kategori))];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = allItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
    setCurrentPage(1);
  };

  return (
    <section className="transactions-page">
      <div className="transactions-filter-card">
        <div className="filter-group">
          <span>Tarih Aralığı:</span>
          <input
            type="date"
            value={filter.baslangic}
            onChange={(e) => handleFilterChange("baslangic", e.target.value)}
          />
          <span>-</span>
          <input
            type="date"
            value={filter.bitis}
            onChange={(e) => handleFilterChange("bitis", e.target.value)}
          />
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
            {categories.map((cat) => (
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
          <span></span>
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
                    onClick={() => dispatch(deleteTransaction(item.id))}
                  >
                    Sil
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
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
    </section>
  );
}
