/*
 * Codychrome Problem Service
 * Manages the parsed Cody Coursework problem.
 *
 * Carlton Duffett
 * 05-17-2016
 */
(function(){
  
  'use strict';
  
  angular
    .module('problem', [])
    .factory('problemService', problemService);
  
  function problemService() {
    
    var problem = {};
    
    var service = {
      problem: problem,
      
      /* methods */
      isValidProblem: isValidProblem,
      newProblem: newProblem
    };
    
    init();
    
    return service;
    ///////////////////////    
    
    function init() {
      angular.copy(CONFIG.PROBLEM_TEMPLATE, problem);
    }
    
    /*
     * Used to validate the parsed problem object keys
     */
    function inArray(array, el) {
      for (var i = array.length; i--;) {
        if (array[i] === el) return true;
      }
      return false;
    }
    
    function isEqArrays(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }
      for (var i = arr1.length; i--;) {
        if (!inArray(arr2, arr1[i])) {
          return false;
        }
      }
      return true;
    }
    
    function isValidProblem(prob) {
      
      if (prob && typeof(prob) === 'object') {
        
        var expected_keys = Object.keys(CONFIG.PROBLEM_TEMPLATE);
        
        var keys = Object.keys(prob);
        
        if (isEqArrays(keys, expected_keys)) {
          return true;
        }
      }
      return false;
    }
    
    /*
     * Stores newly parsed problem in the problemService. We use angular.copy to preserve the data binding.
     */
    function newProblem(prob) {
      angular.copy(prob, problem);
    }
  }
})();