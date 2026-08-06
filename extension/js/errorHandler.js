// ==========================================
// AXYRES Error Handler
// ==========================================

const ErrorHandler = (() => {

    // ==========================================
    // Default Messages
    // ==========================================

    const DEFAULT_MESSAGES = {

        NETWORK:
            "Network connection failed.",

        LOGIN:
            "Please login to continue.",

        RESUME:
            "Resume not found.",

        SCRAPE:
            "Unable to scrape this job page.",

        AI:
            "AI request failed.",

        PDF:
            "Unable to generate PDF.",

        UNKNOWN:
            "Something went wrong."

    };

    // ==========================================
    // Get Message
    // ==========================================

    function getMessage(error) {

        if (!error)
            return DEFAULT_MESSAGES.UNKNOWN;

        if (typeof error === "string")
            return error;

        if (error.message)
            return error.message;

        if (error.error)
            return error.error;

        return DEFAULT_MESSAGES.UNKNOWN;

    }

    // ==========================================
    // Handle Error
    // ==========================================

    function handle(error, options = {}) {

        const message = getMessage(error);

        Logger.error(message, error);

        if (options.showUI !== false) {

            UI.showMessage(message);

        }

        return {

            success: false,

            error: message

        };

    }

    // ==========================================
    // Async Wrapper
    // ==========================================

    async function wrap(fn, options = {}) {

        try {

            return await fn();

        }

        catch (error) {

            return handle(error, options);

        }

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        handle,

        wrap,

        getMessage

    };

})();

window.ErrorHandler = ErrorHandler;