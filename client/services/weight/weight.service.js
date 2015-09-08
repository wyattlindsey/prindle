'use strict';

angular.module('prindleApp')
  .service('weight', function () {

    // put units in order of matching specificity, e.g. 'kg' before 'g' so more specific one gets match
    // there must be a regex way to make 'kg' match but not 'g'

    var units = [
      {
        name: 'pounds',
        pattern: /pound|pounds|lb|lbs/i,
        abbrev: 'lb',
        conversion: 453.59
      },
      {
        name: 'ounces',
        pattern: /ounce|ounces|oz|ozs/i,
        abbrev: 'oz',
        conversion: 28.35
      },
      {
        name: 'kilograms',
        pattern: /kilogram|kilograms|kilo|kilos|kg/i,
        abbrev: 'kg',
        conversion: 1000
      },
      {
        name: 'grams',
        pattern: /gram|grams|gr|g/i,
        abbrev: 'g',
        conversion: 1
      }
    ];

    this.validate = function(weight) {

      var suppliedWeights = [];   // scratch array for the caller supplied values contained in 'weight'
      var validatedWeight = {};   // object to return, including cleaned up custom weight string and
                                  // actual value in gram

      if (!weight) {
        return false;
      }
      // remove the whitespace and non-alphanumerics
      weight = weight.replace(/\W/g,'');

//      if

      // if only a number is entered, return it in grams (maybe default unit later, or perhaps
      // do that in the view layer)
      if (/^\d+$/.test(weight)) {
        return {
          display: weight + 'g',
          grams: Number(weight)
        };
      }

      // split the string into groups of number and character (unit) pairs
      var weightPattern = /\d+\D+/g;
      var weightGroups = [];
      var tempWeightGroup;

      while((tempWeightGroup = weightPattern.exec(weight)) !== null) {
        weightGroups.push(tempWeightGroup);
      }

      // drop anything beyond two groups
      weightGroups = weightGroups.slice(0,2);

      // split off each weight group's number


      // split off each weight group's unit and number and store it in the temp array
      var numeric = /[0-9]+/;
      var alpha = /\D+/;
      _.forEach(weightGroups, function(weightGroup) {
        var amount = numeric.exec(weightGroup);
        var units = alpha.exec(weightGroup);
        suppliedWeights.push({
          weight: Number(amount),
          units: units
        });
      });

      // match unit names and create formatted weight object
      var totalWeightInGrams;

      _.forEach(suppliedWeights, function(suppliedWeight) {

        // this whole thing would be better if the regex were better so we could avoid the break statement
        // it's not good to use the condition of a variable to determine if this thing was matched
        // should be tracking a boolean (result of search?) for the unit part to be valid
        // checking if a unit matches could be a separate function

        for (var i = 0; i < units.length; i++) {

          if (units[i].pattern.test(suppliedWeight.units)) {
            if (!totalWeightInGrams) {
              totalWeightInGrams = 0;
            }
            if (!validatedWeight.display) {
              validatedWeight.display = '';
              validatedWeight.display += suppliedWeight.weight + units[i].abbrev;
            } else {
              validatedWeight.display += ' ' + suppliedWeight.weight + units[i].abbrev;
            }

            var grams = convertToGrams(units[i].name, suppliedWeight.weight);

            totalWeightInGrams += (grams || 0);

            break;  // don't want multiple matches
          }
        }
      });

      if (typeof totalWeightInGrams == 'undefined') {
        return false;
      } else {
        validatedWeight.grams = totalWeightInGrams;
      }

      return validatedWeight;

    };

    var convertToGrams = function(unit, value) {
      var unitObject = _.find(units, {name: unit});
      if (unitObject && !isNaN(value)) {
        return Number(value) * unitObject.conversion;
      } else {
        return false;
      }
    };

  });
