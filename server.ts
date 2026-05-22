import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      res.status(500).json({ error: error.message || "حدث خطأ غير متوقع أثناء معالجة الخادم للطلب" });
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
      res.status(500).json({ error: error.message || "حدث خطأ غير متوقع أثناء معالجة الخادم للطلب" });
    }
  });

  // Serve Vite or static assets depending on environment
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
