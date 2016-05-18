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
    
    var problem = {
      title: '',
      desription: '',
      type: 0,          // 0 = function, 1 = script
      template: '',
      solution: '',
      visibleTests: '',
      hiddenTests: ''
    };
    
    var service = {
      problem: problem,
      
      /* methods */
      isValidProblem: isValidProblem,
      newProblem: newProblem
    };
    
    return service;
    ///////////////////////    
    
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
        
        var expected_keys = [
          'title',
          'description',
          'type',
          'template',
          'solution',
          'visibleTests',
          'hiddenTests'
        ];
        
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