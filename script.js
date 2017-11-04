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
                    comparePrice();
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
                    break;
                case 49 /* 1 */:
                    if (ev.altKey) {
                        commonUtility.collectLogs();
                    }
                    break;
                case 70 /* f */:
                    getFutbinData();
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
     * Clicks "Compare Price" so the user can compare the price of other
     * like items on the market to the one that is selected.
     */
    function comparePrice() {
        commonUtility.log('Attempting to compare price of other items on the market like the current item...');

        try {
            // Tap "Compare Price" button.
            domUtility.clickComparePrice();
        } catch (error) {
            commonUtility.logError(error);
            commonUtility.logError('Unable to compare price.');
            return;
        }

        chrome.runtime.sendMessage({ trackComparePrice: true });
        commonUtility.log('Successfully compared the price of the current item to other items on the market.');
    }

    /**
     * Displays FUTBIN data for currently selected item.
     */
    function getFutbinData() {
        chrome.runtime.sendMessage({ trackFutbin: true });

        try {
            // Get all items.
            let items = domUtility.getListItems();

            // Get current index.
            let currentIndex = domUtility.getCurrentSelectedIndex(items);

            // Get the ID of the object.
            const id = domUtility.getItemId(items[currentIndex]);

            // Fire request to FUTBIN to get price data.
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.futbin.com/18/playerPrices?player=' + id, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    try {
                        const response = JSON.parse(xhr.responseText);

                        // Get host panel where we will add our stuff.
                        const panel = document.getElementsByClassName('slick-slide slick-current slick-active')[0];

                        // Clear "old" div, if it exists.
                        const oldDiv = document.getElementById('shortfuts-div');
                        if (oldDiv) {
                            panel.removeChild(oldDiv);
                        }

                        // Ensures that the response from FUTBIN has the price data.
                        if (response[id].prices) {
                            const xboxSpan = _getPlatformAverageLowestBinSpan(response[id].prices, 'Xbox');
                            const psSpan = _getPlatformAverageLowestBinSpan(response[id].prices, 'PS');
                            const pcSpan = _getPlatformAverageLowestBinSpan(response[id].prices, 'PC');

                            const div = document.createElement('div');
                            div.id = 'shortfuts-div';

                            div.appendChild(xboxSpan);
                            div.appendChild(psSpan);
                            div.appendChild(pcSpan);

                            // Add small timeout for visual indicator.
                            setTimeout(() => {
                                panel.prepend(div);
                            }, 100);
                        }
                    } catch (error) {
                        commonUtility.logError(error);
                        commonUtility.logError('Unable to get FUTBIN data.');
                    }
                }
            }
            xhr.send();
        } catch (error) {
            // Get host panel where we will add our stuff.
            const panel = document.getElementsByClassName('slick-slide slick-current slick-active')[0];

            // Clear "old" div, if it exists.
            const oldDiv = document.getElementById('shortfuts-div');
            if (oldDiv) {
                panel.removeChild(oldDiv);
            }
        }
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

        getFutbinData();
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

    /**
     * Gets a span with the average lowest BIN for the given platform.
     *
     * @param {any} prices The "prices" data from the FUTBIN response.
     * @param {string} platformKey "Xbox", "PS", "PC"
     */
    function _getPlatformAverageLowestBinSpan(prices, platformKey) {
        // Determine platform based on key.
        let platform;
        if (platformKey === 'Xbox') {
            platform = prices.xbox;
        } else if (platformKey === 'PS') {
            platform = prices.ps;
        } else if (platformKey === 'PC') {
            platform = prices.pc;
        }

        // Iterate over response to get BIN values.
        let platformIt = 0;
        let platformTotal = 0;
        for (const prop in platform) {
            if (prop.toLowerCase().indexOf('lcprice') > -1) {
                const price = platform[prop] && parseInt(platform[prop].replace(',', ''));
                if (price > 0) {
                    platformIt++;
                    platformTotal += price;
                }
            }
        }

        // Calculate the average.
        const platformAverage = parseInt(platformTotal / platformIt);

        /**
         * If average is greater than zero (aka it's a number),
         * then return an element with its value. Otherwise, return
         * an empty span.
         */
        if (platformAverage > 0) {
            // Create and return a div element.
            const platformAverageSpan = document.createElement('div');
            platformAverageSpan.textContent = `${platformKey}: ${platformAverage}`;
            return platformAverageSpan;
        } else {
            return document.createElement('span');
        }
    }
})();