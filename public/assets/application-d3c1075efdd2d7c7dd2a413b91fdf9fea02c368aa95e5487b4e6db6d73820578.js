// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//



/*global angular, console, $, Layout, App, QuickSidebar, Demo */


var visaTracker = angular.module("visaTracker", [
    "ngRoute",
    "ui.bootstrap",
    'ngAnimate',
    "oc.lazyLoad",
    "ngSanitize"]);

visaTracker.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    'use strict';
    $ocLazyLoadProvider.config({

    });
}]);

/* Setup global settings */
visaTracker.factory('settings', [
    '$rootScope',
    function ($rootScope) {
        'use strict';
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: '../assets',
            globalPath: '../assets/global',
            layoutPath: '../assets/layouts/layout2',
            counterup: {
                delay: 10,
                time: 500
            }
        };

        $rootScope.settings = settings;

        return settings;
    }]);

visaTracker.controller('AppController', [
    '$scope', '$rootScope',
    function ($scope, $rootScope) {
        'use strict';
        $scope.$on('$viewContentLoaded', function () {
            App.initComponents();
        });
    }]);

/* Setup Layout Part - Header */
visaTracker.controller('HeaderController', [
    '$scope',
    function ($scope) {
        'use strict';
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader(); // init header
        });
    }]);

/* Setup Layout Part - Sidebar */
visaTracker.controller('SidebarController', [
    '$scope',
    function ($scope) {
        'use strict';
        $scope.$on('$includeContentLoaded', function () {
            Layout.initSidebar(); // init sidebar
        });

        //        $scope.open = function (templateUrl, controller, size) {
        //            var modalInstance = $uibModal.open({
        //                animation: true,
        //                templateUrl: templateUrl,
        //                controller: controller,
        //                size: size,
        //                resolve: {
        //                    modalArgs: function () {
        //                        return $scope.modalArgs;
        //                    }
        //                }
        //            });
        //            modalInstance.result.then(function (selectedItem) {
        //                $scope.selected = selectedItem;
        //            }, function () {
        //                //$log.info('Modal dismissed at: ' + new Date());
        //            });
        //        };
    }]);

/* Setup Layout Part - Quick Sidebar */
visaTracker.controller('QuickSidebarController', [
    '$scope',
    function ($scope) {
        'use strict';
        $scope.$on('$includeContentLoaded', function () {
            setTimeout(function () {
                QuickSidebar.init(); // init quick sidebar        
            }, 2000);
        });
    }]);

/* Setup Layout Part - Theme Panel */
visaTracker.controller('ThemePanelController', [
    '$scope',
    function ($scope) {
        'use strict';
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }]);

/* Setup Layout Part - Footer */
visaTracker.controller('FooterController', [
    '$scope',
    function ($scope) {
        'use strict';
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });
    }]);

/* Setup Layout Part - New Page Action */
visaTracker.controller('NewPageActionController', [
    '$scope',
    function ($scope) {
        'use strict';

    }]);

/* Setup Layout Part - Page Breadcrumb */
visaTracker.controller('PageBreadcrumbController', [
    '$scope', '$route',
    function ($scope, $route) {
        'use strict';
        $scope.path = $route.current.data.path || [{
            name: "Dashboard"
        }];
    }]);

/* Setup Layout Part - Page Breadcrumb */
visaTracker.controller('ModalController', [
    '$scope',
    function ($scope, $uibModalInstance, modalArgs) {
        'use strict';
        $scope.ok = function () {
            $uibModalInstance.close($scope.returnValue);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

/* Init global settings and run the app */
visaTracker.run([
    "$rootScope", "settings", "$route",
    function ($rootScope, settings, $route) {
        'use strict';
        $rootScope.$route = $route; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
    }]);
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
        }).otherwise({
            redirectTo: '/dashboard/latest'
        });
    }]);
/*global angular, console, Morris, jQuery, $ */

var chartColours = [
    '#3598DC', // blue
    '#1BC98E', // 27, 201, 216
    '#E64759', // 230, 71, 89
    '#C49F47', // 28, 168, 221
    '#6B15A1', // 107, 21, 161
    '#D91E18', // red thunderbird
    '#4D5360', // 77, 83, 96
    '#C8D046', // soft yellow
    '#337AB7'  // 51, 122, 183 
];

angular.module("visaTracker").controller("ApprovalByCaseSubmittedController", function ($scope) {
    'use strict';

    $scope.approvalsData = [
        { y: '2006', a: 100, b: 90 },
        { y: '2007', a: 75,  b: 65 },
        { y: '2008', a: 50,  b: 40 },
        { y: '2009', a: 75,  b: 65 },
        { y: '2010', a: 50,  b: 40 },
        { y: '2011', a: 75,  b: 65 },
        { y: '2012', a: 100, b: 90 }
    ];

    var chart = new Morris.Area({
        element: 'approvals_statistics',
        lineColors: chartColours,
        data: $scope.approvalsData,
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B']
    });
});

