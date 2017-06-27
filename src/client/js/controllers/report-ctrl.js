/**
 * Report Controller
 */

angular.module('martketManagement')
    .controller('ReportCtrl', ['$scope','$http','helper', ReportCtrl]);

function ReportCtrl($scope,$http,helper) {
    function getSubject(){
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
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            });
    }
    getSubject();

    $scope.reset = function(){
        $scope.subject = null;
        $scope.semesterID = "1";
        if($scope.reportList){
            $scope.reportList.data = [];
        }
        $scope.title = "";
       };
    $scope.reset();

    $scope.report = function(){
        var subject = null;
        if($scope.subject){
            subject = angular.fromJson($scope.subject);
        }
        var subjectID = subject?subject.subjectID:null;
        var subjectName = subject?subject.subjectName:null;

        var url = subjectID?"subject":"semester";

        $scope.title = subjectID?("Báo cáo kết quả môn "+ subjectName+" - Học kì "+($scope.semesterID==1?"I":"II"))
        :"Báo cáo kết quả học kì "+($scope.semesterID==1?"I":"II");

        var semesterID = $scope.semesterID?parseInt($scope.semesterID):"";

        $http({
            method: 'GET',
            url: '/api/statistic/'+url,
            params:{semesterID: semesterID,subjectID: subjectID}
        }).then(function successCallback(response) {
            if (response.data.success) {
                $scope.reportList.minRowsToShow = response.data.data.list.length;
                $scope.reportList.data = response.data.data.list;
                $scope.reportList.data.forEach(function (e, i) {
                    $scope.reportList.data[i].no = i + 1;
                });
                helper.scrollTo("report-area");
            } else {
                $scope.reportList.data = [];
                $scope.title = "Không có dữ liệu";
                helper.popup.info({title: "Lỗi",message: "Không có dữ liệu.",close: function () {; return;}})
            }
        }, function errorCallback(response) {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
        });
    }

    $scope.reportList = {
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'className', displayName: 'Lớp' },
            { field: 'numOfStudents', displayName: 'Sĩ Số' },
            { field: 'numOfPass', displayName: 'SL Đạt' },
            { field: 'ratio', displayName: 'Tỉ Lệ', cellFilter:'toPercent' }
        ]
    };
}
