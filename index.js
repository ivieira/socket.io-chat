// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  var joined = false;

  // when the client emits 'join chat', this listens and executes
  socket.on('join chat', function (data) {
    if (joined) return;

    socket.username = data.nickname;
    socket.room = data.room;
    socket.join(socket.room);
    socket.emit('welcome', {room: socket.room});
    socket.to(socket.room).emit('user joined', {name: socket.username});

    joined = true;
  });

  // when the client emits 'send message', this listens and executes
  socket.on('send message', function (data) {
    socket.emit('message sent', {message: data.message});
    socket.to(socket.room).emit('message sent by user', {
      name: socket.username,
      message: data.message
    });
  });

  // when the client emits 'change room', this listens and executes
  socket.on('change room', function (data) {
    if (data.room === socket.room) return;

    socket.leave(socket.room);
    socket.to(socket.room).emit('user left', {name: socket.username});

    socket.join(data.room);
    socket.emit('room changed', {room: data.room});
    socket.to(data.room).emit('user joined', {name: socket.username});

    socket.room = data.room;
  });

  // when the user disconnects.. perfom this
  socket.on('disconnect', function () {
    if (joined) {
      socket.to(socket.room).emit('user left', {name: socket.username});
    }
  });
});

http.listen(3000, function () {
  console.log('Server listening at port 3000');
});
