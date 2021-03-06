/*
 * Codychrome Client Configuration
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */

var CONFIG = {
  
  DEBUG: false,
  
  /* Codychrome User Template */
  USER: {
    username: '',
    isAuthenticated: false,
    interactiveAuthLaunched: false,
    authToken: ''
  },
  
  /* Codychrome GitHub Repo Data */
  REPO: {
    name: 'cody-coursework',  // the default repository name
    description: 'Cody Coursework problems managed by Codychrome',
    auto_init: true,
    private: false,
    org_by_assignment: true
  },
      
  /* GitHub Client */
  GITHUB_CLIENT: {
    ID: '',  // omitted in source control for security reasons
    SECRET: '',
    SCOPE: 'repo'
  },
  
  /* GitHub API Routes */
  GITHUB_API: {
    WEB_ROOT: 'https://github.com/',
    API_ROOT: 'https://api.github.com/',
    AUTH_URL: 'login/oauth/authorize',
    AUTH_REDIRECT_PATH: '', // redirects to the root
    TOKEN_URL: 'login/oauth/access_token',
    GET_USER_URL: 'user',
    GET_REPO_URL: 'repos/:username/:repo_name',
    CREATE_REPO_URL: 'user/repos',
    FILE_URL: 'repos/:username/:repo_name/contents/:path'
  },

  /* Cody Coursework Problem Parser */
  PARSER: {
    TITLE_ID: '#problem_title',
    DESCRIPTION_ID: '#problem_body',
    TEMPLATE_ID: '#problem_function_template',
    SOLUTION_ID: '#problem_reference_solution_attributes_body',
    VISIBLE_TESTS_ID: '#problem_test_suite',
    HIDDEN_TESTS_ID: '#problem_hidden_test_suite',
    TYPE_RADIO_CLASS: '.radio_circle.checked',
    FUNCTION_RADIO_CLASS: 'problem_category_function',
    SCRIPT_RADIO_CLASS: 'problem_category_script',
    FUNCTION: 0,
    SCRIPT: 1
  },
  
  /* Cody Coursework Problem Template */
  PROBLEM_TEMPLATE: {
    meta: {
      courseName: '',
      assignmentName: '',   // assignment and problem name are slugs parsed from the page's URL
      problemName: '' 
    },
    title: '',
    description: '',
    type: 0,
    template: '',
    solution: '',
    visibleTests: '',
    hiddenTests: ''
  },
  
  /* Alert Messages */
  ALERTS: {
    
    STYLE_CLASSES: {
      ERROR: 'alert-danger',
      INFO: 'alert-info',
      SUCCESS: 'alert-success',
      WARNING: 'alert-warning'
    },
    
    MESSAGES: {
      /* Unkown Error */
      UNKNOWN_ERROR: 'An unknown error occured',
      
      /* GitHub OAuth */
      OAUTH_INIT: 'Contacting GitHub...',
      OAUTH_VERIFY: 'Verifying authentication...',
      OAUTH_FAILED: 'Authentication failed, please retry',
      OAUTH_SUCCESS: 'Authenticated with GitHub',
      OAUTH_CSRF: 'Unsecure Authentication Detected',
      OAUTH_NOT_AUTHENTICATED: 'Not authenticated with GitHub',
      OAUTH_NEEDS_AUTHENTICATION: 'Please authorize GitHub to continue',

      /* Problem Parsing */
      PARSE_ERROR: 'Failed to parse problem',
      PARSE_SUCCESS: 'Problem parsed successfully',
      
      /* GitHub Repository */
      REPO_SAVE_SUCCESS: 'Repository settings updated',
      REPO_SAVE_FAILED: 'Failed to update repository',
      REPO_NAME_INVALID: 'Please enter a valid repository name',
      
      /* GitHub Commit */
      COMMIT_INIT: 'Committing to GitHub...',
      COMMIT_VERIFYING_REPO: 'Verifying repository...',
      COMMIT_UPDATING_PROBLEM: 'Updating problem...',
      COMMIT_FAILED: 'Failed to commit to GitHub',
      COMMIT_SUCCESS: 'Committed successfully',
      COMMIT_NO_MESSAGE: 'Please enter a comment',
      COMMIT_NO_PROBLEM: 'No parsed problem to commit',
      COMMIT_NO_CHANGES: 'No changes to commit'
    }
  },
  
  /* Filesystem Paths to Resources */
  FILES: {
    CONFIG: '/js/config.js',
    JQUERY: '/js/lib/jquery-2.2.3.min.js',
    PARSER: '/js/scripts/parse.js'
  }
};
