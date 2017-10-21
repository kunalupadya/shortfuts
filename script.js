(function(){
    commonUtility.log('Initializing extension...');

    window.addEventListener('keydown', function(ev) {
        chrome.storage.sync.get('isActive', function(data) {
            const keyCode = ev.keyCode;

            chrome.runtime.sendMessage({ isActive: data.isActive });

            /**
             * ALT + s will toggle the extension's availability.
             */
            if (ev.altKey && keyCode === 83 /* s */) {
                const newState = !data.isActive;
                chrome.storage.sync.set({ 'isActive': newState}, function() {
                    commonUtility.log('Toggled extension availability.');
                    chrome.runtime.sendMessage({ isActive: newState });
                });
                return;
            }

            /**
             * Checks if extension is currently active before responding
             * to keystroke.
             */
            if (data.isActive === false) {
                return;
            } else if (data.isActive === undefined) {
                chrome.storage.sync.set({ 'isActive': true }, function() {
                    commonUtility.log('Initialized "isActive" setting.');
                });
            }

            switch (keyCode) {
                case 67 /* c */:
                    search();
                    break;
                case 77 /* m */:
                    listMinBin();
                    break;
                case 83 /* s */:
                    storeInClub();
                    break;
                case 84 /* t */:
                    sendToTransferList();
                    break;
                case 81 /* q */:
                    quickSell();
                    break;
                case 40 /* down arrow */:
                    move(ev);
                    break;
                case 38 /* up arrow */:
                    move(ev);
                    break;
                case 8 /* backspace */:
                    goBack();
                    break;
                case 66 /* b */:
                    buyBronzePack();
                    break;
                case 78 /* n */:
                case 220 /* \ */:
                    buyNow();
                    break;
                case 87 /* w */:
                    toggleTransferTargetStatus();
                    break;
                case 76 /* l */:
                    listItem();
                case 49 /* 1 */:
                    if (ev.altKey) {
                        commonUtility.collectLogs();
                    }
                default:
                    break;
            }
        });
    });

    /**
     * Buys a regular bronze pack.
     */
    function buyBronzePack() {
        commonUtility.log('Attempting to buy a bronze pack...');

        try {
            // Only execute this shortcut if in the "Store" tab.
            if (!domUtility.isUserOnPage('Store')) {
                commonUtility.logError('Not on store page, so not trying to buy a pack.');
                return;
            }

            // Go to "Bronze" store tab.
            domUtility.goToStoreTab('Bronze');

            setTimeout(() => {
                // Buy a 400 token bronze pack.
                domUtility.clickBronzePackButton();

                // Press OK.
                domUtility.confirmDialog();
            }, commonUtility.getRandomWait());
        } catch (error) {
            commonUtility.logError('Unable to buy a bronze pack.');
            return;
        }

        commonUtility.log('Successfully bought a bronze pack.');
        chrome.runtime.sendMessage({ trackBuyBronzePack: true });
    }

    /**
     * Executes "Buy Now" on the selected on "Search Results" page.
     */
    function buyNow() {
        commonUtility.log('Attempting to "Buy Now" currently selected item...');

        if (!domUtility.isUserOnPage('Search Results')) {
            commonUtility.logError(`Not executing "Buy Now" because we're not on the "Search Results" page.`);
            return;
        }

        try {
            // Tap "Buy Now" button.
            domUtility.clickBuyNowButton();

            // Press OK.
            domUtility.confirmDialog();
        } catch (error) {
            commonUtility.logError(error);
            return;
        }

        commonUtility.log('Successfully executed "Buy Now" on selected item.');
        chrome.runtime.sendMessage({ trackBuyNow: true });
    }

    /**
     * Goes back.
     */
    function goBack() {
        /**
         * Extra check for English language to only allow back button shortcut
         * on the "Search Results" page.
         */
        if (!domUtility.isUserOnPage('Search Results')) {
            commonUtility.log('Not going back because we\'re not on the search results page.');
            return;
        }

        commonUtility.log('Attempting to go to the previous page...');

        // Clicks the back button.
        try {
            domUtility.clickBackButton();
        } catch (error) {
            console.logError(error);
        }

        commonUtility.log('Successfully went back.');
    }

    /**
     * Lists the current item with whatever minimum and "buy now" prices
     * are currently set.
     */
    function listItem() {
        commonUtility.log('Trying to list the current item...');

        try {
            domUtility.clickDetailsPanelButton('List Item');
        } catch (error) {
            commonUtility.logError(error);
            commonUtility.logError('Unable to list the current item.');
            return;
        }

        commonUtility.log('Successfully listed current item.');
        chrome.runtime.sendMessage({ trackListItem: true });
    }

    /**
     * Lists the current item with a BIN price of 200.
     */
    function listMinBin() {
        commonUtility.log('Attempting to list current item for minimum BIN...');

        try {
            domUtility.listItem(150, 200);
        } catch (error) {
            commonUtility.logError(error);
            return;
        }

        commonUtility.log('Successfully listed current item for minimum BIN.');
        chrome.runtime.sendMessage({ trackListMinBin: true });
    }

    /**
     * Adds item selection to the list.
     *
     * @param {Event} ev
     */
    function move(ev) {
        commonUtility.log('Attempting to change the currently selected item...');

        try {
            const isDown = ev.keyCode === 40;

            // Get all items.
            let items = domUtility.getListItems();

            // Get current index.
            let currentIndex = domUtility.getCurrentSelectedIndex(items);

            if (isDown && currentIndex + 1 <= items.length) {
                currentIndex = domUtility.selectNextItem(items, currentIndex);
            } else if (!isDown && currentIndex - 1 >= 0) {
                currentIndex = domUtility.selectPreviousItem(items, currentIndex);
            }
        } catch (error) {
            commonUtility.logError(error);
            return;
        }

        commonUtility.log('Successfully changed the currently selected item.');
    }

    /**
     * Quick sells the current item. If it fails, we try to redeem item (maybe
     * coins or packs).
     */
    function quickSell() {
        commonUtility.log('Attempting to quick sell the current item...');

        try {
            // Tap "Quick Sell" button.
            domUtility.clickDetailsPanelButton('Quick Sell');

            // Press OK.
            domUtility.confirmDialog();
        } catch (error) {
            commonUtility.logError(error);

            try {
                domUtility.clickDetailsPanelButton('Redeem');
            } catch (error) {
                commonUtility.logError(error);
                return;
            }
        }

        commonUtility.log('Successfully quick sold the current item.');
        chrome.runtime.sendMessage({ trackQuickSell: true });
    }

    /**
     * Tries to search. If we're on the "Search the Transfer Market" page,
     * click the "Search" button. Otherwise, click "Compare Price".
     */
    function search() {
        commonUtility.log('Attempting to search for current item to compare price...');

        try {
            if (domUtility.isUserOnPage('Search the Transfer Market')) {
                // Tap "Search" button.
                domUtility.clickSearchButton();
                chrome.runtime.sendMessage({ trackSearch: true });
            } else {
                // Tap "Compare Price" button.
                domUtility.clickComparePrice();
                chrome.runtime.sendMessage({ trackComparePrice: true });
            }
        } catch (error) {
            commonUtility.logError(error);
            commonUtility.logError('Unable to search.');
            return;
        }

        commonUtility.log('Successfully searched for current item.');
    }

    /**
     * Sends current item to transfer list.
     */
    function sendToTransferList() {
        commonUtility.log('Attempting to send current item to transfer list...');

        try {
            domUtility.clickDetailsPanelButton('Send to Transfer List');
        } catch (error) {
            logError(error);
        }

        commonUtility.log('Successfully sent current item to transfer list.');
        chrome.runtime.sendMessage({ trackSendToTransferList: true });
    }

    /**
     * Attemps to store current item in the club. If "Send to My Club" button
     * is hidden, we try to "Redeem" item (maybe coins or packs).
     */
    function storeInClub() {
        commonUtility.log('Attempting to store item in the club...');

        try {
            domUtility.clickDetailsPanelButton('Send to My Club');
        } catch (error) {
            commonUtility.logError(error);

            try {
                domUtility.clickDetailsPanelButton('Redeem');
            } catch (error) {
                commonUtility.logError(error);
                return;
            }
        }

        commonUtility.log('Succesfully stored item in the club.');
        chrome.runtime.sendMessage({ trackStoreInClub: true });
    }

    /**
     * Toggles the current item's status on the "Transfer Targets" list (i.e. adds if
     * it's not on there already, or removes if it is).
     */
    function toggleTransferTargetStatus() {
        commonUtility.log(`Attempting to toggle current item's "watched" status...`);

        if (!domUtility.isUserOnPage('Search Results') && !domUtility.isUserOnPage('Transfer Targets')) {
            commonUtility.logError(`Not executing "Watch" because we're not on a supported page.`);
            return;
        }

        try {
            // Tap "Watch" or "Unwatch" button.
            domUtility.clickWatchButton();
        } catch (error) {
            commonUtility.logError(error);
            return;
        }

        commonUtility.log(`Successfully toggled current item's "watched" status.`);
    }
})();