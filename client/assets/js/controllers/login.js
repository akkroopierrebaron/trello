(function() {
	"use strict";

	angular.module('application')
		.controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = ['$scope', '$stateParams', '$state', '$controller', '$rootScope'];
	function LoginCtrl($scope, $stateParams, $state, $controller, $rootScope) {
		angular.extend(this, $controller('DefaultController', {
			$scope: $scope,
			$stateParams: $stateParams,
			$state: $state
		}));

		activate();

		$scope.connectToTrello = connectToTrello;
		function activate() {
		}

		function connectToTrello() {
			Trello.authorize({
				type: "popup",
				name: "Trello for Akkroo",
				persist: false,
				interactive: true,
				scope: {write: true, read: true},
				success: onAuthorize
			});

			function onAuthorize() {
				Trello.members.get("me", function(member) {
					$scope.$apply(function() {
						$rootScope.$broadcast('login', member);
						$state.go("home");
					});
				});
			}
		}
	}
})();
