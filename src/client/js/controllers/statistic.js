/**
 * Item Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('StatisticCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', StatisticCtrl]);

function StatisticCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    function initModel(){
        $scope.item = {
            
        };
    }

    $scope.FIList = {
        minRowsToShow: 10,
        enableSorting: false,
        rowHeight: 35,
        data: [{name: "Bread", price:3000},{name: "Egg", price:5000},
        {name: "Milk", price:15000},{name: "Cheese", price:17500},{name: "Corn", price:10000},{name: "Tomato", price:30000}],
        enableRowSelection: true,
        multiSelect: false,
        columnDefs: [
            { field: 'name', displayName: 'Tên món hàng', type:"text", minWidth: 190, maxWidth: 400 },
            { field: 'price', displayName: 'Giá', type:"number", minWidth: 80,maxWidth: 200 }
        ]
    }
    
        function getData(){
            $http.get('/api/statistic', { params: {} }).then(function successCallBack(res) {
                $scope.data = res.data.data;
                console.log(12121212,$scope.data);
            }, function errorCallback() {
                helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
            });
        }
        getData();
        
        function getDataMining(){
            $http.get('/api/statistic/mining', { params: {} }).then(function successCallBack(res) {
                console.log("DATA MINING",res.data.data);
            }, function errorCallback() {
                helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
            });
        }
        getDataMining();


}