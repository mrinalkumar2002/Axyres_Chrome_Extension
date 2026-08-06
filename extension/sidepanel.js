// ==========================================
// AXYRES SIDE PANEL
// ==========================================


console.log(
    "SIDE PANEL JS LOADED"
);


// ==========================================
// Page Change Listener
// ==========================================


chrome.runtime.onMessage.addListener(
async (message)=>{


    console.log(
        "SIDE PANEL MESSAGE:",
        message
    );


    if(message.action !== "PAGE_CHANGED") {

        return;

    }


    console.log(
        "Refreshing Job Detection..."
    );


    setTimeout(async ()=>{


        console.log(
            "Workflow:",
            typeof Workflow
        );


        console.log(
            "JobDetector:",
            typeof JobDetector
        );


        console.log(
            "UI:",
            typeof UI
        );



        if(typeof JobDetector === "undefined"){


            console.error(
                "JobDetector not available in sidepanel"
            );


            return;

        }



        const detection =
            await JobDetector.detect();



        console.log(
            "JOB DETECTION OBJECT:",
            detection
        );



        const isJobPage =
            detection?.canScrape === true;



        console.log(
            "JOB DETECTION RESULT:",
            isJobPage
        );



        if(isJobPage){


            console.log(
                "Switching to SCRAPE mode"
            );


            UI.enableScrape();


            UI.setStatus(
                "Job page detected",
                "success"
            );


        }
        else{


            console.log(
                "Switching to NON JOB mode"
            );


            UI.disableScrape();


            UI.setStatus(
                "Open a job posting to scrape",
                "warning"
            );


        }


    },500);


});