'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/martket.html'
            })
            .state('items', {
                url: '/items',
                templateUrl: 'templates/itemlist.html'
            })
            .state('statistic', {
                url: '/statistic',
                templateUrl: 'templates/statistic.html'
            })
    }
]);