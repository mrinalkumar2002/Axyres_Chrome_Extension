/**
 * ==========================================================
 * AXYRES Keyword Matcher
 * ==========================================================
 * Compares resume skills with job keywords.
 * Returns matched and missing keywords.
 * ==========================================================
 */

/**
 * Normalize keyword
 */
function normalize(keyword) {
    return keyword
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

/**
 * Remove duplicate keywords
 */
function unique(list) {
    return [...new Set(list.map(normalize))];
}

/**
 * Match Resume vs Job
 */
export function keywordMatcher(resume = {}, job = {}) {

    // Resume Skills
    const resumeSkills = [

        ...(resume.technicalSkills || []),

        ...(resume.skills || [])

    ];

    // Job Skills
    const jobSkills = [

        ...(job.skills || []),

        ...(job.technologies || []),

        ...(job.keywords || [])

    ];

    const resumeList = unique(resumeSkills);

    const jobList = unique(jobSkills);

    const matchedKeywords = [];

    const missingKeywords = [];

    for (const keyword of jobList) {

        if (resumeList.includes(keyword)) {

            matchedKeywords.push(keyword);

        } else {

            missingKeywords.push(keyword);

        }

    }

    return {

        totalJobKeywords: jobList.length,

        matchedCount: matchedKeywords.length,

        missingCount: missingKeywords.length,

        matchedKeywords,

        missingKeywords

    };

}