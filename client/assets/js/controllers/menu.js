(function () {
    "use strict";

    angular.module('application')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', '$state'];
    function MenuCtrl($scope, $state) {
        var vm = this;

        activate();
        vm.logout = logout;

        function activate() {
            $scope.$on('login', function (event, member) {
                vm.member = member;
            });
            $scope.$on('menu-title-changed', function (event, title) {
                vm.title = title;
            });
        }

        function logout() {
            Trello.deauthorize();
            vm.member = {};
            $state.go("login");
        }
    }
})();
