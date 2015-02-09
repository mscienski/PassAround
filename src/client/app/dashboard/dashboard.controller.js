(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['currentAuth','$q', 'dataservice', 'logger'];
    /* @ngInject */
    function DashboardController(currentAuth, $q, dataservice, logger) {
        var vm = this;
        vm.news = {
            title: 'PassAround',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';
        vm.authData = null;

        activate();

        function activate() {
            getMessageCount();
            getPeople();
            vm.authData = !!currentAuth;
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getPeople() {
            return dataservice.getPeople().then(function (data) {
                vm.people = data;
                return vm.people;
            });
        }
    }
})();
