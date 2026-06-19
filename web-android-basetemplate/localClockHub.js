// localClockHub.js
const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
console.log('🚀 Match Clock Local Hub running on ws://localhost:8080');

// Shared authoritative state
let isRunning = false;

wss.on('connection', (ws) => {
  console.log('📱 A device connected to the clock hub.');
  
  // Instantly sync newly connected devices with current status
  ws.send(JSON.stringify({ type: 'SYNC_STATE', isRunning }));

  ws.on('message', (message) => {
    try {
      const payload = JSON.parse(message);
      
      if (payload.type === 'TOGGLE_CLOCK') {
        isRunning = payload.isRunning !== undefined ? payload.isRunning : !isRunning;
        console.log(`⏱️ Clock Toggle Requested -> Running State: ${isRunning}`);
        
        // Broadcast state change immediately to all connected devices (Mobile and Laptop Scorer)
        const broadcastData = JSON.stringify({ type: 'CLOCK_UPDATE', isRunning });
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(broadcastData);
          }
        });
      }
    } catch (err) {
      console.error('Error handling websocket message:', err);
    }
  });

  ws.on('close', () => console.log('👋 Device disconnected.'));
});