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
                }]
        }];

    $scope.KhuVucList = {
        minRowsToShow: 10,
        enableSorting: false,
        data: $scope.KhuVuc,
        columnDefs: [
            {field: 'name', displayName: 'Ten KV', minWidth: 90, maxWidth: 160},
            {field: 'slKe', displayName: 'SL Ke', minWidth: 20, maxWidth: 70},
            {field: 'slNgan', displayName: 'SL Ngan', minWidth: 20, maxWidth: 70},
            {field: 'ktNgan', displayName: 'Kt Ngan', minWidth: 20, maxWidth: 70},
            {field: 'slDong', displayName: 'SL Hang', minWidth: 20, maxWidth: 70},
            {field: 'x', displayName: 'x', minWidth: 60, maxWidth: 120},
            {field: 'y', displayName: 'y', minWidth: 60, maxWidth: 120},
            {field: 'rotate', displayName: 'Xoay', minWidth: 50, maxWidth: 70},
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

        $(".khuvuc-container").click(function(e){
            console.log(2222,this,e);
            $scope.selectedTab = 1;
        })

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
    $scope.build();

    function renderKe(slKe, slNgan, ktNgan, slDong, kienHang) {
        var sd = 1;
        var slCot = slKe * slNgan * ktNgan;
        var a = '<table border="1" class="khuvuc" width="' + slCot * 15 + '">';
        while (sd <= slDong) {
            a = a + '<tr>';
            var sc = 1;
            while (sc <= slCot) {
                a = a + '<td class="ngan ngan' + sd + '-' + sc + '"></td>';
                sc++;
            }
            a = a + '</tr>';
            sd++;
        }
        a = a + '</table>';
        return a;
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

    var initialW, initialH;
    setTimeout(function(){
        $("#main_area").mousedown(function (e) {
            console.log('111111',e)
            $("#big-ghost").remove();
            $(".ghost-select").addClass("ghost-active");
            $(".ghost-select").css({
                'left': e.pageX,
                'top': e.pageY
            });

            initialW = e.pageX;
            initialH = e.pageY;

            $("#main_area").bind("mouseup", selectElementsPriority); //selectElements or selectElementsPriority
            $("#main_area").bind("mousemove", openSelector);

        });
    },2000)
    

    function selectElementsPriority(e) {
        $(document).unbind("mousemove", openSelector);
        $(document).unbind("mouseup", selectElementsPriority);
        var maxX = 0;
        var minX = 5000;
        var maxY = 0;
        var minY = 5000;
        var totalElements = 0;
        var elementArr = new Array();

        var priority = {
            ele: null,
            distance:  9007199254740992
        };//uu tien

        $(".elements").each(function () {
            var aElem = $(".ghost-select");
            var bElem = $(this);
            var result = doObjectsCollide(aElem, bElem);
            //tinh toan
            if (result && priority.distance > (bElem.offset().left + bElem.offset().top)) {
                priority = {
                    ele: bElem,
                    distance: bElem.offset().left + bElem.offset().top
                }
            }
        });

        if (priority.ele) {
            var bElem = priority.ele;
            $("#score>span").text(Number($("#score>span").text()) + 1);
            var aElemPos = bElem.offset();
            var bElemPos = bElem.offset();
            var aW = bElem.width();
            var aH = bElem.height();
            var bW = bElem.width();
            var bH = bElem.height();

            var parent = bElem.parent();

            if (bElem.css("left") === "auto" && bElem.css("top") === "auto") {
                bElem.css({
                    'left': parent.css('left'),
                    'top': parent.css('top')
                });
            }
            $("body").append("<div id='big-ghost' class='big-ghost' x='" + Number(aElemPos.top - 20) + "' y='" + Number(aElemPos.left - 10) + "'></div>");

            $("#big-ghost").css({
                'width': aW + 40,
                'height': aH + 20,
                'top': aElemPos.top - 10,
                'left': aElemPos.left - 20
            });
        }

        $(".ghost-select").removeClass("ghost-active");
        $(".ghost-select").width(0).height(0);

        ////////////////////////////////////////////////

    }

    function openSelector(e) {
        var w = Math.abs(initialW - e.pageX);
        var h = Math.abs(initialH - e.pageY);

        $(".ghost-select").css({
            'width': w,
            'height': h
        });
        if (e.pageX <= initialW && e.pageY >= initialH) {
            $(".ghost-select").css({
                'left': e.pageX
            });
        } else if (e.pageY <= initialH && e.pageX >= initialW) {
            $(".ghost-select").css({
                'top': e.pageY
            });
        } else if (e.pageY < initialH && e.pageX < initialW) {
            $(".ghost-select").css({
                'left': e.pageX,
                "top": e.pageY
            });
        }
    }


    function doObjectsCollide(a, b) { // a and b are your objects
        //console.log(a.offset().top,a.position().top, b.position().top, a.width(),a.height(), b.width(),b.height());
        var aTop = a.offset().top;
        var aLeft = a.offset().left;
        var bTop = b.offset().top;
        var bLeft = b.offset().left;

        return !(
            ((aTop + a.height()) < (bTop)) ||
            (aTop > (bTop + b.height())) ||
            ((aLeft + a.width()) < bLeft) ||
            (aLeft > (bLeft + b.width()))
        );
    }

    function checkMaxMinPos(a, b, aW, aH, bW, bH, maxX, minX, maxY, minY) {
        'use strict';

        if (a.left < b.left) {
            if (a.left < minX) {
                minX = a.left;
            }
        } else {
            if (b.left < minX) {
                minX = b.left;
            }
        }

        if (a.left + aW > b.left + bW) {
            if (a.left > maxX) {
                maxX = a.left + aW;
            }
        } else {
            if (b.left + bW > maxX) {
                maxX = b.left + bW;
            }
        }
        ////////////////////////////////
        if (a.top < b.top) {
            if (a.top < minY) {
                minY = a.top;
            }
        } else {
            if (b.top < minY) {
                minY = b.top;
            }
        }

        if (a.top + aH > b.top + bH) {
            if (a.top > maxY) {
                maxY = a.top + aH;
            }
        } else {
            if (b.top + bH > maxY) {
                maxY = b.top + bH;
            }
        }

        return {
            'maxX': maxX,
            'minX': minX,
            'maxY': maxY,
            'minY': minY
        };
    }

}