import app from './configs/dependencies';
import connection from './configs/connection';
var express = require('express');

var server = app.listen(connection.port, () => {
    console.log(`Server is running on port: ${connection.port}`);
});

app.use(express.static(__dirname + '/'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('===== socket is connected =====');
    socket.on('disconnect', function () {
        console.log('===== Socket is disconnected =====');
    })
    //Nhận socket từ client A
    socket.on('change_zone_view1',function(data){
        var _data = data;
        //Bắn socket cho các client khác A
        console.log("CHANGE VIEW 1");
        socket.broadcast.emit('change_zone_view1',_data);
    })
    socket.on('change_item_view2',function(data){
        var _data = data;
        console.log("CHANGE VIEW 2");
        socket.broadcast.emit('change_item_view2',_data);
    })

});