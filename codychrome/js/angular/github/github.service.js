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
    
    var repo = {};  // see config.js for the default repo model
    var commit = {};
    
    var service = {
      repo: repo,
      commit: commit,
      
      /* methods */
      initRepo: initRepo,
      loadRepo: loadRepo,
      saveRepo: saveRepo
    };

    return service;
    //////////////////////////
    
    /*
     * Initializes a new repository in storage. This may overwrite an existing repository.
     */
    function initRepo() {
      
      return new Promise(function(resolve, reject) {
        angular.copy(CONFIG.REPO, repo);
        saveRepo().then(resolve);
      });
    }
    
    /*
     * Loads an existing repository from storage.
     */
    function loadRepo() {
      
      return new Promise(function(resolve, reject) {
        
        chrome.storage.sync.get('repo', storageCallback);
        
        function storageCallback(items) {
          
          if (!items.hasOwnProperty('repo')) {
            // no repo currently in storage
            reject();
            return;
          }
          
          angular.copy(items.repo, repo);
          resolve();
        }
      });
    }
    
    /*
     * Updates an existing repository in storage.
     */
    function saveRepo() {
      
      return new Promise(function(resolve, reject) {
        
        var item = {repo: repo};
        chrome.storage.sync.set(item, storageCallback);
        
        function storageCallback(bytesInUse) {
          resolve();
        }
      });
    }   
  }  
})();