import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// Helper function to dynamically initialize or retrieve the Gemini client with multiple fallback API keys
function getGeminiClient(): { ai: GoogleGenAI | null; error?: string } {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      ai: null,
      error: "لم يتم العثور على مفتاح الـ API لـ Gemini. بحث السيرفر الخلفي عن المتغيرات البيئية التالية ولم يجد أي مسمّى معرّف بنجاح:\n" +
             "1. GEMINI_API_KEY\n" +
             "2. NEXT_PUBLIC_GEMINI_API_KEY\n" +
             "3. VITE_GEMINI_API_KEY\n\n" +
             "يرجى التأكد من مطابقة اسم المتغير تماماً في إعدادات البيئة لـ Vercel مع أحد المسميات أعلاه (يُفضل GEMINI_API_KEY في قسم Environment Variables)."
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return { ai };
  } catch (initErr: any) {
    return {
      ai: null,
      error: `حدث خطأ أثناء تهيئة العميل البرمجي لـ GoogleGenAI: ${initErr.message || initErr}`
    };
  }
}

// Helper function to format Gemini API errors beautifully in Arabic
function formatGeminiError(error: any): string {
  const errMsg = error.message || String(error);
  
  if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid") || errMsg.includes("INVALID_ARGUMENT")) {
    return "مفتاح الـ API لـ Gemini غير صالح أو تم إيقافه (معطل أو مسرب من قبل غوغل لأسباب أمنية). يرجى إصدار مفتاح جديد تماماً من Google AI Studio (https://aistudio.google.com) واستبداله في الإعدادات الخاصة بـ Vercel أو ملف .env المحلي تحت الاسم GEMINI_API_KEY.";
  }
  
  try {
    const parsed = JSON.parse(errMsg);
    if (parsed.error && parsed.error.message) {
      const msg = parsed.error.message;
      if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
        return "مفتاح الـ API لـ Gemini غير صالح أو تم إيقافه (معطل أو مسرب من قبل غوغل لأسباب أمنية). يرجى إصدار مفتاح جديد تماماً من Google AI Studio (https://aistudio.google.com) واستبداله في الإعدادات الخاصة بـ Vercel أو ملف .env المحلي تحت الاسم GEMINI_API_KEY.";
      }
      return msg;
    }
  } catch (e) {}
  
  return errMsg || "حدث خطأ غير متوقع أثناء معالجة الخادم للطلب";
}

// Endpoint to generate initial program
app.post("/api/gemini/generate-initial", async (req, res) => {
  try {
    const { ai, error } = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error });
    }

    const { prompt } = req.body;

    // Use the premium/general modern recommended model: gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "فشل AI في توليد محتوى نصي" });
    }

    res.json({ text });
  } catch (error: any) {
    console.error("Error in generate-initial:", error);
    res.status(500).json({ error: formatGeminiError(error) });
  }
});

// Endpoint to generate subsequent month
app.post("/api/gemini/generate-subsequent", async (req, res) => {
  try {
    const { ai, error } = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error });
    }

    const { prompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "فشل AI في توليد محتوى نصي" });
    }

    res.json({ text });
  } catch (error: any) {
    console.error("Error in generate-subsequent:", error);
    res.status(500).json({ error: formatGeminiError(error) });
  }
});

// Bootstrap static file server or Vite middleware (only in non-Vercel environment)
async function setupStaticAssets() {
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite development server could not be mounted as middleware: ", e);
    }
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupStaticAssets();

export default app;
