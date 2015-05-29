(function() {
	"use strict";

	angular.module('application')
		.service('ApiLabels', ApiLabels);

	ApiLabels.$inject = ['Api', 'ApiBoards', 'ENV'];
	function ApiLabels(Api, ApiBoards, ENV) {
		var service = {
			getAllLabels: getAllLabels,
			getMultipleLabels: getMultipleLabels,
			getLabel: getLabel
		};
		return service;


		function getAllLabels() {
			return ApiBoards.getBoard(ENV.board)
				.then(function(board) {
					return Api.getAllElements("boards/" + board.id + "/labels");
				});
		}

		function getMultipleLabels(labelNames) {
			return getAllLabels()
				.then(function(labels) {
					return Api.getMultipleElements(labels, labelNames, 'name');
				});
		}

		function getLabel(labelName) {
			return getAllLabels()
				.then(function(labels) {
					return Api.getSingleElement(labels, labelName, 'name');
				});
		}
	}
})();
