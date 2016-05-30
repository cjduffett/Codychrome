/*
 * Codychrome Problem Service
 * Manages the parsed Cody Coursework problem.
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
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
      isCompleteProblem: isCompleteProblem,
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
     * Tests if the problem is complete (contains all required fields)
     */
    function isCompleteProblem(prob) {
      
      if (isValidProblem(prob)) {
        
        var problem_keys = Object.keys(prob);
        var meta_keys = Object.keys(prob.meta);
        
        // verifies that all problem fields (except meta and visibleTests) are not blank
        for (var i = 0; i < problem_keys.length; i++) {
          if (problem_keys[i] === 'meta' || problem_keys[i] === 'visibleTests') {
            continue;
          }
          
          if (!prob[problem_keys[i]]) {
            return false;
          }
        }
        
        for (var i = 0; i < meta_keys.length; i++) {
          if (!prob.meta[meta_keys[i]]) {
            return false;
          }
        }
        // all required problem fields are not blank
        return true;
      }
      return false;
    }
    
    /*
     * Stores newly parsed problem in the problemService. We use angular.copy to preserve the data binding.
     */
    function newProblem(prob, meta) {
      angular.copy(prob, problem);
      angular.copy(meta, problem.meta);
    }
  }
})();