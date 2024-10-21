document.addEventListener('DOMContentLoaded', function() {
    const screenshotImg = document.getElementById('screenshot');
    const statusDiv = document.getElementById('status');
    const copyButton = document.getElementById('copyButton');
    const newTabButton = document.getElementById('newTabButton');
    const shareButton = document.querySelector('.button-container .button-below:last-child');
    let imageBlob = null;
    let imageUrl = null;

    chrome.runtime.sendMessage({action: "getScreenshot"}, function(response) {
        if (response && response.dataUrl) {
            screenshotImg.src = response.dataUrl;
            imageUrl = response.dataUrl;
            statusDiv.textContent = "Screenshot captured!";
            copyButton.disabled = false;
            newTabButton.disabled = false;
            shareButton.disabled = false;
            
            // Convert data URL to Blob
            fetch(response.dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    imageBlob = blob;
                });
        } else {
            statusDiv.textContent = "Failed to capture screenshot.";
        }
    });

    copyButton.addEventListener('click', function() {
        if (imageBlob) {
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': imageBlob
                })
            ]).then(function() {
                statusDiv.textContent = "Image copied to clipboard!";
            }, function(error) {
                console.error("Unable to copy image to clipboard:", error);
                statusDiv.textContent = "Failed to copy image to clipboard.";
            });
        }
    });

    newTabButton.addEventListener('click', function() {
        if (imageUrl) {
            chrome.tabs.create({ url: imageUrl });
        }
    });

    shareButton.addEventListener('click', function() {
        // tbd
        // if (imageBlob) {
        //     const file = new File([imageBlob], 'screenshot.png', { type: 'image/png' });
        //     const shareData = {
        //         files: [file],
        //     };
            
        //     if (navigator.canShare && navigator.canShare(shareData)) {
        //         navigator.share(shareData)
        //             .then(() => statusDiv.textContent = "Screenshot shared successfully!")
        //             .catch((error) => {
        //                 console.error("Error sharing screenshot:", error);
        //                 statusDiv.textContent = "Failed to share screenshot.";
        //             });
        //     } else {
        //         statusDiv.textContent = "Sharing is not supported on this device or browser.";
        //     }
        // }
    });
});