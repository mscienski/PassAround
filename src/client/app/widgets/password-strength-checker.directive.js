(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('passwordStrengthChecker', passwordStrengthChecker);

    /* @ngInject */
    function passwordStrengthChecker() {
        //Usage:
        //<div ht-widget-header title="vm.map.title"></div>
        // Creates:
        // <div ht-widget-header=""
        //      title="Movie"
        //      allow-collapse="true" </div>
        var directive = {
            scope: {
                password: '='
            },
            bindToController: true,
            templateUrl: 'app/widgets/password-strength-checker.html',
            restrict: 'EA',
            controller: PasswordStrengthController,
            controllerAs: 'pw',
            link: link
        };

        function PasswordStrengthController() {
            var pw = this;

            pw.score = 0;
            pw.updateScore = updateScore;

            var lengthScore = 0;
            var caseScore = 1;
            var numberScore = 1;
            var specialsScore = 1;
            //upper case
            var uCaseRe = /[A-Z]+/;
            //lower case
            var lCaseRe = /[a-z]+/;
            //numbers
            var numRe = /[0-9]+/;
            //specials
            var specialsRe = /(?![A-Za-z0-9])[\u0000-\uFFFF]+/;
            
            function updateScore(password) {
                if (password) {
                    if (password.length < 8) {
                        lengthScore = 0;
                    } else if (password.length > 8 && password.length < 14) {
                        lengthScore = 1;
                    } else if (password.length > 14) {
                        lengthScore = 3;
                    }

                    if (uCaseRe.exec(password) && lCaseRe.exec(password)) {
                        caseScore = 3;
                    } else {
                        caseScore = 1;
                    }

                    if (numRe.exec(password)) {
                        numberScore = 3;
                    } else {
                        numberScore = 1;
                    }

                    if (specialsRe.exec(password)) {
                        specialsScore = 3;
                    } else {
                        specialsScore = 1;
                    }

                    //good scores have at least 3 of the 4 categories above and a medium length, or a good length and 2 categories
                    pw.score = Math.ceil((lengthScore * (lengthScore + caseScore + numberScore + specialsScore)) / ((lengthScore !== 0 ? lengthScore : 1)*3));

                    pw.score = pw.score === 0 ? 1 : pw.score;
                }
            }
        }

        function link(scope, elem, attrs) {
            scope.$watch(function () {
                return scope.pw.password;
            }, function () {
                scope.pw.updateScore(scope.pw.password);
            });
        }

        return directive;
    }
})();
