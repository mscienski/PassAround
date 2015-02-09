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
            isAuth: isAuth,
            register: register,
            resetPassword: resetPassword,
            changePassword: changePassword,
            deleteAccount: deleteAccount
        };

        var fb = new Firebase('https://passaround.firebaseio.com/');
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

        function register(email, password) {
            var defer = $q.defer();
            var authUser = {};
            $auth.$createUser({
                email: email,
                password: password
            }).then(function (result) {
                authUser = result;
                var userSync = $firebase(fb.child('/Users'));
                var userObject = userSync.$asObject();
                return userObject.$loaded();
            }).then(function(userObj) {
                userObj[email.replace('.', ',')] = {
                    email: email,
                    created: Firebase.ServerValue.TIMESTAMP
                };
                return userObj.$save();
            }, function (error) {
                defer.reject(error)
            }).then(function () {
                defer.resolve(authUser);
            }, function (error) {
                defer.reject(error)
            });

            return defer.promise;
        }

        function resetPassword(email) {
            return $auth.$resetPassword({
                email: email
            });
        }

        function changePassword(email, oldPass, newPass) {
            return $auth.$changePassword({
                email: email,
                oldPassword: oldPass,
                newPassword: newPass
            });
        }

        function deleteAccount(email, password) {
            return $auth.$removeUser({
                email: email,
                password: password
            });
        }

        return service;
    }
})();
