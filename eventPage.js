chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.browserAction.setBadgeBackgroundColor({ color: '#201c55' });
    chrome.browserAction.setBadgeText({ text: request.isActive ? 'ON' : 'OFF' });
});