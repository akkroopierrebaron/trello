(function () {
    "use strict";

    angular.module('application')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', '$rootScope', '$state'];
    function MenuCtrl($scope, $rootScope, $state) {
        var vm = this;

        activate();
        vm.logout = logout;

        function activate() {
        }

        function logout() {
            Trello.deauthorize();
            $rootScope.member = {};
            $state.reload("home");
        }
    }
})();
