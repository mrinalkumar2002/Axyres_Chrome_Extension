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
    console.log("Axyres Extension Started");
});

function broadcastPageChanged(tabId) {
    chrome.runtime.sendMessage({ action: "PAGE_CHANGED", tabId }).catch(() => {});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' || changeInfo.url) {
        broadcastPageChanged(tabId);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    broadcastPageChanged(activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
            if (tabs.length > 0) broadcastPageChanged(tabs[0].id);
        });
    }
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

                windowId: sender.tab.windowId

            });

        }


    }

);