/**
 * Enter Score Controller
 * Implement: Phong Nguyen
 */
angular.module('martketManagement')
    .controller('enterScoreCtrl', ['$scope', 'helper', '$http', '$rootScope', enterScoreCtrl]);

function enterScoreCtrl($scope, helper, $http, $rootScope) {
    var minRow = 40, rowHeight = 30;
    $scope.scoreList = {
        data: [],
        minRowsToShow: 50,
        enableSorting: true,
        enableRowSelection: false,
        multiSelect: false,
        enableColumnResizing: true,
        columnDefs: [
            { field: 'no', displayName: 'STT', enableCellEdit : false, enableCellEdit : false,  minWidth: 50, maxWidth: 70 },
            { field: 'studentName', displayName: 'Tên Học Sinh', type: 'text', enableCellEdit : false, minWidth: 200, maxWidth: 250 },
            { field: 'score1', displayName: '15P (Hệ số 1)', type: 'number', width: 100,
            editableCellTemplate:'<input type="number" min="0" max="10" ui-grid-editor ng-model="MODEL_COL_FIELD">' },
            { field: 'score2', displayName: '1T (Hệ số 2)', type: 'number', width: 100 ,
            editableCellTemplate:'<input type="number" min="0" max="10" ui-grid-editor ng-model="MODEL_COL_FIELD">' },
            { field: 'score3', displayName: 'Thi (Hệ số 3)', type: 'number', width: 100 ,
            editableCellTemplate:'<input type="number" min="0" max="10" ui-grid-editor ng-model="MODEL_COL_FIELD">' }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    function initModel(){
        $scope.subjectList = null;
        $scope.selectedSubject = null;
        $scope.classID = "";
        $scope.semesterID = "";
        $scope.scoreList.data = [];
    }initModel();

    if (angular.isFunction($scope.$watchCollection)) {
        $scope.$parent.$watchCollection(function () {
            return $scope.dataToEnter;
        }, init);
    }

    function init(newValue, oldValue) {
        if (newValue != oldValue) {
            //UPDATE
            initModel();
            $scope.title = newValue.title;
            $scope.classID = newValue.classID;
            $scope.semesterID = newValue.semesterID;
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
    }
     
    $scope.getScoreList = function(){
        if($scope.selectedSubject){
            $http({
                //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'GET',
                url: '/api/subject/score',
                params:{semesterID: $scope.semesterID, classID: $scope.classID, subjectID: $scope.selectedSubject}
            }).then(function successCallback(response) {
                if(response.data.success){
                    $scope.scoreList.minRowsToShow = response.data.datas.list[0].listScores.length;
                    $scope.scoreList.data = [];
                    if(response.data.datas && response.data.datas.list && 
                    response.data.datas.list.length && response.data.datas.list[0].listScores){
                        $scope.scoreList.data = response.data.datas.list[0].listScores;
                        $scope.scoreList.data.forEach(function (e, i) {
                        $scope.scoreList.data[i].no = i + 1;
                    });
                }
                }else{
                    helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
                }
            });
        }else{
            $scope.scoreList.data = [];
        }
         
    }

    $scope.reset = function () {
           
    }

    $scope.save = function () {
        var dataSave = {
            semesterID: $scope.semesterID,
            classID: $scope.classID,
            subjectID: $scope.selectedSubject,
            listScores: $scope.scoreList.data
        }
        $http.post('/api/subject/score', dataSave, {}).then(function successCallBack(res) {
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
}