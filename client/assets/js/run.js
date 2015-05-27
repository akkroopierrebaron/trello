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
			FastClick.attach(document.body);
			Trello.authorize({
				interactive: false,
				success: onAuthorize
			});

			function onAuthorize() {
				Trello.members.get("me", function(member) {
					$rootScope.$apply(function() {
						$rootScope.member = member;
					});
				});
			}
		}

		function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
			if ($state.current.name !== "login" && !Trello.authorized()) {
				$state.go("login");
			}
		}
	}
})();
