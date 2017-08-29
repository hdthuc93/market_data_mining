/**
 * Item Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('StatisticCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', StatisticCtrl]);

function StatisticCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    $scope.Math = window.Math;
    function initModel(){
        $scope.data = {};
        $scope.dataMining = {};            
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
            { field: 'quan', displayName: 'Số lượng', type:"number", minWidth: 80,maxWidth: 200 }
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
        
        function getBestSeller(){
            $http.get('/api/item/bestseller', { params: {} }).then(function successCallBack(res) {
                console.log("BEST SELLER",res.data.data);
                $scope.FIList.data = res.data.data;
            }, function errorCallback() {
                helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
            });
        }
        getBestSeller();

        function getDataMining(){
            $http.get('/api/statistic/mining', { params: {} }).then(function successCallBack(res) {
                console.log("DATA MINING",res.data.data);
                $scope.dataMining = res.data.data;
                $scope.dataMining.sort(function(a, b) {
                    return b["conf"] - a["conf"];
                });
            }, function errorCallback() {
                helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
            });
        }
        getDataMining();


}