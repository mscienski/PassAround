(function() {
    'use strict';

    angular
        .module('app.proposal')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'proposal',
                config: {
                    url: '/proposal',
                    templateUrl: 'app/proposal/proposal.html',
                    title: 'proposal',
                    controller: 'ProposalController',
                    controllerAs: 'vm',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-puzzle-piece"></i> Proposals'
                    },
                    resolve: {
                        'currentAuth': ['authservice', function (authservice) {
                            return authservice.requireAuth();
                        }]
                    }
                }
            },
            {
                state: 'list',
                config: {
                    parent: 'proposal',
                    url: '/list',
                    templateUrl: 'app/proposal/proposal.list.html',
                    controller: 'ListProposalController',
                    controllerAs: 'vm',
                    title: 'proposal.list',
                    settings: {
                        nav: -1
                    },
                }
            },
            {
                state: 'new',
                config: {
                    parent: 'proposal',
                    url: '/new',
                    templateUrl: 'app/proposal/proposal.new.html',
                    controller: 'NewProposalController',
                    controllerAs: 'vm',
                    title: 'proposal.new',
                    settings: {
                        nav: -1
                    },
                }
            }
        ];
    }
})();
