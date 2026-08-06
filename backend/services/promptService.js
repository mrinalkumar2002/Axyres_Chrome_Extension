/**
 * ==========================================================
 * AXYRES AI Prompt Service
 * ==========================================================
 * All prompts used by the AI backend are centralized here.
 * This keeps business logic clean and makes prompt updates easy.
 * ==========================================================
 */

/**
 * Job Description Extraction Prompt
 */
/**
 * ==========================================================
 * Job Description Extraction Prompt
 * ==========================================================
 */

export function getExtractionPrompt(job) {

    return `

You are an expert technical recruiter.

Extract structured job information from the provided job data.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Preserve provided information.
3. Never remove company, title, or location if they are already available.
4. Do not guess missing information.
5. Use empty strings or empty arrays when information is unavailable.


Return this JSON format:

{
  "title": "",
  "company": "",
  "location": "",
  "employmentType": "",
  "experience": "",
  "salary": "",
  "skills": [],
  "responsibilities": [],
  "qualifications": [],
  "technologies": [],
  "keywords": [],
  "summary": ""
}


Provided Job Information:

Title:
${job.title || ""}


Company:
${job.company || ""}


Location:
${job.location || ""}


Job Description:

${job.text || ""}

`;

}
/**
 * Resume Tailoring Prompt
 */
export function getTailorPrompt(resume, job) {

return `

You are an expert ATS Resume Writer.

Your task is to tailor an existing resume for a specific job description.

Follow these rules strictly.


IMPORTANT:

DO NOT change:

- Name
- Email
- Phone
- LinkedIn
- GitHub
- Address
- Education
- Certifications
- Languages


You MUST improve:

1. Professional Summary
2. Technical Skills
3. Work Experience bullets
4. Project descriptions


RULES:

- Match keywords from the job description.
- Improve ATS score.
- Keep experience truthful.
- Never invent companies.
- Never add fake projects.
- Never create fake achievements.
- Use only information available in the resume.


RETURN ONLY THIS JSON FORMAT:

{
 "personalInfo": {},
 "summary": "",
 "technicalSkills": [],
 "workExperience": [
    {
      "company": "",
      "role": "",
      "responsibilities": [],
      "achievements": []
    }
 ],
 "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
 ],
 "education": [],
 "certifications": [],
 "languages": []
}


ORIGINAL RESUME:

${JSON.stringify(resume,null,2)}



JOB DESCRIPTION:

${JSON.stringify({

title: job.title || "",

company: job.company || "",

skills: job.skills || [],

description:
job.description?.substring(0,3000) || ""

},null,2)}


`;

}
/**
 * ATS Analysis Prompt
 */
export function getATSAnalysisPrompt(resume, job) {
    return `
You are an ATS Scanner.

Compare the resume with the job description.

Return ONLY JSON.

{
  "atsScore": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

Resume:

${JSON.stringify(resume, null, 2)}

Job Description:

${JSON.stringify(job, null, 2)}
`;
}

/**
 * Cover Letter Prompt
 */
export function getCoverLetterPrompt(resume, job) {
    return `
Write a professional cover letter based on the resume and job description.

Keep it under 400 words.

Resume:

${JSON.stringify(resume, null, 2)}

Job Description:

${JSON.stringify(job, null, 2)}
`;
}

/**
 * Interview Questions Prompt
 */
export function getInterviewPrompt(job) {
    return `
Generate 15 technical interview questions.

Return ONLY JSON.

{
  "easy": [],
  "medium": [],
  "hard": []
}

Job Description:

${JSON.stringify(job, null, 2)}
`;
}