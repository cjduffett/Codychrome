/*
 * Codychrome Problem Parser
 * Parses an existing Cody Coursework problem from the DOM
 *
 * Copyright (C) 2016 Carlton Duffett
 * Licensed under GPL (https://github.com/cjduffett/Codychrome/blob/master/LICENSE)
 */
(function() {
  
  var problem = Object.assign({}, CONFIG.PROBLEM_TEMPLATE);
  
  var error = false;
  
  var RADIO_CHOICES = [
    CONFIG.PARSER.FUNCTION_RADIO_CLASS,
    CONFIG.PARSER.SCRIPT_RADIO_CLASS
  ];
    
  function findProblemType(radio_class) {
    for (var i = 0; i < RADIO_CHOICES.length; i++) {
      if (RADIO_CHOICES[i] === radio_class) {
        return i;
      }
    }
  }

  // attempt to parse problem from page
  try {
    problem.title         = $(CONFIG.PARSER.TITLE_ID).val();
    problem.description   = $(CONFIG.PARSER.DESCRIPTION_ID).val();
    problem.template      = $(CONFIG.PARSER.TEMPLATE_ID).val();
    problem.solution      = $(CONFIG.PARSER.SOLUTION_ID).val();
    problem.visibleTests  = $(CONFIG.PARSER.VISIBLE_TESTS_ID).val();
    problem.hiddenTests   = $(CONFIG.PARSER.HIDDEN_TESTS_ID).val();

    var selected_radio = $(CONFIG.PARSER.TYPE_RADIO_CLASS).parent().attr('class');
    problem.type = findProblemType(selected_radio);
  }
  catch(err) {
    // any number of errors could occur here. For now, we just catch them and move on
    error = true;
  }
  
  // pass parsed problem back to the extension. Validation is handled by the extension.
  var message = {
    from: 'parser',
    error: error,
    problem: problem
  };
  
  chrome.runtime.sendMessage(message, function(response) {
    // do nothing in response
  });
  
})();
