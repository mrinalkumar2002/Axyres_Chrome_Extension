// ==========================================
// AXYRES Workflow Module
// ==========================================

const Workflow = (() => {

    let currentTabId = null;
    let currentJob = null;
    let currentResume = null;

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

        UI.showLoader("Checking resume...");

        const response = await ExtensionApi.status();

        if (!response.success) {
            UI.showNotification("Unable to verify account.", "error");
            return;
        }

        const data = response.data;

        if (!data.loggedIn) {

            chrome.tabs.create({
                url: `${CONFIG.WEBSITE_URL}/login`
            });

            UI.showNotification(
                "Please login first.",
                "warning"
            );

            return;
        }

        if (!data.resumeExists) {

            chrome.tabs.create({
                url: `${CONFIG.WEBSITE_URL}/resume`
            });

            UI.showNotification(
                "Please upload your resume first.",
                "warning"
            );

            return;
        }

        UI.showNotification(
            "Resume Found ✓",
            "success"
        );

        // Phase 2 ends here.

        UI.showLoader("Fetching resume...");

        const resumeResponse =
    await ExtensionApi.latestResume();


if (!resumeResponse.success) {

    UI.showNotification(
        "Unable to fetch resume.",
        "error"
    );

    return;

}


const resume =
    resumeResponse.data?.resume?.resumeData;



if (!data.resumeExists) {

    chrome.tabs.create({
        url: `${CONFIG.WEBSITE_URL}/resume`
    });

    UI.showNotification(
        "Please upload your resume first.",
        "warning"
    );

    return;
}



console.log(
    "RESUME FETCHED FROM WEBSITE:",
    JSON.stringify(
        resume,
        null,
        2
    )
);


console.log(
    "RESUME DATA:",
    resume
);



Logger.info(
    "Latest Resume Received",
    resume
);


// Temporary storage for next phases
currentResume = resume;

// ==========================================
// Phase 4: AI Tailoring
// ==========================================

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

    UI.showNotification(
        "Resume tailoring failed.",
        "error"
    );

    return;

}


Logger.info(
    "Tailored Resume Received",
    tailorResponse.data
);

console.log(
    "FULL TAILORED RESPONSE:",
    JSON.stringify(
        tailorResponse,
        null,
        2
    )
);

chrome.storage.local.set({

    tailoredResume:
        tailorResponse.data.data

});


if (action === "review") {


    chrome.tabs.create({

        url: chrome.runtime.getURL(
            "review.html"
        )

    });


}



if (action === "download") {


    UI.showLoader(
        "Generating PDF..."
    );


    const pdfResponse =
        await ExtensionApi.pdf({

            resume:
                tailorResponse.data.data,

            job:
                currentJob

        });



    if (!pdfResponse.success) {


        UI.showNotification(
            "PDF generation failed.",
            "error"
        );


        return;

    }



    const pdfUrl =
        pdfResponse.data.pdfUrl;



    chrome.downloads.download({

        url:
            pdfUrl,


        filename:
            "Axyres_Tailored_Resume.pdf",


        saveAs:
            true

    });


}


UI.showNotification(
    "Resume Loaded ✓",
    "success"
);

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
            "Open a job posting to scrape",
            "warning"
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