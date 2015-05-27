(function() {
	"use strict";

	angular.module('application')
		.service('TrelloService', TrelloService);

	TrelloService.$inject = ['$q'];
	function TrelloService($q) {

		var service = {
			getBoards: getBoards,
			getDevBoard: getDevBoard,
			getLabels: getLabels,
			getLists: getLists,
			getMembers: getMembers
		};
		return service;
		
		function getBoards() {
			var deferred = $q.defer();

			Trello.get("members/me/boards", {}, successCallback, errorCallback);

			return deferred.promise;


			function successCallback(result) {
				deferred.resolve(result);
			}

			function errorCallback(error) {
				deferred.reject(error);
			}
		}

		function getDevBoard() {
			var deferred = $q.defer();

			getBoards()
				.then(successCallback)
				.catch(errorCallback);

			return deferred.promise;


			function successCallback(boards) {
				var result = boards.find(function(board) {
					return board.name === "Development";
				});
				deferred.resolve(result);
			}

			function errorCallback(error) {
				deferred.reject(error);
			}
		}

		function getLabels() {
			var deferred = $q.defer();

			getDevBoard()
				.then(function(board) {
					Trello.get("boards/" + board.id + "/labels", {}, successCallback, errorCallback);
				})
				.catch(errorCallback);


			return deferred.promise;


			function successCallback(result) {
				deferred.resolve(result);
			}

			function errorCallback(error) {
				deferred.reject(error);
			}
		}

		function getLists() {
			var deferred = $q.defer();

			getDevBoard()
				.then(function(board) {
					Trello.get("boards/" + board.id + "/lists", {}, successCallback, errorCallback);
				})
				.catch(errorCallback);


			return deferred.promise;


			function successCallback(result) {
				deferred.resolve(result);
			}

			function errorCallback(error) {
				deferred.reject(error);
			}
		}

		function getMembers() {
			var deferred = $q.defer();

			getDevBoard()
				.then(function(board) {
					Trello.get("boards/" + board.id + "/members", {}, successCallback, errorCallback);
				})
				.catch(errorCallback);


			return deferred.promise;


			function successCallback(result) {
				deferred.resolve(result);
			}

			function errorCallback(error) {
				deferred.reject(error);
			}
		}
	}
})();
