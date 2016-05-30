/*
 * Codychrome Problem Controller
 * Manages the interaction with a Cody Coursework problem.
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function() {
  
  'use strict';
  
  angular
    .module('problem')
    .controller('ProblemController', ProblemController);
  
  ProblemController.$inject = ['$scope', 'alerts', 'problemService'];
  
  function ProblemController($scope, alerts, problemService) {
    var vm = this;
    var tab = {}; // the current active tab
    vm.problem = problemService.problem;
    
    /* methods */
    vm.parseProblem = parseProblem;
    vm.populateProblem = populateProblem;
    
    init();
    
    ////////////////////
    
    function init() {
      
      // get the current active tab from chrome
      var query = {
        active: true,
        currentWindow: true
      };
      
      chrome.tabs.query(query, function(tabs) {
        tab = tabs[0];
      });
    }
    
    /*
     * Parses an existing Cody Coursework problem into its JSON representation.
     */
    function parseProblem() {  
      
      // setup listener to catch the response from the parser
      chrome.runtime.onMessage.addListener(listener);
      
      function listener(request, sender) {

        if (request.from !== 'parser') {
          return;
        }
        
        // This callback runs outside of angular's scope. We therefore need $apply to update the data bindings.
        $scope.$apply(function() {
          if (request.problem && !request.error) {

            if (problemService.isValidProblem(request.problem)) {

              // we infer the problem's course, assignment, and problem name from the tab's URL
              var meta = {
                courseName: getCourseName(tab.url),
                assignmentName: getAssignmentName(tab.url),
                problemName: getProblemName(tab.url)
              };
              
              problemService.newProblem(request.problem, meta);
              alerts.success(CONFIG.ALERTS.MESSAGES.PARSE_SUCCESS);
            }
            else {
              alerts.error(CONFIG.ALERTS.MESSAGES.PARSE_ERROR);
            } 
          }
          else {
            alerts.error(CONFIG.ALERTS.MESSAGES.PARSE_ERROR);
          }
        });
      }
            
      // run config, jQuery, and parser against the Cody Coursework page
      chrome.tabs.executeScript(tab.id, {
        file: CONFIG.FILES.CONFIG
      });
      
      chrome.tabs.executeScript(tab.id, {
        file: CONFIG.FILES.JQUERY
      });
      
      chrome.tabs.executeScript(tab.id, {
        file: CONFIG.FILES.PARSER
      });
    }
    
    /*
     * Takes an existing JSON problem (either previously extracted or newly pulled from GitHub) and populates a Cody Coursework problem.
     */
    
    function populateProblem() {
      
    }
    
    /*
     * Parses a problem's course name from the current tab's URL
     * FORMAT:
     * https://coursework.mathworks.com/courses/<coursename>/assignments/<assignment_name>/problems/<problem_name>/edit
     */
    function getCourseName(url) {
      return url.split('/')[4];
    }
    
    /*
     * Parses a problem's assignment name from the current tab's URL
     * FORMAT:
     * https://coursework.mathworks.com/courses/<coursename>/assignments/<assignment_name>/problems/<problem_name>/edit
     */
    function getAssignmentName(url) {
      return url.split('/')[6];  
    }
    
    /*
     * Parses a problem's filename from the current tab's URL
     * FORMAT:
     * https://coursework.mathworks.com/courses/<coursename>/assignments/<assignment_name>/problems/<problem_name>/edit
     */
    function getProblemName(url) {
      return url.split('/')[8];
    }
  }
  
})();