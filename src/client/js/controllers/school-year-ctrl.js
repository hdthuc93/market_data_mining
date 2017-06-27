/**
 * Alerts Controller
 */

angular.module('martketManagement')
    .controller('SchoolYearCtrl', ['$scope','$rootScope','$http','helper','$timeout', SchoolYearCtrl]);

function SchoolYearCtrl($scope,$rootScope,$http,helper,$timeout) {
     function createNewSchoolYearVariable(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year',
        }).then(function successCallback(response) {
            if(response.data.success){
                var data = response.data.data;
                $scope.schoolYearList.data = data;
                $scope.newSchoolYear = parseInt(data[data.length-1].schooYearCode)+1;
            }else{
            }
        });
   }
   
   function getFutureSchoolYear(){
        $http({
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            method: 'GET',
            url: '/api/school_year/future',
        }).then(function successCallback(response) {
            if(response.data.success){
                var data = response.data.datas;
                 if(data.length){
                    $scope.selectedFutureSchoolYear = data[0].schoolYearID;
                    $scope.selectedFutureSchoolYearName = data[0].schoolYearName;  
                }else{
                    $scope.selectedFutureSchoolYearName = "Chưa tạo";   
                }               
            }else{
            }
        });
   }
   
    function init(){
        $scope.newSchoolYear = "";
        $scope.selectedFutureSchoolYear = "";
        $scope.selectedFutureSchoolYearName = "";   
        createNewSchoolYearVariable();
        getFutureSchoolYear();
    }
    init();

  

    $scope.createSchoolYear = function(){
        var _year = $scope.newSchoolYear
        $http.post('/api/school_year', {year:_year}).then(function successCallBack(res){
            helper.popup.info({
                title:"Thông báo",
                message:res.data.success?"Tạo thành công năm học mới.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close:function(){
                    init();
                    return;
                }
            });
        }, function errorCallback(){
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.changeSchoolYear = function(){
        $http.post('/api/school_year/change', {schoolYearID:$scope.selectedFutureSchoolYear}).then(function successCallBack(res){
            helper.popup.info({
                title:"Thông báo",
                message:res.data.success?"Đã mở thành công năm học mới. Năm học hiện tại là "+$scope.selectedFutureSchoolYearName:"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                close:function(){
                    location.reload();
                    return;
                }
            });
        }, function errorCallback(){
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }

    $scope.schoolYearList = {
        data: [],
        minRowsToShow: 10,
        rowheight: 30,
        enableSorting: true,
        enableRowSelection: false,
        multiSelect: false,
        columnDefs: [
            { field: 'schoolYearName', displayName: 'Năm học', minWidth: 100  },
            { field: 'status', displayName: 'Trạng thái', cellFilter: 'schoolYearStatusToText', minWidth: 200 },
        ]
    };


}