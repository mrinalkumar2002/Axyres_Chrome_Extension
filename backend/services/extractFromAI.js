import { groqChat, parseJson } from "./groqClient.js";
import { getExtractionPrompt } from "./promptService.js";


// ==========================================================
// Extract Structured Job Information
// ==========================================================

export async function extractJobData(job) {

    if (!job || !job.text || !job.text.trim()) {

        throw new Error(
            "Job description is empty."
        );

    }


    const prompt = getExtractionPrompt(job);


    const messages = [

        {
            role: "system",

            content:
                `
You are an expert recruitment assistant.

Extract structured job information.

Return ONLY valid JSON.

Never remove provided company, title or location.
If information is already provided, preserve it.
`
        },

        {
            role: "user",

            content: prompt

        }

    ];


    const aiResponse = await groqChat(messages);


    const data = parseJson(aiResponse);


    return validateJobData(
        data,
        job
    );

}



// ==========================================================
// Validation
// ==========================================================

function validateJobData(data, originalJob) {


    return {


        title:

            data.title ||

            originalJob.title ||

            "",



        company:

            data.company ||

            originalJob.company ||

            "",



        location:

            data.location ||

            originalJob.location ||

            "",



        employmentType:

            data.employmentType || "",



        experience:

            data.experience || "",



        salary:

            data.salary || "",



        summary:

            data.summary || "",



        skills:

            Array.isArray(data.skills)

                ? data.skills

                : [],



        responsibilities:

            Array.isArray(data.responsibilities)

                ? data.responsibilities

                : [],



        qualifications:

            Array.isArray(data.qualifications)

                ? data.qualifications

                : [],



        technologies:

            Array.isArray(data.technologies)

                ? data.technologies

                : [],



        keywords:

            Array.isArray(data.keywords)

                ? data.keywords

                : []

    };

}