import { Button } from "./src/Button.js";
import { GameLoop } from "./src/GameLoop.js";
import { Input } from "./src/Input.js";
import { Player } from "./src/Player.js";
import { Scene } from "./src/Scene.js";
import { Vector2 } from "./src/Vector2.js";

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const canvas = document.getElementById("game");
    if (!canvas) throw new Error("Canvas not found.");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const mapBounds = { width: canvas.width, height: canvas.height };
    const input = new Input(canvas, 1);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Context not found.");

    let activeScene;

    // initiate main menu scene
    const mainMenuScene = new Scene({ bounds: mapBounds });
    const hostButton = new Button({
      text: "Host Game",
      position: new Vector2(20, canvas.height * 0.9 - 40),
      input: input,
      context: ctx,
      onClick: (e) => console.log("clicked"),
    });
    const joinButton = new Button({
      text: "Join Game",
      position: new Vector2(20, canvas.height * 0.9),
      input: input,
      context: ctx,
      onClick: (e) => console.log("clicked"),
    });

    mainMenuScene.addChild(hostButton);
    mainMenuScene.addChild(joinButton);

    // initiate gameplay scene
    const gameScene = new Scene({ bounds: mapBounds });
    const player = new Player({ input: input });

    // add elements to gamescene
    gameScene.addChild(player);

    // activeScene = gameScene;
    activeScene = mainMenuScene;

    // define update gameloop
    const update = (delta) => {
      activeScene.stepEntry(delta, gameScene);
    };

    // define render gameloop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      activeScene.draw(ctx, 0, 0);
    };

    // start game
    const gameLoop = new GameLoop(update, draw);
    gameLoop.start();
  });
});
