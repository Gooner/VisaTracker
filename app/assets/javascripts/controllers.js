/*global angular, console, Morris, jQuery, $, toastr */
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

angular.module("visaTracker").controller("DataImportController", [
    '$scope', '$routeParams',
    function ($scope, $routeParams) {
        'use strict';

        $scope.progress = 0;
        $scope.uploaded = false;
        $("#fileupload").ajaxForm();

        var importType = $routeParams.importType ? $routeParams.importType.toLowerCase() : "";
        switch ($routeParams.importType) {
            case "state":
                $scope.subTitle = "States and Territories";
                $scope.fileInputLabel = "States & Territories Data File";
                break;
            default:
                $scope.subTitle = "Labor Data";
                $scope.fileInputLabel = "Labor Data File";
                break;
        }

        $scope.onFileSelected = function (file) {
            $scope.selectedFileName = file.name;
        };

        $scope.uploadFile = function ($event) {

            var $form = $("#fileupload");     
            $scope.progress = 0;

            $form.ajaxSubmit({
                type: 'POST',
                dataType: 'json',
                uploadProgress: function(evt, pos, tot, percentComplete) { 
                    $scope.uploaded = true;
                    $scope.progress = percentComplete;
                },
                error: function(evt, statusText, response, form) { 
                    toastr.error(statusText, "Failed to upload " + $scope.fileInputLabel);
                },
                success: function(response, status, xhr, form) { 
                    toastr.success("Uploaded", "Uploaded " + $scope.fileInputLabel);
                },
            });
            
            $event.preventDefault();
            return false; 
        };
    }]);
