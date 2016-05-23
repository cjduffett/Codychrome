/*
 * CodyChrome Core App
 *
 * Carlton Duffett
 * 05-17-2016
 */
(function() {

  'use strict';

  angular
    .module('app', [
      /* shared modules */
      'alerts',
      'user',
      'oauth',
      'problem',
      'github'
    ]);
  
  /*
   * Application-wide configuration
   */
  
  angular
    .module('app')
    .factory('httpRequestInterceptor', httpRequestInterceptor);
  
  function httpRequestInterceptor() {
    
    var service = {
      request: request
    };
    return service;
    //////////////////////
    
    function request(config) {
      var keys = Object.keys(CONFIG.HTTP.HEADERS);
      for (var i; i < keys.length; i++) {
        config.headers[keys[i]] = CONFIG.HTTP.HEADERS[keys[i]];
      }
      return config;
    }
  }
  
  angular
    .module('app')
    .config(setConfig);
  
  function setConfig($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
  }
  
})();