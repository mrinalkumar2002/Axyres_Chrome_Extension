// ==========================================
// AXYRES Extension Configuration
// ==========================================

const CONFIG = Object.freeze({

    WEBSITE_API: "http://localhost:4000",

    AI_API: "http://localhost:5001",

    WEBSITE_URL: "http://localhost:5173",

    TIMEOUT: 120000,

    SUPPORTED_SITES: [

        {
            name: "LinkedIn",
            hostname: "linkedin.com"
        },

        {
            name: "Indeed",
            hostname: "indeed.com"
        },

        {
            name: "Naukri",
            hostname: "naukri.com"
        },

        { name: "Glassdoor", hostname: "glassdoor.com" },
        { name: "Foundit", hostname: "foundit.in" },
        { name: "Monster", hostname: "monster.com" },
        { name: "Wellfound", hostname: "wellfound.com" },
        { name: "Internshala", hostname: "internshala.com" },
        { name: "Greenhouse", hostname: "greenhouse.io" },
        { name: "Lever", hostname: "lever.co" },
        { name: "Workday", hostname: "workdayjobs.com" },
        { name: "SuccessFactors", hostname: "successfactors.com" },
        { name: "Oracle Careers", hostname: "oraclecloud.com" },
        { name: "SmartRecruiters", hostname: "smartrecruiters.com" },
        { name: "Ashby", hostname: "ashbyhq.com" }
    ]

});