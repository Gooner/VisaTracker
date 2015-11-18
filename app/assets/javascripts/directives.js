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