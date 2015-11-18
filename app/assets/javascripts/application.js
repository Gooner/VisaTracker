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
//= require application
//= require applicationRoutes
//= require_tree .
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
