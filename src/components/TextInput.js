import { Interface } from "../Interface.js";

export class TextInput extends Interface {
  constructor({
    text = "",
    placeholder = "Type here.",
    width = 250,
    height,
    maxCharacters = 10,
    ...options
  }) {
    super({ text, width, height, ...options });

    this.maxCharacters = maxCharacters;
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

    if (focusedElement === this) {
      const pastedText = input?.getAndResetClipboardData?.();

      if (input?.ctrlKey) {
        if (pastedText) {
          const cleanedText = pastedText.replace(/[^a-zA-Z0-9]/g, "");
          const remainingCharacters = this.maxCharacters - this.text.length;
          const textToAdd = cleanedText.substring(0, remainingCharacters);

          this.text += textToAdd;
          this.value = this.text;
        }
      } else if (input?.pressedKey) {
        if (input?.pressedKey === "Backspace") {
          this.text = this.text.slice(0, -1);
          this.value = this.text;
        } else if (
          /^[a-z0-9]$/i.test(input.pressedKey) &&
          this.text.length < this.maxCharacters
        ) {
          // only allow numbers and letters here
          this.text += input.pressedKey;
          this.value = this.text;
        }
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
