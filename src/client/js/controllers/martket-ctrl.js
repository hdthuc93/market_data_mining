/**
 * Martket Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('MartketCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', MartketCtrl]);

function MartketCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {

    var _socket = null;
    _socket = io(window.location.host);

    _socket.io.on('connect_error', function (err) {
        console.log("socket can not connect to server: " + JSON.stringify(err));
    });
    _socket.on('disconnect', function () {
        console.log("*******disconnected to server.");
    });
    _socket.on("connect", function () {
        console.log("****** socket connected")
    });

    _socket.on("change_zone_view1", function (data) {
        var zone = data;
        for (var i in $scope.Zones) {
            if (zone.id == $scope.Zones[i].id) {
                $scope.Zones[i] = zone;
                $scope.renderView1();
                break;
            }
        }
    });

    _socket.on("change_item_view2", function (data) {
        var zone = data;console.log(zone,"change view 1");
        for (var i in $scope.Zones) {
            if (zone.id == $scope.Zones[i].id) {
                $scope.Zones[i] = zone;
                $scope.renderView1();
                if (zone.id == $("#detail_area").attr("zoneid")) {
                    //if View2 === khuvuc change content
                    renderView2(zone);
                }
                break;
            }
        }
    });

    function initModel() {
        $scope.data = {
            name: "",
            shelves: "",
            row: "",
            col: "",
            item: [],
            x_axis: 0,
            y_axis: 0
        };
        $scope.selectedTab = 0;
        $scope.cart = [];
        $scope.orderPrice = 0;
    }
    initModel();

    function getZoneList() {
        $http.get('/api/info', { params: {} }).then(function successCallBack(res) {
            $scope.Zones = res.data.data;
            $scope.zoneList.data = $scope.Zones;
            $scope.renderView1();
        }, function errorCallback() {
            helper.popup.info({ title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () { return; } })
        });
    }
    getZoneList();


    $scope.zoneList = {
        minRowsToShow: 10,
        enableSorting: false,
        rowHeight: 35,
        data: [],
        columnDefs: [
            { field: 'name', displayName: 'Khu Vực', minWidth: 90, maxWidth: 160 },
            { field: 'shelves', displayName: 'Số kệ', minWidth: 20, maxWidth: 70 },
            { field: 'col', displayName: 'Số ngăn', minWidth: 20, maxWidth: 70 },
            { field: 'row', displayName: 'Số Hàng', minWidth: 20, maxWidth: 70 },
            { field: 'x_axis', displayName: 'Tọa độ x', minWidth: 60, maxWidth: 120 },
            { field: 'y_axis', displayName: 'Tọa độ y', minWidth: 60, maxWidth: 120 },
            { field: 'radian', displayName: 'Xoay', minWidth: 50, maxWidth: 70 },
        ]
    }

    $scope.addShelve = function () {
        $scope.data = {
            name: "",
            shelves: "",
            row: "",
            col: "",
            item: [],
            x_axis: 0,
            y_axis: 0
        };

    }

    $scope.save = function () {
        if ($scope.martketForm.$invalid) {
            helper.popup.info({
                title: "Thông báo",
                message: "Vui lòng điền đầy đủ thông tin.",
                close: function () {
                    return;
                }
            });
            return;
        }
        var data = {
            id: $scope.data.id || null,
            name: $scope.data.name,
            shelves: $scope.data.shelves || 1,
            col: $scope.data.col || 1,
            row: $scope.data.row || 1,
            x: $scope.data.x_axis || 0,
            y: $scope.data.y_axis || 0,
            radian: $scope.data.radian || 0,
            items: $scope.data.items || []
        }

        if (!data.id) {
            //Thêm mới khu vực
            console.log("add new Khu vuc", data)
        }
    }

    //Render View 1
    $scope.renderView1 = function () {
        if (!$scope.Zones.length) {
            return;
        }
        var mainArea = $("#main_area");
        mainArea.empty();
        var contentHTML = "";
        for (var i in $scope.Zones) {
            var zone = $scope.Zones[i];
            var posX = (zone.x_axis) ? 'left:' + zone.x_axis + 'px;' : '';
            var posY = (zone.y_axis) ? 'top:' + zone.y_axis + 'px;' : '';
            var radian = (zone.radian) ? 'transform : radian(' + zone.radian + 'deg)' : '';
            var _style = ' style="position:absolute;' + posX + posY + radian + '" ';
            var _id = ' id=' + zone.id + ' ';
            var _class = ' class="khuvuc-container" ';
            var quayke = renderShelveView1(zone.shelves, zone.col, zone.row, zone.items);
            contentHTML += '<div ' + _id + _class + _style + ' >' + quayke + '</div>';
        }
        mainArea.html(contentHTML);

        for (var i in $scope.Zones) {
            for (var j in $scope.Zones[i].items) {
                var zone = $scope.Zones[i];
                var item = zone.items[j];

                var vt1 = $('#' + zone.id + ' .ngan' + item.row + '-' + item.col);
                vt1.css("background-color", item.color);
                vt1.addClass("has-item");
                if (item.size == 2) {
                    var vt2 = $('#' + zone.id + ' .ngan' + item.row + '-' + (parseInt(item.col) + 1));
                    vt2.css("background-color", item.color);
                    vt2.addClass("has-item");
                }
            }
        }

        //Chức năng thu phóng
        $("#main_area").panzoom();
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

        //Sự kiện tô chọn Khu vực để chọn sang View 2
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

                        //Thực hiện chọn Khu vực ưu tiên rồi hiện lên View 2
                        for (var i in $scope.Zones) {
                            if ($scope.Zones[i].id == priorityEle.attr('id')) {
                                var khuvuc = $scope.Zones[i];
                                renderView2(khuvuc);
                                break;
                            }
                        }
                    }
                }
            }
        );

        $(".khuvuc-container").draggable({
            create: function (event, ui) {
            },
            stop: function (event, ui) {
                console.log("Drag xong ne");
                for (var i = 0; i < $scope.Zones.length; i++) {
                    var zone = $scope.Zones[i];
                    if (zone.id == $(this).attr('id')) {
                        zone.x_axis = $(this).position().left;
                        zone.y_axis = $(this).position().top;
                        console.log("vi tri moi cua Khu vuc", $(this).position());
                        var newPos = $(this).position();
                        //saving to DB...
                        //After save to db success
                        _socket.emit("change_zone_view1", zone);
                        //zone.radian = parseInt(getDeg(this)); //hien tai, mac dinh la 0
                        break;
                    }
                }
            }
        });
    }

    //Render View 2
    function renderView2(khuvuc) {
        var shelves = khuvuc.shelves, col = khuvuc.col, row = khuvuc.row, items = khuvuc.items, name = khuvuc.id;
        var sk = 1;       
        
        //Thêm 2 button action và tên hàng
        var content = '<div id="control" class="control col-xs-12"><span style="border: none">Khu vực ' + name + ' </span><span id="remove" class="fa fa-trash"></span><span id="addtocart" class="fa fa-cart-plus"></span></div><table border="0" class="inline"+ width="' + slCot * 50 + '">';
        for (var i = 1; i <= row; i++) {
            content = content + '<tr><td class="ngan"><b>&nbsp;Hàng ' + i + '&nbsp;</b></td></tr>';
        }
        content = content + '</table>';

        //Thêm các kệ
        while (sk <= shelves) {
            var sd = 1;
            var slCot = col;
            content = content + '<table border="1" class="ke ke' + sk + ' inline"+ width="' + slCot * 50 + '">';
            while (sd <= row) {
                content = content + '<tr>';
                var sc = (sk - 1) * col + 1;
                //var sc = 1;
                while ((sc - slCot * (sk - 1)) <= slCot) {
                    content = content + '<td class="ngan ngan' + sd + '-' + sc + '" itemrow="' + sd + '" itemcol="' + sc + '"></td>';
                    sc++;
                }
                content = content + '</tr>';
                sd++;
            }
            content = content + '<tr><td class="text-center shelve-name" colspan="'+slCot+'">Kệ '+sk+'</td></tr></table>     ';
            sk++;
        }

        $("#detail_area").attr("zoneid", khuvuc.id).html(content);
        for (var j in khuvuc.items) {
            var item = khuvuc.items[j];
            fillItemView2(item);
        }

        setupView2();
    }

    //Render kệ trong View 1 
    function renderShelveView1(shelves, col, row, items) {
        var sd = 1;
        var slCot = shelves * col;
        var content = '<table border="1" class="khuvuc" width="' + slCot * 10 + '">';
        while (sd <= row) {
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

    //Tính góc xoay
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

    //Dựng các listener cho View 2
    function setupView2() {
        /*$("#sortable").sortable({
            //cancel: ".fixed"
        });*/

        $("#detail_area table.ke td.ngan div.item-head").draggable({
            snap: '#detail_area td.ngan, .remove',
            revert: true,//ve vi tri cu khi khong thuc hien dc
            drag: function (event, ui) {
            },
            start: function (event, ui) {
            },
            stop: function (event, ui) {
            }
        });

        //CHANGE ITEM POSITION
        $("#detail_area table.ke td.ngan").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) {
                var isChange = true;
                var item = $(ui.draggable);
                //Kiểm tra cho phép drop
                if (parseInt(item.attr('itemsize')) == 2) {
                    var tdTail = '#detail_area .ngan.ngan' + $(this).attr('itemrow') + '-' + (parseInt($(this).attr('itemcol')) + 1);
                    //TH1: item size=2 drop vào cuối dãy kệ
                    if (!$(tdTail).length) {
                        console.log("TH1")
                        isChange = false;
                    }
                    //TH2: item size=2 drop vào bên trái item khác && keo lui ben trai
                    if ($(tdTail).find("div").length) {
                        var dk1 = item.hasClass("item-head");
                        var dk2 = $(tdTail).attr("itemcol") !== item.parent().attr("itemcol");
                        if (dk1 && dk2) {
                            console.log("TH2")
                            isChange = false;
                        }
                    }
                }
                //Nếu item này kéo nằm lên item khác
                if ($(this).find("div").length) {
                    console.log("TH3");
                    isChange = false;
                }

                var items = [];
                if (isChange) {
                    $(this).append(item.css("position", "inherit"));

                    /*Thay đổi biến KhuVuc và Build lại*/
                    var itemList = $("#detail_area td div.item-head");
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
                }

                var khuvucChange = null;
                for (var i in $scope.Zones) {
                    if ($scope.Zones[i].id == $("#detail_area").attr("zoneid")) {
                        if (items.length) {
                            $scope.Zones[i].items = items;
                        }
                        khuvucChange = $scope.Zones[i];
                        renderView2(khuvucChange);
                        break;
                    }
                }console.log("1221SSSSSSSSS3334dddd",isChange);
                if (isChange) {
                    //Bắn socket thay đổi item ở view2
                    console.log("23SSSSSSSSSSSSS")
                    _socket.emit("change_item_view2", khuvucChange);
                    $scope.renderView1();
                }
            }
        });

        //REMOVE
        $("#detail_area #control #remove").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) {
                console.log("XOA NE");
                var item = $(ui.draggable);
                helper.popup.confirm({
                    title: "Xoá kiện hàng",
                    message: "Bạn có muốn xoá [" + item.attr("itemname") + "]?",
                    ok: function () {
                        for (var i in $scope.Zones) {
                            var zone = $scope.Zones[i];
                            if (zone.id == $("#detail_area").attr("zoneid")) {
                                for (var j in zone.items) {
                                    if (item.attr("itemid") == zone.items[j].id &&
                            parseInt(item.parent().attr('itemrow'))==parseInt(zone.items[j].row) &&
                            parseInt(item.parent().attr('itemcol'))==parseInt(zone.items[j].col)) {
                                        var _it = zone.items[j];
                                        $scope.Zones[i].items.splice(j, 1);
                                        renderView2(zone);
                                        $scope.renderView1();
                                        _socket.emit("change_item_view2", $scope.Zones[i]);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    },
                    cancel: function () {
                        return;
                    }
                })

            }
        });

        //ADD ITEM TO CART
        $("#detail_area #control #addtocart").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) {
                console.log("ADD CART NE", $scope.cart);
                var item = $(ui.draggable);
                for (var i in $scope.Zones) {
                    var zone = $scope.Zones[i];
                    if (zone.id == $("#detail_area").attr("zoneid")) {
                        for (var j in zone.items) {
                            if (item.attr("itemid") == zone.items[j].id &&
                            parseInt(item.parent().attr('itemrow'))==parseInt(zone.items[j].row) &&
                            parseInt(item.parent().attr('itemcol'))==parseInt(zone.items[j].col)){
                                var _it = zone.items[j];
                                _it.qty = 1;
                                if($scope.cart.length){
                                    $scope.orderPrice += parseFloat(_it.price);
                                    var isExist = false;
                                    for (var k in $scope.cart) {
                                        if($scope.cart[k].id==_it.id){
                                            $scope.cart[k].qty++;
                                            isExist = true;
                                            break;
                                        }
                                    }
                                    if(!isExist){
                                        $scope.cart.push(_it);
                                    }                                    
                                }
                                if(!$scope.cart.length){
                                    $scope.orderPrice += parseFloat(_it.price);
                                    $scope.cart.push(_it);
                                }

                                
                                
                                $scope.Zones[i].items.splice(j, 1);
                                _socket.emit("change_item_view2", $scope.Zones[i]);
                                renderView2(zone);
                                $scope.renderView1();
                                $scope.$apply();
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        });

    }

    //Fill Item trong View 2
    function fillItemView2(data) {
        var itemData = data;
        var $ele = $("#detail_area td[itemrow='" + itemData.row + "'][itemcol='" + itemData.col + "']");
        var item = document.createElement("DIV");
        $(item).css({ "background-color": itemData.color, "width": "100%", "height": "100%" })
            .attr("itemcolor", itemData.color)
            .attr("itemid", itemData.id)
            .attr("itemname", itemData.name)
            .attr("itemsize", itemData.size)
            .attr("itemprice", itemData.price)
            .addClass((parseInt(itemData.size) == 2) ? "item-head" : "item-head item-tail");
        $(item).append('<label class="item-info">'+itemData.name+'</label>');
        $ele.append(item);

        if (parseInt(itemData.size) == 2) {
            var $ele2 = $("#detail_area td[itemrow='" + itemData.row + "'][itemcol='" + (parseInt(itemData.col) + 1) + "']");
            var item = document.createElement("DIV");
            $(item).css({ "background-color": itemData.color, "width": "100%", "height": "100%" })
                .addClass("item-tail")
            $ele2.append(item);
        }
    }
}