/*
 * Codychrome OAuth Controller
 * Manages user authentication and OAuth with GitHub
 * 
 * Carlton Duffett
 * 05-22-2016
 */

(function() {
  
  'use strict';
  
  angular
    .module('user')
    .controller('OAuthController', OAuthController);
  
  OAuthController.$inject = ['$scope', 'alerts', 'oauthService', 'userService'];
  
  function OAuthController($scope, alerts, oauthService, userService) {
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
          
          if (!userService.user.isAuthenticated && !userService.user.interactiveAuthLaunched) {
            alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED);
            return;
          }
          
          verifyAuthentication();
        });
      }

      function loadErrorCallback() {
        // user does not exist yet
        $scope.$apply(function() {
          userService.initUser();
          alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED);
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
     * Handles interaction with oauthService authentication
     */
    
    function authenticate() {
      oauthService.authenticate()
        .then(authVerified)
        .catch(authFailed);
      
      
      function authVerified() {
        $scope.$apply(function() {
          alerts.success(CONFIG.ALERTS.MESSAGES.OAUTH_SUCCESS);
        });
      }

      function authFailed() {
        $scope.$apply(function() {
          alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED);
        });
      }
    }
  }
  
})();