/*
 * Codychrome GitHub Controller
 * Manages the GitHub form and interaction with GitHub.
 *
 * Carlton Duffett
 * 05-18-2016
 */
(function() {
  
  'use strict';
  
  angular
    .module('github')
    .controller('GithubController', GithubController);
  
  GithubController.$inject = ['$scope', 'alerts', 'userService', 'githubService'];
  
  function GithubController($scope, alerts, userService, githubService) {
    var vm = this;
    vm.repo = githubService.repo;
    
    /* methods */
    vm.saveRepo = saveRepo;
    
    init();
    ///////////////////////
    
    function init() {
      
      initUser().then(initRepo);
    }
    
    /*
     * Initializes the User Service
     */
    
    function initUser() {
      
      return new Promise(function(resolve, reject) {
        
        userService.loadUser()
          .then(loadSuccessCallback)
          .catch(loadErrorCallback);

        function loadSuccessCallback() {

          $scope.$apply(function() {

            if (!userService.user.isAuthenticated) {
              alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED);
            }
            resolve();
          });
        }

        function loadErrorCallback() {
          // user does not exist yet
          $scope.$apply(function() {
            userService.initUser().then(resolve);
          });
        }
      });
    }
    
    /*
     * Initializes the GitHub repository
     */
    
    function initRepo() {
      
      return new Promise(function(resolve, reject) {
        
        githubService.loadRepo()
          .then(loadSuccessCallback)
          .catch(loadErrorCallback);

        function loadSuccessCallback() {
          resolve();
        }

        function loadErrorCallback() {
          // repo does not exist yet
          githubService.initRepo().then(resolve);
        }
      });
    }
    
    function saveRepo() {
      
      return new Promise(function(resolve, reject) {
        
        githubService.saveRepo()
          .then(saveSuccessCallback)
          .catch(saveErrorCallback);
        
        function saveSuccessCallback() {
          $scope.$apply(function() {
            alerts.success(CONFIG.ALERTS.MESSAGES.REPO_SAVE_SUCCESS);
          });
          resolve();
        }
        
        function saveErrorCallback() {
          $scope.$apply(function() {
            alerts.error(CONFIG.ALERTS.MESSAGES.REPO_SAVE_FAILED);
          });
          reject();
        };
      });
    }
  }
  
})();