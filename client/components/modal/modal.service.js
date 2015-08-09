'use strict';

angular.module('prindleApp')
  .factory('Modal', ['$rootScope', '$modal', '$timeout', function ($rootScope, $modal, $timeout) {
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
        scope: modalScope,
        controller: scope.modal.controller,
        keyboard: scope.modal.keyboard
      });
    }

    // Public API here
    return {

      /* get a value from a single field */
      singleField: function(cb) {
        cb = cb || angular.noop;

        return function() {
          // need to find how to make return key trigger Create button

          var args = Array.prototype.slice.call(arguments);
          var modalTitle = args.shift();

          var singleFieldModal = openModal({
            modal: {
              dismissable: true,
              keyboard: true,
              title: modalTitle,
              size: 'sm',
              template: 'components/modal/singleField.html',
              buttons: [
                  {
                    classes: 'btn-success',
                    text: 'Create',
                    click: function(result) {
                      singleFieldModal.close(result);
                    }
                  },
                  {
                    classes: 'btn-default',
                    text: 'Cancel',
                    click: function() {
                      singleFieldModal.dismiss();
                    }
                  }
                ]
              }
            });
          singleFieldModal.opened.then(function() {
            $timeout(function() {
              angular.element('#singleField').trigger('focus');
            });
          });
          singleFieldModal.result.then(function(result) {
            cb(result.data);   // not sure why cb.apply() doesn't work right here
          });
          }
        },


      /**
       * open categories editor
      */

      category: function(cb) {
        cb = cb || angular.noop;

        return function() {
          var categoryModal;
          var args = Array.prototype.slice.call(arguments);
          var modalTitle = args.shift();


          categoryModal = openModal({
            modal: {
              dismissable: true,
              keyboard: false,
              title: modalTitle,
              size: 'lg',
              controller: 'categoryModalCtrl',
              template: 'components/modal/categoryModal/categoryModal.html',
              buttons: [
                {
                  classes: 'btn-success',
                  text: 'Done',
                  click: function(e) {
                    categoryModal.close(e);
                  }
                }
              ]
            }
          });
          categoryModal.result.then(function(event) {
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
                keyboard: true,
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
