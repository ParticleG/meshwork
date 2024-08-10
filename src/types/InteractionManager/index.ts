import { KeyEvent } from 'excalibur';
import { KeyEventType, KeyHandler } from 'types/InteractionManager/types';
import { Player } from 'types/Player';
import { HandlerResult } from 'types/common';
import { InputHost } from 'excalibur/build/dist/Input/InputHost';

export class InteractionManager {
  private _currentPlayer: Player;
  private _players: Player[] = [];
  private _keyHandlerMap = new Map<KeyEventType, KeyHandler[]>(
    Object.values(KeyEventType).map((keyEventType) => [
      keyEventType,
      []
    ])
  );

  /**
   * Creates an instance of InteractionManager.
   * @param {Player} currentPlayer - The current player.
   * @param {InputHost} inputHost - The input host for handling input events.
   */
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

  /**
   * Registers key handlers for different key event types.
   *
   * @param {Record<KeyEventType, KeyHandler[]>} keyHandlers - An object where keys are key event types and values are arrays of key handlers.
   * @returns {Map<KeyEventType, KeyHandler[]>} - A map of duplicate key handlers that were not added because they already exist.
   */
  registerKeyHandlers(keyHandlers: Record<KeyEventType, KeyHandler[]>): Map<KeyEventType, KeyHandler[]> {
    const duplicateHandlers = new Map<KeyEventType, KeyHandler[]>(
      Object.values(KeyEventType).map((keyEventType) => [
        keyEventType,
        []
      ])
    );
    Object.values(KeyEventType).forEach((keyEventType) => {
      if (keyHandlers[keyEventType]?.length) {
        const handlers = this._keyHandlerMap.get(keyEventType) ?? [];
        for (const keyHandler of keyHandlers[keyEventType]) {
          const sameIdIndex = handlers.findIndex((handler) => handler.id === keyHandler.id);
          if (sameIdIndex !== -1) {
            duplicateHandlers.get(keyEventType)?.push(keyHandler);
          } else {
            handlers.push(keyHandler);
          }
        }
      }
    });
    return duplicateHandlers;
  }

  /**
   * Unregisters key handlers for different key event types.
   *
   * @param {Record<KeyEventType, KeyHandler[]>} keyHandlers - An object where keys are key event types and values are arrays of key handlers.
   * @returns {Map<KeyEventType, KeyHandler[]>} - A map of key handlers that were not found and thus not removed.
   */
  unregisterKeyHandlers(keyHandlers: Record<KeyEventType, KeyHandler[]>): Map<KeyEventType, KeyHandler[]> {
    const notFoundHandlers = new Map<KeyEventType, KeyHandler[]>(
      Object.values(KeyEventType).map((keyEventType) => [
        keyEventType,
        []
      ])
    );
    Object.values(KeyEventType).forEach((keyEventType) => {
      if (keyHandlers[keyEventType]?.length) {
        const handlers = this._keyHandlerMap.get(keyEventType) ?? [];
        for (const keyHandler of keyHandlers[keyEventType]) {
          const foundIndex = handlers.findIndex((handler) => handler.id === keyHandler.id);
          if (foundIndex !== -1) {
            handlers.splice(foundIndex, 1);
          } else {
            notFoundHandlers.get(keyEventType)?.push(keyHandler);
          }
        }
      }
    });
    return notFoundHandlers;
  }

  /**
   * Handles key events by invoking the appropriate key handlers.
   *
   * @param {KeyEventType} keyEventType - The type of key event.
   * @param {KeyEvent} keyEvent - The key event object.
   * @private
   */
  private _handleKeyEvent(keyEventType: KeyEventType, keyEvent: KeyEvent) {
    const handlers = this._keyHandlerMap.get(keyEventType);
    if (handlers) {
      let handlerResult: HandlerResult = HandlerResult.Continue;
      for (const handler of handlers) {
        handlerResult = handler.handle(
          keyEvent,
          this._currentPlayer,
          this._players
        );
        if (handlerResult !== HandlerResult.Continue) {
          break;
        }
      }
    }
  }
}
