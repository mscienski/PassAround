(function () {
    'use strict';

    angular
        .module('app.proposal')
        .controller('NewProposalController', NewProposalController);

    NewProposalController.$inject = ['currentAuth','$q', 'dataservice', 'logger'];
    /* @ngInject */
    function NewProposalController(currentAuth, $q, dataservice, logger) {
        var vm = this;
        vm.title = 'New Proposals';
        vm.authData = null;
        vm.uploadFile = null;

        activate();

        function activate() {
            vm.authData = !!currentAuth;
        }

    }
})();
