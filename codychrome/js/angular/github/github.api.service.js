/*
 * Codychrome GitHub API Service
 * Properly configures all authenticated and unauthenticated requests to the 
 * GitHub API.
 * 
 * Carlton Duffett
 * 05-28-2016
 */
(function() {
  
  'use strict';
  
  angular
    .module('github')
    .factory('apiService', apiService);
  
  apiService.$inject = ['$http', 'userService'];
  
  function apiService($http, userService) {
    
    var service = {
      /* methods */
      sendRequest: sendRequest,
      sendWebRequest: sendWebRequest,
      sendAuthenticatedRequest: sendAuthenticatedRequest
    };
    
    return service;
    /////////////////////////
    
    /*
     * Adds the required headers for communicating with the GitHub API
     */
    function sendRequest(config) {
      
      console.log(config);
      
      if (!Object.hasOwnProperty(config, 'headers')) {
        config['headers'] = {};
      }
      
      config['headers']['Accept'] = 'application/json';
      /* NOTE: The GitHub API requires that the User-Agent header is set. It appears that this header
       * is set by Chrome and we cannot modify this header from our extension like:
       * config['headers']['User-Agent'] = 'Codychrome';
       */
      config['url'] = CONFIG.GITHUB_API.API_ROOT + config['url']; // prepends the API root
      
      return $http(config);
    }
    
    /*
     * Sends a request to GitHub's web root instead of the API root
     */
    function sendWebRequest(config) {
      
      if (!config.hasOwnProperty('headers')) {
        config['headers'] = {};
      }
      
      config.headers['Accept'] = 'application/json';
      
      config['url'] = CONFIG.GITHUB_API.WEB_ROOT + config['url']; // prepends the web root
      
      return $http(config);
    }
    
    /*
     * Adds the Authorization header for authenticated requests
     */
    function sendAuthenticatedRequest(config) {

      if (!config.hasOwnProperty('headers')) {
        config['headers'] = {};
      }
      
      config.headers['Authorization'] = 'Token ' + userService.user.authToken;
      config.headers['Accept'] = 'application/json';
      
      config['url'] = CONFIG.GITHUB_API.API_ROOT + config['url']; // prepends the web root
      
      return $http(config);
    }
  }
  
})();