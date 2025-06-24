import { Button } from "../../components/Button.js";
import { Container } from "../../components/Container.js";
import { Dialog } from "../../components/containers/Dialog.js";
import { Scene } from "../../components/Scene.js";
import { TextInput } from "../../components/TextInput.js";
import { Vector2 } from "../../Vector2.js";

export class MainMenu extends Scene {
  constructor(game) {
    super({});
    if (!game) throw new Error("Game not found.");

    this.game = game;
    this.attach("input", game.input);

    this.hostButton = null;
    this.joinButton = null;

    this.joinDialog = null;
    this.roomCodeInput = null;
    this.cancelJoinButton = null;
    this.submitJoinButton = null;
    this.clearInputButton = null;
  }

  init() {
    const game = this.game;

    this.hostButton = new Button({
      text: "Host Game",
      width: 120,
      position: new Vector2(20, 20),
      onClick: async () => {
        if (game.isLoading) return;

        game.load(true);

        const message = JSON.stringify({
          type: "create-room",
        });

        try {
          const socket = await game.connectSocket();

          if (socket && socket.readyState == WebSocket.OPEN) {
            const lobbyScene = game.getScene("lobby");
            lobbyScene.attach(socket);

            // send create room request here
            socket.send(message);
          }
        } catch (err) {
          alert(err);
          game.load(false);
        }
      },
    });

    this.joinButton = new Button({
      text: "Join Game",
      width: 120,
      position: new Vector2(20, 50),
      onClick: () => {
        const joinDialog = this.joinDialog;
        if (!joinDialog) return;

        if (joinDialog.hidden) {
          joinDialog.show();
        } else {
          joinDialog.hide();
        }
      },
    });

    this.joinDialog = new Dialog({
      position: new Vector2(game.gameWidth / 3, game.gameHeight / 3),
      backgroundColor: "white",
      padding: new Vector2(10, 10),
      flexDirection: "column",
      gap: 10,
    });

    this.roomCodeInput = new TextInput({
      backgroundColor: "lightgray",
      placeholder: "Enter Room Code",
      fontSize: 24,
      padding: new Vector2(6, 6),
    });

    const joinDialogActions = new Container({
      gap: 20,
    });

    this.cancelJoinButton = new Button({
      text: "Cancel",
      onClick: () => {
        const joinDialog = this.joinDialog;
        if (!joinDialog) return;

        joinDialog.hide();
      },
    });

    this.submitJoinButton = new Button({
      text: "Submit",
      onClick: async () => {
        if (game.isLoading) return;

        game.load(true);

        try {
          const roomCodeInput = this.roomCodeInput;
          if (!roomCodeInput) return;

          game.roomCode = roomCodeInput.value;
          const message = JSON.stringify({
            type: "join-room",
            code: game.roomCode,
          });

          if (!game.roomCode || game.roomCode === "")
            throw new Error("Room code is empty.");

          const socket = await game.connectSocket();

          if (socket && socket.readyState == WebSocket.OPEN) {
            const lobbyScene = game.getScene("lobby");
            lobbyScene.attach(socket);

            // submit room code here
            socket.send(message);
          }
        } catch (err) {
          alert(err);
          game.load(false);
        }
      },
    });

    this.clearInputButton = new Button({
      text: "Clear",
      onClick: () => {
        const roomCodeInput = this.roomCodeInput;
        if (!roomCodeInput) return;

        roomCodeInput.clear();
      },
    });

    joinDialogActions.addChild(this.submitJoinButton);
    joinDialogActions.addChild(this.clearInputButton);
    joinDialogActions.addChild(this.cancelJoinButton);

    this.joinDialog.addChild(this.roomCodeInput);
    this.joinDialog.addChild(joinDialogActions);

    this.addChild(this.hostButton);
    this.addChild(this.joinButton);
    this.addChild(this.joinDialog);
  }
}
