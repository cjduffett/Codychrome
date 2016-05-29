/*
 * Codychrome Client Configuration
 *
 * Carlton Duffett
 * 05-19-2016
 */

var CONFIG = {
  
  DEBUG: true,
  
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
    auto_init: true,
    private: false,
    org_by_assignment: true
  },
  
  COMMIT: {
    message: ''
  },
  
  FILE: {
    path: '',
    content: '',  // base64 encoded file contents
    sha: ''       // sha1 hash of file contents
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
    VERIFY_TOKEN_URL: 'applications/:client_id/tokens/:access_token',
    GET_USER_URL: 'user'
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
      /* GitHub OAuth */
      OAUTH_INIT: 'Authenticating...',
      OAUTH_VERIFY: 'Verifying authentication...',
      OAUTH_FAILED: 'Authentication failed',
      OAUTH_SUCCESS: 'Authenticated with GitHub',
      OAUTH_CSRF: 'Unsecure Authentication Detected',
      OAUTH_ALREADY_AUTHENTICATED: 'Already authenticated',
      OAUTH_NOT_AUTHENTICATED: 'Not authenticated with GitHub',
      OAUTH_RETRY: 'Please retry authentication',

      /* Problem Parsing */
      PARSE_ERROR: 'Failed to parse problem',
      PARSE_SUCCESS: 'Problem parsed successfully',
      
      /* GitHub Repository */
      REPO_SAVE_SUCCESS: 'Repository updated',
      REPO_SAVE_FAILED: 'Failed to update repository'
    }
  },
  
  /* Filesystem Paths to Resources */
  FILES: {
    CONFIG: '/js/config.js',
    JQUERY: '/js/lib/jquery-2.2.3.min.js',
    PARSER: '/js/scripts/parse.js'
  }
};

/*
 * Any additional dynamic config needed
 */
CONFIG.GITHUB_API.VERIFY_TOKEN_URL = 'applications/' + CONFIG.GITHUB_CLIENT.ID + '/tokens/'; // + the user's token