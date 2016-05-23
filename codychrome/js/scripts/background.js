/*
 * Codychrome Background Script
 * Enables the Codychrome app when on an active Cody Coursework page.
 *
 * Carlton Duffett
 * 05-17-2016
 */

(function() {
  
  /*
   * Determines when the extension should be enabled (e.g. only for problem edit pages)
   */
  
  // When the extension is installed or upgraded...
  chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {
          // That fires when the page's URL matches Cody Coursework problem edit pages
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {
                urlContains: 'coursework.mathworks.com/courses/',
                // urlSuffix: 'edit'
              },
            })
          ],
          // And shows the extension's page action.
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });  
})();