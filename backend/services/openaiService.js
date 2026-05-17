import axios from "axios";

export const extractFromAI = async (text) => {
  try {
    if (!text || text.length < 50) {
      throw new Error("Invalid page content");
    }

    console.log("TEXT LENGTH:", text.length);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
  model: "llama-3.1-8b-instant" ,
        messages: [
          {
            role: "user",
            content: `
Extract job details.

Return ONLY valid JSON.
No explanation.

{
  "title": "",
  "company": "",
  "location": "",
  "experience": "",
  "skills": [],
  "responsibilities": []
}

TEXT:
${text.slice(0, 4000)}
`
          }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;

    console.log("RAW GROQ:", content);

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        title: "",
        company: "",
        location: "",
        experience: "",
        skills: [],
        responsibilities: []
      };
    }

    return parsed;

  } catch (error) {
    console.error("🔥 GROQ ERROR FULL:", error.response?.data || error.message);
    throw error;
  }
};