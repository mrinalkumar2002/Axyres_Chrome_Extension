// ==========================================
// AXYRES Background Service Worker
// ==========================================


chrome.runtime.onInstalled.addListener(() => {

    console.log(
        "Axyres Extension Installed"
    );


    // Enable side panel on extension icon click
    chrome.sidePanel.setPanelBehavior({

        openPanelOnActionClick: true

    });

});



chrome.runtime.onStartup.addListener(() => {

    console.log(
        "Axyres Extension Started"
    );

});



// ==========================================
// Open Axyres Side Panel From Floating Button
// ==========================================

chrome.runtime.onMessage.addListener(
    
    (message, sender) => {


        if (
            message.action === "OPEN_AXYRES_PANEL"
        ) {


            console.log(
                "Opening Axyres Side Panel"
            );


            chrome.sidePanel.open({

                tabId: sender.tab.id

            });

        }


    }

);