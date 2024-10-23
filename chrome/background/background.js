chrome.commands.onCommand.addListener(async (command) => {
  if (command === "take-screenshot") {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
        chrome.storage.local.set({ screenshot: dataUrl });
        chrome.action.openPopup();  // Open popup to display screenshot
      });
    } catch (error) {
      console.error("Error taking screenshot:", error);
    }
  }
});
