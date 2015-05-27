(function() {
	"use strict";

	angular.module('application')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', '$stateParams', '$state', '$controller', '$rootScope', 'TrelloService'];
	function HomeCtrl($scope, $stateParams, $state, $controller, $rootScope, TrelloService) {
		angular.extend(this, $controller('DefaultController', {
			$scope: $scope,
			$stateParams: $stateParams,
			$state: $state
		}));
		activate();

		$scope.connectToTrello = connectToTrello;
		function activate() {
			TrelloService.getLabels()
				.then(function(labels) {
					console.log("labels", labels);
				});
		}

		function connectToTrello() {
		}
	}
})();
