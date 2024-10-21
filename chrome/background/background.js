let currentScreenshot = null;

chrome.action.onClicked.addListener((tab) => {
  captureScreenshot();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getScreenshot") {
    if (currentScreenshot) {
      sendResponse({dataUrl: currentScreenshot});
    } else {
      captureScreenshot().then(dataUrl => {
        sendResponse({dataUrl: dataUrl});
      });
    }
    return true; // Indicates we wish to send a response asynchronously
  }
});

function captureScreenshot() {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      currentScreenshot = dataUrl;
      resolve(dataUrl);
    });
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    captureScreenshot();
    chrome.tabs.create({url : "popup/popup.html"}); 
    popup.cancel();
  }
});