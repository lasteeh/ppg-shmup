import { GameObject } from "../GameObject.js";

export class Scene extends GameObject {
  constructor() {
    super({});
  }

  stepEntry(delta, root) {
    super.stepEntry();

    const { input } = root;

    const mouseX = input?.mouse.x;
    const mouseY = input?.mouse.y;

    const interactiveObjects = this.collectInterfaces() ?? [];

    for (const obj of interactiveObjects) {
      const wasHovering = obj.isHovering ?? false;
      const isHovering = obj.containsPoint(mouseX, mouseY);

      if (wasHovering !== isHovering) {
        obj._dirty = true;
      }

      obj.isHovering = isHovering;

      if (isHovering) {
        if (!wasHovering) {
          obj.onHoverStart?.(delta, root);
        }

        obj.onHover?.(delta, root);

        if (this.input?.wasClicked()) {
          obj.onClick?.(delta, root);
          input?.resetClick();
        }
        break;
      } else if (wasHovering && !isHovering) {
        obj.onHoverEnd?.(delta, root);
      }
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
        if (typeof child.containsPoint !== "function") continue;

        result.push(child);
        collectSorted(child);
      }
    };

    collectSorted(this);
    return result.reverse();
  }
}
