function incrementMaxPrice() {
    try {
        const incrementMaxPriceButton = document.querySelector('.searchPrices > .price-filter:last-of-type .incrementBtn');
        _tapElement(incrementMaxPriceButton);
    } catch (error) {
        throw 'Unable to click increment max price button.';
    }
}

function decrementMaxPrice() {
    try {
        const decrementMaxPriceButton = document.querySelector('.searchPrices > .price-filter:last-of-type .decrementBtn');
        _tapElement(decrementMaxPriceButton);
    } catch (error) {
        throw 'Unable to click decrement max price button.';
    }
}

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
        const _buttons = document.getElementsByTagName('button');
        const buttons = Array.from(_buttons);
        for (button of buttons) {
            if (button && button.innerHTML && button.innerHTML.indexOf('Compare Price') > -1) {
                _tapElement(button);
                return;
            }
        }
    } catch (error) {
        throw 'Unable to click "Compare Price" button.';
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
        // Expand "List on Transfer Market" section.
        if (buttonLabel === 'List Item') {
            const _buttons = document.getElementsByTagName('button');
            const buttons = Array.from(_buttons);
            for (button of buttons) {
                if (button && button.innerHTML.indexOf('List on Transfer Market') > -1) {
                    _tapElement(button);

                    setTimeout(() => {
                        // Get buttons in the details panel.
                        const detailsPanel = document.getElementsByClassName('DetailPanel')[0];
                        const detailsPanelButtons = detailsPanel.getElementsByTagName('button');
                        const buttonArray = Array.from(detailsPanelButtons);

                        // Find target button by searching by label.
                        const _button = buttonArray.filter((__button) => __button.innerHTML.indexOf(buttonLabel) > -1 && __button.style.display !== 'none')[0];

                        // Click target button.
                        _tapElement(_button);
                    }, 1000);

                    return;
                }
            }
        }

        // Get buttons in the details panel.
        const detailsPanel = document.getElementsByClassName('DetailPanel')[0];
        const detailsPanelButtons = detailsPanel.getElementsByTagName('button');
        const buttonArray = Array.from(detailsPanelButtons);

        // Find target button by searching by label.
        const _button = buttonArray.filter((foo) => foo.innerHTML.indexOf(buttonLabel) > -1 && foo.style.display !== 'none')[0];

        // Click target button.
        _tapElement(_button);
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
    try {
        const searchButton = document.querySelector('.call-to-action');
        _tapElement(searchButton);
    } catch (error) {
        commonUtility.logError(error);
        throw 'Unable to click "Search" button.';
    }
}

/**
 * Clicks the "Modify Search" button.
 *
 */
function clickModifySearchButton() {
    try {
        const modifySearchButton = document.querySelector('.noResultsScreen .call-to-action');
        if (modifySearchButton) {
            _tapElement(modifySearchButton);
        }
    } catch (error) {
        commonUtility.logError(error);
        throw 'Unable to click "Modify Search" button.';
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
 * Gets the ID of the element so we can find its price.
 *
 * @param {HTMLElement} item
 */
function getItemId(item) {
    try {
        const imageSrc = item.getElementsByClassName('photo')[0].currentSrc;
        const lastIndexOfSlash = imageSrc.lastIndexOf('/');
        const id = imageSrc.substring(lastIndexOfSlash + 1, imageSrc.length - 4);
        return id;
    } catch (error) {
        throw 'Unable to get item ID.';
    }
}

/**
 * Gets list items on the page.
 */
function getListItems() {
    let items = [];

    if (isUserOnPage('Search Results') || isUserOnPage('Players')) {
        const itemList = document.getElementsByClassName('paginated-item-list')[0];
        items = Array.from(itemList.getElementsByClassName('listFUTItem'));
    } else if (isUserOnPage('Transfer List') || isUserOnPage('Unassigned')) {
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
 * Determines if item is a TOTW player
 *
 * @param {HTMLElement} item
 */
function isTotwPlayer(item) {
    try {
        const isTotw = !!item.getElementsByClassName('TOTW')[0];
        return isTotw
    } catch (error) {
        throw 'Unable to determine if player is TOTW.';
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

    // Get all buttons in "List on Transfer Market" section.
    const _buttons = quickListPanelActions.getElementsByTagName('button');
    const buttons = Array.from(_buttons);

    // Find button with "List Item" as text and tap it.
    let listItemButton;
    for (button of buttons) {
        if (button && button.innerHTML === 'List Item') {
            listItemButton = button;
        }
    }

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
    incrementMaxPrice,
    decrementMaxPrice,
    clickBackButton,
    clickBronzePackButton,
    clickBuyNowButton,
    clickComparePrice,
    clickDetailsPanelButton,
    clickSearchButton,
    clickModifySearchButton,
    clickWatchButton,
    confirmDialog,
    getCurrentSelectedIndex,
    getItemId,
    getListItems,
    goToStoreTab,
    isTotwPlayer,
    isUserOnPage,
    listItem,
    selectNextItem,
    selectPreviousItem
};