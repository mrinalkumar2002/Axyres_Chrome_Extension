// ==========================================
// AXYRES Logger
// ==========================================

const Logger = (() => {

    // ==========================================
    // Configuration
    // ==========================================

    const DEBUG =
        CONFIG?.DEBUG ?? true;

    // ==========================================
    // Timestamp
    // ==========================================

    function timestamp() {

        return new Date().toLocaleTimeString();

    }

    // ==========================================
    // Info
    // ==========================================

    function info(message, data = null) {

        if (!DEBUG) return;

        console.info(

            `[INFO ${timestamp()}] ${message}`,

            data ?? ""

        );

    }

    // ==========================================
    // Warning
    // ==========================================

    function warn(message, data = null) {

        if (!DEBUG) return;

        console.warn(

            `[WARN ${timestamp()}] ${message}`,

            data ?? ""

        );

    }

    // ==========================================
    // Error
    // ==========================================

    function error(message, data = null) {

        console.error(

            `[ERROR ${timestamp()}] ${message}`,

            data ?? ""

        );

    }

    // ==========================================
    // Debug
    // ==========================================

    function debug(message, data = null) {

        if (!DEBUG) return;

        console.debug(

            `[DEBUG ${timestamp()}] ${message}`,

            data ?? ""

        );

    }

    // ==========================================
    // Group
    // ==========================================

    function group(title) {

        if (!DEBUG) return;

        console.group(title);

    }

    function groupEnd() {

        if (!DEBUG) return;

        console.groupEnd();

    }

    // ==========================================
    // Table
    // ==========================================

    function table(data) {

        if (!DEBUG) return;

        console.table(data);

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        info,

        warn,

        error,

        debug,

        group,

        groupEnd,

        table

    };

})();

window.Logger = Logger;