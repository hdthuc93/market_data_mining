/**
 * Regulation Controller
 */

angular.module('martketManagement')
    .controller('RegulationCtrl', ['$scope','$http','helper', RuleCtrl]);

function RuleCtrl($scope,$http,helper) {
    var minRowGrade = 5, minRowCourse = 9, rowHeight = 30;
    $scope.futureSchoolyearID = "";

    function init(){
        $scope.reg = {
            grade10: [],
            grade11: [],
            grade12: [],
            course:[],
            minAge: 15,
            maxAge: 20,
            minScore: 5,
            schoolYearID: "",
            regulationID: ""
        }

        initSlider($scope.reg.minAge,$scope.reg.maxAge);

        $scope.selectedRowGrade10 = null;
        $scope.selectedRowGrade11 = null;
        $scope.selectedRowGrade12 = null;
    }
    init();

    function initSlider(minAge, maxAge){
        $scope.slider = {
            minValue: minAge,
            maxValue: maxAge,
            options: {
                floor: 4,
                ceil: 50,
                translate: function(value, sliderId, label) {
                    switch (label) {
                        case 'model':
                        $scope.reg.minAge = value;
                        return '<b>Tuổi MIN:</b>'+ value;
                        case 'high':
                        $scope.reg.maxAge = value;
                        return '<b>Tuổi MAX:</b>' + value;
                        default:
                        return  value
                    }
                }
            }
        };
    }

    function getFutureSchoolYear(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year/future',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.futureSchoolYear = response.data.datas
            }else{
            }
        });
   }
    getFutureSchoolYear();

    $scope.getRegulation = function(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            type: 'application/json',
            url: '/api/regulation',
            params: {schoolYearID: $scope.futureSchoolyearID}
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.reg = response.data.data;
                $scope.grade10.data = $scope.reg.grade10;
                $scope.grade11.data = $scope.reg.grade11;
                $scope.grade12.data = $scope.reg.grade12;
                $scope.course.data = $scope.reg.course;
                initSlider($scope.reg.minAge,$scope.reg.maxAge);
            }else{
            }
        });
    }
    function getGradeData(d) {
        var data = [];
        if(d.length){
            for(var i in d){
                if(d[i].className&&d[i].maxQty){
                    data.push(d[i])
                }
            }
        }
        return data;
    }

    function getCourseData(d) {
        var data = [];
        if(d.length){
            for(var i in d){
                if(d[i].courseName){
                    data.push(d[i])
                }
            }
        }
        return data;
    }

    $scope.save = function(){
        if ($scope.regulationForm.$invalid) {
            helper.popup.info({title: "Lỗi",message: "Vui lòng điền thông tin đầy đủ và chính xác.",close: function () { return;}})
            return;
        }
        var grade10Data = getGradeData($scope.reg.grade10);
        var grade11Data = getGradeData($scope.reg.grade11);
        var grade12Data = getGradeData($scope.reg.grade12);
        var courseData = getCourseData($scope.reg.course);
        var dataSave = {
            grade10: grade10Data,
            grade11: grade11Data,
            grade12: grade12Data,
            course: courseData,
            minAge: $scope.reg.minAge,
            maxAge: $scope.reg.maxAge,
            minScore: $scope.reg.minScore,
            schoolYearID: $scope.reg.schoolYearID,
            regulationID: $scope.reg.regulationID,
            regulationCode: $scope.reg.regulationCode
        }

        $http.post('/api/regulation/update', dataSave, {}).then(function successCallBack(res) {
            helper.popup.info({
                title: "Thông báo",
                message:res.data.success? "Cập nhật thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close: function () {
                    return;
                }
            });
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.grade10 = {
        data: $scope.reg.grade10,
        minRowsToShow: minRowGrade,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'className', displayName: 'Tên Lớp', type: 'text', minWidth: 100 },
            { field: 'maxQty', displayName: 'Sĩ Số Tối Đa', type: 'number', minWidth: 70, 
            editableCellTemplate:'<input type="number" min="0" max="500" ui-grid-editor ng-model="MODEL_COL_FIELD">'}
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowGrade10 = row.entity;
                } else {
                    $scope.selectedRowGrade10 = null;
                }
            });
        }
    };

    $scope.addRowGrade10 = function(data){
        var dataLength = $scope.grade10.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade10.data[dataLength-1];
            if (lastRecord.className.trim() === "" || !lastRecord.maxQty) {return;}
        }
        if (!data) { data = {};}
        $scope.reg.grade10.push(
            {className: data.className || "",maxQty: data.maxQty || ""}
        )
    }
    
    $scope.deleteRowGrade10 = function () {
        if ($scope.selectedRowGrade10) {
            for (var i in $scope.grade10.data) {
                if ($scope.grade10.data[i] === $scope.selectedRowGrade10) {
                    $scope.grade10.data.splice(i, 1);
                    $scope.selectedRowGrade10 = false;
                    break;
                }
            }
        }
    };

    $scope.grade11 = {
        data: $scope.reg.grade11,
        minRowsToShow: minRowGrade,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'className', displayName: 'Tên Lớp', type: 'text', minWidth: 100  },
            { field: 'maxQty', displayName: 'Sĩ Số Tối Đa', type: 'number', minWidth: 70,
        editableCellTemplate:'<input type="number" min="0" max="500" ui-grid-editor ng-model="MODEL_COL_FIELD">'  }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowGrade11 = row.entity;
                } else {
                    $scope.selectedRowGrade11 = null;
                }
            });
        }
    };

    $scope.addRowGrade11 = function(data){
        var dataLength = $scope.grade11.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade11.data[dataLength-1];
            if (lastRecord.className.trim() === "" || !lastRecord.maxQty) {return;}
        }
        if (!data) { data = {};}
        $scope.reg.grade11.push(
            {className: data.className || "",maxQty: data.maxQty || ""}
        )
    }
    
    $scope.deleteRowGrade11 = function () {
        if ($scope.selectedRowGrade11) {
            for (var i in $scope.grade11.data) {
                if ($scope.grade11.data[i] === $scope.selectedRowGrade11) {
                    $scope.grade11.data.splice(i, 1);
                    $scope.selectedRowGrade11 = false;
                    break;
                }
            }
        }
    };

    $scope.grade12 = {
        data: $scope.reg.grade12,
        minRowsToShow: minRowGrade,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'className', displayName: 'Tên Lớp', type: 'text', minWidth: 100  },
            { field: 'maxQty', displayName: 'Sĩ Số Tối Đa', type: 'number', minWidth: 70,
            editableCellTemplate:'<input type="number" min="0" max="500" ui-grid-editor ng-model="MODEL_COL_FIELD">'  }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowGrade12 = row.entity;
                } else {
                    $scope.selectedRowGrade12 = null;
                }
            });
        }
    };

    $scope.addRowGrade12 = function(data){
        var dataLength = $scope.grade12.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade12.data[dataLength-1];
            if (lastRecord.className.trim() === "" || !lastRecord.maxQty) {return;}
        }
        if (!data) { data = {};}
        $scope.reg.grade12.push(
            {className: data.className || "",maxQty: data.maxQty || ""}
        )
    }
    
    $scope.deleteRowGrade12 = function () {
        if ($scope.selectedRowGrade12) {
            for (var i in $scope.grade12.data) {
                if ($scope.grade12.data[i] === $scope.selectedRowGrade12) {
                    $scope.grade12.data.splice(i, 1);
                    $scope.selectedRowGrade12 = false;
                    break;
                }
            }
        }
    };

    $scope.course = {
        data: $scope.reg.course,
        minRowsToShow: minRowCourse,
        rowheight: rowHeight,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'courseName', displayName: 'Môn Học', type: 'text', minWidth: 130  }
        ],
        onRegisterApi: function (gridApi) {
             gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRowCourse = row.entity;
                } else {
                    $scope.selectedRowCourse = null;
                }
            });
        }
    };

    $scope.addRowCourse = function(data){
        var dataLength = $scope.course.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.course.data[dataLength-1];
            if (lastRecord.courseName.trim() === "" ) {return;}
        }
        if (!data) { data = {};}
        $scope.reg.course.unshift(
            {courseName: data.courseName || ""}
        )
    }
    
    $scope.deleteRowCourse = function () {
        if ($scope.selectedRowCourse) {
            for (var i in $scope.course.data) {
                if ($scope.course.data[i] === $scope.selectedRowCourse) {
                    $scope.course.data.splice(i, 1);
                    $scope.selectedRowCourse = false;
                    break;
                }
            }
        }
    };
    

}