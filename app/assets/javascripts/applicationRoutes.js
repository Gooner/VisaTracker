/*global angular, console */
angular.module("visaTracker")
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        'use strict';

        var dashboardPath = [{
            name: "Dashboard",
            url: "#/dashboard/"
        }];

        function loadDashboardFiles($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'visaTracker',
                insertBefore: '#ng_load_plugins_before',
                files: [
                    '../assets/global/plugins/morris/morris.css',
                    '../assets/global/plugins/jqvmap/jqvmap/jqvmap.css',
                    '../assets/global/plugins/morris/morris.min.js',
                    '../assets/global/plugins/morris/raphael-min.js',
                    '../assets/global/plugins/jqvmap/jqvmap/jquery.vmap.js',
                    '../assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js'
                ]
            });
        }

        function loadDataImportFiles($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'visaTracker',
                insertBefore: '#ng_load_plugins_before',
                files: [
                    '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                    '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                    '../assets/global/plugins/jquery.form.min.js'
                ]
            });
        }

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $routeProvider.when('/dashboard/:loadOption?', {
            url: "/dashboard",
            templateUrl: "templates/dashboard.html",
            data: {
                pageTitle: 'Visa Dashboard',
                path: dashboardPath
            },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', loadDashboardFiles]
            }
        }).when('/select-date-range', {
            url: "/select-date-range",
            templateUrl: "templates/custom-date-range.html",
            data: {
                pageTitle: 'Visa Dashboard - Select Date',
                path: angular.copy(dashboardPath).concat({
                    name: "Select Date"
                })
            },
            controller: "CustomDateRangeController"
        }).when('/search', {
            url: "/search",
            templateUrl: "templates/search-box.html",
            data: { pageTitle: 'Search' },
            controller: "SearchController"
        }).when('/data-import/:importType?', {
            url: "/data-import",
            templateUrl: function (arg) {
                return "/DataImport/" + arg.importType;
            },
            data: { 
                pageTitle: 'Data Import',
                path: [{
                    name: "Data Import",
                    url: "#/data-import"
                }]
            },
            controller: "DataImportController",
            resolve: {
                deps: ['$ocLazyLoad', loadDataImportFiles]
            }
        }).otherwise({
            redirectTo: '/dashboard/latest'
        });
    }]);