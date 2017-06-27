/**
 * Class Controller
 * Implement: Phong Nguyen
 */

angular.module('martketManagement')
    .controller('ClassCtrl', ['$scope','$uibModal','$http','helper','$rootScope', ClassCtrl]);

function ClassCtrl($scope,$uibModal,$http,helper,$rootScope) {
    $scope.grade = null;
    $scope.class = null;
    $scope.grades = [];
    $scope.classes = [];
    $scope.showHandleArea = false;

    $scope.studentList = {
        enableSorting: true,
        enableRowSelection: true,
        multiSelect:true,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', minWidth: 50, maxWidth: 70 },
            { field: 'studentCode', displayName: 'Mã học sinh', minWidth: 110, maxWidth: 140  },
            { field: 'name', displayName: 'Họ Tên', minWidth: 250 },
            { field: 'gender', displayName: 'Giới', cellFilter: 'GenderToText', minWidth: 50, maxWidth: 70 },
            { field: 'birthday', displayName: 'Ngày Sinh', minWidth: 110, maxWidth: 120},
            { field: 'address', displayName: 'Địa chỉ', minWidth: 350},
            { field: 'average1', displayName: 'TB HKI', minWidth: 90,maxWidth: 150},
            { field: 'average2', displayName: 'TB HKII', minWidth: 90, maxWidth: 150},
            { field: 'average', displayName: 'TB Cả Năm', minWidth: 90, maxWidth: 150}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var rowsSelected = gridApi.selection.getSelectedRows();
                $scope.selectedStudents = rowsSelected.length?rowsSelected:null;
                $scope.showHandleArea = false
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (gridData) {
                var rowsSelected = gridApi.selection.getSelectedRows();
                $scope.selectedStudents = rowsSelected.length?rowsSelected:null;
                $scope.showHandleArea = false
            });
        }
    };

    function getGrades(){
         $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/grade',
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.grades = response.data.data;
                $scope.grade = null;
                $scope.class = null;
                $scope.studentList.data = [];
                $scope.selectedStudents = null;
                $scope.showHandleArea = false
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }
    getGrades();
    
    $scope.getClasses = function(){
        //console.log("token=====",$rootScope.masterToken);
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/class',
            params:{gradeID: $scope.grade}
        }).then(function successCallback(response) {
            if(response.data.success){
                $scope.classes = response.data.datas;
                $scope.class = null;
                $scope.studentList.data = [];
                $scope.showHandleArea = false
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }
    
    $scope.getStudentInClass = function(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/student_class',
            params:{classID: angular.fromJson($scope.class).classID}
        }).then(function successCallback(response) {
            if(response.data.success&&response.data.datas){
                if(!response.data.datas.length){
                    helper.popup.info({title: "Thông báo",message: "Lớp học này hiện chưa có học sinh. Bấm nút \"Thêm học sinh\" để lập danh sách học sinh.",close: function () {$scope.openStudentList(); return;}})

                }

                $scope.studentList.minRowsToShow = response.data.datas.length;
                $scope.studentList.data = response.data.datas;
                $scope.studentList.data.forEach(function (e, i) {
                    $scope.studentList.data[i].no = i + 1;
                });
                $scope.showHandleArea = false
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }

    $scope.openStudentList = function(){
        $scope.showHandleArea = false
        var clsValue  = angular.fromJson($scope.class).gradeID;
        helper.openModalStudentNotInClass({
            classValue: clsValue,
            close: function (callBackStudent) {
                if(callBackStudent&&callBackStudent.length){
                    var callBackData = callBackStudent;
                    if(angular.fromJson($scope.class).maxNum < ($scope.studentList.data.length + callBackStudent.length)){
                        helper.popup.info({title: "Lỗi",
                        message: "Số học sinh vừa thêm vào vượt quá quy định. (Sĩ số tối đa "+ angular.fromJson($scope.class).maxNum+ " học sinh.)",
                        close: function () { $scope.openStudentList(); return;}})
                        return;
                    }
                    var studentIDList = [];
                    for(var i in callBackData){
                        studentIDList.push(callBackData[i].studentID);
                    }
                    if(studentIDList.length){
                        addStudentToClass(studentIDList,angular.fromJson($scope.class).classID);
                    }
                }else{
                }
            }
        })
    }

    function addStudentToClass(studentIDList,classID){
        $http.post('/api/student_class', {studentList : studentIDList, classID: classID}, {}).then(function successCallBack(res) {
            helper.popup.info({
                title: "Thông báo",
                message:res.data.success? "Thêm học sinh thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close: function () {
                    $scope.getStudentInClass();
                    return;
                }
            });
            $scope.getStudentInClass();
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.removeStudentFromClass = function(){
        var studentIDList = [];
        for(var i in $scope.selectedStudents){
            studentIDList.push($scope.selectedStudents[i].studentID);
        }
        var param = {
            studentList: studentIDList,
            classID: angular.fromJson($scope.class).classID
        }

        helper.popup.confirm({
            title: "Xoá học sinh khỏi lớp",
            message: "Bạn có thưc sự muốn xoá (những) học sinh này?",
            ok: function () {
                $http.post('/api/student_class/del', param).then(function successCallBack(res) {
                    helper.popup.info({
                        title: "Thông báo",
                        message: res.data.success ? "Xoá học sinh thành công." : "Xoá thất bại. Vui lòng thử lại",
                        close: function () {
                            return;
                        }
                    });
                    $scope.getStudentInClass();
                }, function errorCallback() {
                    helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
                });
            },
            cancel: function () {
                return;
            }
        })
    }
    
    $scope.enterScore = function(semesterID){
        $scope.showHandleArea = true;
        $scope.handleEnterScore = true;
        $scope.dataToEnter = {
            title: "Nhập điểm học kì "+ semesterID,
            semesterID: semesterID,
            classID: angular.fromJson($scope.class).classID
        }
        helper.scrollTo("handle-score-area");
    }

    $scope.viewScore = function(){
        $scope.showHandleArea = true;
        $scope.handleEnterScore = false;
        $scope.dataToView = {
            title: "Xem Điểm",
            classID: angular.fromJson($scope.class).classID
        }
        helper.scrollTo("handle-score-area");
    }

    $scope.summarySemester = function(semesterID){
        $http.post('/api/subject/summary', {semesterID : parseInt(semesterID), classID: angular.fromJson($scope.class).classID}, {}).then(function successCallBack(res) {
                helper.popup.info({
                title: "Thông báo",
                message:res.data.success? "Tổng kết thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close: function () {
                    return;
                }
            });
            $scope.getStudentInClass();
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }
}