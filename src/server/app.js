import app from './configs/dependencies';
import connection from './configs/connection';
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

    socket.on('change_zone_view1',function(data){
        var _data = data;
        socket.broadcast.emit('change_zone_view1',_data);
    })
    socket.on('change_zone_view2',function(data){
        var _data = data;
        socket.broadcast.emit('change_zone_view2',_data);
    })

});