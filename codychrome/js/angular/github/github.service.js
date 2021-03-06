/*
 * Codychrome GitHub Service
 * Manages the interaction with GitHub.
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function(){
  
  'use strict';
  
  angular
    .module('github')
    .factory('githubService', githubService);
  
  githubService.$inject = ['apiService', 'userService'];
  
  function githubService(apiService, userService) {
    
    var repo = {};  // see config.js for the default repo and commit models
    var commit = {};
    
    var service = {
      repo: repo,
      
      /* local methods */
      initRepo: initRepo,
      loadRepo: loadRepo,
      saveRepo: saveRepo,
      
      /* API methods */
      getOrCreateRepo: getOrCreateRepo,
      createOrUpdateProblem: createOrUpdateProblem
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
    
    /*
     * Gets the current GitHub repository used for commits. If it doesn't exist, the repo is created.
     */
    function getOrCreateRepo() {
      
      return new Promise(function(resolve, reject) {
        
        var url = CONFIG.GITHUB_API.GET_REPO_URL
                  .replace(':username', userService.user.username)
                  .replace(':repo_name', repo.name);
        
        var config = {
          method: 'GET',
          url: url
        };
        
        apiService.sendAuthenticatedRequest(config)
          .then(repoExists)
          .catch(repoDoesNotExist);
        
        function repoExists(response) {
          resolve();  
        }
        
        function repoDoesNotExist(response) {
          
          if (response.status === 401) {
            // unauthorized
            userService.resetUserAuth().then(function(){
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED
              });
            });
            return;
          }
          
          else if (response.status === 404) {
            // create a new repository
            var data = {
              name: repo.name,
              description: repo.description,
              auto_init: repo.auto_init,
              private: repo.private
            };
            
            var config = {
              method: 'POST',
              url: CONFIG.GITHUB_API.CREATE_REPO_URL,
              data: data
            };
            
            apiService.sendAuthenticatedRequest(config)
              .then(repoCreated)
              .catch(repoNotCreated);
          }
          else {
            // an unexpected error occured 
            reject({
              error: CONFIG.ALERTS.MESSAGES.COMMIT_FAILED
            });
          }
        }
        
        function repoCreated(response) {
          resolve();
        }
        
        function repoNotCreated(response) {
          
          if (response.status === 401) {
            // unauthorized
            userService.resetUserAuth().then(function(){
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED
              });
            });
            return;
          }
          else {
            // an unexpected error occured 
            reject({
              error: CONFIG.ALERTS.MESSAGES.COMMIT_FAILED
            });
          }
        }
        
      });
    }
    
    /*
     * Creates or updates the parsed problem on GitHub
     */
    function createOrUpdateProblem(problem, commitMessage) {
      
      return new Promise(function(resolve, reject) {
        
        // stringify the problem object and check character encoding
        var problemAsString = problemToString(problem);
        
        // convert to base64 encoding (GitHub stores all file contents in base64 encoding)
        var problemAsBase64 = btoa(problemAsString);
        
        // build the file path
        var path = problem.meta.courseName + '/';
        
        if (repo.org_by_assignment) {
          path += problem.meta.assignmentName + '/';
        }
        path += problem.meta.problemName + '.json';
        
        var url = CONFIG.GITHUB_API.FILE_URL
                  .replace(':username', userService.user.username)
                  .replace(':repo_name', repo.name)
                  .replace(':path', path);
        
        var config = {
          method: 'GET',
          url: url
        };
        
        apiService.sendAuthenticatedRequest(config)
          .then(problemExists)
          .catch(problemDoesNotExist);
        
        function problemExists(response) {
          
          // check if the problem has any changes (by comparing file hashes)
          var old_sha = response.data.sha;
          var new_sha = getContentSHA(problemAsString);
          
          if (old_sha === new_sha) {
            reject({
              error: CONFIG.ALERTS.MESSAGES.COMMIT_NO_CHANGES
            });
            return;
          }
          else {
            // commit the new changes
            var data = {
              path: path,
              message: commitMessage,
              content: problemAsBase64,
              sha: old_sha  // blob sha of the file being replaced
            };
            
            var config = {
              method: 'PUT',
              url: url,
              data: data
            };
            
            apiService.sendAuthenticatedRequest(config)
              .then(problemUpdated)
              .catch(problemNotUpdated);  // see implementation below
          }
        }
        
        function problemDoesNotExist(response) {
          
          if (response.status === 401) {
            // unauthorized
            userService.resetUserAuth().then(function(){
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED
              });
            });
            return;
          }
          else if (response.status === 404) {
            // create a new problem
            var data = {
              path: path,
              message: commitMessage,
              content: problemAsBase64
            };
            
            var config = {
              method: 'PUT',
              url: url,
              data: data
            };
            
            apiService.sendAuthenticatedRequest(config)
              .then(problemCreated)
              .catch(problemNotCreated);  // see implementation below
          }
          else {
            // an unexpected error occured 
            reject({
              error: CONFIG.ALERTS.MESSAGES.COMMIT_FAILED
            });
          }
        }
        
        function problemCreated(response) {
          
          resolve();
        }
        
        function problemNotCreated(response) {
          
          console.log(response);
          
          if (response.status === 401) {
            // unauthorized
            reject({
              error: CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED
            });
            return;
          }
          else {
            // an unexpected error occured
            reject({
              error: CONFIG.ALERTS.MESSAGES.COMMIT_FAILED
            });
          }
        }
        
        function problemUpdated(response) {
          
          resolve();
        }
        
        function problemNotUpdated(response) {
          
          if (response.status === 401) {
            // unauthorized
            userService.resetUserAuth().then(function(){
              reject({
                error: CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED
              });
            });
            return;
          }
          else {
            // an unexpected error occured
            reject({
              error: CONFIG.ALERTS.MESSAGES.COMMIT_FAILED
            });
          }
        }
      });
    }
    
    /*
     * Converts the problem object to a string and properly escapes special characters.
     * Characters outside the Latin-1 range cannot be base64 encoded, so we exclude them.
     */
    function problemToString(prob) {
      var probAsString = JSON.stringify(prob);
      if (!isInLatinRange(probAsString)) {
        return boundToLatinRange(probAsString);
      }
      return probAsString;
    }
    
    /*
     * Tests if a string contains characters exclusively in the Latin-1 Unicode range.
     * JavaScript btoa() base64 encoding only accepts characters in this range.
     */
    function isInLatinRange(str) {
      for (var i = 0; i < str.length; i++) {
        if (str[i] < '\u0000' || str[i] > '\u00FF') {
          return false;
        }
      }
      return true;
    }
    
    /*
     * Restricts erroneous string elements to characters exclusively in the Latin-1 range.
     * For now, this just deletes characters that are outside of the range \u0000 to \u00FF.
     */
    function boundToLatinRange(str) {
      
      var charArray = Array.from(str);  // convert to character array to allow replacement
      
      for (var i = 0; i < charArray.length; i++) {
        if (charArray[i] < '\u0000' || charArray[i] > '\u00FF') {
          charArray[i] = '';
        }
      }
      return charArray.join('');
    }
    
    /*
     * Computes the SHA1 blob hash of a GitHub file's contents.
     * SEE: http://alblue.bandlem.com/2011/08/git-tip-of-week-objects.html
     */
    function getContentSHA(content) {
      
      var blob = "blob " + content.length.toString() + "\0" + content;
      return CryptoJS.SHA1(blob).toString();
    }
  }  
})();