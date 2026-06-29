# Bütçe360

Bütçe360, kullanıcıların gelir-gider işlemlerini, otomatik ödeme talimatlarını, raporlarını ve yapay zeka destekli finans tahminlerini takip edebildiği React tabanlı bir bütçe yönetim uygulamasıdır.

## Kullanılan teknolojiler

| Teknoloji | Kullanım amacı |
| --- | --- |
| React | Sayfa ve component yapısını oluşturmak |
| Vite | Projeyi geliştirme ortamında çalıştırmak ve build almak |
| Redux Toolkit | Global state yönetimini daha düzenli yapmak |
| React Redux | React componentleri ile Redux state'i bağlamak |
| React Router DOM | Sayfa yönlendirme ve korumalı route yapısı kurmak |
| Tailwind CSS | Arayüz stillerini yönetmek |
| Recharts | Dashboard ve rapor grafiklerini göstermek |
| react-data-table-component | Kullanıcı listesi gibi tabloları göstermek |
| xlsx | Raporları Excel olarak dışa aktarmak |
| jsPDF / jspdf-autotable | Raporları PDF olarak dışa aktarmak |
| Hugging Face API | AI tahmin ve tasarruf önerileri almak |

## Mimari yapı

Projede sayfalar React componentleri ile oluşturulur. Ortak veriler Redux Toolkit slice dosyalarında tutulur. Başlangıç verileri JSON dosyalarından gelir, tarayıcı tarafında güncellenen bazı veriler localStorage içinde saklanır.

```txt
kullanıcı
   ↓
React sayfaları
   ↓
Redux action / selector
   ↓
Redux slice
   ↓
JSON data / localStorage / API
```

Redux store yapısı:

```js
{
  auth: authReducer,
  transactions: transactionReducer,
  payments: paymentReducer,
  aiForecast: aiForecastReducer
}
```

## Klasör yapısı

```txt
src
├── app
│   └── store.js
├── assets
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components
│   ├── ProtectedRoute.jsx
│   └── layout
│       ├── Header.jsx
│       ├── MainLayout.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
├── data
│   ├── payments.json
│   ├── transactions.json
│   └── users.json
├── features
│   ├── aiForecast
│   │   └── aiForecastSlice.js
│   ├── auth
│   │   └── authSlice.js
│   ├── payments
│   │   └── paymentSlice.js
│   └── transactions
│       └── transactionSlice.js
├── pages
│   ├── AddTransaction.jsx
│   ├── AiForecast.jsx
│   ├── AutoPayments.jsx
│   ├── Dashboard.jsx
│   ├── EditUser.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── Reports.jsx
│   └── Transactions.jsx
├── router
│   └── AppRouter.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Sayfa yapısı

| Sayfa | Görevi |
| --- | --- |
| Login | Kullanıcı girişi yapmak |
| Register | Yeni kullanıcı kaydı oluşturmak |
| Dashboard | Bakiye, gelir, gider, son işlemler ve kategori dağılımını göstermek |
| Transactions | Gelir-gider işlemlerini listelemek, filtrelemek ve silmek |
| AddTransaction | Yeni gelir veya gider eklemek |
| AutoPayments | Otomatik ödeme talimatlarını yönetmek |
| Reports | Aylık raporları, kategori dağılımını ve dışa aktarma işlemlerini göstermek |
| AiForecast | AI tahmini ve tasarruf önerilerini göstermek |
| Profile | Kullanıcı bilgilerini ve kullanıcı listesini yönetmek |

## Route yapısı

Giriş yapılmadan ana uygulama sayfalarına erişilemez. Bu kontrol `ProtectedRoute.jsx` ile yapılır.

```txt
public routes
├── /login
└── /register

