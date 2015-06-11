(function() {
    'use strict';

    angular
        .module('application')
        .run(run);

    run.$inject = ['$rootScope', '$state'];

    function run($rootScope, $state) {
        activate();
        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        function activate() {
            FastClick.attach(document.body);
        }

        function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            if(!Trello.authorized()) {
                logMe();
            }
        }

        function logMe() {
            $state.go("home");

            Trello.authorize({
                type        : "popup",
                name        : "Trello for Akkroo",
                persist     : true,
                interactive : true,
                scope       : {write : true, read : true},
                success     : onAuthorize
            });
        }

        function onAuthorize() {
            Trello.members.get("me", successCallback, errorCallback);

            function successCallback(member) {
                $rootScope.$apply(function() {
                    $rootScope.member = member;
                    $state.reload("home");
                });
            }

            function errorCallback(error) {
                if(error.status === 401) {
                    Trello.deauthorize();
                    logMe();
                }
            }
        }
    }
})();
