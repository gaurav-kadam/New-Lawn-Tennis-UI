// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const WebSocket = require('ws');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// -------------------------------------------------------------
// 🚀 INJECTED LOCAL WEBSOCKET SYNC SERVER FOR MATCH TIMER
// -------------------------------------------------------------
const PORT = 8082;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('📱 A device connected to the Match Sync Server');

  ws.on('message', (message) => {
    // Broadcast incoming timer payload to all OTHER connected devices
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ A device disconnected from the Match Sync Server');
  });
});

console.log(`\n🚀 Local Match Timer Sync Server running on port ${PORT}\n`);
// -------------------------------------------------------------

module.exports = config;