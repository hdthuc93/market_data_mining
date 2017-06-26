var app = angular.module('rzSliderDemo', ['rzModule']);

app.controller('rotateDemoCtrl', function ($scope, $rootScope, $timeout) {
    //Slider with selection bar
    $scope.sliderBar = {
        value: 0,
        options: {
			floor: -90,
            ceil: 90,
            showSelectionBar: true,
            onStart: function () {
               $scope.style = {transform: "rotate("+$scope.sliderBar.value+"deg)"};
            },
            onChange: function () {
            console.log("3333333333333")
            	$scope.style = {transform: "rotate("+$scope.sliderBar.value+"deg)"};
            },
            onEnd: function () {
                 $scope.style = {transform: "rotate("+$scope.sliderBar.value+"deg)"};
            }
        }
    };

});