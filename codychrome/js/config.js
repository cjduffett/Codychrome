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
    isAuthenticated: false,
    interactiveAuthLaunched: false,
    authToken: ''
  },
  
  /* Common Headers in all HTTP requests */
  HTTP: {
    HEADERS: {
      'User-Agent': 'Codychrome',
      'Accept': 'application/json'
    }
  },
  
  /* GitHub Client */
  GITHUB_CLIENT: {
    ID: '',  // omitted in source control for security reasons
    SECRET: '',
    SCOPE: 'repo',
    AUTH_REDIRECT_PATH: '', // redirects to the root
    AUTH_URL: 'https://github.com/login/oauth/authorize',
    TOKEN_URL: 'https://github.com/login/oauth/access_token',
  },
  
  /* GitHub API Routes */
  GITHUB_API: {
    ROOT: 'https://api.github.com/',
    VERIFY_TOKEN_URL: 'applications/:client_id/tokens/:access_token',  
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
      PARSE_SUCCESS: 'Problem parsed successfully'
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