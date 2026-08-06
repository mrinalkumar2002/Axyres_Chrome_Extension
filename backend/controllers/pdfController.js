import { generateResumePDF } from "../services/pdfService.js";

/**
 * ==========================================================
 * PDF Controller
 * ==========================================================
 * Endpoint:
 * POST /api/pdf
 * ==========================================================
 */

export const pdfController = async (req, res) => {

    try {

        const { resume } = req.body;

        // Validate request
        if (!resume || typeof resume !== "object") {

            return res.status(400).json({

                success: false,

                message: "Resume data is required."

            });

        }

        console.log("========================================");
        console.log("PDF Generation Request");
        console.log("Resume Received:", !!resume);
        console.log("========================================");

        const pdf = await generateResumePDF(resume);

        return res.status(200).json({

            success: true,

            message: "PDF generated successfully.",

            data: {

      data: {

    filename: pdf.filename,

    pdfUrl: pdf.downloadUrl,

    filePath: pdf.filePath

}

            }

        });

    } catch (error) {

        console.error("PDF Controller Error:");
        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message || "Failed to generate PDF."

        });

    }

};