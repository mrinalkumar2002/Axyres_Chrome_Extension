// ==========================================
// AXYRES Validator
// ==========================================

const Validator = (() => {

    // ==========================================
    // Empty Check
    // ==========================================

    function isEmpty(value) {

        return (
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
        );

    }

    // ==========================================
    // Job Validation
    // ==========================================

    function validateJob(job) {

        if (!job)
            return {
                valid: false,
                message: "Job data is missing."
            };

        if (isEmpty(job.title))
            return {
                valid: false,
                message: "Job title is missing."
            };

        if (isEmpty(job.company))
            return {
                valid: false,
                message: "Company name is missing."
            };

        if (isEmpty(job.description))
            return {
                valid: false,
                message: "Job description is missing."
            };

        return {
            valid: true
        };

    }

    // ==========================================
    // Resume Validation
    // ==========================================

    function validateResume(resume) {

        if (!resume)
            return {
                valid: false,
                message: "Resume not found."
            };

        return {
            valid: true
        };

    }

    // ==========================================
    // User Validation
    // ==========================================

    function validateUser(user) {

        if (!user)
            return {
                valid: false,
                message: "User not found."
            };

        if (isEmpty(user.email))
            return {
                valid: false,
                message: "Email is missing."
            };

        return {
            valid: true
        };

    }

    // ==========================================
    // API Response Validation
    // ==========================================

    function validateResponse(response) {

        if (!response)
            return {
                valid: false,
                message: "No response received."
            };

        if (response.success !== true)
            return {
                valid: false,
                message:
                    response.error ||
                    "Request failed."
            };

        return {
            valid: true
        };

    }

    // ==========================================
    // PDF Validation
    // ==========================================

    function validatePDF(pdf) {

        if (!pdf)
            return {
                valid: false,
                message: "PDF not generated."
            };

        if (!pdf.pdfUrl && !pdf.pdf)
            return {
                valid: false,
                message: "Invalid PDF response."
            };

        return {
            valid: true
        };

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        isEmpty,

        validateJob,

        validateResume,

        validateUser,

        validateResponse,

        validatePDF

    };

})();

window.Validator = Validator;