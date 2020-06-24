document.addEventListener('DOMContentLoaded', (e) => {
  const socketClient = io.connect(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`);

  const cachedHTML = {
    'logContainer': document.getElementById('log-container'),
    'submitButton': document.getElementById('button'),
    'input': document.getElementById('input'),
    'messageContainer': document.getElementById('message-container'),
  }

  const appendInfo = (message, container) => {
    const div = document.createElement('div')
    div.innerText = message;
    cachedHTML[container].appendChild(div);
  }

  const getRoom = () => {
    const params = new URLSearchParams(window.location.search);

    return params.get('room') ? params.get('room') : '1';
  }

  const joinRoom = () => {
    const room = getRoom();

    socketClient.emit('join', { room });
  }
  
  socketClient.on('connect', () => {
    const socketInfo = `
    --- MY client socket connected ---
    id: ${socketClient.id}
    time: ${new Date()}
    -------------------`;

    appendInfo(socketInfo, 'logContainer');
    joinRoom();
  });
  
  socketClient.on('disconnect', (reason) => {
    const socketInfo = `
    --- MY client socket disconnected ---
    id: ${socketClient.id}
    reason: ${reason}
    time: ${new Date()}
    -------------------`;

    appendInfo(socketInfo, 'logContainer');
  });

  socketClient.on('otherClientJoined', (data) => {
    const { joinedAt, room, socketId } = data;

    const socketInfo = `
    --- ANOTHER client socket joined ---
    id: ${socketId}
    room: ${room}
    time: ${new Date(joinedAt)}
    `

    appendInfo(socketInfo, 'logContainer');
  });

  socketClient.on('message', (data) => {
    const { value, senderId, sentAt } = data;

    const identifier = socketClient.id === senderId ? '(me)' : ''

    const socketInfo = `
      senderId: ${senderId} ${identifier}
      message: ${value}
      sentAt: ${new Date(sentAt)}
      `;

    appendInfo(socketInfo, 'messageContainer');
  })

  // manual
  cachedHTML['submitButton'].addEventListener('click', () => {
    const { value } = input;

    if (value === '') return;

    const room = getRoom();

    socketClient.emit('broadcast', {
      senderId: socketClient.id,
      room,
      sentAt: new Date(),
      value
    });

    input.value = '';
  });

  // keyboard
  cachedHTML['input'].addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      cachedHTML['submitButton'].click();
    }
  });
});

