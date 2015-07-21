'use strict';

angular.module('prindleApp')
  .factory('Modal', ['$rootScope', '$modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: scope.modal.template,
        windowClass: modalClass,
        size: scope.modal.size,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* get a value from a single field */
      singleField: function(add) {
        add = add || angular.noop;

        return function() {
          var singleFieldModal;
          var args = Array.prototype.slice.call(arguments);
          var name = args.shift();
          var submitResult = function(result) {
            $rootScope.$broadcast('got-' + name + '-from-singleFieldModal', result);
          };

          // need to find how to redirect return key to Create button

          singleFieldModal = openModal({
            modal: {
              dismissable: true,
              title: 'Add New Category',    // this should be parameterized to make the modal modular
              size: 'sm',
              template: 'components/modal/singleField.html',
              submitResult: submitResult,
              buttons: [
                  {
                    classes: 'btn-success',
                    text: 'Create',
                    click: function(e) {
                      singleFieldModal.close(e);
                    }
                  },
                  {
                    classes: 'btn-default',
                    text: 'Cancel',
                    click: function(e) {
                      singleFieldModal.dismiss(e);
                    }
                  }
                ]
              }
            });
          singleFieldModal.result.then(function(event) {
            add.apply(event);
          });
          }
        },


      /* open categories editor */
      categories: function(cb) {
        cb = cb || angular.noop;

        return function() {
          var categoriesModal;


          // need to find how to redirect return key to Create button

          categoriesModal = openModal({
            modal: {
              dismissable: true,
              title: 'Manage Categories',    // this should be parameterized to make the modal modular
              size: 'lg',
              template: 'components/modal/categoriesModal/categoriesModal.html',
              buttons: [
                {
                  classes: 'btn-success',
                  text: 'Done',
                  click: function(e) {
                    categoriesModal.close(e);
                  }
                },
                {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    categoriesModal.dismiss(e);
                  }
                }
              ]
            }
          });
          categoriesModal.result.then(function(event) {
            cb.apply(event);
          });
        }
      },



      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                template: 'components/modal/modal.html',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  }]);
