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
      socket,
    };

    room.players.push(player);
    this.socketToRoom.set(socket, code);

    // todo: broadcast player count updates here
    this.broadcastPlayerUpdates(code);

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

    console.log(`Player left room ${roomCode}: `, {
      id: leavingPlayer.id,
      name: leavingPlayer.name,
      isHost: leavingPlayer.isHost,
    });

    if (leavingPlayer && leavingPlayer.isHost) {
      room.players.forEach((player) => {
        this.socketToRoom.delete(player.socket);

        // todo: broadcast delete room update here
      });
      this.rooms.delete(roomCode);
      console.log(`Room ${roomCode} deleted. Host left.`);
    } else {
      room.players = room.players.filter((p) => p.socket !== socket);
      this.socketToRoom.delete(socket);

      if (room.players.length === 0) {
        this.rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted. No players left.`);
      }
    }
  }

  broadcastPlayerUpdates(code) {
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
}

module.exports = RoomManager;
