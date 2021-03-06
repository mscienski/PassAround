(function() {
    'use strict';

    angular
        .module('app.login')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'app/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Login',
                    settings: {
                        nav: -1,
                        content: '<i class="fa fa-lock"></i> Login'
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
