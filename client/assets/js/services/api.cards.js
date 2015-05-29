(function() {
	"use strict";

	angular.module('application')
		.service('ApiCards', ApiCards);

	ApiCards.$inject = ['$q'];
	function ApiCards($q) {

		var service = {
			postCard: postCard
		};
		return service;

		function postCard(args) {
			var deferred = $q.defer();

			Trello.post("/cards", args, successCallback, errorCallback);

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
