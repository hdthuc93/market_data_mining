/**
 * Item Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('ItemCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', ItemCtrl]);

function ItemCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    $scope.ItemList = {
        minRowsToShow: 10,
        enableSorting: false,
        rowHeight: 35,
        data: [],
        columnDefs: [
            { field: 'name', displayName: 'Tên món hàng', minWidth: 200, maxWidth: 300 },
            { field: 'price', displayName: 'Giá', minWidth: 80, maxWidth: 100 },
            { field: 'color', displayName: 'Màu sắc', minWidth: 80, maxWidth: 100 },
            { field: 'size', displayName: 'Kích thước', minWidth: 20, maxWidth: 90 }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    }
    $scope.addItem = function(data){
        var dataLength = $scope.ItemList.data.length;
        if (dataLength > 0) {
            var lastRecord = $scope.grade10.data[dataLength-1];
            if (lastRecord.name.trim() === "") {return;}
        }
        if (!data) { data = {};}
        $scope.ItemList.data.push(
            {name: data.name || "", price: data.price || "", color: data.color || "", size: data.size || ""}
        )
    }

    $scope.deleteItem = function () {
        // if ($scope.selectedRowGrade10) {
        //     for (var i in $scope.grade10.data) {
        //         if ($scope.grade10.data[i] === $scope.selectedRowGrade10) {
        //             $scope.grade10.data.splice(i, 1);
        //             $scope.selectedRowGrade10 = false;
        //             break;
        //         }
        //     }
        // }
    };
}