/**
 * Clicks the back button. Throws if button is not
 * available to the user.
 */
function clickBackButton() {
    try {
        const backButton = document.getElementsByClassName('btn-flat back headerButton')[0];
        _tapElement(backButton);
    } catch (error) {
        throw 'Unable to click back button.';
    }
}

/**
 * Clicks the 400 token bronze pack button.
 */
function clickBronzePackButton() {
    try {
        const bronzePackButton = document.getElementsByClassName('currency call-to-action cCoins')[0];
        _tapElement(bronzePackButton);
    } catch (error) {
        throw 'Unable to click bronze pack button.';
    }
}

/**
 * Clicks "Buy Now" button.
 */
function clickBuyNowButton() {
    const buyNowButton = document.getElementsByClassName('buyButton')[0];

    if (buyNowButton) {
        _tapElement(buyNowButton);
    } else {
        throw 'Unable to find "Buy Now" button.';
    }
}

/**
 * Clicks the "Compare Price" button.
 */
function clickComparePrice() {
    try {
        const quickListPanelActions = _getQuickListPanelActions();
        const buttons = quickListPanelActions.getElementsByTagName('button');
        const comparePriceButton = buttons[buttons.length - 1];
        _tapElement(comparePriceButton);
    } catch (error) {
        try {
            const detailsPanel = document.getElementsByClassName('DetailPanel')[0];
            const buttonList = detailsPanel.getElementsByTagName('ul')[0];
            const buttons = Array.from(buttonList.getElementsByTagName('button'));
            _tapElement(buttons[buttons.length - 1]);
        } catch (error) {
            throw 'Unable to click "Compare Price" button.';
        }
    }
}

/**
 * Finds and clicks a button in the details panel. If the button can't
 * be found or if it's not available to the user, this function throws.
 *
 * @param {string} buttonLabel
 */
function clickDetailsPanelButton(buttonLabel) {
    commonUtility.log(`Attempting to press "${buttonLabel}" button...`);

    try {
        // Get buttons in the details panel.
        const detailsPanel = document.getElementsByClassName('DetailPanel')[0];
        const detailsPanelButtons = detailsPanel.getElementsByTagName('button');
        const buttonArray = Array.from(detailsPanelButtons);

        // Find target button by searching by label.
        const button = buttonArray.filter((button) => button.innerText.indexOf(buttonLabel) > -1 && button.style.display !== 'none')[0];

        // Click target button.
        _tapElement(button);
    } catch (error) {
        throw `Unable to locate the "${buttonLabel}" button.`;
    }

    commonUtility.log(`Successfully pressed "${buttonLabel}" button.`);
}

/**
 * Clicks the "Search" button.
 *
 * TODO: Make this work.
 */
function clickSearchButton() {
    throw 'This shortfut is in development.';

    try {
        const searchButton = document.getElementsByClassName('btn btn-raised call-to-action')[0];
        _tapElement(searchButton);
    } catch (error) {
        commonUtility.logError(error);
        throw 'Unable to click "Search" button.';
    }
}

/**
 * Clicks "Watch" or "Unwatch" button. Throws if button isn't found
 * or is not available.
 */
function clickWatchButton() {
    try {
        const watchButton = document.getElementsByClassName('watch')[0];
        _tapElement(watchButton);
    } catch (error) {
        throw 'Unable to click "Watch" or "Unwatch" button.';
    }
}

/**
 * Presses "OK" button in confirmation dialog.
 */
function confirmDialog() {
    setTimeout(() => {
        try{
            const okButton = document.getElementsByClassName('Dialog')[0].getElementsByClassName('btn-flat')[1];
            _tapElement(okButton);
        } catch (error) {
            commonUtility.logError(error);
        }
    }, commonUtility.getRandomWait());
}

/**
 * Gets currently selected index in list of items.
 *
 * @param {Array} items
 */
function getCurrentSelectedIndex(items) {
    return items.findIndex((item) => { return item.className.indexOf('selected') > -1; })
}

/**
 * Gets list items on the page.
 */
function getListItems() {
    let items = [];

    if (isUserOnPage('Search Results')) {
        const itemList = document.getElementsByClassName('paginated-item-list')[0];
        items = Array.from(itemList.getElementsByClassName('listFUTItem'));
    } else if (isUserOnPage('Transfer List')) {
        const itemLists = Array.from(document.getElementsByClassName('itemList'));
        itemLists.forEach(function(itemList) {
            items = items.concat(Array.from(itemList.getElementsByClassName('listFUTItem')));
        }, this);
    } else {
        const itemList = document.getElementsByClassName('itemList')[0];
        items = Array.from(itemList.getElementsByClassName('listFUTItem'));
    }

    return items;
}

