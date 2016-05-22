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
    
    var service = {
    
    };

    return service;
    //////////////////////////
  }  
})();