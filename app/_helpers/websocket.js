const websocket = require('socket.io');

let io;

let socketOptions = {
    cors: {
        origin: '*',
    },
    transports: ['websocket'],
    secure: true,
}

const initWebSocket = (httpServer) => {
    io = websocket(httpServer, socketOptions);

    io.on('connection', socket => {
        console.log('--- new websocket connection: ' + socket.id);

        socket.on('disconnected', () => {
            console.log(`--- websocket ${socket.id} has disconnected.`);

            /* handle any cleanup here */
        });

        socket.on('ws-test', (data) => {
            console.log('--- websocket-test: ', data);
        });

    });
}

const webSocket = () => {
    return io;
}

module.exports = {
    initWebSocket,
    webSocket,
}
