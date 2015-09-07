'use strict';

angular.module('prindleApp')
  .service('weight', function () {

    // put units in order of matching specificity, e.g. 'kg' before 'g' so more specific one gets match

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
                                  // actual value in grams

      // need to break up the weight parameter into multiple strings
      // first a number then a string for the units
      // possibly discard anything preceding the number
      // after finding a number, test for valid unit, discard the rest
      // return false if it doesn't match the form \d+\D+

      // need a way to get the global unit setting (defaults to grams)
      // actually this can be managed by the caller

      if (!weight) {
        return;
      }
      // remove the whitespace and non-alphanumerics
      weight = weight.replace(/\W/g,'');

      // if only a number is entered, return it with no unit
      if (/^\d+$/.test(weight)) {
        return [{
          weight: weight,
          units: 'default'
        }];
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
      var weightInGrams = 0;

      _.forEach(suppliedWeights, function(suppliedWeight) {

        for (var i = 0; i < units.length; i++) {

          if (units[i].pattern.test(suppliedWeight.units)) {
            if (!validatedWeight.displayWeight) {
              validatedWeight.displayWeight = '';
              validatedWeight.displayWeight += suppliedWeight.weight + units[i].abbrev;
            } else {
              validatedWeight.displayWeight += ' ' + suppliedWeight.weight + units[i].abbrev;
            }

            weightInGrams += convertToGrams(units[i].name, suppliedWeight.weight);

            break;  // don't want multiple matches
          }
        }
      });

      validatedWeight.grams = weightInGrams;

      return validatedWeight;

    };

    var convertToGrams = function(unit, value) {
      var unitObject = _.find(units, {name: unit});
      if (unitObject) {
        return value * unitObject.conversion;
      } else {
        return 0;   // maybe good??
      }
    };

  });
