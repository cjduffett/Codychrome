/*
 * Codychrome Client Configuration
 *
 * Carlton Duffett
 * 05-19-2016
 */

var CONFIG = {
  
  /* GitHub Client */
  GITHUB_CLIENT: {
    ID: '',  // omitted in source control for security reasons
    SECRET: '',
    SCOPE: 'repo',
    AUTH_REDIRECT_PATH: 'pages/github.html',
    AUTH_URL: 'https://github.com/login/oauth/authorize',
    TOKEN_URL: 'https://github.com/login/oauth/access_token'
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
      OAUTH_INIT_MESSAGE: 'Authenticating...',
      OAUTH_FAILED_MESSAGE: 'Authentication failed',
      OAUTH_SUCCESS_MESSAGE: 'Authenticated with GitHub',
      OAUTH_CSRF_MESSAGE: 'Unsecure Authentication Detected',

      /* Problem Parsing */
      PARSE_ERROR_MESSAGE: 'Failed to parse problem',
      PARSE_SUCCESS_MESSAGE: 'Problem parsed successfully'
    }
  },
  
  /* Filesystem Paths to Resources */
  FILES: {
    CONFIG: '/js/config.js',
    JQUERY: '/js/lib/jquery-2.2.3.min.js',
    PARSER: '/js/scripts/parse.js'
  }
};