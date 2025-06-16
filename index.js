import { Game } from "./src/Game.js";

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const canvas = document.getElementById("game");
    if (!canvas) throw new Error("Canvas not found.");

    const game = new Game(canvas, 960, 540);
    game.init();
    game.start();
  });
});
