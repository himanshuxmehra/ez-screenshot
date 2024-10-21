chrome.runtime.sendMessage({action: "getScreenshot"});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showScreenshot") {
    document.getElementById('screenshot').src = request.dataUrl;
  }
});