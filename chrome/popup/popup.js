document.addEventListener("DOMContentLoaded", async () => {
    const img = document.getElementById("screenshot");
    const controls = document.getElementById("controls");
    const captureBtn = document.getElementById("capture-btn");
  
    chrome.storage.local.get("screenshot", ({ screenshot }) => {
      if (screenshot) {
        img.src = screenshot;
        img.style.display = "block";
        controls.style.display = "flex";
        captureBtn.style.display = "none";
      } else {
        captureBtn.style.display = "block";
      }
    });
  
    // Capture screenshot when no screenshot is present
    captureBtn.addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
        chrome.storage.local.set({ screenshot: dataUrl });
        img.src = dataUrl;
        img.style.display = "block";
        controls.style.display = "flex";
        captureBtn.style.display = "none";
      });
    });
  
    document.getElementById("save-btn").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = img.src;
      a.download = "screenshot.png";
      a.click();
    });
  
    document.getElementById("share-btn").addEventListener("click", async () => {
      // if (navigator.canShare && navigator.canShare({ files: [new File([img.src], "screenshot.png")] })) {
      //   await navigator.share({ files: [new File([img.src], "screenshot.png")] });
      // }
      console.log("share");
    });
  
    document.getElementById("copy-btn").addEventListener("click", async () => {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        // alert("Image copied to clipboard");
      } catch (error) {
        console.error("Error copying image:", error);
      }
    });
  
    document.getElementById("delete-btn").addEventListener("click", () => {
      img.src = "";
      chrome.storage.local.remove("screenshot");
      img.style.display = "none";
      controls.style.display = "none";
      captureBtn.style.display = "block";
    });
  
    document.getElementById("open-tab-btn").addEventListener("click", () => {
      chrome.tabs.create({ url: img.src });
    });
  });
  