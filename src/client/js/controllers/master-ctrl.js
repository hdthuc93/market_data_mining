/**
 * Master Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore','$http','$rootScope','$timeout','helper', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http, $rootScope,$timeout,helper) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;                
            }
        } else {
            $scope.toggle = false;
            $("#page-wrapper").removeClass('open');
        }
    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $rootScope.masterRegulation = [];
    function getRegulation(){
        $http({
            method: 'GET',
            url: '/api/regulation'
        }).then(function successCallback(response) {
            if(response.data.success){
                $rootScope.masterRegulation = response.data.data;
            }else{
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng tải lại trang.",close: function () {location.reload(); return;}})
            }
        });
    }
    getRegulation();
     
     
}