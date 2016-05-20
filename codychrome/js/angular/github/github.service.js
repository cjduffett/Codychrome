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
    
    /*
     * GitHub Client Configuration
     * Note: Since Chrome Extensions are strictly client-side, there is no secure way
     * to keep the secret key secret.
     */
    var githubClient = {
      id:                 '1f2110af226993c5f6ad',
      secret:             '',
      scope:              'repo',  // gives client read/write access to user's repositories
      authRedirectPath:   'pages/github.html',
      authURL:            'https://github.com/login/oauth/authorize',
      tokenURL:           'https://github.com/login/oauth/access_token'
    };
    
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
      return chrome.identity.getRedirectURL() + githubClient.authRedirectPath;
    }
        
    /*
     * Makes initial request to GitHub API for an access code.
     * Returns a promise
     */
    function getAccessCode() {
      
      // used to prevent CSRF in OAuth request
      var state = getState();
      
      var url = githubClient.authURL + '?' +
          'client_id=' + githubClient.id +
          '&scope=' + githubClient.scope +
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
              error: 'Cross-site request forgery detected.'
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
                error: 'Failed to obtain access token.'
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
        client_id: githubClient.id,
        client_secret: githubClient.secret,
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
        .post(githubClient.tokenURL, data, config)
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