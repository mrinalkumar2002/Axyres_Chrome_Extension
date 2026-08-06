import { extractJobData } from "../services/extractFromAI.js";

/**
 * ==========================================================
 * Extract Job Controller
 * ==========================================================
 * POST /api/extract
 * Body:
 * {
 *   "text": "Complete Job Description...",
 *   "title": "",
 *   "company": "",
 *   "location": ""
 * }
 * ==========================================================
 */

export const extractController = async (req, res) => {

    try {

        console.log("========== EXTRACT REQUEST ==========");

        console.log("METHOD:", req.method);

        console.log(
            "CONTENT TYPE:",
            req.headers["content-type"]
        );

        console.log(
            "BODY:",
            req.body
        );

        console.log("=====================================");


        const {
            text,
            title,
            company,
            location

        } = req.body;


        // Validate request

        if (
            !text ||
            typeof text !== "string" ||
            !text.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Job description text is required."

            });

        }


        console.log("========================================");

        console.log(
            "Job Extraction Request"
        );

        console.log(
            "Characters:",
            text.length
        );

        console.log("========================================");


        // Send complete job object to AI service

        const extractedJob = await extractJobData({

            text,

            title: title || "",

            company: company || "",

            location: location || ""

        });


        return res.status(200).json({

            success: true,

            message:
                "Job extracted successfully.",

            data: extractedJob

        });


    } catch (error) {


        console.error(
            "Extract Controller Error:"
        );

        console.error(error);


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to extract job description."

        });

    }

};