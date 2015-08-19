'use strict';

angular.module('prindleApp')
  .service('weight', function () {

    this.validate = function(weight) {

      var unitPatterns = {
        pounds: /pound|pounds|lb|lbs/i,
        ounces: /ounce|ounces|oz|ozs/i,
        kilograms: /kilogram|kilograms|kilo|kilos|kg/i,
        grams: /gram|grams|gr|g/i
      };

      var validatedWeight = [];   // array of JSON objects to return
      var suppliedWeights = [];    // scratch array for the caller supplied values

//      var pounds = /pound|pounds|lb|lbs/i;
//      var ounces = /ounce|ounces|oz|ozs/i;
//      var kilograms = /kilogram|kilograms|kilo|kilos|kg/i;
//      var grams = /gram|grams|gr|g/i;

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
      var numeric = /[0-9]/;
      var alpha = /\D+/;
      _.forEach(weightGroups, function(weightGroup) {
        var amount = numeric.exec(weightGroup);
        var units = alpha.exec(weightGroup);
        suppliedWeights.push({
          weight: amount,
          units: units
        });
      });

      // check which unit is being used
      _.forEach(suppliedWeights, function(suppliedWeight) {
        _.forEach(unitPatterns, function(unitPattern) {
          if (unitPattern.test(suppliedWeight.units)) {
            validatedWeight.push(suppliedWeight);
          }
        });
      });



      // any number followed by characters is now in the array weightGroups

//      var weightPattern = /\d+\D+/;
//      var regex = /(\d+)/g;   // the /g option means 'global', so find all matches, not necessary?
//      var number = /[0-9]/;
//      if (number.test(weight)) {
//        console.log('number');
//      } else {
//        console.log('not a number');
//      }
//      if (weightPattern.test(weight)) {
//        console.log('good')
//      } else {
//        console.log('bad');
//      }
    };
  });
