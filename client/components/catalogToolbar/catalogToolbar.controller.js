'use strict';

/**
 * Catalog Toolbar Controller - handles the binding of buttons in the toolbar above the
 * catalog list to actions handled in the list controllers
 */

angular.module('prindleApp')
  .directive('catalogToolbar', function () {
    return {
      templateUrl: '/components/catalogToolbar/catalogToolbar.html',
      restrict: 'A',
      controller: 'catalogToolbarCtrl'
    };
  })
//  .controller('catalogToolbarCtrl', ['$scope', function() {
//    $scope.addCatalogAction = function() {
//      console.log('adding');
//
//      $scope.listUtil.add('catalogs',
//        [{
//            name: 'untitled',
//            readOnly: false
//          }
//        ]
//      );
//
//    };
//  }])
;
//    /**
//     * addCatalogAction() - ideally create new collection with edit action enabled
//     */
//
//
//    $scope.addCatalogAction = function() {
//
//      $scope.listUtil.add('catalogs',
//        [{
//            name: 'untitled',
//            readOnly: false
//          }
//        ]
//      );
//
//    };
//
//    /**
//     * copyCatalogAction() - copy selected collections
//     */
//
//    $scope.copyCatalogAction = function() {
//
//      if (typeof $scope.data.catalogs  === 'undefined' || $scope.data.catalogs.length === 0 ||
//        $scope.state.catalogs.selected.length === 0) {
//
//        return;
//
//      } else {
//
//        // need to make sure when copying a read-only item, that item becomes writable
//
//        $scope.listUtil.copy('catalogs', $scope.state.catalogs.selected);
//
//      }
//    };
//
//    /**
//     * removeCatalogAction() - confirm, then delete collections
//     */
//
//    var itemsToDelete = $scope.state.catalogs.selected;
//
//    $scope.removeCatalogAction = Modal.confirm.delete(function(itemsToDelete) {
//
//      if (typeof $scope.data.catalogs === 'undefined' || $scope.data.catalogs.length === 0 ||
//        $scope.state.catalogs.selected.length === 0) {
//
//        return;
//
//      } else {
//
//        $scope.listUtil.delete('catalogs', $scope.state.catalogs.selected);
//
//      }
//    });

