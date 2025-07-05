const crypto = require("crypto");

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.socketToRoom = new Map();
    this.MAX_PLAYERS = 5;
  }

  generateRoomCode() {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  joinRoom(code, socket, isHost = false) {
    const room = this.rooms.get(code);

    if (!room)
      return { type: "room-joined", success: false, error: "Room not found." };
    if (room.players.length >= this.MAX_PLAYERS)
      return { type: "room-joined", success: false, error: "Room full." };
    if (room.isRunning)
      return {
        type: "room-joined",
        success: false,
        error: "Game already started.",
      };

    const playerNumber = room.players.length + 1;
    const player = {
      id: crypto.randomUUID(),
      name: `P${playerNumber}`,
      isHost: isHost,
      isFiring: false,
      socket,
    };

    room.players.push(player);
    this.socketToRoom.set(socket, code);

    // todo: broadcast player count updates here
    this.broadcastRoomUpdates(code);

    return {
      type: "room-joined",
      success: true,
      code: code,
      playerId: player.id,
      isHost: isHost,
    };
  }

  createRoom() {
    let code;

    do {
      code = this.generateRoomCode();
    } while (this.rooms.has(code));

    this.rooms.set(code, { players: [], isRunning: false });

    return code;
  }

  getRoom(code) {
    return this.rooms.get(code);
  }

  removePlayer(socket) {
    const roomCode = this.socketToRoom.get(socket);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (!room) return;

    const leavingPlayer = room.players.find((p) => p.socket === socket);
    if (!leavingPlayer) return;

    console.log(`Player left room ${roomCode}: `, {
      id: leavingPlayer.id,
      name: leavingPlayer.name,
      isHost: leavingPlayer.isHost,
    });

    if (leavingPlayer && leavingPlayer.isHost) {
      room.players.forEach((player) => {
        this.socketToRoom.delete(player.socket);

        // todo: broadcast delete room update here
        player.socket.close();
      });
      this.rooms.delete(roomCode);
      console.log(`Room ${roomCode} deleted. Host left.`);
    } else {
      room.players = room.players.filter((p) => p.socket !== socket);
      this.socketToRoom.delete(socket);

      if (room.isRunning) {
        this.broadcastPlayerLeft(room, leavingPlayer);
      }

      if (room.players.length === 0) {
        this.rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted. No players left.`);
      } else {
        this.broadcastRoomUpdates(roomCode);
      }
    }
  }

  startGame(socket) {
    const roomCode = this.socketToRoom.get(socket);
    if (!roomCode)
      return {
        type: "game-started",
        success: false,
        error: "Client is not in a room",
      };

    const room = this.rooms.get(roomCode);
    if (!room)
      return {
        type: "game-started",
        success: false,
        error: "Room does not exist.",
      };

    const player = room.players.find((p) => p.socket === socket);
    if (!player || !player.isHost)
      return {
        type: "game-started",
        success: false,
        error: "Client is not the host.",
      };

    room.isRunning = true;

    const positions = this.generateSpawnPoints(room.players.length);

    room.players.forEach((p, index) => {
      p.spawnPoint = positions[index];
    });

    const payload = {
      type: "game-started",
      success: true,
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        spawnPoint: p.spawnPoint,
      })),
    };

    const json = JSON.stringify(payload);

    for (const p of room.players) {
      p.socket.send(json);
    }

    console.log("Sent: ");
    console.log(payload);
    console.log("Game started: " + roomCode);

    return null;
  }

  broadcastRoomUpdates(code) {
    const room = this.rooms.get(code);
    if (!room) return;

    const playersWithoutSockets = room.players.map((player) => {
      const { socket, ...playersWithoutSocket } = player;
      return playersWithoutSocket;
    });

    for (const player of room.players) {
      player.socket?.send(
        JSON.stringify({ type: "room-update", players: playersWithoutSockets })
      );
    }

    console.log("Sent:");
    console.log(`Room ${code} players: `, playersWithoutSockets);
  }

  generateSpawnPoints(playerCount) {
    const positions = [];
    const spacing = 50;

    for (let i = 0; i < playerCount; i++) {
      positions.push({ x: (i % 3) * spacing, y: Math.floor(i / 3) * spacing });
    }

    return positions;
  }

  updatePlayerPosition(socket, position) {
    const roomCode = this.socketToRoom.get(socket);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.socket === socket);
    if (!player) return;

    player.position = position;
    console.log("Player position updated: ", player.id, player.position);
  }

  broadcastPlayerPosition(socket, id, position) {
    const roomCode = this.socketToRoom.get(socket);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (!room) return;

    const message = JSON.stringify({
      type: "player-moved",
      id,
      position,
    });

    for (const p of room.players) {
      if (p.socket !== socket) {
        p.socket.send(message);
      }
    }

    console.log("Sent: ");
    console.log(JSON.parse(message));
  }

  updatePlayerFiring(socket, isFiring) {
    const roomCode = this.socketToRoom.get(socket);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.socket === socket);
    if (!player) return;

    player.isFiring = isFiring;
    console.log("Player firing state updated: ", player.id, player.isFiring);
  }

  broadcastPlayerFiring(socket, id, isFiring) {
    const roomCode = this.socketToRoom.get(socket);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (!room) return;

    const message = JSON.stringify({
      type: "player-fired",
      id,
      isFiring,
    });

    for (const p of room.players) {
      if (p.socket !== socket) {
        p.socket.send(message);
      }
    }

    console.log("Sent: ");
    console.log(JSON.parse(message));
  }

  broadcastPlayerLeft(room, leavingPlayer) {
    const playerId = leavingPlayer.id;
    if (!playerId) return;

    const message = JSON.stringify({
      type: "player-left",
      id: playerId,
    });

    for (const player of room.players) {
      player.socket.send(message);
    }

    console.log("Sent: ");
    console.log(JSON.parse(message));
  }
}

module.exports = RoomManager;
