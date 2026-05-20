// functions/generate.js
import fetch from "node-fetch";

const IMGUR_CLIENT_ID = "SEU_CLIENT_ID_IMGUR"; // criar no Imgur API

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { prompt, imageBase64 } = body;

    // Chamada Hugging Face
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.2-dev", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt, image: imageBase64, parameters: { guidance_scale: 7.5 } })
    });

    if (!hfResponse.ok) {
      const text = await hfResponse.text();
      return { statusCode: hfResponse.status, body: text };
    }

    const arrayBuffer = await hfResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Upload Imgur
    const imgurResponse = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}`, "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image, type: "base64" })
    });

    const imgurData = await imgurResponse.json();
    if (!imgurData.success) throw new Error("Falha ao enviar imagem para Imgur");

    return { statusCode: 200, body: JSON.stringify({ image: imgurData.data.link }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
