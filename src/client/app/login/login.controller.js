(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$rootScope', '$timeout', '$q', '$state', 'authservice'];
    /* @ngInject */
    function LoginController($scope, $rootScope, $timeout, $q, $state, authservice) {
        var vm = this;
        vm.title = 'Login';
        vm.email = '';
        vm.password = '';
        vm.loginError = {
            isError: false,
            message: ''
        };
        vm.isReset = false;

        vm.login = login;
        vm.resetPassword = resetPassword;

        activate();

        function activate() {
            vm.authData = false;
            $rootScope.$broadcast('logEvent');
        }

        function login() {
            authservice.login(vm.email, vm.password).then(function (result) {
                $state.go('dashboard');
                $rootScope.$broadcast('logEvent');
            }, function (errors) {
                vm.loginError.isError = true;
                vm.loginError.message = errors.message
                $rootScope.$broadcast('logEvent');
            });
        }

        function resetPassword() {
            if (vm.email) {
                authservice.resetPassword(vm.email).then(function () {
                    vm.isReset = true;
                });
            }
        }

        $scope.$watch('vm.loginError.isError', function() {
            if (vm.loginError) {
                $timeout(function () {
                    vm.loginError.isError = false;
                    vm.loginError.message = '';
                }, 3000);
            }
        });

        $scope.$watch('vm.isReset', function () {
            if (vm.isReset) {
                $timeout(function () {
                    vm.isReset = false;
                }, 3000);
            }
        });
    }
})();
