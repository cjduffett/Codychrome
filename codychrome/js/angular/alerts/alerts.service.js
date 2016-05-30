/*
 * Codychrome Alerts Service
 * Uses the Bootstrap "alert" class to display visual alerts.
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function(){
  
  'use strict';
  
  angular
    .module('alerts', [])
    .factory('alerts', alerts);
  
  function alerts() {
    
    var alert = {
      message: '',
      class: ''
    };
    
    var service = {
      alert     : alert,
      
      /* methods */
      error     : error,
      info      : info,
      success   : success,
      warning   : warning,
      clear     : clear
    };
    
    return service;
    ///////////////////////
    
    function setAlert(message, alertClass) {
      alert.message = message;
      alert.class = alertClass;
    }
    
    function error(message) {
      setAlert(message, CONFIG.ALERTS.STYLE_CLASSES.ERROR);
    }
    
    function info(message) {
      setAlert(message,  CONFIG.ALERTS.STYLE_CLASSES.INFO);
    }
    
    function success(message) {
      setAlert(message,  CONFIG.ALERTS.STYLE_CLASSES.SUCCESS);
    }
    
    function warning(message) {
      setAlert(message,  CONFIG.ALERTS.STYLE_CLASSES.WARNING);
    }
    
    function clear() {
      setAlert('','');
    }
  }
})();