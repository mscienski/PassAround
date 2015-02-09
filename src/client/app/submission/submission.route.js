(function() {
    'use strict';

    angular
        .module('app.submission')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'submission',
                config: {
                    url: '/submission',
                    templateUrl: 'app/submission/submission.html',
                    controller: 'SubmissionController',
                    controllerAs: 'vm',
                    title: 'submission',
                    settings: {
                        nav: -1,
                        content: '<i class="fa fa-share"></i> Submission'
                    },
                    resolve: {
                        'currentAuth': ['authservice', function (authservice) {
                            return authservice.requireAuth();
                        }]
                    }
                }
            }
        ];
    }
})();
