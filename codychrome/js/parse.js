/*
 * Codychrome Problem Parser
 * Parses an existing Cody Coursework problem from the DOM
 *
 * Carlton Duffett
 * 05-17-2016
 */
(function() {
  
  var problem = {};
  var error = false;
  
  var RADIO_CHOICES = [
    'problem_category_function',
    'problem_category_script'
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
    problem.title = $('#problem_title').attr('value');
    problem.description = $('#problem_body').text();
    problem.template = $('#problem_function_template').text();
    problem.solution = $('#problem_reference_solution_attributes_body').text();
    problem.visibleTests = $('#problem_test_suite').text();
    problem.hiddenTests = $('#problem_hidden_test_suite').text();

    var selected_radio = $('.radio_circle.checked').parent().attr('class');
    problem.type = findProblemType(selected_radio);
  }
  catch(err) {
    // any number of errors could occur here. For now, we just catch them and move on
    error = true;
  }
  
  // pass parsed problem back to the extension. Validation is handled by the extension.
  var message = {
    error: error,
    problem: problem
  };
  
  chrome.runtime.sendMessage(message, function(response) {
    // do nothing in response
  });
  
})();