/**
 * Goes to a specific tab in the "Store" page. It
 * requires the user to already be on that page.
 *
 * @param {string} tab
 */
function goToStoreTab(tab) {
    if (tab === 'Bronze') {
        // Select the last tab, which contain the bronze packs.
        const packTabButtons = document.getElementsByClassName('TabMenuItem');
        const bronzeTabButton = packTabButtons[packTabButtons.length - 1];
        _tapElement(bronzeTabButton);
    }
}

/**
 * Checks if user is on specific page, based on the input.
 *
 * @param {string} pageTitle
 */
function isUserOnPage(pageTitle) {
    const title = document.getElementById('futHeaderTitle');
    return title && title.innerHTML === pageTitle;
}

/**
 * Sets the starting price and BIN price for an item.
 *
 * @param {number} startingPrice
 * @param {number} binPrice
 */
function listItem(startingPrice, binPrice) {
    // Set starting price and BIN price for selected item.
    const quickListPanelActions = _getQuickListPanelActions();
    const actionRows = quickListPanelActions.getElementsByClassName('panelActionRow');

    const startPriceRow = actionRows[1];
    const startPriceInput = startPriceRow.getElementsByTagName('input')[0];
    startPriceInput.value = startingPrice;

    const binRow = actionRows[2];
    const binInput = binRow.getElementsByTagName('input')[0];
    binInput.value = binPrice;

    // Tap "List Item" button.
    const buttons = quickListPanelActions.getElementsByTagName('button');
    const listItemButton = buttons[buttons.length - 2];
    _tapElement(listItemButton);
}

/**
 * Selects the next item in the list. Returns the index
 * of that item.
 *
 * @param {Array} items
 * @param {number} currentIndex
 */
function selectNextItem(items, currentIndex) {
    try {
        const nextItem = items[++currentIndex].getElementsByClassName('has-tap-callback')[0];
        _tapElement(nextItem);

        return currentIndex;
    } catch (error) {
        throw 'Unable to select next item.';
    }
}

/**
 * Selects the previous item in the list. Returns the index
 * of that item.
 *
 * @param {Array} items
 * @param {number} currentIndex
 */
function selectPreviousItem(items, currentIndex) {
    try {
        const previousItem = items[--currentIndex].getElementsByClassName('has-tap-callback')[0];
        _tapElement(previousItem);

        return currentIndex;
    } catch (error) {
        throw 'Unable to select previous item.';
    }
}

/**
 * Gets the quick list panel actions div.
 */
function _getQuickListPanelActions() {
    try {
        const quickListPanel = document.getElementsByClassName('QuickListPanel')[0];
        const quickListPanelActions = quickListPanel.getElementsByClassName('panelActions')[0];
        return quickListPanelActions;
    } catch (error) {
        throw 'Unable to get Quick List Panel actions.';
    }
}

/**
 * Dispatches a touch event on the element.
 * https://stackoverflow.com/a/42447620
 *
 * @param {HTMLElement} element
 * @param {string} eventType
*/
function _sendTouchEvent(element, eventType) {
    const touchObj = new Touch({
        identifier: 'Keyboard shortcuts should be supported natively without an extension!',
        target: element,
        clientX: 0,
        clientY: 0,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5
    });

    const touchEvent = new TouchEvent(eventType, {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [touchObj],
        changedTouches: [touchObj],
        shiftKey: true
    });

    element.dispatchEvent(touchEvent);
}

/**
 * Simulates a tap/click on an element.
 *
 * @param {HTMLElement} element
 */
function _tapElement(element) {
    _sendTouchEvent(element, 'touchstart');
    _sendTouchEvent(element, 'touchend');
}

window.domUtility = {
    clickBackButton,
    clickBronzePackButton,
    clickBuyNowButton,
    clickComparePrice,
    clickDetailsPanelButton,
    clickSearchButton,
    clickWatchButton,
    confirmDialog,
    getCurrentSelectedIndex,
    getListItems,
    goToStoreTab,
    isUserOnPage,
    listItem,
    selectNextItem,
    selectPreviousItem
};