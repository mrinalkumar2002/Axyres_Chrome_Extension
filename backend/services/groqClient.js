import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MODEL =
    process.env.GROQ_MODEL || "llama-3.1-8b-instant";

/**
 * Generic Groq Chat Function
 */
export async function groqChat(messages, options = {}) {

    try {

        const response = await axios.post(
            GROQ_API_URL,
       {
    model: options.model || DEFAULT_MODEL,

    messages,

    temperature: options.temperature ?? 0.2,

    max_tokens: options.max_tokens ?? 4096,

    top_p: options.top_p ?? 1,

    response_format: {
        type: "json_object"
    }
},
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 120000
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {

        console.error("Groq API Error:");

        if (error.response) {

            console.error(error.response.data);

            throw new Error(
                error.response.data.error?.message ||
                "Groq API request failed"
            );

        }

        throw new Error(error.message);
    }

}

/**
 * Removes markdown code blocks if AI returns:
 *
 * ```json
 * { ... }
 * ```
 */
export function cleanJson(text) {

    if (!text) return "";

    let cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();


    // Extract JSON object only
    const start = cleaned.indexOf("{");

    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {

        cleaned = cleaned.substring(
            start,
            end + 1
        );

    }


    return cleaned.trim();

}

/**
 * Parse AI JSON safely
 */
export function parseJson(text) {

    try {

        return JSON.parse(cleanJson(text));

    } catch (err) {

        throw new Error("AI returned invalid JSON.");

    }

}