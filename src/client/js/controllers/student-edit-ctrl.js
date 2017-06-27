/**
 * Student Controller
 * Implement: Phong Nguyen
 */
angular.module('martketManagement')
    .controller('StudentEditCtrl', ['$scope', 'helper', '$http', '$rootScope', StudentEditCtrl]);

function StudentEditCtrl($scope, helper, $http, $rootScope) {
    $scope.emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    $scope.datePattern = /^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    if (angular.isFunction($scope.$watchCollection)) {
        $scope.$parent.$watchCollection(function () {
            return $scope.studentData;
        }, init);
    }
    
    function init(newValue, oldValue) {
        if (newValue !== oldValue && Object.keys(newValue.data).length > 0 && newValue.action == "edit") {
            //UPDATE
            $scope.title = "Cập nhật học sinh";
            $scope.data = {};
            angular.extend($scope.data, $scope.studentData.data);
            if(!$scope.data.className){
                $scope.data.className = "Chưa có";
            }

            if(!$scope.data.prevClassesString){
                $scope.data.prevClassesString = "Chưa có";
            }
        }
        if (newValue !== oldValue && Object.keys(newValue.data).length > 0 && newValue.action == "view") {
            //VIEW
            $scope.title = "Thông tin học sinh";
            $scope.data = {};
            angular.extend($scope.data, $scope.studentData.data);
            if(!$scope.data.className){
                $scope.data.className = "Chưa có";
            }
            if(!$scope.data.prevClassesString){
                $scope.data.prevClassesString = "Chưa có";
            }
        }
        if (newValue.action == "create") {
            //CREATE NEW
            $scope.title = "Tiếp nhận học sinh";
            $scope.data = {
                yearAdmissionName: $rootScope.masterRegulation.schoolYearName,
                className: "Chưa có",
                prevClassesString: "Chưa có"
            };
        }
    }

    $scope.reset = function () {
        if ($scope.studentData.action == "create") {
            $scope.data = {};
        } else {
            angular.extend($scope.data, $scope.studentData.data);
        }
        $scope.studentEditForm.$setPristine();
        $scope.studentEditForm.$setUntouched();
    }

    $scope.save = function () {
        if ($scope.studentEditForm.$invalid) {
            helper.popup.info({title: "Lỗi",message: "Vui lòng điền thông tin đầy đủ và chính xác.",close: function () { return;}})
            return;
        }
        if ($scope.studentData.action == "create") {
            var dataSave = {
                address: $scope.data.address,
                birthday: $scope.data.birthday,
                email: $scope.data.email,
                gender: $scope.data.gender,
                name: $scope.data.name,
                schoolYearID: $rootScope.masterRegulation.schoolYearID
            }
            $http.post('/api/student', dataSave, {}).then(function successCallBack(res) {
                helper.popup.info({
                    title: "Thông báo",
                    message:res.data.success? "Tạo mới học sinh thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                    close: function () {
                        $scope.data = {
                            yearAdmission: $rootScope.masterRegulation.schoolYearName,
                            className: "Chưa có",
                            prevClassesString: "Chưa có"
                        };
                        $scope.studentEditForm.$setPristine();
                        $scope.studentEditForm.$setUntouched();
                        $rootScope.$broadcast('reset-student-list');
                        return;
                    }
                });
            }, function errorCallback() {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }
        if ($scope.studentData.action == "edit") {
            var dataSave = {
                address: $scope.data.address,
                birthday: $scope.data.birthday,
                email: $scope.data.email,
                gender: $scope.data.gender,
                name: $scope.data.name,
                studentCode: $scope.data.studentCode,
                studentID: $scope.data.studentID
            }
            $http.put('/api/student', dataSave, {}).then(function successCallBack(res) {
                helper.popup.info({
                    title: "Thông báo",
                    message: res.data.success?"Cập nhật thành công.":"Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",
                    close: function () {
                        $rootScope.$broadcast('reset-student-list');
                        return;
                    }
                });
            }, function errorCallback() {
                helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
            });
        }
    }
    $(function(){
        $http({
            method: 'GET',
            url: '/api/regulation',
        }).then(function successCallback(response) {
            if(response.data.success){
                var data = response.data.data
                var minDate = "-"+data.maxAge+"Y";
                var maxDate = "-"+data.minAge+"Y";
                    $(".dp-birthday").datepicker({ dateFormat: 'dd-mm-yy', changeMonth: true,
                    changeYear: true, numberOfMonths: 1, minDate: minDate, maxDate: maxDate,
                    showOn: "button", buttonImage: "img/dp-icon.png", buttonImageOnly: true});  
            }
        });
    })
}