'use strict';


angular.module('prindleApp')
  .controller('MainCtrl', function ($scope) {

    $scope.$on('$viewContentLoaded', function() {
      jQuery.event.props.push('dataTransfer');  // needed for lvlDragDrop
    });

  });
