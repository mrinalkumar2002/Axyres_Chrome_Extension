// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Axyres Extension Installed');
  
  // Initialize storage
  chrome.storage.local.set({
    axyres_analytics: {
      resumesGenerated: 0,
      downloads: 0,
      lastUsed: new Date().toISOString()
    },
    axyres_settings: {
      defaultTemplate: 'ats',
      defaultFormat: 'pdf',
      autoScrape: true,
      showBadge: true
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    chrome.action.openPopup();
  }
  
  if (message.action === 'updateAnalytics') {
    chrome.storage.local.get(['axyres_analytics'], (result) => {
      const analytics = result.axyres_analytics || {};
      analytics[message.key] = (analytics[message.key] || 0) + 1;
      chrome.storage.local.set({ axyres_analytics: analytics });
    });
  }
  
  if (message.action === 'getUser') {
    chrome.storage.local.get(['axyres_user'], (result) => {
      sendResponse(result.axyres_user);
    });
    return true; // Required for async response
  }
});

// Listen for tab updates to check for job pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isJobSite = /(linkedin\.com\/jobs|indeed\.com\/viewjob|\/careers\/|\/jobs\/)/.test(tab.url);
    
    if (isJobSite) {
      // Inject content script if not already injected
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).catch(err => console.log('Script injection failed:', err));
    }
  }
});

// Sync with backend periodically
setInterval(async () => {
  const user = await chrome.storage.local.get(['axyres_user']);
  
  if (user.axyres_user && user.axyres_user.token) {
    try {
      const response = await fetch('https://axyres-landingpage.onrender.com/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.axyres_user.token}`
        },
        body: JSON.stringify({
          analytics: await chrome.storage.local.get(['axyres_analytics'])
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          chrome.storage.local.set({ axyres_user: data.user });
        }
      }
    } catch (error) {
      console.log('Sync failed:', error);
    }
  }
}, 300000); // Every 5 minutes