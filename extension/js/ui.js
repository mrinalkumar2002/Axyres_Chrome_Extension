// ======================================================
// AXYRES AI EXTENSION
// UI MODULE
// Phase 3 - Part 1
// ======================================================

const UI = (() => {
    

    // ==================================================
    // Cached Elements
    // ==================================================

    const elements = {};

    // ==================================================
    // Screen Names
    // ==================================================

    const SCREENS = {

        OPEN: "open",

        SCRAPE: "scrape",

        RESULT: "result"

    };

    // ==================================================
    // Initialize
    // ==================================================

    function init() {

        // Status

        elements.status =
            document.getElementById("statusMessage");

        // Loader

        elements.loader =
            document.getElementById("loader");

        // Screens

        elements.openScreen =
            document.getElementById("openJobScreen");

        elements.scrapeScreen =
            document.getElementById("scrapeScreen");

        elements.resultScreen =
            document.getElementById("jobResultScreen");

        // Job Output

        elements.jobOutput =
            document.getElementById("jobOutput");

        // Resume Actions

        elements.resumeActions =
            document.getElementById("resumeActions");

        elements.reviewBtn =
            document.getElementById("reviewBtn");

        elements.downloadBtn =
            document.getElementById("downloadBtn");

            // Resume Button Events

if (elements.reviewBtn) {

    elements.reviewBtn.addEventListener(
        "click",
        Workflow.review
    );

}


if (elements.downloadBtn) {

    elements.downloadBtn.addEventListener(
        "click",
        Workflow.download
    );

}

        // Progress

        elements.progressCard =
            document.getElementById("progressCard");

        elements.progressText =
            document.getElementById("progressText");

        elements.progressFill =
            document.getElementById("progressFill");

        // Notification

        elements.notification =
            document.getElementById("notification");

        elements.notificationText =
            document.getElementById("notificationText");

        elements.notificationIcon =
            document.getElementById("notificationIcon");

        // Footer

        elements.footerStatus =
            document.getElementById("footerStatus");

    }

    // ==================================================
    // Helper
    // ==================================================

    function show(element) {

        if (!element) return;

        element.classList.remove("hidden");

    }

    function hide(element) {

        if (!element) return;

        element.classList.add("hidden");

    }

    // ==================================================
    // Hide All Screens
    // ==================================================

    function hideAllScreens() {

        hide(elements.openScreen);

        hide(elements.scrapeScreen);

        hide(elements.resultScreen);

    }

    // ==================================================
    // Screen Controller
    // ==================================================

    function showScreen(screen) {

        hideAllScreens();

        switch (screen) {

            case SCREENS.OPEN:

                show(elements.openScreen);

                break;

            case SCREENS.SCRAPE:

                show(elements.scrapeScreen);

                break;

            case SCREENS.RESULT:

                show(elements.resultScreen);

                break;

        }

    }

    // ==================================================
    // Public Screen Methods
    // ==================================================

    function showOpenJob() {

        showScreen(SCREENS.OPEN);

    }

    function showScrape() {

        showScreen(SCREENS.SCRAPE);

    }

    function showJobResult() {

        showScreen(SCREENS.RESULT);

    }

    // ==================================================
    // Resume Actions
    // ==================================================

    function showResumeActions() {

        show(elements.resumeActions);

    }

    function hideResumeActions() {

        hide(elements.resumeActions);

    }

    // ==================================================
    // Reset UI
    // ==================================================

    function reset() {

        hideAllScreens();

        hide(elements.loader);

        hide(elements.progressCard);

        hide(elements.notification);

        hideResumeActions();

        if (elements.jobOutput) {

            elements.jobOutput.innerHTML = "";

        }

        if (elements.progressFill) {

            elements.progressFill.style.width = "0%";

        }

        if (elements.progressText) {

            elements.progressText.textContent =
                "Waiting...";

        }

        if (elements.footerStatus) {

            elements.footerStatus.textContent =
                "Ready";

        }

    }

        // ==================================================
    // STATUS
    // ==================================================

    function setStatus(message, type = "info") {

        if (!elements.status) return;

        elements.status.textContent = message;

        elements.status.className = "status-message";

        switch (type) {

            case "success":

                elements.status.classList.add(
                    "status-success"
                );

                break;

            case "error":

                elements.status.classList.add(
                    "status-error"
                );

                break;

            case "loading":

                elements.status.classList.add(
                    "status-loading"
                );

                break;

        }

        if (elements.footerStatus) {

            elements.footerStatus.textContent = message;

        }

    }

    // ==================================================
    // LOADER
    // ==================================================

    function showLoader(text = "Please wait...") {

        if (!elements.loader) return;

        show(elements.loader);

        const loaderText =
            elements.loader.querySelector(".loader-text");

        if (loaderText) {

            loaderText.textContent = text;

        }

    }

    function hideLoader() {

        hide(elements.loader);

    }

    // ==================================================
    // PROGRESS
    // ==================================================

    function showProgress(text, percentage = 0) {

        show(elements.progressCard);

        if (elements.progressText) {

            elements.progressText.textContent = text;

        }

        if (elements.progressFill) {

            elements.progressFill.style.width =
                `${percentage}%`;

        }

    }

    function hideProgress() {

        hide(elements.progressCard);

    }

    function updateProgress(state) {

        switch (state) {

            case WORKFLOW_STATE.CHECKING_LOGIN:

                showProgress(
                    "Checking login...",
                    10
                );

                break;

            case WORKFLOW_STATE.SCRAPING_JOB:

                showProgress(
                    "Scraping job...",
                    35
                );

                break;

            case WORKFLOW_STATE.CHECKING_RESUME:

                showProgress(
                    "Checking resume...",
                    55
                );

                break;

            case WORKFLOW_STATE.FETCHING_RESUME:

                showProgress(
                    "Fetching resume...",
                    70
                );

                break;

            case WORKFLOW_STATE.TAILORING_RESUME:

                showProgress(
                    "Tailoring resume...",
                    90
                );

                break;

            case WORKFLOW_STATE.GENERATING_PDF:

                showProgress(
                    "Generating PDF...",
                    98
                );

                break;

            case WORKFLOW_STATE.COMPLETED:

                showProgress(
                    "Completed",
                    100
                );

                break;

        }

    }

    // ==================================================
    // NOTIFICATION
    // ==================================================

    function showNotification(
        message,
        type = "info"
    ) {

        if (!elements.notification) return;

        show(elements.notification);

        if (elements.notificationText) {

            elements.notificationText.textContent =
                message;

        }

        if (!elements.notificationIcon) return;

        const icon =
            elements.notificationIcon.querySelector("i");

        if (!icon) return;

        switch (type) {

            case "success":

                icon.className =
                    "fas fa-circle-check";

                break;

            case "warning":

                icon.className =
                    "fas fa-triangle-exclamation";

                break;

            case "error":

                icon.className =
                    "fas fa-circle-xmark";

                break;

            default:

                icon.className =
                    "fas fa-circle-info";

        }

    }

    function hideNotification() {

        hide(elements.notification);

    }

    // ==================================================
    // BUTTONS
    // ==================================================

    function enableReview() {

        showResumeActions();

        if (elements.reviewBtn) {

            elements.reviewBtn.disabled = false;

        }

    }

    function disableReview() {

        if (elements.reviewBtn) {

            elements.reviewBtn.disabled = true;

        }

    }

    function enableDownload() {

        showResumeActions();

        if (elements.downloadBtn) {

            elements.downloadBtn.disabled = false;

        }

    }

    function disableDownload() {

        if (elements.downloadBtn) {

            elements.downloadBtn.disabled = true;

        }

    }

function enableScrape() {


    const openJobScreen =
        document.getElementById(
            "openJobScreen"
        );


    const scrapeScreen =
        document.getElementById(
            "scrapeScreen"
        );


    if(openJobScreen){

        openJobScreen.classList.add(
            "hidden"
        );

    }


    if(scrapeScreen){

        scrapeScreen.classList.remove(
            "hidden"
        );

    }


    const scrapeBtn =
        document.getElementById(
            "scrapeBtn"
        );


    if(scrapeBtn){

        scrapeBtn.disabled = false;

    }


}

function disableScrape() {


    const openJobScreen =
        document.getElementById(
            "openJobScreen"
        );


    const scrapeScreen =
        document.getElementById(
            "scrapeScreen"
        );


    if(openJobScreen){

        openJobScreen.classList.remove(
            "hidden"
        );

    }


    if(scrapeScreen){

        scrapeScreen.classList.add(
            "hidden"
        );

    }

}
    // ==================================================
// SHOW SCRAPED JOB
// ==================================================

function showScrapedJob(job) {

    showJobResult();

    if (!elements.jobOutput) return;

    elements.jobOutput.innerHTML = `
        <div class="job-card">

            <h3>${job.title || "N/A"}</h3>

            <p><strong>Company:</strong> ${job.company || "N/A"}</p>

            <p><strong>Location:</strong> ${job.location || "N/A"}</p>

            <p><strong>Experience:</strong> ${job.experience || "N/A"}</p>

            <p><strong>Skills:</strong></p>

            <div class="skills">
                ${(job.skills || []).join(", ")}
            </div>

            <p><strong>Description</strong></p>

            <div class="description">
                ${job.description || ""}
            </div>

        </div>
    `;

    showResumeActions();

    if (elements.reviewBtn)
        elements.reviewBtn.disabled = false;

    if (elements.downloadBtn)
        elements.downloadBtn.disabled = false;

    setStatus("Job scraped successfully", "success");
}

  return {

    init,
    reset,

    showOpenJob,
    showScrape,
    showJobResult,
    showScrapedJob,   // <-- ADD THIS

    setStatus,

    showLoader,
    hideLoader,

    showProgress,
    hideProgress,
    updateProgress,

    showNotification,
    hideNotification,

    enableReview,
    disableReview,

    enableDownload,
    disableDownload,

    enableScrape,
    disableScrape

};

})();
