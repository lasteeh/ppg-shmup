export class GameLoop {
  constructor(update, render) {
    this.lastFrameTime = 0;
    this.accumulatedTime = 0;
    this.timeStep = 1000 / 60; // 60 frames per second;

    this.update = update;
    this.render = render;

    this.rafID = null;
    this.isRunning = false;
  }

  mainLoop = (timestamp) => {
    if (!this.isRunning) return;

    let deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.accumulatedTime += deltaTime;

    while (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep);
      this.accumulatedTime -= this.timeStep;
    }

    this.render();

    this.rafID = requestAnimationFrame(this.mainLoop);
  };

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.rafID = requestAnimationFrame(this.mainLoop);
  }

  stop() {
    if (this.rafID) cancelAnimationFrame(this.rafID);

    this.isRunning = false;
  }
}
