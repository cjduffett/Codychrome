/*
 * Codychrome OAuth Service
 * Manages OAuth with the GitHub API
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function() {
  
  'use strict';
  
  angular
    .module('oauth', [])
    .factory('oauthService', oauthService);
  
  oauthService.$inject = ['$http', 'apiService', 'userService'];
  
  function oauthService($http, apiService, userService) {
  
    var service = {
      /* methods */
      newAuth: newAuth,
      verifyAuth: verifyAuth,
      getUsername: getUsername
    };
    
    return service;
    //////////////////////////////
    
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
      return chrome.identity.getRedirectURL() + CONFIG.GITHUB_API.AUTH_REDIRECT_PATH;
    }
    
    /*
     * Sets up and launches an external OAuth request to GitHub
     */
    function setupWebAuthFlow(interactive, state, callback) {

      var url = CONFIG.GITHUB_API.WEB_ROOT + CONFIG.GITHUB_API.AUTH_URL + '?' +
          'client_id=' + CONFIG.GITHUB_CLIENT.ID +
          '&scope=' + CONFIG.GITHUB_CLIENT.SCOPE +
          '&state=' + state +
          '&redirect_uri=' + encodeURIComponent(getRedirectURL());         

      var details = {
        url: url,
        interactive: interactive  // if true, ensures the OAuth is opened in a new interactive window
      };
      
      chrome.identity.launchWebAuthFlow(details, callback);
    }
    
    /*
     * Executes new GitHub OAuth flow
     */
    function newAuth() {
      
      return new Promise(function(resolve, reject) {
        
        // STEP 1: Launch an interactive OAuth window for authorization from GitHub
        userService.user.interactiveAuthLaunched = true;
        
        userService.saveUser().then(function() {

          var state = getState(); // used to prevent CSRF
          
          setupWebAuthFlow(true, state, function(){}); // interactive = true, empty callback 
          /*
           * NOTE: Since launching the web auth flow takes focus away from the extension's popup, the
           * popup is destroyed. We therefore don't expect to actually reach the callback in this case.
           * Authentication will be verified when the extension is relaunched.
           */
          resolve();
        });
      });
    }
    
    /*
     * Verfies authentication with GitHub after initial OAuth flow was launched
     */
    function verifyAuth() {
      
      return new Promise(function(resolve, reject) {
        
        var state = getState(); // used to prevent CSRF
        
        setupWebAuthFlow(false, state, authResponse); // interactive = false, authResponse callback
        /*
         * NOTE: When not in interactive mode the extension's popup is preserved and program flow
         * reaches the authResponse callback as expected.
         */
        
        function authResponse(responseUrl) {
          
          if (chrome.runtime.lastError) {
            /*
             * The interactive auth window was closed before the user authorized CodyChrome.
             * We'll need to reset the OAuth flow and prompt the user to try again.
             */
            userService.resetUserAuth().then(resetCallback);
            
            function resetCallback() {
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_RETRY
              });
            }
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
        } // authResponse
        
      });
    }
    
    /*
     * Obtains the access token following a successful getAccessCode() request.
     */
    function getAccessToken(code, state) {
      
      return new Promise(function(resolve, reject) {
        
        var data = {
          client_id: CONFIG.GITHUB_CLIENT.ID,
          client_secret: CONFIG.GITHUB_CLIENT.SECRET,
          code: code,
          redirect_uri: getRedirectURL(),
          state: state
        };

        var config = {
          method: 'POST',
          url: CONFIG.GITHUB_API.TOKEN_URL,
          data: data
        };

        return apiService.sendWebRequest(config)
          .then(successCallback)
          .catch(errorCallback);

        function successCallback(response) {
          userService.user.isAuthenticated = true;
          userService.user.authToken = response.data.access_token;
          /*
           * We're newly authenticated, so let's grab the user's username for use in future
           * requests and to add a personal touch to our app. getUsername will also save the
           * user model for us.
           */
          getUsername()
            .then(resolve)
            .catch(reject);
        }

        function errorCallback(response) {
          // Authentication failed :(
          userService.resetUserAuth().then(reject);
        }
      });
    }
    
    /*
     * Gets the authenticated user's information from GitHub.
     */
    function getUsername() {
      
      return new Promise(function(resolve, reject) {
                
        var config = {
          method: 'GET',
          url: CONFIG.GITHUB_API.GET_USER_URL
        };
        
        apiService.sendAuthenticatedRequest(config)
          .then(successCallback)
          .catch(errorCallback);
        
        function successCallback(response) {
          // for now we just extract the user's GitHub username from the response.
          userService.user.username = response.data.login;
          userService.saveUser().then(resolve);
        }
        
        function errorCallback(response) {
          reject();
        }
      });
    }
  }
  
})();