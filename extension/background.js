chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "OPEN_POPUP") {
    chrome.action.openPopup();
  }
});