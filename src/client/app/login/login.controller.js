(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$q', '$state', 'authservice'];
    /* @ngInject */
    function LoginController($rootScope, $q, $state, authservice) {
        var vm = this;
        vm.news = {
            title: 'PassAround',
            description: 'Pass Around is a site for democratically created media content.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Login';
        vm.email = '';
        vm.password = '';
        vm.fb = {};
        vm.sync = {};

        vm.login = login;

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
                console.log(errors);
                $rootScope.$broadcast('logEvent');
            });
        }
    }
})();
