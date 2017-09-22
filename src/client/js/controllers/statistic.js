/**
 * Statistic Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('StatisticCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', StatisticCtrl]);

function StatisticCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    //Gọi thư viện Math trên client
    $scope.Math = window.Math;

    //Khởi tạo data ban đầu
    $scope.data = {
        minSupp: 0,
        minConf: 0
    }

    //Khởi tạo ban đầu
    function initModel(){
        $scope.data = {
            minSupp: 20,
            minConf: 40
        };
        $scope.dataMining = {};          
    }
    initModel();

    //Khởi tạo danh sách mẫu Phổ biến
    $scope.FIList = {
        minRowsToShow: 10,
        enableSorting: false,
        rowHeight: 23,
        data: [{name: "Bread", price:3000},{name: "Egg", price:5000},
        {name: "Milk", price:15000},{name: "Cheese", price:17500},{name: "Corn", price:10000},{name: "Tomato", price:30000}],
        enableRowSelection: true,
        multiSelect: false,
        columnDefs: [
            { field: 'name', displayName: 'Tên món hàng', type:"text", minWidth: 190, maxWidth: 400 },
            { field: 'quan', displayName: 'Số lượng', type:"number", minWidth: 80,maxWidth: 200 }
        ]
    }
    
    //Hàm lấy thống kê dữ liệu đơn giản
    function getStatistic(){
        $http.get('/api/statistic', { params: {} }).then(function successCallBack(res) {
            $scope.data = res.data.data;
        }, function errorCallback() {
            helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
        });
    }
    getStatistic();
    
    //Hàm lấy danh sách mặt hàng đc mua nhiều nhất
    function getBestSeller(){
        $http.get('/api/item/bestseller', { params: {} }).then(function successCallBack(res) {
            $scope.FIList.data = res.data.data;
        }, function errorCallback() {
            helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
        });
    }
    getBestSeller();

    //Hàm lấy MBP và luật KH
    $scope.getDataMining = function(){
        console.log($scope.formInputData, typeof $scope.data.minSupp , $scope.data.minConf)
        if($scope.data.minSupp<0 || $scope.data.minSupp>100 || $scope.data.minConf < 0|| $scope.data.minConf > 100){
            helper.popup.info({ title: "Lỗi", message: "Giá trị phải là số dương và không vượt quá 100.", close: function () { return; } })
            return;
        }

        var _param = {
            "minSupp": parseFloat(($scope.data.minSupp/100).toFixed(1)),
            "minConf": parseFloat(($scope.data.minConf/100).toFixed(1))
        }

        $http.get('/api/statistic/mining', { params: _param }).then(function successCallBack(res) {
            $scope.dataMining = res.data.data;
            // $scope.dataMining.ar.sort(function(a, b) {
            //     return b["conf"] - a["conf"];
            // });
            // $scope.dataMining.fi.sort(function(a, b) {
            //     return b["supp"] - a["supp"];
            // });
        }, function errorCallback() {
            helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
        });
    }
    $scope.getDataMining();


}