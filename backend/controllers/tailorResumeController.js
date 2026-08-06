import { tailorResume } from "../services/tailorResumeAI.js";

/**
 * ==========================================================
 * Tailor Resume Controller
 * ==========================================================
 * Endpoint:
 * POST /api/tailor
 * ==========================================================
 */

export const tailorResumeController = async (req, res) => {

    try {

        const { resume, job } = req.body;

        // Validate Resume
        if (!resume || typeof resume !== "object") {

            return res.status(400).json({

                success: false,

                message: "Resume data is required."

            });

        }

        // Validate Job
        if (!job || typeof job !== "object") {

            return res.status(400).json({

                success: false,

                message: "Job data is required."

            });

        }

        console.log("======================================");
        console.log("Resume Tailoring Request");
        console.log("Resume Received :", !!resume);
        console.log("Job Received    :", !!job);
        console.log("======================================");

        // AI Tailoring
        const tailoredResume = await tailorResume(resume, job);

        return res.status(200).json({

            success: true,

            message: "Resume tailored successfully.",

            data: tailoredResume

        });

    } catch (error) {

        console.error("Tailor Resume Controller Error:");
        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message || "Failed to tailor resume."

        });

    }

};