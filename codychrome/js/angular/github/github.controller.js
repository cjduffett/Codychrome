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
  
  GithubController.$inject = ['$scope', 'alerts', 'oauthService', 'userService', 'githubService', 'problemService'];
  
  function GithubController($scope, alerts, oauthService, userService, githubService, problemService) {
    var vm = this;
    vm.repo = githubService.repo;
    vm.commit = {
      message: ''
    };
    
    /* methods */
    vm.saveRepo = saveRepo;
    vm.commitProblem = commitProblem;
    
    init();
    ///////////////////////
    
    function init() {

      initRepo();
    }
      
    /*
     * Initializes the GitHub repository
     */
    
    function initRepo() {
      
      return new Promise(function(resolve, reject) {
        
        githubService.loadRepo()
          .then(loadSuccessCallback)
          .catch(loadErrorCallback);

        function loadSuccessCallback() {
          $scope.$apply(function() {
            resolve();
          });
        }

        function loadErrorCallback() {
          // repo does not exist yet
          githubService.initRepo().then(resolve);
        }
      });
    }
    
    function saveRepo() {
      
      return new Promise(function(resolve, reject) {
        
        if (!vm.repo.name) {
          alerts.error(CONFIG.ALERTS.MESSAGES.REPO_NAME_INVALID);
          return;
        }
        
        githubService.saveRepo()
          .then(saveSuccessCallback)
          .catch(saveErrorCallback);
        
        function saveSuccessCallback() {
          $scope.$apply(function() {
            alerts.success(CONFIG.ALERTS.MESSAGES.REPO_SAVE_SUCCESS);
            resolve();
          });
        }
        
        function saveErrorCallback() {
          $scope.$apply(function() {
            alerts.error(CONFIG.ALERTS.MESSAGES.REPO_SAVE_FAILED);
            reject();
          });
        };
      });
    }
    
    /*
     * Commits the parsed problem to GitHub
     */
    function commitProblem() {
      
      alerts.info(CONFIG.ALERTS.MESSAGES.COMMIT_INIT);
      
      if (!userService.user.isAuthenticated) {
        alerts.error(CONFIG.ALERTS.MESSAGES.OAUTH_NOT_AUTHENTICATED);
        return;
      }
      
      if (!vm.commit.message) {
        alerts.error(CONFIG.ALERTS.MESSAGES.COMMIT_NO_MESSAGE);
        return;
      }
      
      if (!problemService.isCompleteProblem(problemService.problem)) {
        alerts.error(CONFIG.ALERTS.MESSAGES.COMMIT_NO_PROBLEM);
        return;
      }
      
      // check if repository exists yet
      githubService.getOrCreateRepo()
        .then(repoSuccess)
        .catch(repoError);
      
      function repoSuccess() {
        
        githubService.createOrUpdateProblem(problemService.problem, vm.commit.message)
          .then(problemSuccess)
          .catch(problemError);
      }
      
      function repoError(reponse) {
        $scope.$apply(function() {
          if (reponse.error) {
            alerts.error(reponse.error);
          }
          else {
            alerts.error(CONFIG.ALERTS.MESSAGES.COMMIT_FAILED);
          }
        });
      }
      
      function problemSuccess() {
        $scope.$apply(function() {
          alerts.success(CONFIG.ALERTS.MESSAGES.COMMIT_SUCCESS);
        });  
      }
      
      function problemError(response) {
        $scope.$apply(function() {
          if (response.error) {
            alerts.error(response.error);
          }
          else {
            alerts.error(CONFIG.ALERTS.MESSAGES.COMMIT_FAILED);
          }
        });
      }
    }
  }
  
})();