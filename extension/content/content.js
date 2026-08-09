// ==========================================
// AXYRES Content Script
// ==========================================


// ==========================================
// Create Axyres Floating Button
// ==========================================

function createAxyresButton() {

    if (document.getElementById("axyres-button")) {
        return;
    }


    const button = document.createElement("button");

    button.id = "axyres-button";

  button.innerHTML = `

<img 
src="${chrome.runtime.getURL("logo.jpeg")}"
style="
width:40px;
height:40px;
transform:rotate(90deg);
border-radius:10px;
"
/>

<span>
Axyres
</span>

`;


button.style.position = "fixed";

button.style.right = "0px";

button.style.top = "50%";

button.style.transform = "translateY(-50%)";

button.style.zIndex = "999999";


button.style.display = "flex";

button.style.flexDirection = "column";

button.style.alignItems = "center";

button.style.justifyContent = "center";


button.style.padding = "12px 18px";


button.style.border = "none";

button.style.borderRadius = "30px 0 0 30px";


button.style.cursor = "pointer";


button.style.background = "#111827";

button.style.color = "white";


button.style.fontSize = "14px";

button.style.fontWeight = "600";


button.style.boxShadow =
"0 4px 12px rgba(0,0,0,0.25)";

    button.onclick = () => {

        chrome.runtime.sendMessage({

            action: "OPEN_AXYRES_PANEL"

        });

    };


    document.body.appendChild(button);


    console.log(
        "Axyres Button Added"
    );

}


// ==========================================
// Start Content Script
// ==========================================

(function(){

    console.log("Axyres Content Loaded");

    const url = window.location.href;
    const isJobSite = /linkedin\.com|indeed\.|naukri\.com|foundit\.in|monster\.|glassdoor\.|greenhouse\.io|lever\.co|workdayjobs\.|smartrecruiters\.com/i.test(url);

    if (isJobSite) {
        createAxyresButton();
    }

})();


console.log(
    "AXYRES CONTENT ACTIVE",
    window.location.href
);

(() => {

    console.log("Axyres Content Script Loaded");

    // ==========================================
    // Message Listener
    // ==========================================

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

        if (request.action !== "SCRAPE_JOB") {
            return;
        }

        scrapeCurrentPage()
            .then(sendResponse)
            .catch(error => {

                sendResponse({

                    success: false,

                    error: error.message || "Failed to scrape page."

                });

            });

        return true;

    });

    // ==========================================
    // Main Scraper
    // ==========================================

    async function scrapeCurrentPage() {

        const hostname = window.location.hostname;

        let job = null;

        if (hostname.includes("linkedin.com")) {

            job = scrapeLinkedIn();

        } else if (hostname.includes("indeed.com")) {

            job = scrapeIndeed();

        } else if (
            hostname.includes("naukri.com") ||
            hostname.includes("foundit.in")
        ) {

            job = scrapeNaukri();

        } else if (hostname.includes("glassdoor.com")) {

            job = scrapeGlassdoor();

        } else {
            job = scrapeGeneric();
        }

        return {

            success: true,

            job: normalizeJob(job)

        };

    }

    // ==========================================
// Generic Fallback Scraper
// ==========================================
function scrapeGeneric() {
    return {
        title: document.title || "Unknown Title",
        company: window.location.hostname.replace('www.', ''),
        location: "",
        description: document.body.innerText.substring(0, 15000),
        employmentType: "",
        experience: "",
        workplaceType: "",
        salary: "",
        skills: [],
        source: window.location.hostname
    };
}

    // ==========================================
    // LinkedIn
    // ==========================================
// ==========================================
// LinkedIn Scraper
// ==========================================

