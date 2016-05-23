/*
 * Codychrome OAuth Service
 * Manages OAuth with the GitHub API
 *
 * Carlton Duffett
 * 05-21-2016
 */
(function() {
  
  'use strict';
  
  angular
    .module('oauth', [])
    .factory('oauthService', oauthService);
  
  oauthService.$inject = ['$http', 'userService'];
  
  function oauthService($http, userService) {
  
    var service = {
      /* methods */
      authenticate: authenticate
    };
    
    return service;
    //////////////////////////////
    
    /*
     * Executes GitHub OAuth
     */
    function authenticate() {
      
      return new Promise(function(resolve, reject) {
        
        // STEP 1: Get an access code from GitHub's OAuth API
        getAccessCode()
          .then(successCallback)
          .catch(reject);

        function successCallback(token) {

          if (!token) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_FAILED
            });
            return;
          }

          userService.user.isAuthenticated = true;
          userService.user.authToken = token;
          userService.saveUser().then(resolve);
        }
      });
    }
    
    /*
     * Generates CSRF token for OAuth request
     */
    function getState() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    }
    
    /*
     * Generates redirect URL from initial GitHub OAuth request
     */
    function getRedirectURL() {
      return chrome.identity.getRedirectURL() + CONFIG.GITHUB_CLIENT.AUTH_REDIRECT_PATH;
    }
        
    /*
     * Makes initial request to GitHub API for an access code.
     */
    function getAccessCode() {
      
      return new Promise(function(resolve, reject) {
        
        // used to prevent CSRF in OAuth request
        var state = getState();

        var url = CONFIG.GITHUB_CLIENT.AUTH_URL + '?' +
            'client_id=' + CONFIG.GITHUB_CLIENT.ID +
            '&scope=' + CONFIG.GITHUB_CLIENT.SCOPE +
            '&state=' + state +
            '&redirect_uri=' + encodeURIComponent(getRedirectURL());         

        var details = {
          url: url,
          interactive: true  // opens a new window for GitHub OAuth
        };

        if (!userService.user.interactiveAuthLaunched) {
          // the user has not attempted interactive OAuth yet
          userService.user.interactiveAuthLaunched = true;
          userService.saveUser().then(function() {
            chrome.identity.launchWebAuthFlow(details, authResponse);
            /*
             * NOTE: Since launching the web auth flow takes focus away from the popup, the popup
             * is destroyed. We therefore don't expect to actually reach the authResponse callback
             * in this case. Authentication will be verified the next time the extension is launched.
             */
          });
        }
        else {
          // interactive auth was previously launched and succeeded, so don't use it
          details.interactive = false;
          chrome.identity.launchWebAuthFlow(details, authResponse);
        }
          
        function authResponse(responseUrl) {
          
          if (chrome.runtime.lastError) {
            /*
             * Interactive auth was never completed, we need to reset and prompt the user
             * to authenticate with GitHub again.
             */
            userService.resetUserAuth().then(resetCallback);
            
            function resetCallback() {
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_RETRY
              });
            }
            return;
          }
          
          if (!responseUrl) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_FAILED
            });
            return;
          }
          
          // parses the code and state out of the response url
          // format: https://<app_id>.chromiumapp.org/?code=<oauth_code>&state=<state_token> 
          var paramsArray = responseUrl.split('?')[1].split('&');
          var code = paramsArray[0].split('=')[1];
          var responseState = paramsArray[1].split('=')[1];

          if (state !== responseState) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_CSRF
            });
            return;
          }
          
          // STEP 2: Resolve the access code into an access token
          getAccessToken(code, state)
            .then(resolve)
            .catch(errorCallback);

          function errorCallback(response) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_FAILED
            });
          }
        }   
      });
    }
    
    /*
     * Obtains the access token following a successful getAccessCode() request.
     */
    function getAccessToken(code, state) {
      
      var data = {
        client_id: CONFIG.GITHUB_CLIENT.ID,
        client_secret: CONFIG.GITHUB_CLIENT.SECRET,
        code: code,
        redirect_uri: getRedirectURL(),
        state: state
      };
      
      var config = {
        headers: {
          'Accept': 'application/json'
        }
      };
      
      return $http
        .post(CONFIG.GITHUB_CLIENT.TOKEN_URL, data, config)
        .then(successCallback)
        .catch(errorCallback);
      
      function successCallback(response) {
        return response.data.access_token;
      }
      
      function errorCallback(response) {
        return null;
      }
    }
  }
  
})();