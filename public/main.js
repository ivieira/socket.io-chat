var socket = io();

// Adds a message to the messages and scrolls to the bottom
function addMessage (message) {
  $('#chat ul').append(message);
  $('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
}

// Whenever the server emits 'welcome', log it in the chat body
socket.on('welcome', function (data) {
  $('#chat-title').text('').append(data.room);
  addMessage('<li class="update">Welcome, you has joined the chat</li>');
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
  addMessage('<li class="update"><strong>' + data.name + '</strong> has joined the chat</li>');
});

// Whenever the server emits 'room changed', log it in the chat body
socket.on('room changed', function (data) {
  $('#chat-title').text('').append(data.room);
  addMessage('<li class="update">You moved to <strong>' + data.room + '</strong></li>');
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', function (data) {
  addMessage('<li class="update"><strong>' + data.name + '</strong> has left the chat!</li>');
});

// Whenever the server emits 'message sent', update the chat body
socket.on('message sent', function (data) {
  addMessage('<li><strong>Me: </strong>' + data.message + '</li>');
});

// Whenever the server emits 'message sent by user', update the chat body
socket.on('message sent by user', function (data) {
  addMessage('<li><strong>' + data.name +': </strong>' + data.message + '</li>');
});

$(function () {
  $('#form-welcome').submit(function () {
    var nickname = $('#nickname').val();
    var room = $('#room').val();
    socket.emit('join chat', {nickname: nickname, room: room});
    $('#welcome').hide();
    $('#chat-room').show();
    $('#message').focus();
    return false;
  });

  $('#form-send-message').submit(function () {
    var message = $('#message').val();
    socket.emit('send message', {message: message});
    $('#message').val('').focus();
    return false;
  });

  $('#form-change-room').submit(function () {
    var room = $('#room').val();
    socket.emit('change room', {room: room});
    $('#message').val('').focus();
    return false;
  });
});
