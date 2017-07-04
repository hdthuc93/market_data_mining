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
            id: "kidtoy",
            name: "do choi KID",
            row: 1,
            col: 1,
            size: 2,
            color: "red"
        }, {
            id: "dochoi0",
            name: "do choi 0",
            row: 1,
            col: 3,
            size: 2,
            color: "orange"
        }, {
            id: "dochoi1",
            name: "do choi 1",
            row: 2,
            col: 1,
            size: 1,
            color: "green"
        }, {
            id: "dochoi2",
            name: "do choi 2",
            row: 5,
            col: 6,
            size: 2,
            color: "#333"
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
            id: "cachua",
            name: "ca chua",
            row: 4,
            col: 5,
            size: 2,
            color: "brown"
        }, {
            id: "dochoi",
            name: "do choi",
            row: 1,
            col: 3,
            size: 2,
            color: "orange"
        }, {
            id: "thenho",
            name: "the nho",
            row: 2,
            col: 1,
            size: 1,
            color: "green"
        }, {
            id: "cd",
            name: "dia CD",
            row: 5,
            col: 1,
            size: 1,
            color: "#d3d3d3"
        }, {
            id: "usb",
            name: "USB",
            row: 3,
            col: 2,
            size: 2,
            color: "violet"
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

                var vt1 = $('#' + $scope.KhuVuc[i].id + ' .ngan' + item.row + '-' + item.col);
                vt1.css("background-color", item.color);
                vt1.addClass("has-item");
                if ($scope.KhuVuc[i].items[j].size == 2) {
                    var vt2 = $('#' + $scope.KhuVuc[i].id + ' .ngan' + item.row + '-' + (item.col + 1));
                    vt2.css("background-color", item.color);
                    vt2.addClass("has-item");
                }

            }
        }

        //$("#main_area").panzoom();
        var ele = $("#main_area");
        ele.panzoom("destroy");
        $("#zoom-control").hide();
        var panZoom = null;
        $('#active-zoom').change(function () {
            if ($(this).is(":checked")) {
                $("#zoom-control").show();
                panZoom = ele.panzoom({
                    minScale: 0.5,
                    maxScale: 2,
                    $zoomRange: $("input[type='range'].zoom-range"),
                    $reset: $("button.reset-panzoom")
                });
            } else {
                $("#zoom-control").hide();
                ele.panzoom("reset").panzoom("destroy");
            }
        });

        ele.selectable(
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
                                var khuvuc = $scope.KhuVuc[i];
                                var quayke = renderKeDetail(khuvuc.slKe, khuvuc.slNgan
                                    , khuvuc.ktNgan, khuvuc.slDong, khuvuc.items);
                                $("#detail_area").attr("kvid", khuvuc.id).html(quayke);
                                for (var j in khuvuc.items) {
                                    var item = khuvuc.items[j];

                                    var ele = $('#detail_area .ngan' + item.row + '-' + item.col);
                                    fillItem(item.id, item.name, item.row, item.col, item.size, item.color);
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
        var content = '<table border="1" class="khuvuc" width="' + slCot * 10 + '">';
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
            content = content + '<table border="1" class="ke ke' + sk + ' inline"+ width="' + slCot * 50 + '">';
            while (sd <= slDong) {
                content = content + '<tr>';
                var sc = (sk - 1) * slNgan * ktNgan + 1;
                //var sc = 1;
                while ((sc - slCot * (sk - 1)) <= slCot) {
                    content = content + '<td class="ngan ngan' + sd + '-' + sc + '" itemrow="' + sd + '" itemcol="' + sc + '"></td>';
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

    $scope.setupView2 = function () {
        $("#sortable").sortable({
            //cancel: ".fixed"
        });

        var dragEleClass = null;

        $("#detail_area table.ke td.ngan:not(:has(>div))").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) {
                var item = $(ui.draggable)
                $(this).append(item.css("position", "inherit"));
            }
        });

        $("#detail_area table.ke td.ngan div.item-head").draggable({
            snap: '#detail_area td.ngan:not(:has(>div))',
            cursor: "move",
            drag: function (event, ui) {

            },
            stop: function (event, ui) {
                var itemList = $("#detail_area td div.item-head");
                var items = [];
                for (var i = 0; i < itemList.length; i++) {
                    var _it = {
                        id: $(itemList[i]).attr('itemid'),
                        name: $(itemList[i]).attr('itemname'),
                        row: $(itemList[i]).parent().attr('itemrow'),
                        col: $(itemList[i]).parent().attr('itemcol'),
                        size: $(itemList[i]).attr('itemsize'),
                        color: $(itemList[i]).attr('itemcolor')
                    }
                    items.push(_it);
                }
                //TEST*/
                for (var i in $scope.KhuVuc) {
                    if ($scope.KhuVuc[i].id == $("#detail_area").attr("kvid")) {
                        var khuvuc = $scope.KhuVuc[i];
                        khuvuc.items = items;
                        var quayke = renderKeDetail(khuvuc.slKe, khuvuc.slNgan
                            , khuvuc.ktNgan, khuvuc.slDong, khuvuc.items);
                        $("#detail_area").attr("kvid", khuvuc.id).html(quayke);
                        for (var j in khuvuc.items) {
                            var item = khuvuc.items[j];

                            var ele = $('#detail_area .ngan' + item.row + '-' + item.col);
                            fillItem(item.id, item.name, item.row, item.col, item.size, item.color);
                        }
                        break;
                    }
                }
            }
        });

    }

    function fillItem(id, name, row, col, size, color) {
        var $ele = $("#detail_area td[itemrow='" + row + "'][itemcol='" + col + "']");
        var item = document.createElement("DIV");
        $(item).css({ "background-color": color, "width": "100%", "height": "100%" })
            .attr("itemcolor", color)
            .attr("itemid", id)
            .attr("itemname", name)
            .attr("itemsize", size)
            .addClass((parseInt(size) == 2) ? "item-head" : "item-head item-tail");
        $ele.append(item);

        if (parseInt(size) == 2) {
            var $ele2 = $("#detail_area td[itemrow='" + row + "'][itemcol='" + (parseInt(col) + 1) + "']");
            var item = document.createElement("DIV");
            $(item).css({ "background-color": color, "width": "100%", "height": "100%" })
                .addClass("item-tail")
            $ele2.append(item);
        }
    }



}