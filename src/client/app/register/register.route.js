(function() {
    'use strict';

    angular
        .module('app.register')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'register',
                config: {
                    url: '/register',
                    templateUrl: 'app/register/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm',
                    title: 'Register',
                    settings: {
                        nav: -1,
                        content: '<i class="fa fa-lock"></i> Register'
                    },
                    resolve: {
                        'loggedIn': ['authservice', '$q', '$state', function (authservice, $q, $state) {
                            var defer = $q.defer();

                                authservice.isAuth().then(function (res) {
                                    if (res) {
                                        defer.resolve($state.go('dashboard'));
                                    } else {
                                        defer.resolve();
                                    }
                                });

                            return defer.promise;
                        }]
                    }
                }
            }
        ];
    }
})();
