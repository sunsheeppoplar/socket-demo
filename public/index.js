document.addEventListener('DOMContentLoaded', (e) => {
  const socketClient = io.connect(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`);
  
  const body = document.querySelector('body');
  console.log(body, 'body')
  
  const appendInfo = (message) => {
    const div = document.createElement('div')
    div.innerText = message;
    console.log(body, 'body')
    body.appendChild(div);
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
});

