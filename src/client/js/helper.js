var module = angular.module('mod.helper',['ui.bootstrap','ui.grid','ui.grid.selection','ui.grid.resizeColumns']);
var topTemplate =
                '<div class="modal-header"><h4 class="modal-title" ng-bind="Header"></h4></div>' +
                '<div class="modal-body">' +
                '<h5 class="modal-body-content"><span ng-bind="Message"></span></h5>' +
                '</div>';

var modalInstance = null;

module.factory('helper',['$uibModal','$interval',
 function($uibModal,$interval) {
    var service = {}, timeout = null;
    service.popup = {
        confirm: function(options){
                var template = topTemplate +
                        '<div class="modal-footer"><button class="btn btn-primary btn-xs" type="button" ng-click="ok()"><i class="fa fa-check"></i> Có</button>' +
                        '<button class="btn btn-primary btn-xs" type="button" ng-click="cancel()"><i class="fa fa fa-times"></i> Không</button> </div>';
                var data = {};
                if (typeof options.title !== 'undefined') {
                    data.Header = options.title;
                } else {
                    data.Header = "Thông báo";
                }
                if (typeof options.message !== 'undefined') {
                    data.Message = options.message;
                }
                var configs = {
                    template: template,
                    animation: true,
                    controller: 'popupCtrl',
                    appendTo: angular.element("#modal_area"),
                    resolve: {
                        items: function () {
                            return data;
                        }
                    },
                    size: 'sm'
                };
                modalInstance = $uibModal.open(configs);
                modalInstance.result.then(function (rs) {
                    if (rs == 'ok' && typeof options.ok !== 'undefined' && angular.isFunction(options.ok)) {
                        options.ok();
                    }
                    if (rs == 'cancel' && typeof options.cancel !== 'undefined' && angular.isFunction(options.cancel)) {
                        options.cancel();
                    }
                });
        },
        info: function(options){
                var template = topTemplate +
                        '<div class="modal-footer">'+
                        '<button class="btn btn-primary btn-xs" type="button" ng-click="close()"><i class="fa fa fa-times"></i> OK</button> </div>';
                var data = {};
                if (typeof options.title !== 'undefined') {
                    data.Header = options.title;
                } else {
                    data.Header = "Thông báo";
                }
                if (typeof options.message !== 'undefined') {
                    data.Message = options.message;
                }
                var configs = {
                    template: template,
                    animation: true,
                    controller: 'popupCtrl',
                    appendTo: angular.element("#modal_area"),
                    resolve: {
                        items: function () {
                            return data;
                        }
                    },
                    size: 'sm'
                };
                modalInstance = $uibModal.open(configs);
                modalInstance.result.then(function (rs) {
                    if (rs == 'close' && typeof options.close !== 'undefined' && angular.isFunction(options.close)) {
                        options.close();
                    }
                });
        }
    }

    service.scrollTo = function(anchor){
        var stop = $interval(function () {
                var ele = angular.element("#" + anchor);
                var headerHeight = angular.element(".page-content .row.header").outerHeight() + 15;
                var scrollLength = ele[0].offsetTop + headerHeight;
                if (ele.height() > 10) {
                    angular.element('html,body').animate({
                        scrollTop: scrollLength
                    }, "slow", "swing", function () {
                        if ($(window).scrollTop() >= scrollLength || $(window).scrollTop() == ($(document).height() - $(window).height())) {
                            $interval.cancel(stop);
                            stop = undefined;
                        }
                    });
                } else {
                }
            }, 500, 30);
    }

    service.openModalStudentNotInClass = function(options){
        var classValue = options.classValue;
        var configs = {
            templateUrl: "templates/popup_select_student.html",
            animation: true,
            controller: 'studentListNotInClassCtrl',
            appendTo: angular.element("#modal_area"),
            resolve: {
                itemClassValue: function () {
                    return classValue;
                }
            },
            size: 'md'
        };
        modalInstance = $uibModal.open(configs);
        modalInstance.result.then(function (rs) {
            if (rs && rs.title == 'studentID' && typeof options.close !== 'undefined' && angular.isFunction(options.close)) {
                options.close(rs.data);
            }
        });
    }

    return service;
}]);


