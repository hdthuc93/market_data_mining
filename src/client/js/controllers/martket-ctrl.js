/**
 * Martket Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('MartketCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', MartketCtrl]);

function MartketCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    $scope.selectedTab = 0;
    $scope.panzoomConfig = {
        zoomLevels: 5,
        neutralZoomLevel: 1,
        scalePerZoomLevel: 1.5
    };
    $scope.panzoomModel = {};
    $scope.KhuVuc = [{
        name: "Khu Vuc 1",
        id: "kv1",
        slKe: 2, // so luong ke
        slNgan: 3, //co bao nhieu ngan / 1 ke
        ktNgan: 2, // kich thuoc ngan 2 or 1
        slDong: 5, //co bao nhieu Hang`
        x: 10, //left
        y: 10, //top
        rotate: 0,
        items: [{
            dong: 1,
            cot: 1,
            kthuoc: 2,
            mausac: "red"
        }, {
            dong: 1,
            cot: 3,
            kthuoc: 2,
            mausac: "orange"
        }, {
            dong: 2,
            cot: 1,
            kthuoc: 1,
            mausac: "green"
        }, {
            dong: 5,
            cot: 6,
            kthuoc: 2,
            mausac: "#333"
        }]
    }, {
        name: "Khu Vuc 2",
        id: "kv2",
        slKe: 3, // so luong ke
        slNgan: 2, //co bao nhieu ngan / 1 ke
        ktNgan: 1, // kich thuoc ngan 2 or 1
        slDong: 6, //co bao nhieu Hang`
        x: 10, //left
        y: 100, //top
        rotate: -45,
        items: [{
            dong: 4,
            cot: 5,
            kthuoc: 2,
            mausac: "brown"
        }, {
            dong: 1,
            cot: 3,
            kthuoc: 2,
            mausac: "orange"
        }, {
            dong: 2,
            cot: 1,
            kthuoc: 1,
            mausac: "green"
        }, {
            dong: 5,
            cot: 1,
            kthuoc: 1,
            mausac: "#d3d3d3"
        },{
            dong: 3,
            cot: 2,
            kthuoc: 2,
            mausac: "violet"
        }]
    }];

    $scope.KhuVucList = {
        minRowsToShow: 10,
        enableSorting: false,
        data: $scope.KhuVuc,
        columnDefs: [
            { field: 'name', displayName: 'Ten KV', minWidth: 90, maxWidth: 160 },
            { field: 'slKe', displayName: 'SL Ke', minWidth: 20, maxWidth: 70 },
            { field: 'slNgan', displayName: 'SL Ngan', minWidth: 20, maxWidth: 70 },
            { field: 'ktNgan', displayName: 'Kt Ngan', minWidth: 20, maxWidth: 70 },
            { field: 'slDong', displayName: 'SL Hang', minWidth: 20, maxWidth: 70 },
            { field: 'x', displayName: 'x', minWidth: 60, maxWidth: 120 },
            { field: 'y', displayName: 'y', minWidth: 60, maxWidth: 120 },
            { field: 'rotate', displayName: 'Xoay', minWidth: 50, maxWidth: 70 },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    }

    $scope.themKhuVuc = function () {
        if ($scope.data) {
            var dk = {
                name: "Khu Vuc " + Math.floor((Math.random() * 9999) + (Math.random() * 9999)),
                id: "kv" + Math.floor((Math.random() * 9999) + (Math.random() * 9999)),
                slKe: $scope.data.slKe || 1,
                slNgan: $scope.data.slNgan || 1,
                ktNgan: $scope.data.ktNgan || 1,
                slDong: $scope.data.slDong || 1,
                x: $scope.data.x || 0,
                y: $scope.data.y || 0,
                rotate: 0,
                items: []
            }
            $scope.KhuVuc.push(dk);
            $scope.KhuVucList.data = $scope.KhuVuc;
        }
    }

    $scope.save = function () {
        var data = $(".khuvuc");
        if (data.length) {
            for (var i = 0; i < data.length; i++) {
                console.log($(data[i]))
            }
        }
    }

    $scope.build = function () {
        if (!$scope.KhuVuc.length) {
            return;
        }
        var mainArea = $("#main_area");
        mainArea.empty();
        var contentHTML = "";
        for (var i in $scope.KhuVuc) {
            var posX = ($scope.KhuVuc[i].x) ? 'left:' + $scope.KhuVuc[i].x + 'px;' : '';
            var posY = ($scope.KhuVuc[i].y) ? 'top:' + $scope.KhuVuc[i].y + 'px;' : '';
            var rotate = ($scope.KhuVuc[i].rotate) ? 'transform : rotate(' + $scope.KhuVuc[i].rotate + 'deg)' : '';
            var _style = ' style="position:absolute;' + posX + posY + rotate + '" ';
            var _id = ' id=' + $scope.KhuVuc[i].id + ' ';
            var _class = ' class="khuvuc-container" ';
            var quayke = renderKe($scope.KhuVuc[i].slKe, $scope.KhuVuc[i].slNgan
                , $scope.KhuVuc[i].ktNgan, $scope.KhuVuc[i].slDong, $scope.KhuVuc[i].items);
            contentHTML += '<div ' + _id + _class + _style + ' >' + quayke + '</div>';
        }
        mainArea.html(contentHTML);

        for (var i in $scope.KhuVuc) {
            for (var j in $scope.KhuVuc[i].items) {
                var item = $scope.KhuVuc[i].items[j];

                var vt1 = $('#' + $scope.KhuVuc[i].id + ' .ngan' + item.dong + '-' + item.cot);
                vt1.css("background-color", item.mausac);
                vt1.addClass("hasItem");
                if ($scope.KhuVuc[i].items[j].kthuoc == 2) {
                    var vt2 = $('#' + $scope.KhuVuc[i].id + ' .ngan' + item.dong + '-' + (item.cot + 1));
                    vt2.css("background-color", item.mausac);
                    vt2.addClass("hasItem");
                }

            }
        }

        $("#main_area").selectable(
            {
                filter: ".khuvuc-container",
                stop: function (event, ui) {
                    var selectedEles = $(".khuvuc-container.ui-selected");
                    if (selectedEles.length) {
                        var priorityEle = $(selectedEles[0]);
                        if (selectedEles.length > 1) {
                            for (var i = 1; i < selectedEles.length; i++) {
                                var ele = $(selectedEles[i])
                                if ((priorityEle.offset().top + priorityEle.offset().left) > (ele.offset().top + ele.offset().left)) {
                                    priorityEle = ele;
                                }
                            }
                        }

                        //Detail (view 2)
                        for (var i in $scope.KhuVuc) {
                            if ($scope.KhuVuc[i].id == priorityEle.attr('id')) {
                                var quayke = renderKeDetail($scope.KhuVuc[i].slKe, $scope.KhuVuc[i].slNgan
                                    , $scope.KhuVuc[i].ktNgan, $scope.KhuVuc[i].slDong, $scope.KhuVuc[i].items);
                                $("#detail_area").html(quayke);
                                for (var j in $scope.KhuVuc[i].items) {
                                    var item = $scope.KhuVuc[i].items[j];

                                    var vt1 = $('#detail_area .ngan' + item.dong + '-' + item.cot);
                                    vt1.css("background-color", item.mausac);
                                    var _class = "hasItem " + ($scope.KhuVuc[i].items[j].kthuoc == 2)?" item-head":"";
                                    vt1.addClass(_class);
                                    if ($scope.KhuVuc[i].items[j].kthuoc == 2) {
                                        var vt2 =  $('#detail_area .ngan' + item.dong + '-' + (item.cot + 1));
                                        vt2.css("background-color", item.mausac);
                                        vt2.addClass("hasItem item-tail");
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        );

        $(".khuvuc-container").draggable({
            create: function (event, ui) {
                for (var i = 0; i < $scope.KhuVuc.length; i++) {
                    if ($scope.KhuVuc[i].id === $(this).attr('id')) {
                        $scope.KhuVuc[i].x = $(this).position().left;
                        $scope.KhuVuc[i].y = $(this).position().top;
                        $scope.KhuVuc[i].rotate = parseInt(getDeg(this));
                        break;
                    }
                }
            },
            stop: function (event, ui) {
                for (var i = 0; i < $scope.KhuVuc.length; i++) {
                    if ($scope.KhuVuc[i].id === $(this).attr('id')) {
                        $scope.KhuVuc[i].x = $(this).position().left;
                        $scope.KhuVuc[i].y = $(this).position().top;
                        $scope.KhuVuc[i].rotate = parseInt(getDeg(this));
                        break;
                    }
                }
            }
        });
    }
    setTimeout(function () {
        $scope.build();
        $scope.indextab = 2; 
    }, 1000)

    function renderKe(slKe, slNgan, ktNgan, slDong, kienHang) {
        var sd = 1;
        var slCot = slKe * slNgan * ktNgan;
        var content = '<table border="1" class="khuvuc" width="' + slCot * 15 + '">';
        while (sd <= slDong) {
            content = content + '<tr>';
            var sc = 1;
            while (sc <= slCot) {
                content = content + '<td class="ngan ngan' + sd + '-' + sc + '"></td>';
                sc++;
            }
            content = content + '</tr>';
            sd++;
        }
        content = content + '</table>';
        return content;
    }

    function renderKeDetail(slKe, slNgan, ktNgan, slDong, kienHang) {
        var sk = 1;
        var content = "";
        while (sk <= slKe) {
            var sd = 1;
            var slCot = slNgan * ktNgan;
            content = content + '<table border="1" class="ke ke'+sk+' inline"+ width="' + slCot * 50 + '">';
            while (sd <= slDong) {
                content = content + '<tr>';
                var sc = (sk-1)*slNgan*ktNgan + 1;
                //var sc = 1;
                while ( (sc - slCot*(sk-1)) <= slCot) {
                    content = content + '<td class="ngan ngan' + sd + '-' + sc + '"></td>';
                    sc++;
                }
                content = content + '</tr>';
                sd++;
            }
            content = content + '</table>';
            sk++;
        }    
        return content;
    }

    function getDeg(ele) {
        var obj = $(ele);
        var angle = 0;
        var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
        if (matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else {
            angle = 0;
        }
        return (angle < 0) ? angle + 360 : angle;
    }

}