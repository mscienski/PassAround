(function() {

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$scope', 'config', 'logger', '$state', 'authservice'];
    /* @ngInject */
    function ShellController($scope, config, logger, $state, authservice) {
        var vm = this;
        vm.logout = {
            show: false,
            logout: logout
        }
        vm.showSidebar = false;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Created by Michal Scienski',
            user: ''
        };

        activate();

        function activate() {
            authservice.isAuth().then(function (result) {
                if (result) {
                    vm.navline.user = result.password.email;
                    vm.logout.show = true;
                    vm.showSidebar = true;
                } else {
                    vm.navline.user = '';
                    vm.logout.show = false;
                    vm.showSidebar = false;
                }
            });
        }

        function logout() {
            authservice.logout().then(function (result) {
                $state.go('login');
            });
        }

        $scope.$on('logEvent', activate);
    }
})();
