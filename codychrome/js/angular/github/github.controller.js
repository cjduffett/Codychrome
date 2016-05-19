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
    
    /* methods */
    vm.saveCredentials = saveCredentials;
    
    init();
    
    /////////////////////
    
    /*
     * Controller initialization
     */
    function init() {
      loadCredentials();
    }
    
    /*
     * Loads the user's GitHub credentials from local storage
     */
    
    function loadCredentials() {
      
    }
    
    /*
     * Saves or updates the user's GitHub credentials to local storage
     */
    
    function saveCredentials() {
    
    } 
  }
  
})();