(function () {
    'use strict';

    angular
        .module('app.proposal')
        .controller('ProposalController', ProposalController);

    ProposalController.$inject = ['currentAuth','$q', 'dataservice', 'logger'];
    /* @ngInject */
    function ProposalController(currentAuth, $q, dataservice, logger) {
        var vm = this;
        vm.title = 'Proposals';
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
