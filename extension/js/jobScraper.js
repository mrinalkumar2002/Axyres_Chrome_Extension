// ==========================================
// AXYRES Job Scraper Module
// ==========================================

const JobScraper = (() => {

    // ==========================================
    // Scrape Current Job
    // ==========================================

async function scrape() {

    try {

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab) {
            return {
                success: false,
                error: "No active tab found."
            };
        }

        // Ensure content script is injected
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content/content.js"]
        });

        const response = await chrome.tabs.sendMessage(tab.id, {
            action: "SCRAPE_JOB"
        });

        if (!response) {
            return {
                success: false,
                error: "No response from content script."
            };
        }

        return response;

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }

}
    // ==========================================
    // Validate Scraped Job
    // ==========================================

    function validate(job) {

        if (!job) {
            return false;
        }

        if (!job.title) {
            return false;
        }

        if (!job.company) {
            return false;
        }

        if (!job.description) {
            return false;
        }

        return true;

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        scrape,

        validate

    };

})();