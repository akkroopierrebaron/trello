(function() {
	"use strict";

	angular.module('application')
		.controller('CardFeatureCtrl', CardFeatureCtrl);

	CardFeatureCtrl.$inject = [
		'$scope', '$stateParams', '$state', '$controller', 'ApiCards', 'ApiLabels', 'ApiMembers', 'ApiLists', 'ENV'
	];
	function CardFeatureCtrl($scope, $stateParams, $state, $controller, ApiCards, ApiLabels, ApiMembers, ApiLists, ENV) {
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
			who: "",
			what: "",
			why: "",
			information: "",
			idLabels: [],
			idMembers: []
		};

		activate();
		$scope.submitCard = submitCard;

		function activate() {
			ApiLabels
				.getAllLabels()
				.then(function(labels) {
					$scope.form.labels = labels;

					var preselectedLabels = [ENV.labels.feature];

					$scope.card.idLabels = labels
						.filter(function(label) {
							return preselectedLabels.find(label.name) !== undefined;
						})
						.map(function(label) { return label.id; });
				});

			ApiMembers
				.getAllMembers()
				.then(function(members) {
					$scope.form.members = members;
				});

			ApiLists
				.getList(ENV.lists.bugs)
				.then(function(list) {
					$scope.card.idList = list.id;
				});
		}

		function submitCard() {
			var args = {
				name: $scope.card.name,
				desc: createDescription($scope.card),
				idMembers: $scope.card.idMembers,
				idLabels: $scope.card.idLabels,
				idList: $scope.card.idList,
				due: null,
				urlSource: null
			};

			ApiCards
				.postCard(args)
				.then(function(card) {
					console.log("card created", card);
				});
		}

		function createDescription(obj) {
			var string = "" +
				createUserStory(obj.who, obj.what, obj.why) + " \r\n \r\n" +
				"# Information \r\n" + obj.information;

			return string;
		}

		function createUserStory(who, what, why) {
			var string = "" +
				"# User story \r\n" +
				"As a " + who + ", " +
				"I would like to be able " + what +
				"so that" + why;

			return string;
		}
	}
})();
