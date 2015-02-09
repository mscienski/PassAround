(function () {
    'use strict';

    angular
        .module('app.proposal')
        .controller('ListProposalController', ListProposalController);

    ListProposalController.$inject = ['currentAuth','$q', 'dataservice', 'logger'];
    /* @ngInject */
    function ListProposalController(currentAuth, $q, dataservice, logger) {
        var vm = this;
        vm.title = 'New Proposals';
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