protected routes
├── /dashboard
├── /transactions
├── /transactions/add
├── /auto-payments
├── /reports
├── /ai-forecast
├── /profile
└── /profile/users/:id/edit
```

## Slice yapısı

### authSlice

Kullanıcı girişi, çıkışı, kayıt olma, kullanıcı ekleme, kullanıcı güncelleme ve kullanıcı silme işlemlerini yönetir.

```js
{
  currentUser,
  users,
  isAuthenticated,
  error
}
```

### transactionSlice

Gelir-gider işlemlerini ve rapor hesaplamalarını yönetir. Dashboard, Transactions, Reports ve AiForecast sayfaları bu slice içindeki verileri kullanır.

Öne çıkan yardımcı fonksiyonlar:

```js
getUserTransactions()
getReportMonths()
getMonthlyReport()
getCategoryReport()
```

### paymentSlice

Otomatik ödeme talimatlarını yönetir. Aktif ödeme talimatları gerektiğinde işlem formatına çevrilerek diğer sayfalarda da kullanılabilir.

Örnek selector:

```js
selectUserPaymentsAsItems()
```

### aiForecastSlice

AI tahmin isteğini yönetir. API çağrısı `createAsyncThunk` ile yapılır ve dönen sonuç Redux state içine kaydedilir.

```js
{
  forecast,
  loading,
  error
}
```

## AI tahmin akışı

AI tahmin sayfasında ham JSON verisi doğrudan gönderilmez. Önce kullanıcının aylık raporu, kategori dağılımı ve otomatik ödemeleri özetlenir.

```txt
transactions.json / payments.json
        ↓
Redux selector ve helper fonksiyonlar
        ↓
monthlyReport, categoryList, fixedPayments
        ↓
aiData objesi
        ↓
Hugging Face API
        ↓
forecast state
        ↓
AiForecast.jsx kartları
```

API çağrısının kod akışı:

```txt
AiForecast.jsx
    dispatch(getAiForecast(aiData))
        ↓
aiForecastSlice.js
    createAsyncThunk
        ↓
https://router.huggingface.co/v1/chat/completions
        ↓
Redux forecast state güncellenir
```

## Ortam değişkenleri

AI tahmin özelliğinin çalışması için `.env` dosyasında Hugging Face token bulunmalıdır.

```env
VITE_HF_TOKEN=hf_xxxxxxxxxxxxxxxxx
```

İsteğe bağlı olarak model adı da tanımlanabilir.

```env
VITE_HF_MODEL=openai/gpt-oss-120b:cerebras
```

`.env` dosyası gizli tutulmalı ve GitHub'a gönderilmemelidir.

## Veri yönetimi

Başlangıç verileri bu dosyalardan gelir:

```txt
src/data/users.json
src/data/transactions.json
src/data/payments.json
```

Bu proje frontend tarafında çalıştığı için tarayıcıdan doğrudan JSON dosyalarına kalıcı yazma işlemi yapılmaz. Kayıt olan veya güncellenen bazı kullanıcı bilgileri localStorage üzerinde saklanır.

## Raporlama ve dışa aktarma

Reports sayfasında gelir-gider trendi, kategori dağılımı ve aylık performans tablosu bulunur. Bu veriler Excel veya PDF olarak dışa aktarılabilir.

```txt
monthlyReport + categoryList
        ↓
xlsx veya jsPDF
        ↓
excel / pdf dosyası
```

## Kurulum

Bağımlılıkları yüklemek için:

```bash
npm install
```

Projeyi geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Production build almak için:

```bash
npm run build
```

Build önizlemesi için:

```bash
npm run preview
```

## Genel çalışma mantığı

```txt
kullanıcı giriş yapar
        ↓
protected route kontrolü geçilir
        ↓
main layout açılır
        ↓
sayfalar Redux state üzerinden veri okur
        ↓
veriler userId alanına göre filtrelenir
        ↓
kullanıcı kendi finans verilerini görür
```

## Notlar

- Proje React ve Redux Toolkit mimarisiyle hazırlanmıştır.
- Kullanıcı bazlı veri gösterimi `userId` alanı üzerinden yapılır.
- Admin kullanıcı ayarlar sayfasında tüm kullanıcıları görebilir.
- Normal kullanıcı sadece kendi profilini düzenleyebilir.
- AI tahminleri Hugging Face API üzerinden alınır.
- JSON dosyaları başlangıç verisi olarak kullanılır, gerçek backend gibi davranmaz.

Demo Link : https://butce360.vercel.app/
