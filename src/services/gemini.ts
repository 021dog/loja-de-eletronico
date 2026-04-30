import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainTechSpec(productName: string, specs: string[]) {
  const prompt = `Você é um analista de tecnologia visionário da NovaTech, uma empresa de eletrônicos futuristas.
  Explique por que as seguintes especificações técnicas do produto "${productName}" são inovadoras.
  Mantenha o tom profissional, futurista e conciso. Use no máximo 60 palavras. Responda em Português do Brasil.
  
  Especificações: ${specs.join(", ")}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Link neural estável, mas sem dados recuperados.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao estabelecer link neural com o Banco de Dados NovaTech. Tente novamente.";
  }
}
