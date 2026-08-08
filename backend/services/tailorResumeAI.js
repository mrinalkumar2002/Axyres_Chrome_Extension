import { groqChat, parseJson } from "./groqClient.js";
import { getSummaryPrompt, getExperiencePrompt, getProjectPrompt, getSkillsPrompt, getJDAnalysisPrompt } from "./promptService.js";

/**
 * Tailor Resume using AI (Section-Level Pipeline)
 *
 * @param {Object} resume Original Resume JSON
 * @param {Object} job Extracted Job JSON
 * @returns {Object} Tailored Resume
 */
// Helper to prevent hitting Groq rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function tailorResume(resume, job) {
    if (!resume || typeof resume !== "object") {
        throw new Error("Resume data is required.");
    }
    if (!job || typeof job !== "object") {
        throw new Error("Job data is required.");
    }

    console.log("=========================================");
    console.log("STARTING SECTION-LEVEL TAILORING PIPELINE");
    console.log("=========================================");

    // Step 0: Analyze Job Description
    let structuredJD = job;
    try {
        console.log("[Pipeline] Analyzing Job Description...");
        const jdPrompt = getJDAnalysisPrompt(job);
        const jdResponse = await groqChat([{ role: "system", content: "You are an expert technical recruiter. Return ONLY JSON." }, { role: "user", content: jdPrompt }]);
        structuredJD = parseJson(jdResponse);
        console.log("[Pipeline] Structured JD successfully generated.");
        await sleep(8000); // Wait to clear TPM buffer
    } catch (e) {
        console.error("[Pipeline Error] JD Analyzer failed, falling back to raw job description:", e.message);
        structuredJD = {
            title: job.title || "",
            company: job.company || "",
            skills: job.skills || [],
            description: job.description?.substring(0,2000) || job.text?.substring(0,2000) || ""
        };
    }

    const tailored = {
        name: resume.personalInfo?.name || resume.name || "",
        summary: resume.summary,
        experience: resume.workExperience || resume.experience || [],
        projects: resume.projects || [],
        skills: resume.technicalSkills || resume.skills || []
    };

    // 1. Rewrite Summary & Extract Name
    try {
        console.log("[Pipeline] Tailoring Professional Summary...");
        const prompt = getSummaryPrompt(resume.summary || resume.professionalSummary || "", structuredJD, resume.personalInfo || {});
        const response = await groqChat([{ role: "system", content: "You are an expert ATS Resume Writer. Return ONLY JSON." }, { role: "user", content: prompt }]);
        const result = parseJson(response);
        if (result.professional_summary) {
            tailored.summary = result.professional_summary;
        }
        if (result.name) {
            tailored.name = result.name;
        }
        await sleep(8000); // Wait to clear TPM buffer
    } catch (e) {
        console.error("[Pipeline Error] Failed to tailor summary:", e.message);
    }

    // 2. Rewrite Work Experience sequentially
    console.log(`[Pipeline] Tailoring ${tailored.experience.length} Work Experience entries...`);
    const newExperience = [];
    for (let i = 0; i < tailored.experience.length; i++) {
        try {
            console.log(`[Pipeline] Tailoring Experience ${i + 1}/${tailored.experience.length}...`);
            const prompt = getExperiencePrompt(tailored.experience[i], structuredJD);
            const response = await groqChat([{ role: "system", content: "You are an expert ATS Resume Writer. Return ONLY JSON." }, { role: "user", content: prompt }]);
            newExperience.push(parseJson(response));
            await sleep(8000); // Wait to clear TPM buffer
        } catch (e) {
            console.error(`[Pipeline Error] Failed to tailor experience ${i + 1}:`, e.message);
            newExperience.push(tailored.experience[i]); // fallback
        }
    }
    tailored.experience = newExperience;

    // 3. Rewrite Projects sequentially
    console.log(`[Pipeline] Tailoring ${tailored.projects.length} Projects...`);
    const newProjects = [];
    for (let i = 0; i < tailored.projects.length; i++) {
        try {
            console.log(`[Pipeline] Tailoring Project ${i + 1}/${tailored.projects.length}...`);
            const prompt = getProjectPrompt(tailored.projects[i], structuredJD);
            const response = await groqChat([{ role: "system", content: "You are an expert ATS Resume Writer. Return ONLY JSON." }, { role: "user", content: prompt }]);
            newProjects.push(parseJson(response));
            if (i < tailored.projects.length - 1) await sleep(8000); // Wait to clear TPM buffer
        } catch (e) {
            console.error(`[Pipeline Error] Failed to tailor project ${i + 1}:`, e.message);
            newProjects.push(tailored.projects[i]); // fallback
        }
    }
    tailored.projects = newProjects;

    // 4. Reorder Skills
    try {
        await sleep(8000); // Ensure buffer is clear before final call
        console.log("[Pipeline] Reordering Technical Skills...");
        const prompt = getSkillsPrompt(tailored.skills, structuredJD);
        const response = await groqChat([{ role: "system", content: "You are an expert ATS Resume Writer. Return ONLY JSON." }, { role: "user", content: prompt }]);
        const result = parseJson(response);
        if (result.skills && Array.isArray(result.skills)) {
            tailored.skills = result.skills;
        }
    } catch (e) {
        console.error("[Pipeline Error] Failed to reorder skills:", e.message);
    }

    console.log("=========================================");
    console.log("SECTION-LEVEL TAILORING PIPELINE COMPLETE");
    console.log("=========================================");

    // Validate and Merge final structure
    return validateResume({
        ...resume,
        personalInfo: {
            ...(resume.personalInfo || {}),
            name: tailored.name || resume.personalInfo?.name || resume.name || "",
            email: resume.personalInfo?.email || resume.email || "",
            phone: resume.personalInfo?.phone || resume.phone || "",
            location: resume.personalInfo?.location || resume.location || "",
            linkedin: resume.personalInfo?.linkedin || resume.linkedin || "",
            github: resume.personalInfo?.github || resume.github || ""
        },
        summary: tailored.summary,
        technicalSkills: tailored.skills,
        experience: mergeExperience(resume.workExperience || resume.experience || [], tailored.experience),
        projects: mergeProjects(resume.projects || [], tailored.projects),
        education: resume.education || [],
        certifications: resume.certifications || [],
        languages: resume.languages || []
    });
}

