document.addEventListener('DOMContentLoaded', (e) => {
  const socketClient = io.connect(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`);

  // cache html
  const logContainer = document.getElementById('log-container');
  const submitButton = document.getElementById('button');
  const input = document.getElementById('input');
  const messageContainer = document.getElementById('message-container');

  const appendInfo = (message) => {
    const div = document.createElement('div')
    div.innerText = message;
    logContainer.appendChild(div);
  }
  
  socketClient.on('connect', () => {
    const socketInfo = `
    --- client socket connected ---
    id: ${socketClient.id}
    time: ${new Date()}
    -------------------`;

    appendInfo(socketInfo);
  });
  
  socketClient.on('disconnect', (reason) => {
    const socketInfo = `
    --- client socket disconnected ---
    id: ${socketClient.id}
    reason: ${reason}
    time: ${new Date()}
    -------------------`;

    appendInfo(socketInfo);
  });

  socketClient.on('message', (data) => {
    const { value, senderId } = data;

    const message = document.createElement('div');
    message.innerText = `
      senderId: ${senderId}
      message: ${value}`;

    messageContainer.appendChild(message);
  })

  submitButton.addEventListener('click', () => {
    const { value } = input;

    socketClient.emit('broadcast', {
      senderId: socketClient.id,
      value
    });
  })
});

