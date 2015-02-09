(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$rootScope', '$timeout', '$q', '$state', 'authservice'];
    /* @ngInject */
    function RegisterController($scope, $rootScope, $timeout, $q, $state, authservice) {
        var vm = this;
        vm.title = 'Register';
        vm.email = '';
        vm.password = '';
        vm.passwordRepeat = '';
        vm.registrationError = {
            isError: false,
            message: ''
        };

        vm.register = register;

        activate();

        function activate() {
            vm.authData = false;
            $rootScope.$broadcast('logEvent');
        }

        function register() {
            authservice.register(vm.email, vm.password).then(function (result) {
                authservice.login(vm.email, vm.password).then(function (result) {
                    $rootScope.$broadcast('logEvent');
                    $state.go('dashboard');
                })
            }, function (error) {
                vm.registrationError.isError = true;
                vm.registrationError.message = error.message;
            });
        }

        $scope.$watch('vm.registrationError.isError', function () {
            if (vm.registrationError) {
                $timeout(function () {
                    vm.registrationError.isError = false;
                    vm.registrationError.message = '';
                }, 3000);
            }
        });
    }
})();
