(function() {
	"use strict";

	angular.module('application')
		.controller('CardCtrl', CardCtrl);

	CardCtrl.$inject = ['$scope', '$stateParams', '$state', '$controller', '$rootScope', 'ApiBoards', 'ApiCards', 'ApiLabels', 'ApiLists', 'ENV'];
	function CardCtrl($scope, $stateParams, $state, $controller, $rootScope, ApiBoards, ApiCards, ApiLabels, ApiLists, ENV) {
		angular.extend(this, $controller('DefaultController', {
			$scope: $scope,
			$stateParams: $stateParams,
			$state: $state
		}));

		$scope.form = {
			labels: [],
			members: []
		};

		$scope.card = {
			name: "",
			page: "",
			context: "",
			actions: "",
			result: "",
			expected: "",
			idLabels: []
		};

		activate();
		$scope.submitCard = submitCard;

		function activate() {

			ApiLabels
				.getAllLabels()
				.then(function(labels) {
					$scope.form.labels = labels;

					var preselectedLabels = [ENV.labels.bug, ENV.labels.reproduced];

					$scope.card.idLabels = labels
						.filter(function(label) {
							return preselectedLabels.find(label.name) !== undefined;
						})
						.map(function(label) { return label.id; });
				});
			ApiLists
				.getList(ENV.lists.bugs)
				.then(function(list) {
					console.log(list);
					$scope.card.idList = list.id;
				});
		}

		function submitCard() {
			var args = {
				name: $scope.card.name,
				desc: createDescription($scope.card),
				//idMembers: $scope.card.userIds,
				idLabels: $scope.card.idLabels,
				idList: $scope.card.idList,
				due: null,
				urlSource: null
			};
			console.log(args);

			ApiCards.postCard(args).then(function(card) {
				console.log("card created", card);
			});
		}

		function createDescription(obj) {
			var string = "" +
				"# Page \r\n" + obj.page + " \r\n \r\n" +
				"# Context \r\n" + obj.context + " \r\n \r\n" +
				"# Context \r\n" + obj.context + " \r\n \r\n" +
				"# Actions \r\n" + obj.result + " \r\n \r\n" +
				"# Expected \r\n" + obj.expected;

			return string;
		}
	}
})();
