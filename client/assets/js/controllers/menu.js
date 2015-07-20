(function () {
    "use strict";

    angular.module('application')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', '$rootScope', '$state', 'ENV'];
    function MenuCtrl($scope, $rootScope, $state, ENV) {
        var vm = this;

        activate();
        vm.logout = logout;

        function activate() {
            $rootScope.isProduction = ENV.production;
        }

        function logout() {
            Trello.deauthorize();
            $rootScope.member = {};
            $state.reload("home");
        }
    }
})();
