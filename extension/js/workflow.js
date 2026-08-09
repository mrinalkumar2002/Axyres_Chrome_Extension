// ==========================================
// AXYRES Workflow Module
// ==========================================

const Workflow = (() => {

    let currentTabId = null;
    let currentJob = null;
    let currentResume = null;
    let currentTailoredResume = null;

    let workflowState = WORKFLOW_STATE.IDLE;
    let isRunning = false;

    // ==========================================
    // Initialize
    // ==========================================

    function initialize(tabId) {

        currentTabId = tabId;

        Logger.info("Workflow Initialized");

    }

    // ==========================================
    // State
    // ==========================================

    function setState(state) {

        workflowState = state;

        Logger.debug("Workflow State", state);

    }

    // ==========================================
    // Start Workflow
    // ==========================================

    async function start() {

        if (isRunning) {

            Logger.warn("Workflow already running.");

            return;

        }

        isRunning = true;

        UI.showLoader("Checking login...");

        Logger.group("Workflow");

        try {

            // -----------------------------
            // Check Website Login
            // -----------------------------

            setState(WORKFLOW_STATE.CHECKING_LOGIN);

            const login = await Auth.checkLogin();

            if (!login.success) {

                UI.setStatus(
                    "Please login to Axyres to continue.",
                    "error"
                );

                chrome.tabs.create({
                    url: `${CONFIG.WEBSITE_URL}/login`
                });

                return;

            }

            // -----------------------------
            // Scrape Job
            // -----------------------------

            UI.showLoader("Scraping job...");

            setState(WORKFLOW_STATE.SCRAPING_JOB);

const result = await JobScraper.scrape();

            if (!result.success) {

                UI.showNotification(
                    result.error,
                    "error"
                );

                return;

            }

            currentJob = result.job;

            Logger.debug(
                "Scraped Job",
                currentJob
            );

            // -----------------------------
            // Clear previous tailored resume cache
            // -----------------------------
            await chrome.storage.local.remove("tailoredResume");
            currentTailoredResume = null;

            // -----------------------------
            // Show Result
            // -----------------------------

            UI.showScrapedJob(currentJob);

            UI.enableReview();

            UI.enableDownload();

            UI.setStatus(
                "Job scraped successfully.",
                "success"
            );

            Logger.info(
                "Workflow Completed"
            );

        }
        catch (error) {

            Logger.error(
                "Workflow Error",
                error
            );

            UI.showNotification(
                error.message || "Unknown Error",
                "error"
            );

        }
        finally {

            UI.hideLoader();

            isRunning = false;

            Logger.groupEnd();

        }

    }


    // ==========================================
// Resume Check
// ==========================================

async function processResume(action) {
    try {
        if (action === "download") {
            UI.showLoader("Generating PDF...");
            const result = await chrome.storage.local.get("tailoredResume");
            const storedResume = result.tailoredResume;

            if (!storedResume) {
                UI.showNotification("Generate a tailored resume before downloading.", "warning");
                return;
            }

            const pdfResponse = await ExtensionApi.pdf({
                resume: storedResume,
                job: currentJob
            });

            if (!pdfResponse.success) {
                UI.showNotification("PDF generation failed.", "error");
                return;
            }

            // API returns { success, data: { success, data: { pdfUrl, filename } } }
            const pdfUrl = pdfResponse.data?.data?.pdfUrl || pdfResponse.data?.pdfUrl;
            
            console.log(">>> PDF URL:", pdfUrl);
            console.log(">>> Full PDF Response:", JSON.stringify(pdfResponse));

            if (!pdfUrl) {
                UI.showNotification("PDF URL not found. Please try again.", "error");
                UI.hideLoader();
                return;
            }

            // Format dynamic filename
            const name = storedResume.personalInfo?.name?.replace(/\s+/g, '_') || "Candidate";
            const jobTitle = currentJob?.title?.replace(/[^a-zA-Z0-9]/g, '_') || "Tailored";
            const dynamicFilename = `${name}_${jobTitle}_Resume.pdf`;

            console.log(">>> Downloading:", dynamicFilename, "from", pdfUrl);

            chrome.downloads.download({
                url: pdfUrl,
                filename: dynamicFilename,
                saveAs: false
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error(">>> Download Error:", chrome.runtime.lastError);
                    UI.showNotification("Download failed: " + chrome.runtime.lastError.message, "error");
                } else {
                    console.log(">>> Download started, ID:", downloadId);
                    UI.showNotification("Resume Downloaded ✓", "success");
                }
                UI.hideLoader();
            });
            return;
        }

        UI.showLoader("Checking resume...");
        const response = await ExtensionApi.status();

        if (!response.success) {
            UI.showNotification("Unable to verify account.", "error");
            return;
        }

        const data = response.data;

        if (!data.loggedIn) {
            chrome.tabs.create({ url: `${CONFIG.WEBSITE_URL}/login` });
            UI.showNotification("Please login first.", "warning");
            return;
        }

        if (!data.resumeExists) {
            chrome.tabs.create({ url: `${CONFIG.WEBSITE_URL}/resume-start?alert=missing_resume` });
            UI.showNotification("Please upload your resume first.", "error");
            return;
        }

        UI.showNotification("Resume Found ✓", "success");
        UI.showLoader("Fetching resume...");

        const resumeResponse = await ExtensionApi.latestResume();

        if (!resumeResponse.success) {
            UI.showNotification("Unable to fetch resume.", "error");
            return;
        }

        const resume = resumeResponse.data?.resume?.resumeData;

        if (!resume) {
            chrome.tabs.create({ url: `${CONFIG.WEBSITE_URL}/resume-start?alert=missing_resume` });
            UI.showNotification("Please upload your resume first.", "error");
            return;
        }

        Logger.info("Latest Resume Received", resume);
        currentResume = resume;

        // Phase 4: AI Tailoring
        let tailorResponseData = null;

        UI.showLoader("Tailoring resume with AI...");

        const tailorResponse = await ExtensionApi.tailor({
            resume: currentResume,
            job: {
                title: currentJob.title,
                company: currentJob.company,
                skills: currentJob.skills,
                description: currentJob.description.substring(0, 3000)
            }
        });

        if (!tailorResponse.success) {
            UI.showNotification("Resume tailoring failed.", "error");
            return;
        }

        Logger.info("Tailored Resume Received", tailorResponse.data);
        tailorResponseData = tailorResponse.data.data;
        currentTailoredResume = tailorResponseData;
        
        // Fix: Ensure the tailored resume preserves the selected template
        currentTailoredResume.templateId = currentResume.templateId || 1;

        await chrome.storage.local.set({
            tailoredResume: currentTailoredResume
        });

        // Sync tailored resume to backend database
        const saveResponse = await ExtensionApi.saveLatest({
            templateId: currentResume.templateId || 1,
            resumeData: tailorResponseData
        });

        if (!saveResponse.success) {
            Logger.warn("Failed to sync tailored resume to backend DB", saveResponse);
        } else {
            Logger.info("Tailored resume synced to DB successfully");
        }

        if (action === "review") {
            chrome.tabs.create({ url: chrome.runtime.getURL("review.html") });
        }

        UI.showNotification("Resume Loaded ✓", "success");

    } finally {
        UI.hideLoader();
    }
}

    // ==========================================
    // Review
    // ==========================================

async function review() {

    console.log(">>> REVIEW CLICKED <<<");

    Logger.info("Review Resume Clicked");

    await processResume("review");
}

    // ==========================================
    // Download
    // ==========================================
async function download() {

    console.log(">>> DOWNLOAD CLICKED <<<");

    Logger.info("Download Resume Clicked");

    await processResume("download");
}

    // ==========================================
    // Helpers
    // ==========================================

    function getCurrentJob() {

        return currentJob;

    }

    function getState() {

        return workflowState;

    }

    function isBusy() {

        return isRunning;

    }

    function clear() {

        currentJob = null;

        workflowState = WORKFLOW_STATE.IDLE;

        isRunning = false;

    }

    function getCurrentResume() {

    return currentResume;

}



    // ==========================================
    // Public API
    // ==========================================
function checkCurrentPage(){

    if(JobDetector.canScrape()){


        UI.enableScrape();


        UI.setStatus(
            "Job page detected",
            "success"
        );


    }
    else{


        UI.disableScrape();


        UI.setStatus(
            "Open a supported job posting to continue.",
            "warning"
        );

        UI.showNotification(
            "Open a supported job posting to continue.",
            "info"
        );


    }

}


// ==========================================
// Public API
// ==========================================

return {

    initialize,

    start,

    review,

    download,

    checkCurrentPage,

    getCurrentJob,

    getCurrentResume,

    getState,

    isBusy,

    clear

};


})();