angular.module("visaTracker").controller("ApprovalByEmployerController", function ($scope) {
    'use strict';

    $scope.employerData = [
        {label: "Cognizant", value: 12},
        {label: "Google", value: 30},
        {label: "Amazon", value: 20}
    ];

    Morris.Donut({
        element: 'employer_activities',
        colors: chartColours,
        data: $scope.employerData
    });
});

angular.module("visaTracker").controller("ApprovalByStateController", function ($scope) {
    'use strict';

    $scope.stateData = [
        {label: "California", value: 12},
        {label: "Virginia", value: 30},
        {label: "Texas", value: 20}
    ];
    //
    //    Morris.Donut({
    //        element: 'state_statistics',
    //        colors: chartColours,
    //        data: $scope.stateData
    //    });

    jQuery('#state_statistics').vectorMap({
        map: 'usa_en',
        backgroundColor: '#a5bfdd',
        borderColor: '#818181',
        borderOpacity: 0.25,
        borderWidth: 1,
        color: '#f4f3f0',
        enableZoom: false,
        hoverColor: '#c9dfaf',
        hoverOpacity: null,
        normalizeFunction: 'linear',
        scaleColors: ['#b6d6ff', '#005ace'],
        selectedColor: '#c9dfaf',
        selectedRegions: [],
        showTooltip: true
    });
});

angular.module("visaTracker").controller("ApprovalByCountryController", function ($scope) {
    'use strict';

    $scope.countryData = [
        {label: "India", value: 12},
        {label: "China", value: 30},
        {label: "Mexico", value: 20}
    ];

    Morris.Donut({
        element: 'country_activities',
        colors: chartColours,
        data: $scope.countryData
    });
});

angular.module("visaTracker").controller("DashboardController", [
    '$scope', '$routeParams',
    function ($scope, $routeParams) {
        'use strict';
        $scope.loadOption = $routeParams.loadOption || "latest";

        switch ($scope.loadOption.toLowerCase()) {
            case "week":
                $scope.period = "This Week";
                break;
            case "month":
                $scope.period = "This Month";
                break;
            default:
                $scope.period = "Yesterday";
                break;
        }
    }]);

angular.module("visaTracker").controller("SearchController", [
    '$scope',
    function ($scope) {
        'use strict';
    }]);

angular.module("visaTracker").controller("CustomDateRangeController", [
    '$scope',
    function ($scope) {
        'use strict';
    }]);
/*global angular, console, $, Layout, App */

angular.module("visaTracker")
    .directive('ngSpinnerBar', ['$rootScope', function ($rootScope) {
        'use strict';
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$routeChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$routeChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$routeNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$routeChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }])
    .directive('counterup', ['settings', '$filter', '$timeout', function (settings, $filter, $timeout) {
        'use strict';
        var divisions = settings.counterup.time / settings.counterup.delay,
            counterupFunc = function (scope, element) {
                var num = 0;
                if (angular.isNumber(scope.value)) {
                    num = scope.value;
                } else if (angular.isString(scope.value)) {
                    num = scope.value.replace(/,/g, '');
                }

                if (num === 0) {
                    element.text(scope.value);
                    return;
                }

                var isInt = /^[0-9]+$/.test(num);
                var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
                var currentValue = 0;
                var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;

                if (isInt) {
                    currentValue = parseInt(num / divisions * scope.count, 10);
                } else if (isFloat) {
                    currentValue = parseFloat(num / divisions * scope.count).toFixed(decimalPlaces);
                }

                if (scope.value < currentValue) {
                    element.text(scope.format ? $filter('number')(scope.value, decimalPlaces) : scope.value);
                } else {
                    element.text(scope.format ? $filter('number')(currentValue, decimalPlaces) : currentValue);
                    scope.count += 1;

                    $timeout(function () {
                        counterupFunc(scope, element);
                    }, settings.counterup.delay);
                }
            };

        function onValueChanged(newValue, oldValue, scope) {
            scope.count = 0;
            $timeout(function () {
                counterupFunc(scope, scope.element);
            }, settings.counterup.delay)
        }

        return {
            restrict: 'CA',
            scope: {
                value: '=?',
                format: '=?'                
            },
            link: function (scope, element, attrs) {
                scope.element = element;
                scope.$watch('value', onValueChanged, true);
            }
        };
    }]);
