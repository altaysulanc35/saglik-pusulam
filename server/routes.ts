import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { geminiModel } from "./gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Symptom Analysis Endpoint
  app.post(api.symptoms.analyze.path, async (req, res) => {
    try {
      console.log("Analyze request received:", JSON.stringify(req.body)); // Log incoming request

      let input;
      try {
        input = api.symptoms.analyze.input.parse(req.body);
      } catch (validationError) {
        console.error("Input validation failed:", validationError);
        return res.status(400).json({
          message: "Geçersiz veri formatı.",
          error: "Girdi verisi doğrulanamadı. Lütfen tekrar deneyin.",
          details: validationError
        });
      }

      const prompt = `
        Sen yardımcı bir akıllı rehberlik sistemisin. Kullanıcı şu şikayeti bildirdi: "${input.symptom}".
        
        Lütfen bu belirtileri analiz et ve aşağıdaki JSON formatında yanıt ver:
        {
          "department": "En uygun hastane bölümü (ör. Dahiliye, Nöroloji, Acil Servis)",
          "explanation": "Neden bu bölümü önerdiğine dair 1-2 cümlelik kısa, anlaşılır, empatik bir açıklama.",
          "urgency": "low" | "medium" | "high" | "emergency",
          "relatedSymptoms": ["olası diğer belirti 1", "olası diğer belirti 2"]
        }
        
        ÖNEMLİ:
        - Yanıtın kesinlikle Türkçe olsun.
        - Asla tıbbi teşhis koyma (ör. "Sen grip olmuşsun" deme, "Belirtileriniz gribe benziyor olabilir" de).
        - Sen bir tıbbi uzman değilsin, sadece belirtilere göre yönlendirme yapan akıllı bir rehbersin.
        - Eğer durum çok ciddiyse (kalp krizi, inme belirtileri vb.) urgency: "emergency" olarak işaretle ve explanation kısmında DERHAL 112'yi araması gerektiğini vurgula.
      `;

      // Gemini doesn't strictly enforce JSON via a parameter in the same way OpenAI does for all models yet,
      // but we can instruct it in the prompt and clean the output. 
      // Note: gemini-1.5-flash supports response_mime_type: "application/json"

      const generationConfig = {
        temperature: 0.1,
        responseMimeType: "application/json",
      };

      const result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: "Sen Türkçe konuşan, yardımsever bir akıllı yönlendirme rehberisin. Tıbbi teşhis koymazsın, sadece uygun bölüme yönlendirme yaparsın.\n\n" + prompt }]
          }
        ],
        generationConfig,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      const responseText = result.response.text();
      console.log("Gemini Raw Response:", responseText); // Log for debugging

      // Clean the response if it contains markdown code blocks
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

      let analysisResult;
      try {
        analysisResult = JSON.parse(cleanJson || "{}");
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Failed JSON content:", cleanJson);
        throw new Error("Invalid JSON response from AI");
      }

      // Validate response against our schema loosely or just return
      res.json(analysisResult);
    } catch (error: any) {
      console.error("Analysis error:", error);
      // Return detailed error for debugging
      res.status(500).json({
        message: "Analiz sırasında bir hata oluştu [v2].",
        error: error.message || String(error),
        details: error
      });
    }
  });

  // Hospitals List Endpoint
  app.get(api.hospitals.list.path, async (req, res) => {
    try {
      const { lat, lng, radius } = api.hospitals.list.input.parse(req.query);

      // Mock data generator for demo purposes
      // Generates hospitals around the user's location
      const mockHospitals = [
        {
          id: "1",
          name: "Merkez Devlet Hastanesi",
          type: "public",
          address: "Atatürk Cad. No:123, Merkez",
          phone: "0212 555 11 22",
          lat: lat + 0.002,
          lng: lng + 0.002,
          distance: 350
        },
        {
          id: "2",
          name: "Özel Yaşam Polikliniği",
          type: "private",
          address: "Cumhuriyet Mah. 4. Sokak",
          phone: "0212 555 33 44",
          lat: lat - 0.003,
          lng: lng + 0.001,
          distance: 500
        },
        {
          id: "3",
          name: "Şehir Eğitim ve Araştırma Hastanesi",
          type: "public",
          address: "Hastane Yolu Üzeri, Kampüs",
          phone: "0212 555 55 66",
          lat: lat + 0.001,
          lng: lng - 0.004,
          distance: 800
        },
        {
          id: "4",
          name: "Acil Tıp Merkezi",
          type: "private",
          address: "İnönü Bulvarı No:5",
          phone: "0212 555 99 00",
          lat: lat - 0.001,
          lng: lng - 0.002,
          distance: 250
        }
      ];

      res.json(mockHospitals);
    } catch (error) {
      console.error("Hospitals error:", error);
      res.status(400).json({ message: "Hastane araması başarısız." });
    }
  });

  return httpServer;
}
