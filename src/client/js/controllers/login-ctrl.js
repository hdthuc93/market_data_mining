/**
 * login Controller
 * Implement: Phong Nguyen
 */

angular.module('martketManagement')
    .controller('loginCtrl', ['$scope', '$cookieStore','$http','$rootScope','$timeout','$location','helper', authenCtrl]);

function authenCtrl($scope, $cookieStore, $http, $rootScope,$timeout,$location,helper) {
    function init(){
        $scope.username = "";
        $scope.password = "";
        $scope.regUsername = "";
        $scope.regPassword = "";
        $scope.regRePassword = "";
        $scope.regFullname = "";
        $scope.title = "Đăng nhập"
        $scope.showLogin = true;
    }
    init();

    $scope.showRegisterForm = function(){
        $scope.username = "";
        $scope.password = "";
        $scope.regUsername = "";
        $scope.regPassword = "";
        $scope.regRePassword = "";
        $scope.regFullname = "";
        $scope.title = "Đăng kí"
        $scope.showLogin = false;
        $scope.registerForm.$setPristine();
        $scope.registerForm.$setUntouched();
    }

    $scope.showLoginForm = function(){
        $scope.username = "";
        $scope.password = "";
        $scope.regUsername = "";
        $scope.regPassword = "";
        $scope.regRePassword = "";
        $scope.regFullname = "";
        $scope.title = "Đăng nhập"
        $scope.showLogin = true;
        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
    }

    $scope.logout = function(){
        $cookieStore.put('userdata', {});
        $location.path('/login');
    }

    $scope.login = function(){
        if ($scope.loginForm.$invalid) {
            return;
        }
        var param = {
            username: $scope.username||null,
            password: $scope.password||null
        }
        $http.post('/api/user/login', param).then(function successCallBack(res){
            if(res.data.success){
                var data = res.data;
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 7);
                // Setting a cookie
                $rootScope.masterToken = data.token;
                $cookieStore.put('userdata', {loggedIn: true, name: data.name, token: data.token}, {'expires': expireDate});
                $location.path('/');
            }else{                
                helper.popup.info({title: "Đăng nhập thất bại",message: "Tên đăng nhập hoặc mật khẩu không đúng, vui lòng thử lại.",close: function () { return;}})
                $scope.showLoginForm();
            }
        }, function errorCallback(){
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { location.reload(); return;}})
        });
    }

    $scope.signup = function(){
        
        if ($scope.registerForm.$invalid) {
            return;
        }
        var data = {
            username: $scope.regUsername.toLowerCase()||"",
            password: $scope.regPassword||"",
            fullName: $scope.regFullname||"",
            confirmPassword: (""+$scope.regRePassword+"")||""
        }
        $http.post('/api/user/register', data).then(function successCallBack(res){
            if(res.data.success){
                 helper.popup.info({title: "Thông báo",message: "Đăng kí thành công",close: function () {return;}});
                 $scope.showLoginForm();
            }else{
                msg =  "Nội dung đăng kí không chính xác";
                if(res.data.exist_usr){
                    msg =  "Tên đăng nhập này đã tồn tại.";
                }  
                if(res.data.pass_not_match){
                    msg =  "Xác nhận mật khẩu không khớp";
                }               
                helper.popup.info({title: "Đăng kí thất bại",message:msg,close: function () { $scope.showRegisterForm(); return;}})
            }
        }, function errorCallback(){
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { location.reload(); return;}})
        });
    }
}