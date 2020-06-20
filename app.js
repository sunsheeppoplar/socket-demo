const express = require('express');
const http = require('http');
const path = require('path');
const io = require('socket.io');

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const socketServer = io(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

router.get('/', (req, res) => {
    res.sendFile('index');
});

socketServer.on('connection', (socket) => {
  const socketInfo = `
    id: ${socket.id}
    pid: ${process.pid}
  `;

  console.log(`=== server socket CONNECTED === ${socketInfo}`);

  socket.on('disconnect', (reason) => {
    const socketInfo = `
    id: ${socket.id}
    pid: ${process.pid}
    reason: ${reason}`;

    console.log(`=== server socket DISCONNECTED === ${socketInfo}`);
  })

  socket.on('broadcast', (data) => {
    socket.broadcast.emit('message', data);
    console.log(`socket ${socket.id} emitted ${JSON.stringify(data)}`);
  })
});

server.listen(port, () => console.log(`listening on port ${port}`));
