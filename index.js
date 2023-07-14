const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketServerPort);
console.log("Server Listening on Port "+webSocketServerPort)

const wsServer = new webSocketServer({
    httpServer : server
});

const clients = {};

const getUniqueID = () => {
  const uniqueID = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return uniqueID() + uniqueID() + '-' + uniqueID();
};


wsServer.on('request', function(request){
    var clientUserID = getUniqueID();
    console.log("clientUserID", clientUserID)
    console.log((new Date()) + ' Received new connection ' + request.origin);
    const connection = request.accept(null, request.origin);
    clients[clientUserID] = connection;
    console.log("Connected : ", +clientUserID )

    connection.on('message', function(message){
        for(key in clients) {
            clients[key].send(message.utf8Data);
            console.log('sent Message to: ', clients[key])
        }
    })
})