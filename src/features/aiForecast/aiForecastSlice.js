import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const getJsonFromText = (text) => {
  const cleanText = text.replace(/```json|```/g, '').trim()
  const firstBrace = cleanText.indexOf('{')
  const lastBrace = cleanText.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('AI cevabı JSON formatında değil.')
  }

  return cleanText.slice(firstBrace, lastBrace + 1)
}

export const getAiForecast = createAsyncThunk(
  'aiForecast/getAiForecast',
  async (aiData, thunkAPI) => {
    try {
      const token = import.meta.env.VITE_HF_TOKEN

      if (!token) {
        return thunkAPI.rejectWithValue('Hugging Face token bulunamadı. .env dosyasını kontrol edin.')
      }

      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_HF_MODEL || 'openai/gpt-oss-120b:cerebras',
          messages: [
            {
              role: 'system',
              content: 'Sen bir bütçe analiz asistanısın. Sadece geçerli JSON formatında cevap ver.',
            },
            {
              role: 'user',
              content: `
Aşağıdaki finans verilerini analiz et.

Sadece şu JSON formatında cevap ver:
{
  "projectionText": "Harcama alışkanlıklarınıza dayanarak gelecek ay projeksiyonu.",
  "confidence": 85,
  "changeRate": -4.2,
  "nextMonthExpense": 7200,
  "fixedExpense": 4500,
  "variableExpense": 2100,
  "unexpectedExpense": 600,
  "categoryPredictions": [
    {
      "title": "Market",
      "estimate": 1800,
      "currentAmount": 1240,
      "percent": 72,
      "type": "kitchen",
      "status": "normal",
      "warning": ""
    }
  ],
  "trendText": "Harcama hızınız geçen aya göre yavaşladı.",
  "savingAmount": 400,
  "savingText": "Ay sonunda tasarruf potansiyeli görünüyor.",
  "suggestions": [
    {
      "title": "Birikime Ayır",
      "text": "Bu ay 1200 TL kârdasınız. Bu tutarın 700 TL kısmını birikim hesabına aktarabilirsiniz.",
      "button": "Uygula",
      "type": "saving"
    }
  ]
}

Kurallar:
- categoryPredictions en fazla 3 eleman olsun.
- suggestions tam 3 eleman olsun.
- suggestions kullanıcının harcama verilerine göre kişisel öneriler içersin.
- suggestions içinde genel tavsiye verme, mutlaka tutar veya kategori adı kullan.
- suggestions örnekleri: "Bu ay 1200 TL kârdasınız, 700 TL birikime ayırabilirsiniz." veya "Market harcamanız arttığı için gelecek ay 500 TL limit koyabilirsiniz."
- suggestions type alanı sadece subscription, limit veya saving olabilir.
- suggestions button alanı kısa olsun: "Uygula", "Limit Koy", "İncele" gibi.
- Para değerlerini sayı olarak gönder.
- type alanı sadece kitchen, transport veya entertainment olabilir.
- status alanı normal veya danger olabilir.
- Türkçe karakterleri doğru kullan.
- JSON dışında açıklama yazma.

Veriler:
${JSON.stringify(aiData)}
              `,
            },
          ],
          response_format: {
            type: 'json_object',
          },
          reasoning_effort: 'low',
          temperature: 0.2,
          max_tokens: 1600,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const apiMessage = data?.error?.message || data?.error || data?.message
        return thunkAPI.rejectWithValue(apiMessage || 'AI tahmini alınamadı.')
      }

      const message = data.choices?.[0]?.message
      const text =
        message?.content ||
        message?.reasoning_content ||
        message?.tool_calls?.[0]?.function?.arguments

      if (!text) {
        console.log('Hugging Face cevabı:', data)
        const finishReason = data.choices?.[0]?.finish_reason
        return thunkAPI.rejectWithValue(
          finishReason
            ? `AI boş cevap döndürdü. Bitiş sebebi: ${finishReason}`
            : 'AI boş cevap döndürdü. Konsoldaki Hugging Face cevabını kontrol edin.',
        )
      }

      const jsonText = getJsonFromText(text)
      return JSON.parse(jsonText)
    } catch (error) {
      console.log('AI Forecast Error:', error)
      return thunkAPI.rejectWithValue(error.message || 'AI tahmini alınırken hata oluştu.')
    }
  },
)

const initialState = {
  forecast: null,
  loading: false,
  error: '',
}

const aiForecastSlice = createSlice({
  name: 'aiForecast',
  initialState,
  reducers: {
    clearAiForecast: (state) => {
      state.forecast = null
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAiForecast.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(getAiForecast.fulfilled, (state, action) => {
        state.loading = false
        state.forecast = action.payload
      })
      .addCase(getAiForecast.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAiForecast } = aiForecastSlice.actions
export default aiForecastSlice.reducer
