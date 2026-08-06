import { groqChat, parseJson } from "./groqClient.js";
import { getTailorPrompt } from "./promptService.js";

/**
 * Tailor Resume using AI
 *
 * @param {Object} resume Original Resume JSON
 * @param {Object} job Extracted Job JSON
 * @returns {Object} Tailored Resume
 */



export async function tailorResume(resume, job) {

    if (!resume || typeof resume !== "object") {
        throw new Error("Resume data is required.");
    }

    if (!job || typeof job !== "object") {
        throw new Error("Job data is required.");
    }

    const prompt = getTailorPrompt(resume, job);

    const messages = [
        {
            role: "system",
            content: `
You are an expert ATS Resume Writer.

Tailor the resume according to the provided job description.

STRICT RULES:

1. Keep unchanged:
- Name
- Email
- Phone
- LinkedIn
- GitHub
- Address
- Education
- Certifications
- Languages


2. Rewrite:
- Professional Summary based on job description
- Technical Skills matching JD keywords
- Project descriptions with relevant technologies
- Work experience bullets with impact

3. Never invent:
- Companies
- Job titles
- Years of experience
- False employment history

4. Convert existing work experience into professional ATS bullet points.

5. For internships and previous roles:
- Rewrite the existing work into responsibilities.
- Convert technical tasks into ATS-friendly bullet points.
- Create achievements only from actual contributions.

6. Do not create:
- Fake metrics
- Fake awards
- Fake promotions
- Fake business impact

7. If original resume has limited details:
- Expand wording using the same meaning.
- Do not leave responsibilities and achievements empty.


8. Use existing experience only.

9. Never remove existing resume information.

10. If you cannot improve a section,
return the original content.

11. Preserve:
- Work experience
- Responsibilities
- Achievements
- Project details
- Education details

12. Only rewrite wording for ATS optimization.

13. Return ONLY JSON.

Required format:

{
 "personalInfo": {},
 "summary": {
    "headline":"",
    "description":""
 },
 "technicalSkills": [],
 "workExperience": [
    {
      "company":"",
      "role":"",
      "responsibilities":[],
      "achievements":[]
    }
 ],
 "projects":[
    {
      "name":"",
      "description":"",
      "technologies":[]
    }
 ],
 "education":[],
 "certifications":[],
 "languages":[]
}
`

        },
        {
            role: "user",
            content: prompt
        }
    ];

    const response = await groqChat(messages);
const tailoredResume = parseJson(response);


return validateResume({

    ...resume,

    ...tailoredResume,


    personalInfo:
        resume.personalInfo,


    education:
        resume.education,


    certifications:
        resume.certifications,


    languages:
        resume.languages,


    workExperience:
        mergeExperience(
            resume.workExperience,
            tailoredResume.workExperience
        ),


    projects:
        mergeProjects(
            resume.projects,
            tailoredResume.projects
        )

});
}

function mergeProjects(original = [], updated = []) {


    const source =
        updated.length
            ? updated
            : original;


    return source.map((item,index)=>{


        const old =
            original[index] || {};


        const aiItem =
            updated[index] || {};



        return {

            ...old,

            ...item,


            technologies:

                aiItem.technologies?.length

                    ? aiItem.technologies

                    :

                    old.technologies || []

        };


    });

}


/**
 * Ensure required sections exist.
 */
function validateResume(resume) {


    return {

        personalInfo:
            resume.personalInfo || {},


       summary:

    typeof resume.summary === "string"

        ? resume.summary

        :

    resume.summary?.description ||

    resume.professionalSummary ||

    "Full Stack Developer experienced in building scalable web applications using modern frontend and backend technologies.",

        technicalSkills:

            Array.isArray(resume.technicalSkills) &&
            resume.technicalSkills.length
                ? resume.technicalSkills
                :
            Array.isArray(resume.skills)
                ? resume.skills
                :
            [],



        workExperience:

            Array.isArray(resume.workExperience)
                ? resume.workExperience
                :
            Array.isArray(resume.experience)
                ? resume.experience
                :
            [],



        projects:

            Array.isArray(resume.projects)
                ? resume.projects
                :
            [],



        education:

            resume.education || [],


        certifications:

            resume.certifications || [],


        languages:

            resume.languages || [],


        achievements:

            resume.achievements || []

    };

}