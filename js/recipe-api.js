var baseUrl = 'https://recipebox-comp3400.herokuapp.com/api', ingredients;

function loadRecipes () {
  $.get(baseUrl + '/recipes', function (recipes, status) {
    var template = $('#recipe-template').html();

    Mustache.parse(template);   // optional, speeds up future uses

    recipes.forEach(function (elem, index) {
      var rendered = Mustache.render(template, {
        card_id: index,
        recipe_picture: elem.picture,
        recipe_title: elem.title,
        recipe_desc: elem.desc,
        recipe_ingredients: elem.ingredients,
        s_recipe_ingredients: JSON.stringify(elem.ingredients),
        recipe_procedure: elem.procedure
      });

      $('#recipe-container').append(rendered);
    });
  });
}

function showPrompt (elem) {
  ingredients = $(elem).attr('value');

  $('#prompt').openModal();
}

function showProcedure (elem) {
  var procedure = $(elem).attr('value');

  $('#procedure-content').html(procedure);
  $('#procedure').openModal();
}

function getPortionCount () {
  var peopleAmount = document.getElementById("peopleAmount").value;

  $('#available_amounts').empty();

  $.post(baseUrl + '/ingredients?peopleAmount=' + peopleAmount, { ingredients: ingredients }, function (counter) {
    Materialize.toast('Calculating...', 1000);

    if (counter.status === 0) {
      counter.results.forEach(function (elem, index) {
        $('#result-title').html('Amount of ingredient portions needed per person:');

        var newItem = '<a href="javascript:void(0)" class="collection-item">' + elem.name + '<span class="badge"> Required amount: ' +
            elem.amount + ' ' + elem.unit + '</span></a>';

        $('#available_amounts').append(newItem);
      });

      $(this).delay(2000).queue(function() {
        $('#counter-results').openModal();
      });
    } else if (counter.status === 1) {
      $('#result-title').html('<span style="font-size: 18px">' + counter.message + '</span>');

      $(this).delay(2000).queue(function() {
        $('#counter-results').openModal();
      });
    }
  });
}

