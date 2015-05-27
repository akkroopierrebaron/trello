(function() {

	angular.module('application')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$scope', '$stateParams', '$state', '$controller'];
	function LoginController($scope, $stateParams, $state, $controller) {
		angular.extend(this, $controller('DefaultController', {
			$scope: $scope,
			$stateParams: $stateParams,
			$state: $state
		}));

		activate();

		function activate() {

		}
	}
})();
