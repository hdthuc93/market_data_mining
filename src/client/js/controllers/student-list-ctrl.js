/**
 * Student List Controller
 * Implement: Phong Nguyen
 */
angular.module('martketManagement').controller('StudentListCtrl', ['$scope', 'helper', '$http', '$rootScope', StudentListCtrl]);

function StudentListCtrl($scope, helper, $http, $rootScope) {
    $scope.showHandleArea = false; //Hien vung xu ly Them/Sua
    $scope.studentData = {};
    $scope.action = "";
    $scope.studentListStatus = "Không có dữ liệu"
    $scope.studentCodePattern = /^[0-9]{0,8}$/;
    function initOptions() {
        $scope.options = {
            studentCode: "",
            gender: "",
            name: "",
            email: "",
            address: "",
            birthdayFrom: "",
            birthdayTo: "",
            yearAdmission: ""
        }
    }
    initOptions();
    function getSchoolYears(){
        $http({
            method: 'GET',
            url: '/api/school_year',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.schoolYear = response.data.data;
            }else{
            }
        });
    }
    getSchoolYears();

    $scope.reset = function () {
        initOptions();
        $scope.getStudentList();
        $scope.studentFormSearch.$setPristine();
        $scope.studentFormSearch.$setUntouched();
    }

    $scope.studentList = {
        minRowsToShow: 50,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', minWidth: 50, maxWidth: 70 },
            { field: 'className', displayName: 'Lớp', minWidth: 50, maxWidth: 70 },
            { field: 'studentCode', displayName: 'Mã Học Sinh', minWidth: 100, maxWidth: 120 },
            { field: 'name', displayName: 'Họ Tên', minWidth: 250 },
            { field: 'gender', displayName: 'Giới', cellFilter: 'GenderToText', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 110, maxWidth: 120 },
            { field: 'address', displayName: 'Địa Chỉ', minWidth: 350 },
            { field: 'email', displayName: 'Email', minWidth: 220 }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                $scope.showHandleArea = false;
                $scope.action = "";
                if (row.isSelected) {
                    $scope.selectedRow = row.entity;
                } else {
                    $scope.selectedRow = null;
                }
            });
        }
    };


    $scope.getStudentList = function () {
        $scope.studentListStatus = "Đang tải...";
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/student',
            params: $scope.options
        }).then(function successCallback(response) {
            if (response.data.success) {
                $scope.studentList.data = response.data.datas;
                $scope.studentList.data.forEach(function (e, i) {
                    $scope.studentList.data[i].no = i + 1;
                });
            } else {
                $scope.studentList.data = [];
                $scope.studentListStatus = "Không có dữ liệu";
            }

        }, function errorCallback(response) {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }
    //$scope.getStudentList();

    $scope.viewStudent = function () {
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: $scope.selectedRow,
            action: "view"
        };
        helper.scrollTo("handle-student-area");
    }

    $scope.addStudent = function () {
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: {},
            action: "create"
        };
        helper.scrollTo("handle-student-area");
    }
    $scope.editStudent = function () {
        $scope.showHandleArea = true;
        $scope.studentData = {
            data: $scope.selectedRow,
            action: "edit"
        };
        helper.scrollTo("handle-student-area");
    }
    $scope.removeStudent = function () {
        $scope.showHandleArea = false;
        $scope.action = "";
        helper.popup.confirm({
            title: "Xoá học sinh",
            message: "Bạn có thưc sự muốn xoá học sinh này?",
            ok: function () {
                $http.delete('/api/student', { params: { studentID: $scope.selectedRow.studentID } }).then(function successCallBack(res) {
                    helper.popup.info({
                        title: "Thông báo",
                        message: res.data.success ? "Xoá học sinh thành công." : "Xoá thất bại. Vui lòng thử lại",
                        close: function () {
                            return;
                        }
                    });
                    $scope.reset();
                }, function errorCallback() {
                    helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
                });
            },
            cancel: function () {
                return;
            }
        })
    }

    $scope.$on('reset-student-list', function (event, mass) {
        $scope.reset();
    });
    $( function() {
        var dateFormat = "dd-mm-yy",
        from = $( "#from" )
            .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            dateFormat: dateFormat,
            showOn: "button", buttonImage: "img/dp-icon.png", buttonImageOnly: true
            })
            .on( "change", function() {
            to.datepicker( "option",{minDate: getDate( this )});
            }),
        to = $( "#to" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,            
            numberOfMonths: 1,
            dateFormat: dateFormat,
            showOn: "button", buttonImage: "img/dp-icon.png", buttonImageOnly: true
        })
        .on( "change", function() {
            from.datepicker( "option",{maxDate: getDate( this )});
        });
    
        function getDate( element ) {
        var date;
        try {
            date = $.datepicker.parseDate( dateFormat, element.value );
            //element.datepicker({ dateFormat: 'dd-mm-yy'}); 
        } catch( error ) {
            date = null;
        }
        return date;
        }
    } );
}