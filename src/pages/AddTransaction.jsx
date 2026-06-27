import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTransaction } from "../features/transactions/transactionSlice";

const AddTransactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.currentUser?.id);

  const [activeType, setActiveType] = useState("income");
  const [activeCategory, setActiveCategory] = useState("salary");
  const [activePaymentMethod, setActivePaymentMethod] = useState("cash");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", type: "success" }), 2500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  const isIncome = activeType === "income";
  const isOtherCategory =
    activeCategory === "otherIncome" || activeCategory === "otherExpense";

  const kategoriAdi = {
    salary: "Maaş",
    rentIncome: "Kira Geliri",
    sale: "Satış",
    otherIncome: "Diğer",
    market: "Market",
    transport: "Ulaşım",
    bill: "Fatura",
    otherExpense: "Diğer",
  };

  const incomeCategories = [
    {
      title: "Maaş",
      type: "salary",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 8H18V18H6V8Z" />
          <path d="M9 8V6H15V8" />
          <path d="M9 12H15" />
        </svg>
      ),
    },
    {
      title: "Kira Geliri",
      type: "rentIncome",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 11L12 5L19 11" />
          <path d="M7 10.5V19H17V10.5" />
          <path d="M10 19V14H14V19" />
        </svg>
      ),
    },
    {
      title: "Satış",
      type: "sale",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 8H18V18H6V8Z" />
          <path d="M9 8V6H15V8" />
          <path d="M9 13H15" />
        </svg>
      ),
    },
    {
      title: "Diğer",
      type: "otherIncome",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12H5.01" />
          <path d="M12 12H12.01" />
          <path d="M19 12H19.01" />
        </svg>
      ),
    },
  ];

  const expenseCategories = [
    {
      title: "Market",
      type: "market",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 6H7.5L9 15H17.5L19 8H8" />
          <path d="M10 19.5H10.01" />
          <path d="M17 19.5H17.01" />
        </svg>
      ),
    },
    {
      title: "Ulaşım",
      type: "transport",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 11L8 6H16L18 11" />
          <path d="M5 11H19V17H5V11Z" />
          <path d="M8 17V19" />
          <path d="M16 17V19" />
          <path d="M8 14H8.01" />
          <path d="M16 14H16.01" />
        </svg>
      ),
    },
    {
      title: "Fatura",
      type: "bill",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 4H17V20L15 18.5L13 20L11 18.5L9 20L7 18.5V4Z" />
          <path d="M10 9H14" />
          <path d="M10 13H14" />
        </svg>
      ),
    },
    {
      title: "Diğer",
      type: "otherExpense",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 12H5.01" />
          <path d="M12 12H12.01" />
          <path d="M19 12H19.01" />
        </svg>
      ),
    },
  ];

  const paymentMethods = [
    {
      title: "Nakit",
      type: "cash",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 7H19.5V17H4.5V7Z" />
          <path d="M8 12H16" />
          <path d="M9 15H12" />
        </svg>
      ),
    },
    {
      title: "Kredi Kartı",
      type: "creditCard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.5 7H19.5V17H4.5V7Z" />
          <path d="M4.5 10H19.5" />
        </svg>
      ),
    },
    {
      title: "Havale/EFT",
      type: "bankTransfer",
      icon: (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 10L12 5L20 10" />
          <path d="M6 10V18" />
          <path d="M10 10V18" />
          <path d="M14 10V18" />
          <path d="M18 10V18" />
          <path d="M4 18H20" />
        </svg>
      ),
    },
  ];

  const categories = isIncome ? incomeCategories : expenseCategories;

  const getKategori = () => {
    if (isOtherCategory) return "Diğer";
    return kategoriAdi[activeCategory] || "Diğer";
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setActiveCategory(type === "income" ? "salary" : "market");
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount.replace(",", ".")) <= 0) {
      setToast({ message: "İşlem gerçekleşmedi. Geçerli bir tutar giriniz.", type: "error" });
      return;
    }
    if (!description.trim()) {
      setToast({ message: "İşlem gerçekleşmedi. Açıklama alanı boş bırakılamaz.", type: "error" });
      return;
    }

    dispatch(
      addTransaction({
        userId: userId || "u1",
        tur: isIncome ? "gelir" : "gider",
        kategori: getKategori(),
        tutar: parseFloat(amount.replace(",", ".")),
        aciklama: description.trim(),
        tarih: date,
      })
    );

    setToast({ message: `${isIncome ? "Gelir" : "Gider"} başarıyla eklendi.`, type: "success" });

    setTimeout(() => navigate("/transactions"), 1500);
  };

  return (
    <section className="add-transaction-page">
      {toast.message && <div className={`profile-toast${toast.type === "error" ? " error" : ""}`}>{toast.message}</div>}
      <div className="add-transaction-card">
        <div className="add-transaction-tabs">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={isIncome ? "active income" : ""}
          >
            Gelir Ekle
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={!isIncome ? "active expense" : ""}
          >
            Gider Ekle
          </button>
        </div>

        <div className="add-transaction-main-grid">
          <div className="add-transaction-left">
            <div className="add-transaction-amount">
              <span className={isIncome ? "income" : "expense"}>₺</span>

              <div className="amount-input-area">
                <label>İşlem Tutarı</label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div
              className={
                isIncome
                  ? "amount-divider income"
                  : "amount-divider expense"
              }
            />

            <div className="add-transaction-row">
              <div className="add-transaction-field">
                <label>İşlem Tarihi</label>

                <div className="add-transaction-input">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 3V6" />
                    <path d="M17 3V6" />
                    <path d="M4.5 9H19.5" />
                    <path d="M5.5 5.5H18.5C19.05 5.5 19.5 5.95 19.5 6.5V18.5C19.5 19.05 19.05 19.5 18.5 19.5H5.5C4.95 19.5 4.5 19.05 4.5 18.5V6.5C4.5 5.95 4.95 5.5 5.5 5.5Z" />
                  </svg>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-transaction-field">
                <label>Açıklama</label>

                <div className="add-transaction-input">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 8H19" />
                    <path d="M5 12H15" />
                    <path d="M5 16H12" />
                  </svg>

                  <input
                    type="text"
                    placeholder="Harcama detayını yazın..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="add-category-area">
              <label>Kategori Seçin</label>

              <div className="add-category-grid">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.type}
                    onClick={() => setActiveCategory(category.type)}
                    className={
                      activeCategory === category.type
                        ? `add-category-option active ${isIncome ? "income" : "expense"}`
                        : `add-category-option ${isIncome ? "income-mode" : "expense-mode"}`
                    }
                  >
                    <span>{category.icon}</span>
                    <strong>{category.title}</strong>
                  </button>
                ))}
              </div>

              {isOtherCategory && (
                <div className="other-category-input-area">
                  <label>Özel Kategori Adı</label>

                  <div className="add-transaction-input">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 7H20" />
                      <path d="M4 12H16" />
                      <path d="M4 17H12" />
                    </svg>

                    <input
                      type="text"
                      placeholder={
                        isIncome
                          ? "Gelir kategorisi yazın..."
                          : "Gider kategorisi yazın..."
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="add-transaction-side">
            <div className="add-payment-area">
              <label>Ödeme Yöntemi</label>

              <div className="add-payment-grid">
                {paymentMethods.map((method) => (
                  <button
                    type="button"
                    key={method.type}
                    onClick={() => setActivePaymentMethod(method.type)}
                    className={
                      activePaymentMethod === method.type
                        ? "add-payment-option active"
                        : "add-payment-option"
                    }
                  >
                    {method.icon}
                    <span>{method.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="transaction-preview-card">
              <span>İşlem Tipi</span>
              <strong className={isIncome ? "income" : "expense"}>
                {isIncome ? "Gelir" : "Gider"}
              </strong>
              <p>
                Seçtiğiniz kategori ve ödeme yöntemiyle işlem kaydı
                oluşturmaya hazırsınız.
              </p>
            </div>

            <div className="add-transaction-actions">
              <button
                type="button"
                className="add-cancel-button"
                onClick={() => navigate("/transactions")}
              >
                İptal
              </button>

              <button
                type="button"
                className="add-save-button"
                onClick={handleSave}
              >
                Kaydet
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AddTransactions;
