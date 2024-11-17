// pages\api\chat.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { responses } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "너는 우울한 사람들을 위한 따뜻하고 친근한 친구야. 사용자가 대답한 내용을 바탕으로 맞춤형 상담을 제공해.",
        },
        {
          role: "user",
          content: `사용자의 대답: ${responses.join(", ")}`,
        },
      ],
    });

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
}
