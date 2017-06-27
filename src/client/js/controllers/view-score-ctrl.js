/**
 * View Score Controller
 * Implement: Phong Nguyen
 */
angular.module('martketManagement')
    .controller('viewScoreCtrl', ['$scope', 'helper', '$http', '$rootScope', viewScoreCtrl]);

function viewScoreCtrl($scope, helper, $http, $rootScope) {
    var minRow = 40, rowHeight = 30;
    function initModel(){
        $scope.subjectList = null;
        $scope.studentList = null;
        $scope.selectedSubject = null;
        $scope.selectedStudent = null;
        $scope.selectedSemester = null;
        $scope.classID = null;
        $scope.selectedItem = null;
    }initModel();

    if (angular.isFunction($scope.$watchCollection)) {
        $scope.$parent.$watchCollection(function () {
            return $scope.dataToView;
        }, init);
    }

    function init(newValue, oldValue) {
        if (newValue != oldValue) {
            //VIEW
            initModel();
            $scope.title = newValue.title;
            $scope.classID = newValue.classID;
           
        }
    }

    $scope.scoreListBySubject = {
        data: [],
        minRowsToShow: 50,
        enableSorting: true,
        enableRowSelection: false,
        multiSelect: false,
        enableColumnResizing: true,
        columnDefs: [
            { field: 'studentName', displayName: 'Tên Học Sinh', type: 'text', enableCellEdit : false, minWidth: 200, maxWidth: 250 },
            { field: 'score1', displayName: '15P (Hệ số 1)', type: 'number', width: 100 },
            { field: 'score2', displayName: '1T (Hệ số 2)', type: 'number', width: 100 },
            { field: 'score3', displayName: 'Thi (Hệ số 3)', type: 'number', width: 100 }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.scoreListByStudent = {
        data: [],
        minRowsToShow: 50,
        enableSorting: true,
        enableRowSelection: false,
        multiSelect: false,
        enableColumnResizing: true,
        columnDefs: [
            { field: 'subjectName', displayName: 'Môn học', type: 'text', enableCellEdit : false, minWidth: 200, maxWidth: 250 },
            { field: 'listScores[0].score1', displayName: '15P (Hệ số 1)', type: 'number', width: 100 },
            { field: 'listScores[0].score2', displayName: '1T (Hệ số 2)', type: 'number', width: 100 },
            { field: 'listScores[0].score3', displayName: 'Thi (Hệ số 3)', type: 'number', width: 100 }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
     
    $scope.getScoreList = function(){
        if(1){
            
        }else{
            $scope.scoreList.data = [];
        }
         
    }

    $scope.save = function () {
        var dataSave = {
            
        }
        $http.post('/api/score', dataSave, {}).then(function successCallBack(res) {
            helper.popup.info({
                title: "Thông báo",
                message:res.data.success? "Cập nhật điểm thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close: function () {
                    return;
                }
            });
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.showSelectArea = function(){
        $scope.subjectList = null;
        $scope.studentList = null;
        $scope.selectedSubject = null;
        $scope.selectedStudent = null;
        $scope.semesterID = null;
        $scope.scoreListBySubject.data = [];
        $scope.scoreListByStudent.data = [];
        if($scope.showSelect == 'subject'){
            $http({
                method: 'GET',
                url: '/api/subject',
            }).then(function successCallback(response) {
                if (response.data.success) {
                    $scope.subjectList = response.data.datas;
                } else {
                    $scope.subjectList = null;
                }
            }, function errorCallback(response) {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }

        if($scope.showSelect =='student'){
            $http({
                //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'GET',
                url: '/api/student_class',
                params:{classID: $scope.classID}
            }).then(function successCallback(response) {
                if(response.data.success){
                    $scope.studentList = response.data.datas;
                }else{
                    helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
                }
            });
        }
    }

    $scope.getScoreList =  function(){
        var param = {
            semesterID: parseInt($scope.semesterID),
            classID: $scope.classID,
            subjectID: $scope.selectedSubject,
            studentID: $scope.selectedStudent
        }

        $http({
                //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'GET',
                url: '/api/subject/score',
                params: param
            }).then(function successCallback(response) {
                if(response.data.success){
                    if(response.data.datas && response.data.datas.list && response.data.datas.list.length){
                        //Subject scores
                        if($scope.selectedSubject&&response.data.datas.list[0].listScores){
                            $scope.scoreListBySubject.minRowsToShow = response.data.datas.list[0].listScores.length;
                            $scope.scoreListBySubject.data = response.data.datas.list[0].listScores;
                            $scope.scoreListBySubject.data.forEach(function (e, i) {
                                $scope.scoreListBySubject.data[i].no = i + 1;
                            });  
                        }
                        //Student scores
                        if($scope.selectedStudent){
                            $scope.scoreListByStudent.minRowsToShow = response.data.datas.list.length;
                            $scope.scoreListByStudent.data = response.data.datas.list;
                            $scope.scoreListByStudent.data.forEach(function (e, i) {
                                $scope.scoreListByStudent.data[i].no = i + 1;
                            });  
                        }
                    }
                }else{
                    helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
                }
            });
    }
}