function mergeProjects(original = [], updated = []) {
    const source = updated.length ? updated : original;
    return source.map((item, index) => {
        const old = original[index] || {};
        const aiItem = updated[index] || {};
        return {
            ...old,
            ...item,
            name: aiItem.title || aiItem.name || old.name || old.title || "",
            description: (Array.isArray(aiItem.description) && aiItem.description.length > 0) 
                         ? aiItem.description 
                         : (aiItem.description || old.description || []),
            technologies: aiItem.technologies?.length ? aiItem.technologies : old.technologies || []
        };
    });
}

function mergeExperience(original = [], updated = []) {
    const source = updated.length ? updated : original;
    return source.map((item, index) => {
        const old = original[index] || {};
        const aiItem = updated[index] || {};
        return {
            ...old,
            ...item,
            company: aiItem.company || old.company || "",
            position: aiItem.role || aiItem.position || old.position || old.role || "",
            duration: aiItem.duration || old.duration || "",
            responsibilities: aiItem.responsibilities?.length ? aiItem.responsibilities : old.responsibilities || [],
            achievements: aiItem.achievements?.length ? aiItem.achievements : old.achievements || [],
            technologies: aiItem.technologies?.length ? aiItem.technologies : old.technologies || []
        };
    });
}

function validateResume(resume) {
    return {
        personalInfo: resume.personalInfo || {},
        summary: typeof resume.summary === "string" 
            ? resume.summary 
            : resume.summary?.description || resume.professionalSummary || "Professional capable of building robust solutions.",
        technicalSkills: Array.isArray(resume.technicalSkills) && resume.technicalSkills.length ? resume.technicalSkills : Array.isArray(resume.skills) ? resume.skills : [],
        workExperience: Array.isArray(resume.workExperience) ? resume.workExperience : Array.isArray(resume.experience) ? resume.experience : [],
        projects: Array.isArray(resume.projects) ? resume.projects : [],
        education: resume.education || [],
        certifications: resume.certifications || [],
        languages: resume.languages || [],
        achievements: resume.achievements || []
    };
}