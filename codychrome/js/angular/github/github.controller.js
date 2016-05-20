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
  
  GithubController.$inject = ['$scope', 'alerts', 'githubService'];
  
  function GithubController($scope, alerts, githubService) {
    var vm = this;
    vm.repo = githubService.repo;
    vm.user = githubService.user;
    vm.token = 'No token available';
    
    /* methods */
    vm.launchOAuth = launchOAuth;
    
    /////////////////////
    
    
  
    /*
     * Initiates Github OAuth
     */
    function launchOAuth() {
      
      alerts.warning('Launched oAuth...');
      githubService.authenticate()
        .then(successCallback)
        .catch(errorCallback);
      
      function successCallback(response) {
        
        $scope.$apply(function() {
          if (response.token) {
            vm.token = response.token;
            alerts.success('Authenticated with GitHub!');
          }
          else {
            vm.token = 'No token available';
            alerts.error('Authentication failed!');
          }
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