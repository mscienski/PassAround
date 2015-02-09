(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authservice', authservice);

    authservice.$inject = ['$q', '$firebase', '$firebaseAuth'];
    /* @ngInject */
    function authservice($q, $firebase, $firebaseAuth) {
        var service = {
            login: login,
            logout: logout,
            requireAuth: requireAuth,
            isAuth: isAuth
        };

        var fb = new Firebase('https://passaround.firebaseio.com/');
        var $fb = $firebase(fb);
        var $auth = $firebaseAuth(fb);

        function login(email, password) {
            return $auth.$authWithPassword({
                email: email,
                password: password
            });
        }

        function logout() {
            return $q.when($auth.$unauth());
        }

        function requireAuth() {
            return $auth.$requireAuth();
        }

        function isAuth() {
            return $q.when($auth.$getAuth());
        }

        return service;
    }
})();
