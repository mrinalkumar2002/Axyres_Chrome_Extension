// ==========================================
// AXYRES Extension API Layer
// ==========================================

const ExtensionApi = (() => {

    // ==========================================
    // Base Request
    // ==========================================

    async function request(url, options = {}) {

        return ErrorHandler.wrap(async () => {

            Logger.group("API Request");

            Logger.info(`${options.method || "GET"} ${url}`);

            const controller = new AbortController();

            const timeout = setTimeout(() => {

                controller.abort();

            }, CONFIG.TIMEOUT);

            try {

                const response = await fetch(url, {

                    credentials: "include",

                    signal: controller.signal,

                    ...options

                });

                clearTimeout(timeout);

                let data = {};

                try {

                    data = await response.json();

                } catch {

                    Logger.warn("Response is not valid JSON");

                }

                Logger.debug("Status", response.status);
                Logger.debug("Response", data);

                if (!response.ok) {

                    return ErrorHandler.handle(

                        data.message ||

                        `HTTP ${response.status}`,

                        { showUI: false }

                    );

                }

                Logger.groupEnd();

                return {

                    success: true,

                    status: response.status,

                    data

                };

            } catch (error) {

                clearTimeout(timeout);

                if (error.name === "AbortError") {

                    return ErrorHandler.handle(

                        "Request Timeout",

                        { showUI: false }

                    );

                }

                return ErrorHandler.handle(

                    error,

                    { showUI: false }

                );

            }

        });

    }

    // ==========================================
    // GET
    // ==========================================

    function get(endpoint) {

        Logger.debug("GET", endpoint);

        return request(endpoint, {

            method: "GET"

        });

    }

    // ==========================================
    // POST
    // ==========================================

    function post(endpoint, body = {}) {

        Logger.group("POST Request");

        Logger.debug("Endpoint", endpoint);

        Logger.debug("Payload", body);

        console.log("========== API REQUEST ==========");
        console.log("Endpoint:", endpoint);
        console.log("Payload:", body);
        console.log("=================================");

        Logger.groupEnd();

        return request(endpoint, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        });

    }

    // ==========================================
    // Website APIs
    // ==========================================

    function status() {

        return get(

            `${CONFIG.WEBSITE_API}/api/extension/status`

        );

    }

    

    function checkResume() {

    return get(

        `${CONFIG.WEBSITE_API}/api/extension/resume`

    );

}

    function latestResume() {

        return get(

            `${CONFIG.WEBSITE_API}/api/resume/latest`

        );

    }

    function saveLatest(payload) {
        return post(
            `${CONFIG.WEBSITE_API}/api/resume/save-latest`,
            payload
        );
    }

    function extensionToken() {

        return get(

            `${CONFIG.WEBSITE_API}/api/extension/token`

        );

    }

    // ==========================================
    // AI APIs
    // ==========================================

    function extract(jobDescription) {

        Logger.info("Sending Job Description to AI");

        Logger.debug(

            "Description Length",

            jobDescription?.length || 0

        );

        Logger.debug(

            "Description Preview",

            jobDescription?.substring(0, 300)

        );

        return post(

            `${CONFIG.AI_API}/api/extract`,

            {

                text: jobDescription,

                jobDescription: jobDescription,

                description: jobDescription

            }

        );

    }

    function tailor(payload) {

        Logger.info("Sending Resume Tailoring Request");

        return post(

            `${CONFIG.AI_API}/api/tailor`,

            payload

        );

    }

    function pdf(payload) {

        Logger.info("Generating Resume PDF");

        return post(

            `${CONFIG.AI_API}/api/pdf`,

            payload

        );

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        request,

        get,

        post,

        status,

        latestResume,
        
        saveLatest,

        extensionToken,

        extract,

        tailor,

        pdf

    };

})();