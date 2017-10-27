var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-108017342-1']);

var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.isActive !== undefined) {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#201c55' });
        chrome.browserAction.setBadgeText({ text: request.isActive ? 'ON' : 'OFF' });
    } else if (request.trackBuyBronzePack) {
        _gaq.push(['_trackEvent', 'telemetry', 'buyBronzePack']);
    } else if (request.trackBuyNow) {
        _gaq.push(['_trackEvent', 'telemetry', 'buyNow']);
    } else if (request.trackListItem) {
        _gaq.push(['_trackEvent', 'telemetry', 'listItem']);
    } else if (request.trackListMinBin) {
        _gaq.push(['_trackEvent', 'telemetry', 'listMinBin']);
    } else if (request.trackQuickSell) {
        _gaq.push(['_trackEvent', 'telemetry', 'quickSell']);
    } else if (request.trackSearch) {
        _gaq.push(['_trackEvent', 'telemetry', 'search']);
    } else if (request.trackComparePrice) {
        _gaq.push(['_trackEvent', 'telemetry', 'comparePrice']);
    } else if (request.trackSendToTransferList) {
        _gaq.push(['_trackEvent', 'telemetry', 'sendToTransferList']);
    } else if (request.trackStoreInClub) {
        _gaq.push(['_trackEvent', 'telemetry', 'storeInClub']);
    } else if (request.trackFutbin) {
        _gaq.push(['_trackEvent', 'telemetry', 'futbin']);
    }
});