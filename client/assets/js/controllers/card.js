(function() {
	"use strict";

	angular.module('application')
		.controller('CardCtrl', CardCtrl);

	CardCtrl.$inject = ['$scope', '$stateParams', '$state', '$controller', '$rootScope', 'TrelloService'];
	function CardCtrl($scope, $stateParams, $state, $controller, $rootScope, TrelloService) {
		angular.extend(this, $controller('DefaultController', {
			$scope: $scope,
			$stateParams: $stateParams,
			$state: $state
		}));

		$scope.card = {
			name: "",
			page: "",
			context: "",
			actions: "",
			result: "",
			expected: "",
			idList: "",
			idLabels: []
		};

		activate();
		$scope.submitCard = submitCard;

		function activate() {
			TrelloService.getLists().then(function(lists) {
				$scope.card.idList = lists.find(function(list) {
					return list.name === "Known issues";
				}).id;
			});

			TrelloService.getMembers().then(function(members) {
				console.log("members", members);
			});
		}

		function submitCard() {
			var args = {
				name: $scope.card.name,
				desc: createDescription($scope.card),
				//idMembers: $scope.card.userIds,
				//labelIds: $scope.card.labelIds,
				idList: $scope.card.idList
			};

			console.log("args", args);
			TrelloService.getDevBoard()
				.then(function(board) {
					Trello.post("cards", args, function(aa) {
						console.log("card created", aa);
					});
				});

		}

		function createDescription(obj) {
			var string = "" +
				"# Page /n" + obj.page + " /n" +
				"# Context /n" + obj.context + " /n" +
				"# Context /n" + obj.context + " /n" +
				"# Actions /n" + obj.result + " /n" +
				"# Expected /n" + obj.expected;

			return string;
		}
	}
})();
