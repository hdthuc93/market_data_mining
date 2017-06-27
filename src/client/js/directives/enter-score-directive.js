angular
    .module('martketManagement')
    .directive('enterScore', enterScore);

function enterScore() {
    var directive = {
        restrict: 'AE',
        templateUrl: "templates/enter_score.html"
    };
    return directive;
};