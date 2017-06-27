angular
    .module('martketManagement')
    .directive('studentHandle', studentHandle);

function studentHandle() {
    var directive = {
        restrict: 'AE',
        templateUrl: "templates/student_edit.html"
    };
    return directive;
};