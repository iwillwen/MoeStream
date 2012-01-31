var sio = require('socket.io');

module.exports = function (web) {
    var io = sio.listen(web.server);
    io.set('transports',
        [
          'websocket',
          'htmlfile',
          'xhr-polling'
        ]);
    web.set('io', io);
}
