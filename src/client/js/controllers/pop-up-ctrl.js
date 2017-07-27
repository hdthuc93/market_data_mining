var module = angular.module('mod.helper');
module.controller('popupCtrl', ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {
    $scope.Header = items.Header;
    $scope.Message = items.Message;
    $scope.Class = items.Class;
    $scope.hideButton = items.hideButton;
    $scope.ok = function () {
        $uibModalInstance.close('ok');
    };
    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };
    $scope.close = function () {
        $uibModalInstance.close('close');
    };
}]);