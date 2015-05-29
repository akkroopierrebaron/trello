(function() {
	"use strict";

	angular.module('application')
		.service('ApiBoards', ApiBoards);

	ApiBoards.$inject = ['Api'];
	function ApiBoards(Api) {
		var service = {
			getAllBoards: getAllBoards,
			getBoard: getBoard
		};
		return service;

		
		function getAllBoards() {
			return Api.getAllElements("members/me/boards");
		}

		function getBoard(boardName) {
			return getAllBoards()
				.then(function(boards) {
					return Api.getSingleElement(boards, boardName, 'name');
				});
		}
	}
})();
