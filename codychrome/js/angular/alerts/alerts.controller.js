/*
 * Codychrome Alerts Controller
 * Uses the Bootstrap "alert" class to display visual alerts.
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function() {
  
  'use strict';
  
  angular
    .module('alerts')
    .controller('AlertsController', AlertsController);
  
  AlertsController.$inject = ['alerts'];
  
  function AlertsController(alerts) {
    var vm = this;
    vm.alert = alerts.alert;
  }
  
})();