/*
 * Codychrome OAuth Controller
 * Manages user authentication and OAuth with GitHub
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
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
        // user already exists in storage
        $scope.$apply(function() {
          
          if (userService.user.isAuthenticated) {
            alerts.success(CONFIG.ALERTS.MESSAGES.OAUTH_SUCCESS);
            return;
          }
          
          // user is not authenticated yet, so...
          
          if (userService.user.interactiveAuthLaunched) {
            // Interactive auth was launched, so we'll try to verify that the user is now authorized
            alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_VERIFY);
            oauthService.verifyAuth()
              .then(authVerified)
              .catch(authNotVerified);
            
            function authVerified() {
              $scope.$apply(function() {
                alerts.success(CONFIG.ALERTS.MESSAGES.OAUTH_SUCCESS);
              });
            }
            
            function authNotVerified() {
              $scope.$apply(function() {
                alerts.error(CONFIG.ALERTS.MESSAGES.OAUTH_FAILED);
              }); 
            }
          }
          else {
            // user hasn't taken action to authorize GitHub yet
            alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_NEEDS_AUTHENTICATION);
          }
          
        });
      }

      function loadErrorCallback() {
        // user does not exist yet and still needs to be authenticated
        $scope.$apply(function() {
          userService.initUser();
          alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_NEEDS_AUTHENTICATION);
        });
      }
    }
    
    /*
     * Launches Github OAuth flow
     */
    function launchAuthentication() {
      
      alerts.warning(CONFIG.ALERTS.MESSAGES.OAUTH_INIT);
      oauthService.newAuth();
    }
  }
  
})();