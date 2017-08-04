/**
 * Item Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('ItemCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', ItemCtrl]);

function ItemCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    function initModel(){
        $scope.item = {
            name:"",
            price:"",
            color:"",
            size:"",
            createdDate:"",
            expiredDate:"",
        };
    }

    $scope.ItemList = {
        minRowsToShow: 10,
        enableSorting: false,
        rowHeight: 35,
        data: [],
        enableRowSelection: true,
        multiSelect: false,
        columnDefs: [
            { field: 'name', displayName: 'Tên món hàng', type:"text", minWidth: 200, maxWidth: 300 },
            { field: 'price', displayName: 'Giá', type:"number", minWidth: 80,maxWidth: 100 },
            { field: 'color', displayName: 'Màu sắc', type:"text", minWidth: 80, maxWidth: 100 },
            { field: 'size', displayName: 'Kích thước', type:"number", minWidth: 20, maxWidth: 90},
            { field: 'createdDate', displayName: 'Ngày tạo', type:"text", minWidth: 100, maxWidth: 200},
            { field: 'expiredDate', displayName: 'Ngày hết hạn', type:"text", minWidth: 100, maxWidth: 200}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.item = row.entity;
                } else {
                    $scope.item = {
                        name:"",
                        price:"",
                        color:"",
                        size:"",
                        createdDate:"",
                        expiredDate:"",
                    };
                }
            });
        }
    }
    $scope.insertItem = function(data){
        initModel();
    }

    $scope.save = function(){
        if($scope.formItem.$invalid){
            helper.popup.info({
                title: "Thông báo",
                message: "Vui lòng điền đầy đủ thông tin.",
                close: function () {
                    return;
                }
            });
            return;
        }
        var dataSave = {
            color: $scope.item.color||null,
            createdDate: $scope.item.createdDate||null,
            expiredDate: $scope.item.expiredDate||null,
            id: $scope.item.id||null,
            name: $scope.item.name||null,
            price: $scope.item.price||null,
            size: $scope.item.size||null
        };
        if(dataSave.id){
            //UPDATE
            $http.put('/api/item?',dataSave,{}).then(function successCallBack(res) {
                console.log("after UPDATE",res)
                var _res = res;
                var _msg = _res.data.success?"Chỉnh sửa thành công.":"Chỉnh sửa kiện hàng thất bại.";
                helper.popup.info({title: "Thông báo",message: _msg,close: function () { return;}})
                if(_res.data.success){
                    getItemList();
                }
            }, function errorCallback() {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }
        if(!$scope.item.id){
            //INSERT
            $http.post('/api/item', dataSave, {}).then(function successCallBack(res) {
                var _res = res;
                var _msg = _res.data.success?"Thêm thành công.":"Thêm kiện hàng thất bại.";
                helper.popup.info({title: "Thông báo",message: _msg,close: function () { return;}});
                if(_res.data.success){
                    getItemList();
                }
            }, function errorCallback() {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }
        
    }

    $scope.deleteItem = function () {
        helper.popup.confirm({
            title: "Xoá kiện hàng",
            message: "Bạn có thưc sự muốn xoá kiện hàng này?",
            ok: function () {
                // $http.delete('/api/student', { params: { studentID: $scope.selectedRow.studentID } }).then(function successCallBack(res) {
                //     helper.popup.info({
                //         title: "Thông báo",
                //         message: res.data.success ? "Xoá học sinh thành công." : "Xoá thất bại. Vui lòng thử lại",
                //         close: function () {
                //             return;
                //         }
                //     });
                //     $scope.reset();
                // }, function errorCallback() {
                //     helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
                // });
            },
            cancel: function () {
                return;
            }
        })
    };

    $scope.getItemList = function(){
        $http.get('/api/item', { params: { } }).then(function successCallBack(res) {
            console.log("item list",res.data.data);
            var data = res.data.data;
            $scope.ItemList.data = data;
           
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
        });
    }
    $scope.getItemList();
}