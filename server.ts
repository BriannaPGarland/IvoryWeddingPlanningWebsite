import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or safely with User-Agent
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Endpoint: Extrapolate Wedding Vision for Form Autofill
app.post("/api/gemini/extrapolate-vision", async (req, res) => {
  try {
    const { profile, formContext } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      // Fallback deterministic extrapolation if API key not available yet
      return res.json({
        eventDate: profile?.weddingDate || "September 18, 2026",
        guestCount: profile?.guestCount || "120",
        weddingStyle: profile?.vibe || "Organic Ethereal Minimalist with warm natural textures",
        colorPalette: profile?.colors?.join(", ") || "Calming Sage, Warm Alabaster, Terracotta Blush, Champagne",
        floralVision: profile?.florals || "Eucalyptus, blush peonies, garden roses, trailing greenery with wild texture",
        budgetRange: profile?.budget ? `$${profile.budget}` : "$35,000 - $45,000",
        messageToVendor: `Hi there! We are planning our wedding on ${profile?.weddingDate || "Sept 18, 2026"} for ~${profile?.guestCount || 120} guests. Our aesthetic is ${profile?.vibe || "organic and warm"}. We'd love to inquire about your availability and receiving a tailored quote based on our vision profile!`,
      });
    }

    const prompt = `
You are an expert AI Wedding Planning Assistant.
A bride/groom is inquiring with a wedding vendor. Extrapolate concise, professional, and accurate form field responses based on their Wedding Vision Profile below.

Wedding Vision Profile:
- Couple Names: ${profile?.coupleNames || "Brianna & Alex"}
- Wedding Date: ${profile?.weddingDate || "2026-09-18"}
- Location: ${profile?.location || "Napa Valley, CA"}
- Estimated Guest Count: ${profile?.guestCount || 120}
- Target Budget: $${profile?.budget || 40000}
- Vibe/Aesthetic: ${profile?.vibe || "Ethereal Organic Minimalist"}
- Floral Preferences: ${profile?.florals || "Eucalyptus, blush peonies, garden roses"}
- Color Palette: ${profile?.colors?.join(", ") || "Sage, Alabaster, Terracotta, Champagne"}
- Additional Vision Notes: ${profile?.notes || "Warm lighting, intimate seating, relaxed luxury"}
- Vendor Category Form Context: ${formContext || "General Wedding Vendor Inquiry"}

Return a JSON object with keys:
"eventDate", "guestCount", "weddingStyle", "colorPalette", "floralVision", "budgetRange", "messageToVendor".
Do NOT include markdown backticks around JSON if possible, or keep it strictly parseable.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (err: any) {
    console.error("Error in extrapolate-vision:", err);
    res.status(500).json({ error: err.message || "Failed to extrapolate vision" });
  }
});

// AI Endpoint: Extract Vendor Quote & Contract details from Email/Document
app.post("/api/gemini/extract-quote", async (req, res) => {
  try {
    const { emailSubject, emailBody, documentName } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        vendorName: "Oakridge Estate & Gardens",
        suggestedAmountSpent: 12500,
        contactPerson: "Elena Vance",
        contactEmail: "elena@oakridgeestate.com",
        documentName: documentName || "Contract_Oakridge_Venue_2026.pdf",
        keyServices: "Venue Rental, Tables & Chairs, Bridal Suite Access, Cleanup Fee",
        summaryNotes: "Includes $2,000 security deposit. Final balance due 30 days prior to event.",
      });
    }

    const prompt = `
Analyze the following vendor email or contract text and extract key details:
Subject: ${emailSubject}
Document/Attachment: ${documentName || "None"}
Content:
${emailBody}

Extract the following in JSON format:
- vendorName (string)
- suggestedAmountSpent (number, extracted total price or quote in USD)
- contactPerson (string, point of contact)
- contactEmail (string, email address)
- documentName (string, reference file or attachment name)
- keyServices (string, summary of what's included)
- summaryNotes (string, key payment deadlines or terms)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (err: any) {
    console.error("Error in extract-quote:", err);
    res.status(500).json({ error: err.message || "Failed to extract quote" });
  }
});

// AI Endpoint: Generate Wedding Design Concept Image using Gemini
app.post("/api/gemini/render-design", async (req, res) => {
  try {
    const { prompt, category, style, colorPalette } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      // Fallback curated aesthetic image link
      return res.json({
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(prompt || category)}/1024/1024`,
        promptUsed: prompt,
      });
    }

    const fullPrompt = `A high quality, elegant wedding design photo of ${category || "wedding decoration"}. ${prompt}. Theme: ${style || "Ethereal organic"}. Colors: ${colorPalette || "Warm sage, alabaster, terracotta"}. Professional bridal photography, shallow depth of field, natural soft lighting, luxurious aesthetic.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt || "wedding")}/1024/1024`;
    }

    res.json({ imageUrl, promptUsed: fullPrompt });
  } catch (err: any) {
    console.error("Error generating design image:", err);
    res.json({
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(req.body.prompt || "wedding")}/1024/1024`,
      error: "Used fallback render due to model limits",
    });
  }
});

// Vendor Google Places / Smart Lookup suggestion endpoint
app.post("/api/gemini/suggest-vendors", async (req, res) => {
  try {
    const { query, category, location } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        suggestions: [
          { name: `${query} Studios`, category, address: `${location || "Napa Valley, CA"}`, rating: 4.9, reviewCount: 84 },
          { name: `${query} & Co. Elegance`, category, address: `Sonoma Coast, CA`, rating: 4.8, reviewCount: 112 },
          { name: `The Botanical ${query}`, category, address: `St. Helena, CA`, rating: 5.0, reviewCount: 45 },
        ],
      });
    }

    const prompt = `
The user is searching for a wedding vendor in category '${category || "General"}' named or matching '${query}' around '${location || "Napa Valley, CA"}'.
Return a JSON array of 4 realistic vendor search suggestions with properties:
"name" (string), "category" (string), "address" (string), "rating" (number e.g. 4.9), "reviewCount" (number e.g. 62), "phone" (string e.g. (707) 555-0192), "website" (string).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const suggestions = JSON.parse(response.text || "[]");
    res.json({ suggestions });
  } catch (err: any) {
    console.error("Error suggesting vendors:", err);
    res.json({ suggestions: [] });
  }
});

// Setup Vite / Static Serving
async function startServer() {
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
    console.log(`Sereno Wedding App Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
