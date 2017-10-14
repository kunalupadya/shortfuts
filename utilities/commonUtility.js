const APP_NAME = 'shortfuts';

/**
 * Logs a message to the console with app information.
 *
 * @param {string} message
 */
function log(message, isError) {
    console.log(`${APP_NAME}: ${message}`);
}

/**
 * Logs an error to the console with app information.
 *
 * @param {string} message
 */
function logError(message) {
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

window.commonUtility = {
    log,
    logError,
    getRandomWait,
    getRandomLongerWait
};
