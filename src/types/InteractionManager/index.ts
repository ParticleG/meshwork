import { KeyEvent } from 'excalibur';
import { KeyEventType, KeyHandler } from 'types/InteractionManager/types';
import { Player } from 'types/Player';
import { HandlerResult } from 'types/common';
import { InputHost } from 'excalibur/build/dist/Input/InputHost';

export class InteractionManager {
  private _currentPlayer: Player;
  private _players: Player[] = [];
  private _keyHandlerMap = new Map<KeyEventType, KeyHandler[]>();

  constructor(currentPlayer: Player, inputHost: InputHost) {
    this._currentPlayer = currentPlayer;
    inputHost.keyboard.on('press', (event) => {
      this._handleKeyEvent(KeyEventType.Press, event);
    });
    inputHost.keyboard.on('release', (event) => {
      this._handleKeyEvent(KeyEventType.Release, event);
    });
    inputHost.keyboard.on('hold', (event) => {
      this._handleKeyEvent(KeyEventType.Hold, event);
    });
    inputHost.gamepads.on('axis', (event) => {
      console.log(event);
    });
    inputHost.gamepads.on('button', (event) => {
      console.log(event);
    });
    inputHost.pointers.on('down', (event) => {
      console.log(event);
    });
    inputHost.pointers.on('move', (event) => {
      console.log(event);
    });
    inputHost.pointers.on('up', (event) => {
      console.log(event);
    });
    inputHost.pointers.on('wheel', (event) => {
      console.log(event);
    });
  }

  set currentPlayer(player: Player) {
    this._currentPlayer = player;
  }

  set players(players: Player[]) {
    this._players = players;
  }

  private _handleKeyEvent(keyEventType: KeyEventType, keyEvent: KeyEvent) {
    const handlers = this._keyHandlerMap.get(keyEventType);
    if (handlers) {
      let handlerResult: HandlerResult = HandlerResult.Continue;
      for (const handler of handlers) {
        handlerResult = handler.handle(
          keyEvent,
          this._currentPlayer,
          this._players,
        );
        if (handlerResult !== HandlerResult.Continue) {
          break;
        }
      }
    }
  }
}