function scrapeLinkedIn() {

    const getText = (selectors) => {

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const getDescription = () => {

        const selectors = [

            ".jobs-description__content",

            ".jobs-box__html-content",

            ".jobs-description",

            ".jobs-description-content",

            "[class*='jobs-description']"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const title = getText([

        "h1",

        ".job-details-jobs-unified-top-card__job-title",

        ".t-24"

    ]);

    const company = getText([

        ".job-details-jobs-unified-top-card__company-name",

        ".jobs-unified-top-card__company-name",

        "[class*='company-name']"

    ]);

    const location = getText([

        ".job-details-jobs-unified-top-card__primary-description-container",

        ".jobs-unified-top-card__bullet",

        "[class*='primary-description']"

    ]);

    const description = getDescription();

    const infoItems = Array.from(

        document.querySelectorAll(

            ".job-details-jobs-unified-top-card__job-insight, .jobs-unified-top-card__job-insight"

        )

    ).map(item => item.innerText.trim());

    let employmentType = "";

    let experience = "";

    let workplaceType = "";

    infoItems.forEach(item => {

        const value = item.toLowerCase();

        if (
            value.includes("full-time") ||
            value.includes("part-time") ||
            value.includes("contract") ||
            value.includes("internship") ||
            value.includes("temporary")
        ) {

            employmentType = item;

        }

        if (
            value.includes("entry") ||
            value.includes("associate") ||
            value.includes("mid") ||
            value.includes("senior") ||
            value.includes("director") ||
            value.includes("executive")
        ) {

            experience = item;

        }

        if (
            value.includes("remote") ||
            value.includes("hybrid") ||
            value.includes("on-site") ||
            value.includes("onsite")
        ) {

            workplaceType = item;

        }

    });

    return {

        title,

        company,

        location,

        description,

        employmentType,

        experience,

        workplaceType,

        salary: "",

        skills: [],

        source: "LinkedIn"

    };

}

    // ==========================================
    // Indeed
    // ==========================================

    // ==========================================
// Indeed Scraper
// ==========================================

function scrapeIndeed() {

    const getText = (selectors) => {

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const getDescription = () => {

        const selectors = [

            "#jobDescriptionText",

            "[data-testid='jobsearch-JobComponent-description']",

            ".jobsearch-jobDescriptionText",

            ".jobsearch-JobComponent-description",

            "[class*='jobDescription']",

            "[class*='job-description']",

            ".jobDescriptionText"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        // Fallback: grab all main content text
        const mainContent = document.querySelector("[role='main']") || document.querySelector("main");
        if (mainContent?.innerText?.trim()) {
            return mainContent.innerText.trim().substring(0, 15000);
        }

        return "";

    };

    const title = getText([

        "[data-testid='jobsearch-JobInfoHeader-title']",

        ".jobsearch-JobInfoHeader-title",

        "h1",

        "h2.jobTitle",

        ".job-title",

        "[class*='JobInfoHeader'] h1"

    ]);

    const company = getText([

        "[data-testid='inlineHeader-companyName']",

        "[data-testid='company-name']",

        ".jobsearch-InlineCompanyRating div:first-child",

        ".jobsearch-InlineCompanyRating a",

        "[class*='companyName']",

        "[class*='company-name']"

    ]);

    const location = getText([

        "[data-testid='job-location']",

        "[data-testid='inlineHeader-companyLocation']",

        ".jobsearch-JobInfoHeader-subtitle div:last-child",

        "[class*='companyLocation']",

        "[class*='job-location']"

    ]);

    const salary = getText([

        "#salaryInfoAndJobType",

        "[data-testid='attribute_snippet_testid']",

        "[class*='salary']",

        ".jobsearch-JobMetadataHeader-item"

    ]);

    const employmentType = getText([

        "[data-testid='jobsearch-JobDescriptionSection-sectionItem']",

        "[class*='jobType']",

        "[class*='JobType']"

    ]);

    const description = getDescription();

    // Extract skills from job details section
    const skills = [];
    document.querySelectorAll("[class*='skill'], [class*='Skill'], [class*='tag'], [class*='chip']").forEach(el => {
        const val = el.innerText?.trim();
        if (val && val.length < 50) skills.push(val);
    });

    return {

        title: title || document.title?.split(' - ')?.[0] || "",

        company,

        location,

        description,

        employmentType,

        experience: "",

        workplaceType: "",

        salary,

        skills,

        source: "Indeed"

    };

}

    // ==========================================
    // Naukri
    // ==========================================
// ==========================================
// Naukri Scraper
// ==========================================

function scrapeNaukri() {

    const getText = (selectors) => {

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const getDescription = () => {

        const selectors = [

            ".styles_JDC__dang-inner-html__h0K4t",

            ".dang-inner-html",

            ".job-desc",

            "[class*='job-desc']",

            "[class*='dang-inner-html']"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const title = getText([

        "h1",

        ".styles_jd-header-title__rZwM1",

        "[class*='jd-header-title']"

    ]);

    const company = getText([

        ".styles_jd-header-comp-name__MvqAI",

        "[class*='comp-name']",

        ".comp-name"

    ]);

    const location = getText([

        ".styles_jhc__location__W_pVs",

        "[class*='location']"

    ]);

    const experience = getText([

        ".styles_jhc__exp__k_giM",

        "[class*='exp']"

    ]);

    const salary = getText([

        ".styles_jhc__salary__jdfEC",

        "[class*='salary']"

    ]);

    const description = getDescription();

    // ===============================
    // Skills
    // ===============================

    const skills = [];

    document.querySelectorAll(

        ".styles_chip__7YCfG, .chip, [class*='chip']"

    ).forEach(skill => {

        const value = skill.innerText.trim();

        if (value) {
            skills.push(value);
        }

    });

    return {

        title,

        company,

        location,

        description,

        employmentType: "",

        experience,

        workplaceType: "",

        salary,

        skills,

        source: "Naukri"

    };

}

    // ==========================================
    // Glassdoor
    // ==========================================

  // ==========================================
// Glassdoor Scraper
// ==========================================

function scrapeGlassdoor() {

    const getText = (selectors) => {

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const getDescription = () => {

        const selectors = [

            "[data-test='jobDescription']",

            ".jobDescriptionContent",

            ".desc",

            "[class*='jobDescription']",

            "[class*='description']"

        ];

        for (const selector of selectors) {

            const element = document.querySelector(selector);

            if (element?.innerText?.trim()) {
                return element.innerText.trim();
            }

        }

        return "";

    };

    const title = getText([

        "h1",

        "[data-test='job-title']",

        "[class*='job-title']"

    ]);

    const company = getText([

        "[data-test='employer-name']",

        "[class*='employerName']",

        "[class*='company']"

    ]);

    const location = getText([

        "[data-test='location']",

        "[class*='location']"

    ]);

    const salary = getText([

        "[data-test='detailSalary']",

        "[class*='salary']"

    ]);

    const description = getDescription();

    return {

        title,

        company,

        location,

        description,

        employmentType: "",

        experience: "",

        workplaceType: "",

        salary,

        skills: [],

        source: "Glassdoor"

    };

}

    // ==========================================
    // Normalize
    // ==========================================

    function normalizeJob(job = {}) {

        // Safely convert any value to string, replacing NaN/undefined/null
        const safe = (val) => {
            if (val === null || val === undefined) return "";
            const str = String(val);
            return (str === "NaN" || str === "undefined" || str === "null") ? "" : str.trim();
        };

        return {

            title: safe(job.title),

            company: safe(job.company),

            location: safe(job.location),

            description: safe(job.description),

            employmentType: safe(job.employmentType),

            experience: safe(job.experience),

            salary: safe(job.salary),

            workplaceType: safe(job.workplaceType),

            skills: Array.isArray(job.skills) ? job.skills.filter(Boolean).map(s => safe(s)) : [],

            source: window.location.hostname,

            url: window.location.href

        };

    }

})();



(() => {
console.log(
    "Current Axyres Page:",
    window.location.href
);

// ==========================================
// AXYRES PAGE CHANGE WATCHER
// ==========================================

function sendPageChange(){

    console.log(
        "AXYRES PAGE CHANGED:",
        window.location.href
    );


    chrome.runtime.sendMessage({

        action:"PAGE_CHANGED",

        url:window.location.href

    });

}


// initial

sendPageChange();



let oldUrl = window.location.href;


// detect URL changes

setInterval(()=>{


    if(oldUrl !== window.location.href){


        oldUrl = window.location.href;


        sendPageChange();


    }


},1000);


// ==========================================
// Detect SPA URL Changes
// ==========================================
// ==========================================
// AXYRES SPA PAGE CHANGE DETECTOR
// ==========================================

function notifyPageChange() {

    console.log(
        "AXYRES PAGE CHECK:",
        window.location.href
    );


    chrome.runtime.sendMessage({

        action: "PAGE_CHANGED",

        url: window.location.href

    });

}


// Initial

notifyPageChange();


// Detect pushState navigation

const originalPushState = history.pushState;

history.pushState = function () {

    originalPushState.apply(this, arguments);

    setTimeout(() => {

        notifyPageChange();

    }, 500);

};


// Detect back/forward

window.addEventListener(
    "popstate",
    () => {

        setTimeout(() => {

            notifyPageChange();

        },500);

    }
);


// Fallback watcher

let currentUrl = window.location.href;


setInterval(()=>{


    if(currentUrl !== window.location.href){


        currentUrl = window.location.href;


        notifyPageChange();


    }


},1000);

})();