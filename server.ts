import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize secure GenAI client
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const ai = geminiApiKey 
    ? new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      })
    : null;

  // Endpoint to generate initial program
  app.post("/api/gemini/generate-initial", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ 
          error: "مفتاح API الخاص بـ Gemini غير مهيأ على الخادم بشكل صحيح. يرجى إضافته في الإعدادات." 
        });
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
      if (!ai) {
        return res.status(500).json({ 
          error: "مفتاح API الخاص بـ Gemini غير مهيأ على الخادم بشكل صحيح. يرجى إضافته في الإعدادات." 
        });
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
