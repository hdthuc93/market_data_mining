'use strict';

/**
 * Route configuration for the martketManagement module.
 */
angular.module('martketManagement').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('studentlist', {
                url: '/studentlist',
                templateUrl: 'templates/student_list.html'
            })
            .state('class', {
                url: '/class',
                templateUrl: 'templates/class.html'
            })
            .state('report', {
                url: '/report',
                templateUrl: 'templates/report.html'
            })
            .state('regulation', {
                url: '/regulation',
                templateUrl: 'templates/regulation.html'
            })
            .state('schoolyear', {
                url: '/schoolyear',
                templateUrl: 'templates/school_year.html'
            }).state('login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            });
    }
]);