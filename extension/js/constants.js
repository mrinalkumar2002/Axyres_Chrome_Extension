// ==========================================
// AXYRES Constants
// ==========================================

const STATUS = Object.freeze({

    SUCCESS: "success",

    ERROR: "error",

    WARNING: "warning",

    INFO: "info",

    LOADING: "loading"

});

// ==========================================
// Job Sites
// ==========================================

const JOB_SITES = Object.freeze({

    LINKEDIN: "LinkedIn",

    INDEED: "Indeed",

    NAUKRI: "Naukri",

    GLASSDOOR: "Glassdoor"

});

// ==========================================
// Workflow States
// ==========================================

const WORKFLOW_STATE = Object.freeze({

    IDLE: "idle",

    CHECKING_LOGIN: "checking_login",

    CHECKING_RESUME: "checking_resume",

    SCRAPING_JOB: "scraping_job",

    FETCHING_RESUME: "fetching_resume",

    EXTRACTING_JOB: "extracting_job",

    TAILORING_RESUME: "tailoring_resume",

    REVIEW_READY: "review_ready",

    GENERATING_PDF: "generating_pdf",

    DOWNLOADING: "downloading",

    COMPLETED: "completed"

});

// ==========================================
// Popup Messages
// ==========================================

const MESSAGES = Object.freeze({

    LOGIN_REQUIRED: "Please login to Axyres first.",

    RESUME_REQUIRED: "Please upload your resume first.",

    SCRAPING: "Scraping job details...",

    FETCHING_RESUME: "Fetching latest resume...",

    EXTRACTING: "Analyzing job description...",

    TAILORING: "Tailoring your resume...",

    REVIEW_READY: "Resume is ready for review.",

    GENERATING: "Generating PDF...",

    DOWNLOAD_COMPLETE: "Resume downloaded successfully.",

    JOB_NOT_SUPPORTED: "This page is not supported.",

    UNKNOWN_ERROR: "Something went wrong."

});

// ==========================================
// Button IDs
// ==========================================

const BUTTONS = Object.freeze({

    SCRAPE: "scrapeBtn",

    REVIEW: "reviewBtn",

    DOWNLOAD: "downloadBtn"

});

// ==========================================
// UI Element IDs
// ==========================================

const UI_IDS = Object.freeze({

    STATUS: "status",

    MESSAGE: "message",

    LOADER: "loader"

});

// ==========================================
// Chrome Runtime Messages
// ==========================================

const EVENTS = Object.freeze({

    SCRAPE_JOB: "SCRAPE_JOB"

});

// ==========================================
// Error Codes
// ==========================================

const ERROR_CODES = Object.freeze({

    NETWORK: "NETWORK_ERROR",

    LOGIN: "LOGIN_REQUIRED",

    RESUME: "RESUME_REQUIRED",

    SCRAPE: "SCRAPE_FAILED",

    AI: "AI_FAILED",

    PDF: "PDF_FAILED",

    UNKNOWN: "UNKNOWN_ERROR"

});

// ==========================================
// Export
// ==========================================

window.STATUS = STATUS;
window.JOB_SITES = JOB_SITES;
window.WORKFLOW_STATE = WORKFLOW_STATE;
window.MESSAGES = MESSAGES;
window.BUTTONS = BUTTONS;
window.UI_IDS = UI_IDS;
window.EVENTS = EVENTS;
window.ERROR_CODES = ERROR_CODES;