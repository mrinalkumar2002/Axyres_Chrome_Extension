// ==========================================
// AXYRES Job Detector Module
// ==========================================

const JobDetector = (() => {

    // ==========================================
    // Current Tab
    // ==========================================

    async function getCurrentTab() {

        try {

            const [tab] = await chrome.tabs.query({

                active: true,

                currentWindow: true

            });

            return tab || null;

        }

        catch (error) {

            Logger.error("Unable to get current tab", error);

            return null;

        }

    }

    // ==========================================
    // Detect Supported Website
    // ==========================================

    function detectSite(url) {

        if (!url) return null;

        return CONFIG.SUPPORTED_SITES.find(site =>

            url.includes(site.hostname)

        ) || null;

    }

    // ==========================================
    // Job Page Detection
    // ==========================================
// ==========================================
// Detect Job Detail Page
// ==========================================

function isJobPage(url) {

    if (!url) return false;

    const patterns = [

        // LinkedIn
        /linkedin\.com\/jobs\/view/i,
        /linkedin\.com\/jobs\/collections/i,
        /linkedin\.com\/jobs\/search/i,

        // Indeed
        /indeed\..+\/viewjob/i,
        /indeed\..+[?&]vjk=/i,
        /indeed\..+[?&]jk=/i,

        // Naukri
        /naukri\.com\/job-listings/i,
        /naukri\.com\/.*-\d+$/i,

        // Foundit
        /foundit\.in/i,

        // Monster
        /monster\./i,

        // Glassdoor
        /glassdoor\./i,

        // Greenhouse
        /greenhouse\.io/i,

        // Lever
        /lever\.co/i,

        // Workday
        /workdayjobs\./i,

        // SmartRecruiters
        /smartrecruiters\.com/i,

        // Wellfound
        /wellfound\.com/i,

        // ZipRecruiter
        /ziprecruiter\.com/i,

        // Dice
        /dice\.com/i,

        // Hirist
        /hirist\.tech/i,

        // Cutshort
        /cutshort\.io/i,

        // TimesJobs
        /timesjobs\.com/i,
        // Shine
        /shine\.com/i,
        // FreshersWorld
        /freshersworld\.com/i,
        // SuccessFactors
        /successfactors\.com/i,
        // Oracle Careers
        /oraclecloud\.com/i,
        // Ashby
        /ashbyhq\.com/i,
        // Internshala
        /internshala\.com/i
    ];

    return patterns.some(pattern => pattern.test(url));

}

    // ==========================================
    // Detect Current Page
    // ==========================================

    async function detect() {

        Logger.group("Job Detection");

        const tab = await getCurrentTab();

        if (!tab) {

            Logger.error("No active tab");

            Logger.groupEnd();

            return {

                success: false,

                supported: false,

                canScrape: false,

                error: "Unable to access current tab."

            };

        }

        Logger.debug("Current URL", tab.url);

        const site = detectSite(tab.url);

        if (!site) {

            Logger.warn("Unsupported Website");

            Logger.groupEnd();

            return {

                success: true,

                supported: false,

                site: null,

                url: tab.url,

                canScrape: false,

                tabId: tab.id

            };

        }
let canScrape = isJobPage(tab.url);


// Confirm actual job page
if (
    site.name === "Naukri" &&
    canScrape
) {

    try {

        const result = await chrome.scripting.executeScript({

            target: {
                tabId: tab.id
            },

            func: () => {

                const title =
                    document.querySelector("h1");


                const description =
                    document.querySelector(
                        "[class*='dang-inner-html'], .job-desc"
                    );


                return !!(
                    title &&
                    description
                );

            }

        });


        canScrape =
            result?.[0]?.result === true;


    } catch(error) {

        console.error(
            "Naukri validation failed",
            error
        );


        canScrape = false;

    }

}

        Logger.info("Detected Site", site.name);

        Logger.info("Can Scrape", canScrape);

        Logger.groupEnd();

        return {

            success: true,

            supported: true,

            site: site.name,

            url: tab.url,

            canScrape,

            tabId: tab.id

        };

    }

    // ==========================================
    // Public API
    // ==========================================

    return {

        detect,

        getCurrentTab,

        detectSite,

        isJobPage

    };

})();