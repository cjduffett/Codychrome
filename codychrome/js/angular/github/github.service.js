/*
 * Codychrome GitHub Service
 * Manages the interaction with GitHub.
 *
 * Carlton Duffett
 * 05-18-2016
 */
(function(){
  
  'use strict';
  
  angular
    .module('github', [])
    .factory('githubService', githubService);
  
  githubService.$inject = ['$http'];
  
  function githubService($http) {
    
    var service = {
      
      /* methods */
      authenticate: authenticate
    }

    return service;
    ///////////////////////////
    
    /*
     * Execute GitHub OAuth
     * Returns a promise
     */
    function authenticate() {
      
      return getAccessCode();
    }
    
    /* =============================================================================== */
    /* GitHub OAuth                                                                    */
    /* =============================================================================== */
    
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
     * Returns a promise
     */
    function getAccessCode() {
      
      // used to prevent CSRF in OAuth request
      var state = getState();
      
      var url = CONFIG.GITHUB_CLIENT.AUTH_URL + '?' +
          'client_id=' + CONFIG.GITHUB_CLIENT.ID +
          '&scope=' + CONFIG.GITHUB_CLIENT.SCOPE +
          '&state=' + state +
          '&redirect_uri=' + getRedirectURL();         
      
      var details = {
        url: url,
        interactive: true  // opens a new window for GitHub OAuth
      };
      
      return new Promise(function(resolve, reject) {
        
        chrome.identity.launchWebAuthFlow(details, authResponse);
        
        function authResponse(responseUrl) {
           
          // parses the code and state out of the response url
          // format: https://<app_id>.chromiumapp.org/?code=<oauth_code>&state=<state_token>
          var paramsArray = responseUrl.split('?')[1].split('&');
          var code = paramsArray[0].split('=')[1];
          var responseState = paramsArray[1].split('=')[1];
          
          if (state !== responseState) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_CSRF_MESSAGE
            });
          }
          else {
            getAccessToken(code, state)
            .then(successCallback)
            .catch(errorCallback);
            
            function successCallback(token) {
              resolve({
                token: token
              });
            }
            
            function errorCallback(response) {
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_FAILED_MESSAGE
              });
            }
          }
        }
      });
    }
    
    /*
     * Obtains the access token following a successful getAccessCode() request.
     * Returns a promise
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
    
    /* =============================================================================== */
    /* GitHub Repository Access                                                        */
    /* =============================================================================== */
    
    // to be continued...
  }  
})();