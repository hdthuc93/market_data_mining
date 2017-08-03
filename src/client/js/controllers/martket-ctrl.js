/**
 * Martket Controller
 * Implement: Phong Nguyen
 */

angular.module('RDash')
    .controller('MartketCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', 'helper', MartketCtrl]);

function MartketCtrl($scope, $cookieStore, $http, $rootScope, $timeout, helper) {
    function initModel(){
        $scope.data = {
            name: "",
            shelves: "",
            row:"",
            col:"",
            item:[],
            x_axis:0,
            y_axis:0
        };
        $scope.selectedTab = 0;
        $scope.cart = [];
        $scope.orderPrice = 0;
    }
    initModel();

    function getZoneList(){
        $http.get('/api/info', { params: { } }).then(function successCallBack(res) {
            $scope.KhuVuc = res.data.data;
            $scope.zoneList.data = $scope.KhuVuc;
            $scope.renderView1();
        }, function errorCallback() {
            helper.popup.info({title: "Lỗi",message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.",close: function () { return;}})
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
            row:"",
            col:"",
            item:[],
            x_axis:0,
            y_axis:0
        };
         
    }

    $scope.save = function () {
        if($scope.martketForm.$invalid){
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
            id:$scope.data.id||null,
            name: $scope.data.name,
            shelves: $scope.data.shelves || 1,
            col: $scope.data.col || 1,
            row: $scope.data.row || 1,
            x: $scope.data.x_axis || 0,
            y: $scope.data.y_axis || 0,
            radian: $scope.data.radian||0,
            items: $scope.data.items||[]
        }
        
        if(!data.id){
            //add new
            console.log("add new Khu vuc", data)
        }
    }

    //Render View 1
    $scope.renderView1 = function () {
        if (!$scope.KhuVuc.length) {
            return;
        }
        var mainArea = $("#main_area");
        mainArea.empty();
        var contentHTML = "";
        for (var i in $scope.KhuVuc) {
            var kv = $scope.KhuVuc[i];
            var posX = (kv.x_axis) ? 'left:' + kv.x_axis + 'px;' : '';
            var posY = (kv.y_axis) ? 'top:' + kv.y_axis + 'px;' : '';
            var radian = (kv.radian) ? 'transform : radian(' + kv.radian + 'deg)' : '';
            var _style = ' style="position:absolute;' + posX + posY + radian + '" ';
            var _id = ' id=' + kv.id + ' ';
            var _class = ' class="khuvuc-container" ';
            var quayke = renderKe(kv.shelves, kv.col, kv.row, kv.items);
            contentHTML += '<div ' + _id + _class + _style + ' >' + quayke + '</div>';
        }
        mainArea.html(contentHTML);

        for (var i in $scope.KhuVuc) {
            for (var j in $scope.KhuVuc[i].items) {
                var kv = $scope.KhuVuc[i];
                var item = kv.items[j];

                var vt1 = $('#' + kv.id + ' .ngan' + item.row + '-' + item.col);
                vt1.css("background-color", item.color);
                vt1.addClass("has-item");
                if (item.size == 2) {
                    var vt2 = $('#' + kv.id + ' .ngan' + item.row + '-' + (parseInt(item.col) + 1));
                    vt2.css("background-color", item.color);
                    vt2.addClass("has-item");
                }
            }
        }

        //Thu Phong
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

        //Event select Zone to render view2
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
                for (var i = 0; i < $scope.KhuVuc.length; i++) {
                    var kv = $scope.KhuVuc[i];
                    if (kv.id === $(this).attr('id')) {
                        kv.x_axis = $(this).position().left;
                        kv.y_axis = $(this).position().top;
                        console.log("vi tri moi cua Khu vuc",$(this).position());
                        //kv.radian = parseInt(getDeg(this)); //hien tai, mac dinh la 0
                        //action Luu lai Khu vuc
                        break;
                    }
                }
            }
        });
    }

    //Render View 2
    function renderView2(khuvuc){
        var shelves = khuvuc.shelves, col= khuvuc.col, row= khuvuc.row, items= khuvuc.items;

        var sk = 1;
        var content = '<div id="control" class="control col-xs-12"><span id="remove" class="fa fa-trash"></span><span id="addtocart" class="fa fa-cart-plus"></span></div>';
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
            content = content + '</table>     ';
            sk++;
        }

        $("#detail_area").attr("kvid", khuvuc.id).html(content);
        for (var j in khuvuc.items) {
            var item = khuvuc.items[j];
            fillItem(item.id, item.name, item.row, item.col, item.size, item.color);
        }

        setupView2();
    }

    //Render Ke trong View 1
    function renderKe(shelves, col, row, items) {
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

    //Tinh toan xoay
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

    //Setup View2
    function setupView2() {
        /*$("#sortable").sortable({
            //cancel: ".fixed"
        });*/

        $("#detail_area table.ke td.ngan div.item-head").draggable({
            snap: '#detail_area td.ngan, .remove',
            revert: true,
            drag: function (event, ui) {
            },
            start: function (event, ui) {
            },
            stop: function (event, ui) { 
            }
        });
        

        $("#detail_area table.ke td.ngan").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) {
                var isChange = true;
                var item = $(ui.draggable);
                //Kiểm tra cho phép drop
                if(parseInt(item.attr('itemsize'))==2){
                    var tdTail = '#detail_area .ngan.ngan'+$(this).attr('itemrow')+'-'+(parseInt($(this).attr('itemcol'))+1);
                    //TH1: item size=2 drop vào cuối dãy kệ
                    if(!$(tdTail).length){
                        console.log("TH1")
                        isChange = false;
                    }
                    //TH2: item size=2 drop vào bên trái item khác && keo lui ben trai
                    if($(tdTail).find("div").length){
                        var dk1 = item.hasClass("item-head");
                        var dk2 = $(tdTail).attr("itemcol")!==item.parent().attr("itemcol");
                        if(dk1&&dk2){
                            console.log("TH2")
                            isChange = false;
                        }
                    }
                }
                //Nếu item này kéo nằm lên item khác
                if($(this).find("div").length){
                    console.log("TH3");          
                    isChange = false;
                }

                var items = [];
                if(isChange){
                    $(this).append(item.css("position", "inherit"));

                    /*Thay doi bien KhuVuc và Build lại*/
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

                for (var i in $scope.KhuVuc) {
                    if ($scope.KhuVuc[i].id == $("#detail_area").attr("kvid")) {
                        if(items.length){
                            $scope.KhuVuc[i].items =  items;
                        }
                        var khuvuc = $scope.KhuVuc[i];
                        renderView2(khuvuc);
                        break;
                    }
                }
                if(isChange){
                    //socket
                    console.log("ban socket co su thay doi");
                    $scope.renderView1();
                }
            }
        });

        $("#detail_area #control #remove").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) {
                console.log("XOA NE");
                var item = $(ui.draggable);
                helper.popup.confirm({
                    title: "Xoá kiện hàng",
                    message: "Bạn có muốn xoá ["+item.attr("itemname")+"]?",
                    ok: function () {
                        for (var i in $scope.KhuVuc) {
                            var kv = $scope.KhuVuc[i];
                            if (kv.id == $("#detail_area").attr("kvid")) {
                                for(var j in kv.items){
                                    if(item.attr("itemid")==kv.items[j].id){
                                        var _it = kv.items[j];
                                        $scope.KhuVuc[i].items.splice(j,1);
                                        renderView2(kv);
                                        $scope.renderView1();
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

        $("#detail_area #control #addtocart").droppable({
            accept: "td div.item-head",
            drop: function (event, ui) { 
                console.log("ADD CART NE", $scope.cart);
                var item = $(ui.draggable);
                for (var i in $scope.KhuVuc) {
                    var kv = $scope.KhuVuc[i];
                    if (kv.id == $("#detail_area").attr("kvid")) {
                        for(var j in kv.items){
                            if(item.attr("itemid")==kv.items[j].id){
                                var _it = kv.items[j];
                                $scope.cart.push(_it);
                                for(var k in $scope.cart){
                                    var price = ($scope.cart[k].price)?($scope.cart[k].price):0;
                                    $scope.orderPrice += parseFloat(price);
                                }
                                $scope.KhuVuc[i].items.splice(j,1);
                                renderView2(kv);
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

    //Build View2
    //Render View2
    function renderKeDetail(shelves, col, row, items) {
        var sk = 1;
        var content = "";
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
            content = content + '</table>     ';
            sk++;
        }
        return content;
    }
}