/*
 * Codychrome Problem Parser
 * Parses an existing Cody Coursework problem from the DOM
 *
 * Carlton Duffett
 * 05-17-2016
 */
(function() {
  
  var problem = {
    title: '',
    description: '',
    type: 0,
    template: '',
    solution: '',
    visibleTests: '',
    hiddenTests: ''
  };
  
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
    problem.title         = $(CONFIG.PARSER.TITLE_ID).attr('value');
    problem.description   = $(CONFIG.PARSER.DESCRIPTION_ID).text();
    problem.template      = $(CONFIG.PARSER.TEMPLATE_ID).text();
    problem.solution      = $(CONFIG.PARSER.SOLUTION_ID).text();
    problem.visibleTests  = $(CONFIG.PARSER.VISIBLE_TESTS_ID).text();
    problem.hiddenTests   = $(CONFIG.PARSER.HIDDEN_TESTS_ID).text();

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
