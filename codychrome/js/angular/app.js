/*
 * CodyChrome Core App
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function() {

  'use strict';

  angular
    .module('app', [
      /* shared modules */
      'alerts',
      'user',
      'oauth',
      'problem',
      'github'
    ]);
  
})();