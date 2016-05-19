/*
 * Codychrome Problem Controller
 * Manages the interaction with a Cody Coursework problem.
 *
 * Carlton Duffett
 * 05-17-2016
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
    
    /*
     * Controller initialization
     */
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
      chrome.runtime.onMessage.addListener(
        function(request, sender) {
          
          // This callback runs outside of angular's scope. We therefore need $apply to update the data bindings.
          $scope.$apply(function() {
            if (request.problem && !request.error) {
              
              if (problemService.isValidProblem(request.problem)) {
                
                problemService.newProblem(request.problem);
                alerts.success('Problem parsed successfully!');
              }
              else {
                alerts.error('Not a valid problem.');
              } 
            }
            else {
              alerts.error('An error occured during parsing.');
            }
          });
        }
      );
      
      // run jQuery and parser against the Cody Coursework page
      chrome.tabs.executeScript(tab.id, {
        file: '/js/lib/jquery-2.2.3.min.js'
      });
      
      chrome.tabs.executeScript(tab.id, {
        file: '/js/scripts/parse.js'
      });
    }
    
    /*
     * Takes an existing JSON problem (either previously extracted or newly pulled from GitHub) and populates a Cody Coursework problem.
     */
    
    function populateProblem() {
      
    }
    
  }
  
})();