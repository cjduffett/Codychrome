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
    
    var user = {
      username: '',
      password: ''
    };
    
    var repo = {
      path: ''
    };
    
    var service = {
      user: user,
      repo: repo,
      
      /* methods */
      saveUser: saveUser,
      saveRepo: saveRepo
    }
    
    return service;
    ///////////////////////////
    
    function saveUser(theUser) {
      // deep copy to preserve data binding
      angular.copy(theUser, user);
    }
    
    function saveRepo(theRepo) {
      // deep copy to preserve data binding
      angular.copy(theRepo, repo);
    }
  }  
})();