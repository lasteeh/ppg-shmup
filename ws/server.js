const os = require("os");
const http = require("http");
const WebSocket = require("ws");

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

websocketServer.on("connection", (websocket) => {
  console.log("A client connected.");

  websocket.on("message", (message) => {
    let parsedMessage;

    try {
      parsedMessage = JSON.parse(message);
      console.log("\n");
      console.log("Received: \n");
      console.log(message);
    } catch (err) {
      websocket.send("Error: Invalid JSON.");
      return;
    }
  });

  websocket.on("close", () => {
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
