import { keywordMatcher } from "./keywordMatcher.js";

/**
 * ==========================================================
 * AXYRES ATS Score Utility
 * ==========================================================
 * Calculates:
 *  - ATS Score
 *  - Match Percentage
 *  - Strengths
 *  - Missing Keywords
 *  - Recommendations
 * ==========================================================
 */

export function calculateATSScore(resume = {}, job = {}) {

    const analysis = keywordMatcher(resume, job);

    const {
        totalJobKeywords,
        matchedCount,
        missingCount,
        matchedKeywords,
        missingKeywords
    } = analysis;

    let atsScore = 0;

    if (totalJobKeywords > 0) {
        atsScore = Math.round(
            (matchedCount / totalJobKeywords) * 100
        );
    }

    const strengths = [];

    const recommendations = [];

    if (matchedCount > 0) {
        strengths.push(
            `${matchedCount} job keywords matched`
        );
    }

    if (matchedCount >= totalJobKeywords * 0.8) {
        strengths.push(
            "Excellent keyword alignment with the job description."
        );
    }

    if (missingCount > 0) {

        recommendations.push(
            "Include the missing technical skills where they genuinely reflect your experience."
        );

        recommendations.push(
            "Update your Professional Summary using relevant job keywords."
        );

        recommendations.push(
            "Strengthen Project and Work Experience sections with applicable technologies."
        );

    }

    if (atsScore < 60) {

        recommendations.push(
            "Resume needs significant optimization for this job."
        );

    } else if (atsScore < 80) {

        recommendations.push(
            "Resume is competitive but can be improved further."
        );

    } else {

        recommendations.push(
            "Resume is well optimized for ATS."
        );

    }

    return {

        atsScore,

        matchPercentage: atsScore,

        totalKeywords: totalJobKeywords,

        matchedKeywords,

        missingKeywords,

        strengths,

        recommendations

    };

}