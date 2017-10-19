// App name to prefix logging messages.
const APP_NAME = 'shortfuts';

// Running collection of log messages from user's current session.
let logs = '';

function collectLogs() {
    _copyTextToClipboard(logs);
}

/**
 * Logs a message to the console with app information.
 *
 * @param {string} message
 */
function log(message, isError) {
    _storeMessage(message);
    console.log(`${APP_NAME}: ${message}`);
}

/**
 * Logs an error to the console with app information.
 *
 * @param {string} message
 */
function logError(message) {
    _storeMessage(message);
    console.error(`${APP_NAME}: ${message}`);
}

/**
 * Gets a random short wait time.
 */
function getRandomWait() {
    return Math.floor(Math.random() * (300 - 150)) + 150;
}

/**
 * Gets a random longer wait time.
 */
function getRandomLongerWait() {
    return Math.floor(Math.random() * (2000 - 1000)) + 1000;
}

/**
 * Copies text to clipboard.
 *
 * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 *
 * @param {string} text
 */
function _copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

/**
 * Initialize logs with browser information.
 */
function _initializeLogs() {
    logs += `Browser language: ${navigator.language}\n`;
    logs += `Browser version: ${window.clientInformation.userAgent}\n\n`;
}

/**
 * Stores the log message in a local cache for log
 * collection if necessary.
 *
 * @param {string} message
 */
function _storeMessage(message) {
    logs += `${(new Date()).toLocaleString()}: ${message}\n`;
}

// Initialize logs with browser information.
_initializeLogs();

window.commonUtility = {
    collectLogs,
    log,
    logError,
    getRandomWait,
    getRandomLongerWait
};
