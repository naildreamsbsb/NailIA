// functions/generate.js
import fetch from "node-fetch";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { prompt, imageBase64 } = body;

    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.2-dev", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { guidance_scale: 7.5 },
        image: imageBase64
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: errText };
    }

    const resultArrayBuffer = await response.arrayBuffer();
    const base64Result = Buffer.from(resultArrayBuffer).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({ image: `data:image/png;base64,${base64Result}` })
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}