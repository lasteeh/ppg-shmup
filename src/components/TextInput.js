import { Interface } from "../Interface.js";

export class TextInput extends Interface {
  constructor({
    text = "",
    placeholder = "Type here.",
    width = 250,
    height,
    ...options
  }) {
    super({ text, width, height, ...options });

    this.height = height ?? this.fontSize + this.padding.y * 2;
    this.placeholder = placeholder;
    this.value = text;
    this.text = this.value === "" ? this.placeholder : this.value;
  }

  clear() {
    this.text = "";
    this.value = "";
  }

  step(delta, root) {
    const { input, focusedElement } = root;

    if (focusedElement !== this) {
      this.onBlur();
    }

    if (focusedElement === this && input?.pressedKey) {
      if (input?.pressedKey === "Backspace") {
        this.text = this.text.slice(0, -1);
        this.value = this.text;
      } else if (/^[a-z0-9]$/i.test(input.pressedKey)) {
        // only allow numbers and letters here
        this.text += input.pressedKey;
        this.value = this.text;
      }
    }

    input?.resetPressedKey();
  }

  onFocus(delta, root) {
    if (this.text === this.placeholder) {
      this.clear();
    } else {
      this.value = this.text;
    }
  }
  onBlur(delta, root) {
    if (this.text === "") {
      this.text = this.placeholder;
      this.value = "";
    }
  }
}
