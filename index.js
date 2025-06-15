import { GameLoop } from "./src/GameLoop.js";
import { Player } from "./src/Player.js";
import { Scene } from "./src/Scene.js";

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const canvas = document.getElementById("game");
    if (!canvas) throw new Error("Canvas not found.");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Context not found.");

    // initiate gameplay scene
    const gameScene = new Scene({
      bounds: { width: canvas.width, height: canvas.height },
    });
    const player = new Player({});

    // add elements to gamescene
    gameScene.addChild(player);

    // define update gameloop
    const update = (delta) => {
      gameScene.stepEntry(delta, gameScene);
    };

    // define render gameloop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gameScene.draw(ctx, 0, 0);
    };

    // start game
    const gameLoop = new GameLoop(update, draw);
    gameLoop.start();
  });
});
