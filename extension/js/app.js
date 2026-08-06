function bindEvents() {

    const scrapeBtn = document.getElementById("scrapeBtn");

    if (scrapeBtn) {
        scrapeBtn.addEventListener("click", async () => {
            await Workflow.start();
        });
    }

    const openJobBtn = document.getElementById("openJobBtn");

    if (openJobBtn) {
        openJobBtn.addEventListener("click", async () => {

            const tab = await JobDetector.getCurrentTab();

            if (tab) {
                chrome.tabs.update(tab.id, {
                    url: "https://www.linkedin.com/jobs/"
                });
            }

        });
    }

}


async function initializePopup() {

    console.log("1");

    UI.init();

    console.log("2");

    UI.reset();

    console.log("3");

    bindEvents();

    console.log("4");

    const page = await JobDetector.detect();

    console.log("5", page);

    if (!page.success || !page.supported || !page.canScrape) {
        console.log("6");
        UI.showOpenJob();
        return;
    }

    console.log("7");

    Workflow.initialize(page.tabId);

  console.log("Showing Scrape Screen");

UI.showScrape();

console.log("Scrape Screen", document.getElementById("scrapeScreen"));

console.log(
    "Classes:",
    document.getElementById("scrapeScreen").className
);

UI.enableScrape();

    console.log("8");
}

document.addEventListener("DOMContentLoaded", initializePopup);