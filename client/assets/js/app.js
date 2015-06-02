(function () {
    'use strict';

    angular.module('application', [
        'ui.router',
        'ngAnimate',
        'ngSanitize',

        //foundation
        'foundation',
        'foundation.dynamicRouting',
        'foundation.dynamicRouting.animations',

        'config',
        'ui.select',
        'btford.markdown'
    ])
        .config(config);

    config.$inject = ['$urlRouterProvider', '$locationProvider'];

    function config($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled     : false,
            requireBase : false
        });

        $locationProvider.hashPrefix('!');

        Trello.authorize({
            type        : "popup",
            name        : "Trello for Akkroo",
            persist     : true,
            interactive : true,
            scope       : {write : true, read : true}
        });
    }
})();
