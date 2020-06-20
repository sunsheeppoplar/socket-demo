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
})

socketServer.on('connection', (socket) => {
  const logMessages = `
  id: ${socket.id}
  pid: ${process.pid}`

  console.log(`=== server socket connected === ${logMessages}`)
})

server.listen(port, () => console.log(`listening on port ${port}`));
