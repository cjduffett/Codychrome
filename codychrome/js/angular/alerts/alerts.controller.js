/*
 * Codychrome Alerts Controller
 * Uses the Bootstrap "alert" class to display visual alerts.
 *
 * Carlton Duffett
 * 05-17-2016
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