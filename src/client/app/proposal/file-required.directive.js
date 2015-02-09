(function() {
    'use strict';

    angular
        .module('app.proposal')
        .directive('fileRead', fileRead);


    
    function fileRead () {
        var directive = {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                fileRead: '='
            },
            link: link
        };

        function link(scope, elem, attrs, ctrl) {
            elem.bind('change', function (e) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileRead = loadEvent.target.result;
                    });
                }
                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0]);
                } else {
                    scope.$apply(function () {
                        scope.fileRead = null;
                    });
                }
            });

            scope.$watch(function () {
                return scope.fileRead;
            }, function () {
                if (scope.fileRead) {
                    ctrl.$setValidity('value', true);
                } else {
                    ctrl.$setValidity('value', false);
                }
            })
        }

        return directive;
    }
})();
