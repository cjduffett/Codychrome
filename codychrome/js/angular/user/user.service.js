/*
 * Codychrome User Service
 * Manages the current user's settings and GitHub OAuth
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function() {
  
  'use strict';
  
  angular
    .module('user', [])
    .factory('userService', userService);
  
  function userService() {
    
    var user = {}; // see config.js for the default user model
    
    var service = {
      user: user,
      
      /* methods */
      initUser: initUser,
      loadUser: loadUser,
      saveUser: saveUser,
      resetUserAuth: resetUserAuth
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
          
          if (!items.hasOwnProperty('user')) {
            // no user currently in storage
            reject();
            return;
          }
          
          angular.copy(items.user, user);
          resolve();
        }  
      });
    }
    
    /*
     * Updates user model in local storage
     */
    function saveUser() {
      
      return new Promise(function(resolve, reject) {
        
        var item = {user: user};
        chrome.storage.sync.set(item, storageCallback);
        
        function storageCallback(bytesInUse) {
          resolve();
        }
      });  
    }
    
    /*
     * Resets user's auth credentials (for failed authentication, or logout)
     */
    function resetUserAuth() {
      user.isAuthenticated = false;
      user.interactiveAuthLaunched = false;
      user.authToken = '';
      return saveUser();
    }
  }
  
})();