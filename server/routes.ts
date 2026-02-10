import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/audio/client"; // Re-using the client from audio integration which is already set up

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Symptom Analysis Endpoint
  app.post(api.symptoms.analyze.path, async (req, res) => {
    try {
      const input = api.symptoms.analyze.input.parse(req.body);

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

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "Sen Türkçe konuşan, yardımsever bir akıllı yönlendirme rehberisin. Tıbbi teşhis koymazsın, sadece uygun bölüme yönlendirme yaparsın." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Validate response against our schema loosely or just return
      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Analiz sırasında bir hata oluştu." });
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
