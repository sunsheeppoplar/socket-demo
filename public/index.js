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
    const { value, senderId, sentAt } = data;

    const message = document.createElement('div');
    message.innerText = `
      senderId: ${senderId}
      message: ${value}
      sentAt: ${new Date(sentAt)}
      `;

    messageContainer.appendChild(message);
  })

  // manual
  submitButton.addEventListener('click', () => {
    const { value } = input;

    if (value === '') return;

    socketClient.emit('broadcast', {
      senderId: socketClient.id,
      sentAt: new Date(),
      value
    });

    input.value = '';
  });

  // keyboard
  input.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      submitButton.click();
    }
  });
});

