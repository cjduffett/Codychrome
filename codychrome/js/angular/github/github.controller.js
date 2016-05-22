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
    vm.user = userService.user;
    
    /* methods */
    vm.launchAuthentication = launchAuthentication;
    
    init();
    
    /////////////////////

    function init() {
      
      userService.loadUser()
        .then(loadSuccessCallback)
        .catch(loadErrorCallback);

      function loadSuccessCallback() {
        
        $scope.$apply(function() {
          
          if (!vm.user.isAuthenticated && vm.user.interactiveAuthLaunched) {
            /* The user has attempted interactive OAuth with GitHub, but we haven't confirmed that he/she is
             * actually authenticated. Typically this occurs when the extension is re-launched immediately
             * after interactive OAuth.
             */
            verifyAuthentication();
          }
        });
      }

      function loadErrorCallback() {
        // user does not exist yet
        $scope.$apply(function() {
          userService.initUser();  
        });
      }
    }
    
    /*
     * Initiates Github OAuth
     */
    function launchAuthentication() {
      
      alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_INIT);
      authenticate();
    }
    
    /*
     * Confirms GitHub OAuth
     */
    function verifyAuthentication() {
      
      alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_VERIFY);
      authenticate();
    }
    
    /*
     * Handles interaction with userService authentication
     */
    
    function authenticate() {
      
      if (vm.user.isAuthenticated) {
        // we don't need to do this for users that are already authenticated
        alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_ALREADY_AUTHENTICATED);
        return;
      }
      
      userService.authenticate()
        .then(successCallback)
        .catch(errorCallback);
      
      function successCallback(response) {
        
        $scope.$apply(function() {
          alerts.success(CONFIG.ALERTS.MESSAGES.OAUTH_SUCCESS);
        });
      }
      
      function errorCallback(response) {
        
        $scope.$apply(function() {
          alerts.error(response.error);
        });
      }
    }
  }
  
})();