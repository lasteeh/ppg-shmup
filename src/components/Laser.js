import { GameObject } from "../GameObject.js";

export class Laser extends GameObject {
  constructor(player) {
    super({ position: player.position });

    this.player = player;
    this.width = 4;
    this.color = "red";
  }

  drawImage(ctx, x, y) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;

    ctx.beginPath();
    ctx.moveTo(
      this.player.position.x + this.player.frameSize / 2,
      this.player.position.y + this.player.frameSize / 2
    );
    ctx.lineTo(
      ctx.canvas.width,
      this.player.position.y + this.player.frameSize / 2
    );
    ctx.stroke();
  }
}
