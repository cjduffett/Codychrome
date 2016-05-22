/*
 * Codychrome User Service
 * Manages the current user's settings and GitHub OAuth
 * 
 * Carlton Duffett
 * 05-20-2016
 */
(function() {
  
  'use strict';
  
  angular
    .module('user', [])
    .factory('userService', userService);
  
  userService.$inject = ['$http'];
  
  function userService($http) {
    
    var user = {};
    
    var service = {
      user: user,
      
      /* methods */
      initUser: initUser,
      loadUser: loadUser,
      saveUser: saveUser,
      authenticate: authenticate
    };
    
    return service;
    /////////////////////////

    /*
     * Initializes a new user in storage. This may overwite an existing user.
     */
    function initUser() {
      
      return new Promise(function(resolve, reject) {
        angular.copy(CONFIG.USER, user);
        saveUser().then(resolve);
      });
    }
    
    /*
     * Loads user model from storage
     */
    function loadUser() {
      
      return new Promise(function(resolve, reject) {
        chrome.storage.sync.get('user', storageCallback);
        
        function storageCallback(items) {
          
          if (items.hasOwnProperty('user')) {
            angular.copy(items.user, user);
            resolve();
          }
          else {
            // user does not exist in local storage
            reject();
          }
        }  
      });
    }
    
    /*
     * Updates user model in local storage
     */
    function saveUser() {
      
      return new Promise(function(resolve, reject) {
        
        var item = {
          user: user
        };
      
        chrome.storage.sync.set(item, storageCallback);
        
        function storageCallback(bytesInUse) {
          resolve();
        }
      });  
    }
    
    /*
     * Executes GitHub OAuth
     */
    function authenticate() {
      
      return new Promise(function(resolve, reject) {
        
        if (!user.isAuthenticated) {
          // STEP 1: Get an access code from GitHub's OAuth API
          getAccessCode()
            .then(successCallback)
            .catch(reject);

          function successCallback(token) {
            
            if (!token) {
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_FAILED
              });
            }
            else {
              user.isAuthenticated = true;
              user.authToken = token;
              saveUser().then(resolve);
            }
          }
        }
        else {
          reject({
            error: CONFIG.ALERTS.MESSAGES.OAUTH_ALREADY_AUTHENTICATED
          });
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

        if (!user.interactiveAuthLaunched) {
          // the user has not attempted interactive OAuth yet
          user.interactiveAuthLaunched = true;
          saveUser().then(function() {
            chrome.identity.launchWebAuthFlow(details, authResponse);
          });
        }
        else {
          // interactive auth was previously launched, so don't use it
          details.interactive = false;
          chrome.identity.launchWebAuthFlow(details, authResponse);
        }
          
        function authResponse(responseUrl) {
          
          // parses the code and state out of the response url
          // format: https://<app_id>.chromiumapp.org/?code=<oauth_code>&state=<state_token>          
          var paramsArray = responseUrl.split('?')[1].split('&');
          var code = paramsArray[0].split('=')[1];
          var responseState = paramsArray[1].split('=')[1];

          if (state !== responseState) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_CSRF
            });
          }
          else {
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