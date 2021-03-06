import app from './configs/dependencies';
import connection from './configs/connection';
import areaCtrl from './controllers/area-controller'
import cellCtrl from './controllers/cell-controller'
var express = require('express');

var server = app.listen(connection.port, () => {
    console.log(`Server is running on port: ${connection.port}`);
});

var io = require('socket.io')(server);

app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {
    console.log('===== socket is connected =====');
    socket.on('disconnect', function () {
        console.log('===== Socket is disconnected =====');
    })
    //Nhận socket từ client A
    socket.on('change_zone_view1', function(data){
        var _data = data;
        //Bắn socket cho các client khác A
        socket.broadcast.emit('change_zone_view1',_data);
        areaCtrl.updateCoordinate(_data).then();

    })
    socket.on('change_item_view2', function(data){
        var _data = data;
        if(_data["Action"] == "ChangePos"){
            console.log(_data);
            //Cập nhật vị trí kiện hàng
            //...
            //Sau khi cập nhật thành công, Bắn socket cho các client khác A
            socket.broadcast.emit('change_item_view2',_data["Zone"]);
            cellCtrl.updatePosition(_data.ItemChange);
        }
    })

});