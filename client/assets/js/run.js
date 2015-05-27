(function() {
	'use strict';

	angular
		.module('application')
		.run(run);

	run.$inject = ['$rootScope', '$state'];

	function run($rootScope, $state) {
		activate();
		$rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
		function activate() {
			console.log("run");

			FastClick.attach(document.body);
		}

		function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
			if ($state.current.name !== "login" && !Trello.authorized()) {
				$state.go("login");
			}
		}
	}
})();
