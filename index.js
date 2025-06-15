import { GameLoop } from "./src/GameLoop.js";
import { GameObject } from "./src/GameObject.js";
import { Player } from "./src/Player.js";

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const canvas = document.getElementById("game");
    if (!canvas) throw new Error("Canvas not found.");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Context not found.");

    // initiate gameplay scene
    const gameScene = new GameObject({});
    const player = new Player({});

    gameScene.addChild(player);

    const update = (delta) => {
      gameScene.stepEntry(delta, gameScene);
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gameScene.draw(ctx, 0, 0);
    };

    const gameLoop = new GameLoop(update, draw);
    gameLoop.start();
  });
});
