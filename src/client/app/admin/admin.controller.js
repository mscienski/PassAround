(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$timeout', '$state', 'authservice'];
    /* @ngInject */
    function AdminController($scope, $timeout, $state, authservice) {
        var vm = this;
        vm.title = 'Admin';
        vm.oldPass = '';
        vm.newPass = '';
        vm.newPassRepeat = '';
        vm.deleteEmail = '';
        vm.deletePassword = '';
        vm.changed = false;
        vm.errored = false;

        vm.authEmail = '';

        vm.changePassword = changePassword;
        vm.deleteAccount = deleteAccount;

        activate();

        function activate() {
            authservice.isAuth().then(function (result) {
                vm.authEmail = result.password.email;
            });
        }

        function changePassword() {
            authservice.changePassword(vm.authEmail, vm.oldPass, vm.newPass).then(function (result) {
                vm.changed = true;
            }, function (error) {
                vm.errored = true;
            });
        }

        function deleteAccount() {
            authservice.deleteAccount(vm.deleteEmail, vm.deletePassword).then(function () {
                $state.go('login');
            });
        }

        $scope.$watch('vm.changed', function () {
            if (vm.changed) {
                $timeout(function () {
                    vm.changed = false;
                }, 3000);
            }
        });

        $scope.$watch('vm.errored', function () {
            if (vm.errored) {
                $timeout(function () {
                    vm.errored = false;
                }, 3000);
            }
        });
    }
})();
