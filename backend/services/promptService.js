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
export function getJDAnalysisPrompt(job) {
return `
You are an expert technical recruiter and ATS specialist.
Analyze the following raw Job Description and extract a structured JSON representation of the role requirements.

RULES:
1. Extract the exact job title and seniority level.
2. Separate required skills from preferred skills.
3. List core technologies and ATS keywords.
4. Summarize the main responsibilities.
5. Identify soft skills, industry, and domain.
6. Return ONLY valid JSON.

RETURN ONLY THIS JSON FORMAT:
{
  "job_title": "",
  "seniority": "",
  "required_skills": [],
  "preferred_skills": [],
  "technologies": [],
  "ats_keywords": [],
  "responsibilities": [],
  "soft_skills": [],
  "industry": "",
  "domain": "",
  "role_type": ""
}

RAW JOB DESCRIPTION:
${job.title || ""}
${job.company || ""}
${job.description || job.text || ""}
`;
}

export function getSummaryPrompt(summary, structuredJD, personalInfo) {
return `
You are an expert ATS Resume Writer.
Rewrite the candidate's Professional Summary to perfectly align with the provided Structured Job Requirements.
Additionally, extract or format the candidate's full name from the provided Personal Info.

RULES:
1. Adapt the summary to highlight the most relevant skills for the Job Description.
2. Inject critical ATS keywords from the JD naturally to ensure a high match score.
3. Adapt the candidate's professional identity to match the target job title and industry, emphasizing transferable skills.
4. The summary MUST be exactly 3 sentences long. Ensure it is concise, impactful, and reads like a cohesive paragraph.
5. Ensure the name is properly capitalized (e.g., John Doe). If missing, try to infer from email.
6. Return ONLY structured JSON without markdown formatting.
3. The summary MUST be exactly 3 sentences long. Ensure it is concise, impactful, and reads like a cohesive paragraph.
4. Ensure the name is properly capitalized (e.g., John Doe). If missing, try to infer from email.
5. Return ONLY structured JSON without markdown formatting.

RETURN ONLY THIS JSON FORMAT:
{
  "name": "",
  "professional_summary": ""
}

ORIGINAL SUMMARY:
${summary}

PERSONAL INFO:
${JSON.stringify(personalInfo, null, 2)}

STRUCTURED JOB REQUIREMENTS:
${JSON.stringify(structuredJD, null, 2)}
`;
}

export function getExperiencePrompt(experienceObj, structuredJD) {
return `
You are an expert ATS Resume Writer.
Rewrite a single Work Experience entry to highlight transferable skills and align with the Structured Job Requirements.

RULES:
1. NEVER SUMMARIZE as a paragraph. The responsibilities MUST be an array of strings.
2. Generate EXACTLY 2 concise bullet points for the responsibilities. Do not generate more than 2 points.
3. Aggressively adapt the responsibilities to align with the Job Description. Highlight transferable skills and use exact keywords from the JD.
4. Frame the existing work in the context of the new job requirements to maximize ATS compatibility.
5. Highlight relevant technologies and skills that match the JD.
6. Inject important ATS keywords seamlessly into the bullet points.
7. Return ONLY structured JSON without markdown formatting.

RETURN ONLY THIS JSON FORMAT:
{
  "company": "",
  "role": "",
  "duration": "",
  "responsibilities": [],
  "achievements": [],
  "technologies": []
}

ORIGINAL WORK EXPERIENCE:
${JSON.stringify(experienceObj)}

STRUCTURED JOB REQUIREMENTS:
${JSON.stringify(structuredJD, null, 2)}
`;
}

export function getProjectPrompt(projectObj, structuredJD) {
return `
You are an expert ATS Resume Writer.
Rewrite a single Project entry to align with the Structured Job Requirements.

RULES:
1. Rewrite the project description to highlight aspects that match the Job Description, without inventing non-existent projects or roles.
2. Inject ATS keywords seamlessly if they apply to the real project work.
3. The description MUST be an array of exactly 2 concise bullet points.
4. Maintain the core project name and technologies. DO NOT fabricate skills the candidate does not have.
5. Return ONLY structured JSON without markdown formatting.

RETURN ONLY THIS JSON FORMAT:
{
  "title": "",
  "description": [],
  "technologies": []
}

ORIGINAL PROJECT ENTRY:
${JSON.stringify(projectObj, null, 2)}

STRUCTURED JOB REQUIREMENTS:
${JSON.stringify(structuredJD, null, 2)}
`;
}

export function getSkillsPrompt(skillsArray, structuredJD) {
return `
You are an expert ATS Resume Writer.
Reorder and refine the candidate's Technical Skills array to prioritize the skills most relevant to the Structured Job Requirements.

RULES:
1. Extract the most important Hard Skills, Tools, and Keywords from the Structured Job Requirements.
2. Add these critical JD keywords to the candidate's skills list to ensure a high ATS match score.
3. Keep the candidate's original relevant skills, but prioritize and place the new JD-specific skills at the very beginning of the array.
4. The final array should be a clean list of strings (e.g. ["Data Entry", "Python", "Communication"]).

RETURN ONLY THIS JSON FORMAT:
{
  "skills": []
}

ORIGINAL SKILLS:
${JSON.stringify(skillsArray)}

STRUCTURED JOB REQUIREMENTS:
${JSON.stringify(structuredJD, null, 2)}
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