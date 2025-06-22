import { GameObject } from "./GameObject.js";

export class Scene extends GameObject {
  constructor() {
    super({});
  }

  stepEntry(delta, root) {
    super.stepEntry();

    const { input } = root;

    const mouseX = input?.mouse.x;
    const mouseY = input?.mouse.y;

    if (this.input?.wasClicked()) {
      const interactiveObjects = this.collectInterfaces() ?? [];

      for (const obj of interactiveObjects) {
        if (obj.containsPoint(mouseX, mouseY)) {
          obj.onClick?.();
          break;
        }
      }

      input?.resetClick();
    }
  }

  collectInterfaces() {
    const result = [];

    // todo: logic
    const collectSorted = (gameObject) => {
      if (!gameObject.children || gameObject.children.length == 0) return;
      const sorted = [...gameObject.children].sort(
        (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)
      );

      for (const child of sorted) {
        if (typeof child.containsPoint === "function") {
          result.push(child);
        }

        collectSorted(child);
      }
    };

    collectSorted(this);
    return result.reverse();
  }
}
