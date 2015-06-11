(function () {
    "use strict";

    angular.module('application')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$stateParams', '$state', '$controller', '$rootScope'];
    function HomeCtrl($scope, $stateParams, $state, $controller, $rootScope) {
        angular.extend(this, $controller('DefaultController', {
            $scope       : $scope,
            $stateParams : $stateParams,
            $state       : $state
        }));
        activate();

        $rootScope.title = "Home";

        function activate() {
        }
    }
})();
