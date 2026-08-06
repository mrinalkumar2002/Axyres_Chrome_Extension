// ==========================================
// AXYRES Authentication Module
// ==========================================

const Auth = (() => {

    let currentUser = null;
    let extensionToken = null;

    // ==========================================
    // Check Website Login
    // ==========================================

    async function checkLogin() {

        return ErrorHandler.wrap(async () => {

            Logger.info("Checking Website Login");

            const response = await ExtensionApi.status();

            const validation =
                Validator.validateResponse(response);

            if (!validation.valid) {

                return ErrorHandler.handle(
                    validation.message,
                    { showUI: false }
                );

            }

            const data = response.data;

            if (!data.success) {

                return ErrorHandler.handle(
                    data.message || MESSAGES.UNKNOWN_ERROR,
                    { showUI: false }
                );

            }

            if (!data.loggedIn) {

                currentUser = null;

                Logger.warn("User is not logged in.");

                return {

                    success: false,

                    error: MESSAGES.LOGIN_REQUIRED

                };

            }

            currentUser = data.user || null;

            const userValidation =
                Validator.validateUser(currentUser);

            if (!userValidation.valid) {

                return ErrorHandler.handle(
                    userValidation.message,
                    { showUI: false }
                );

            }

            Logger.info("Login Verified");

            Logger.debug("Current User", currentUser);

            return {

                success: true,

                user: currentUser

            };

        });

    }

    // ==========================================
    // Get Extension Token
    // ==========================================

    async function getExtensionToken() {

        return ErrorHandler.wrap(async () => {

            Logger.info("Fetching Extension Token");

            const response =
                await ExtensionApi.extensionToken();

            const validation =
                Validator.validateResponse(response);

            if (!validation.valid) {

                return ErrorHandler.handle(
                    validation.message,
                    { showUI: false }
                );

            }

            const data = response.data;

            if (!data.success) {

                return ErrorHandler.handle(

                    data.message ||

                    "Unable to fetch extension token.",

                    { showUI: false }

                );

            }

            if (!data.token) {

                return ErrorHandler.handle(

                    "Extension token missing.",

                    { showUI: false }

                );

            }

            extensionToken = data.token;

            Logger.info("Extension Token Generated");

            return {

                success: true,

                token: extensionToken

            };

        });

    }

    // ==========================================
    // Get Current User
    // ==========================================

    function getCurrentUser() {

        return currentUser;

    }

    // ==========================================
    // Get Extension Token
    // ==========================================

    function getToken() {

        return extensionToken;

    }

    // ==========================================
    // Clear Authentication
    // ==========================================

    function clear() {

        Logger.debug("Clearing Authentication Cache");

        currentUser = null;

        extensionToken = null;

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        checkLogin,

        getExtensionToken,

        getCurrentUser,

        getToken,

        clear

    };

})();