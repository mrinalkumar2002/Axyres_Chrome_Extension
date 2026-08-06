// ==========================================
// AXYRES Resume Module
// ==========================================

const Resume = (() => {

    let currentResume = null;

    // ==========================================
    // Check Resume Exists
    // ==========================================

    async function checkResume() {

        const response = await ExtensionApi.status();

        if (!response.success) {

            return {
                success: false,
                error: response.error || "Unable to verify resume status."
            };

        }

        const data = response.data;

        if (!data.success) {

            return {
                success: false,
                error: data.message || "Unable to verify resume."
            };

        }

        if (!data.resumeExists) {

            currentResume = null;

            return {
                success: false,
                error: "Resume not found."
            };

        }

        return {
            success: true
        };

    }

    // ==========================================
    // Fetch Latest Resume
    // ==========================================

    async function fetchLatestResume() {

        const response = await ExtensionApi.latestResume();

        if (!response.success) {

            return {
                success: false,
                error: response.error || "Unable to fetch resume."
            };

        }

        const data = response.data;

        if (!data.success) {

            return {
                success: false,
                error: data.message || "Resume fetch failed."
            };

        }

        currentResume = data.resume || data.data || null;

        return {
            success: true,
            resume: currentResume
        };

    }

    // ==========================================
    // Helpers
    // ==========================================

    function getResume() {
        return currentResume;
    }

    function clearResume() {
        currentResume = null;
    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        checkResume,

        fetchLatestResume,

        getResume,

        clearResume

    };

})();