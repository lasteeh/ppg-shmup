const os = require("os");
const http = require("http");
const WebSocket = require("ws");
const RoomManager = require("./RoomManager");

const originalLog = console.log;
console.log = (...args) => {
  const timestamp = new Date().toLocaleString();
  originalLog(`[${timestamp}]`, ...args);
};

const PORT = 7979;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Server active.");
});

const websocketServer = new WebSocket.Server({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  if (req.url !== "/ws") {
    socket.destroy();
  } else {
    websocketServer.handleUpgrade(req, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, req);
    });
  }
});

const roomManager = new RoomManager();

websocketServer.on("connection", (websocket) => {
  console.log("A client connected.");

  websocket.on("message", (message) => {
    let parsedMessage;

    try {
      parsedMessage = JSON.parse(message);
      console.log("Received:");
      console.log(parsedMessage);
    } catch (err) {
      websocket.send("Error: Invalid JSON.");
      return;
    }

    let result = { success: false, error: "Uknown command." };

    switch (parsedMessage.type) {
      case "join-room":
        result = roomManager.joinRoom(parsedMessage.code, websocket);
        break;

      case "create-room":
        const roomCode = roomManager.createRoom();
        console.log("Room created: ", roomCode);

        const roomCreateMessage = {
          type: "room-created",
          success: true,
          code: roomCode,
        };

        websocket.send(JSON.stringify(roomCreateMessage));
        console.log("Sent:");
        console.log(roomCreateMessage);

        result = roomManager.joinRoom(roomCode, websocket, true);
        break;

      case "start-game":
        result = roomManager.startGame(websocket);
        break;
    }

    if (!result) return;
    websocket.send(JSON.stringify(result));
    console.log("Sent:");
    console.log(result);
  });

  websocket.on("close", () => {
    roomManager.removePlayer(websocket);
    console.log("A client disconnected.");
  });
});

server.listen(PORT, () => {
  const interfaces = os.networkInterfaces();
  let ipAddress = "localhost"; // fallback

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
  }
  console.log("Listening at http://" + ipAddress + ":" + PORT + "/ws");
});
