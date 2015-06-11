(function(){

	"use strict";

	angular.module('application')
		.directive('gravatar', gravatar);

	gravatar.$inject = [];
	function gravatar() {
		return {
			restrict : 'AE',
			replace  : true,
			scope    : {
				name      : '@',
				height    : '@',
				width     : '@',
				hash : '@'
			},
			template : '<img alt="{{ name }}" height="{{ height }}" width="{{ width }}" src="https://secure.gravatar.com/avatar/{{ hash }}.jpg?s={{ width }}">',
			link     : link
		};

		function link(scope, el, attr) {
		}
	}
})()