import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./openai";

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

      // OpenAI Implementation
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Sen Türkçe konuşan, yardımsever bir akıllı yönlendirme rehberisin. Tıbbi teşhis koymazsın, sadece uygun bölüme yönlendirme yaparsın. Yanıtını sadece JSON formatında ver."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const responseText = response.choices[0].message.content || "{}";
      console.log("OpenAI Raw Response:", responseText);

      let analysisResult;
      try {
        analysisResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Invalid JSON response from AI");
      }

      // Validate response against our schema loosely or just return
      res.json(analysisResult);
    } catch (error: any) {
      console.error("Analysis error:", error);
      // Return detailed error for debugging
      const hint = !process.env.OPENAI_API_KEY ? "OPENAI_API_KEY is missing." : "Check your API Key permissions and quota.";

      res.status(500).json({
        message: "Analiz sırasında bir hata oluştu.",
        error: (error.message || String(error)) + ` [Hint: ${hint}]`,
        details: error,
      });
    }
  });

  // AI Health Check Endpoint
  app.get("/api/health/ai", async (req, res) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...` : "MISSING";

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Test connection" }],
        max_tokens: 10,
      });

      res.json({
        status: "ok",
        key: maskedKey,
        model: "gpt-4o",
        response: response.choices[0].message.content
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        error: error.message,
        details: error
      });
    }
  });

  // Hospitals List Endpoint

  // Hospitals List Endpoint
  // Hospitals List Endpoint
  app.get(api.hospitals.list.path, async (req, res) => {
    try {
      const { lat, lng, radius } = api.hospitals.list.input.parse(req.query);
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.warn("GOOGLE_MAPS_API_KEY is missing. Returning mock data.");
        // Fallback to mock data if no key is provided
        const mockHospitals = [
          {
            id: "1",
            name: "Merkez Devlet Hastanesi (Demo)",
            type: "public",
            address: "Atatürk Cad. No:123, Merkez",
            phone: "0212 555 11 22",
            lat: lat + 0.002,
            lng: lng + 0.002,
            distance: 350
          },
          {
            id: "2",
            name: "Acil Tıp Merkezi (Demo)",
            type: "public", // Unified type
            address: "İnönü Bulvarı No:5",
            phone: "0212 555 99 00",
            lat: lat - 0.001,
            lng: lng - 0.002,
            distance: 250
          }
        ];
        return res.json(mockHospitals);
      }

      // Use Google Places API (New) - Search Nearby
      // https://developers.google.com/maps/documentation/places/web-service/nearby-search
      const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          // Request specific fields to save on data usage and latency
          "X-Goog-FieldMask": "places.name,places.displayName,places.formattedAddress,places.location,places.types,places.nationalPhoneNumber"
        },
        body: JSON.stringify({
          includedTypes: ["hospital", "doctor", "health"],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: {
                latitude: lat,
                longitude: lng
              },
              radius: radius || 5000 // Default 5km if not specified
            }
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Places API Error:", response.status, errorText);
        throw new Error(`Google Places API failed: ${response.statusText}`);
      }

      const data = await response.json();
      const places = data.places || [];

      // Map Google Places format to our application schema
      const hospitals = places.map((place: any, index: number) => {
        // Calculate raw distance simply for display sorting if needed, 
        // though strictly we should use the spherical geometry library or user's haversine
        // simplified here since the map calculates route often.
        const placeLat = place.location.latitude;
        const placeLng = place.location.longitude;

        // Simple Haversine approx for 'distance' field
        const R = 6371e3; // metres
        const φ1 = lat * Math.PI / 180;
        const φ2 = placeLat * Math.PI / 180;
        const Δφ = (placeLat - lat) * Math.PI / 180;
        const Δλ = (placeLng - lng) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // in meters

        return {
          id: place.name || `place-${index}`, // resource name is unique
          name: place.displayName?.text || "Bilinmeyen Sağlık Kurumu",
          type: "public", // We unified the UI, so internal type matters less, but we can default to public
          address: place.formattedAddress || "Adres bilgisi yok",
          phone: place.nationalPhoneNumber || "",
          lat: placeLat,
          lng: placeLng,
          distance: Math.round(distance)
        };
      });

      res.json(hospitals);

    } catch (error) {
      console.error("Hospitals error:", error);
      res.status(500).json({ message: "Hastane araması başarısız." });
    }
  });

  return httpServer;
}
