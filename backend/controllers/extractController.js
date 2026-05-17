import { extractFromAI } from "../services/openaiService.js";

export const extractJob = async (req, res) => {
  try {
    const { text } = req.body;

    const data = await extractFromAI(text);

    res.json({ data });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Extraction failed" });
  }
};