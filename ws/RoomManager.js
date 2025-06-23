const crypto = require("crypto");

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  joinRoom(code, socket) {
    const room = this.rooms.get(code);

    if (!room)
      return { type: "room-joined", success: false, error: "Room not found." };
  }
}

module.exports = RoomManager;
