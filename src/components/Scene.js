import { GameObject } from "../GameObject.js";

export class Scene extends GameObject {
  constructor() {
    super({});

    this.focusedElement = null;
  }

  setFocus(delta, root, element) {
    this.focusedElement?.onBlur?.(delta, root);
    this.focusedElement = element;
    this.focusedElement?.onFocus?.(delta, root);
  }

  clearFocus(delta, root, element) {
    this.focusedElement?.onBlur?.(delta, root);
    this.focusedElement = null;
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
        if (typeof child.containsPoint === "function") result.push(child);
        collectSorted(child);
      }
    };

    collectSorted(this);
    return result.reverse();
  }

  stepEntry(delta, root) {
    super.stepEntry(delta, root);

    const { input } = root;

    const mouseX = input?.mouse.x;
    const mouseY = input?.mouse.y;

    const interactiveObjects = this.collectInterfaces() ?? [];

    const wasClicked = this.input?.wasClicked();
    const clickX = input?.mouse.clickX;
    const clickY = input?.mouse.clickY;

    for (const obj of interactiveObjects) {
      const wasHovering = obj.isHovering ?? false;
      const isHovering = obj.containsPoint(mouseX, mouseY);
      const isTarget = obj.containsPoint(clickX, clickY);

      if (wasHovering !== isHovering) {
        obj._dirty = true;
      }

      obj.isHovering = isHovering;

      if (isHovering) {
        if (!wasHovering) {
          obj.onHoverStart?.(delta, root);
        }

        obj.onHover?.(delta, root);

        if (wasClicked && isTarget) {
          this.setFocus(delta, root, obj);
          obj.onClick?.(delta, root);
          input?.resetClick();
        }
        break;
      } else if (wasHovering && !isHovering) {
        obj.onHoverEnd?.(delta, root);
      }
    }

    if (
      wasClicked &&
      this.focusedElement &&
      !this.focusedElement.containsPoint(clickX, clickY)
    ) {
      this.clearFocus(delta, root); // clicked outside current focus
    }
  }
}
