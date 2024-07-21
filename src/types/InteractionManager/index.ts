import { KeyEvent } from 'excalibur';
import { KeyEventType, KeyHandler } from 'types/InteractionManager/types';
import { Player } from 'types/Player';

export class InteractionManager {
  private _keyPressHandlerMap = new Map<KeyEventType, KeyHandler[]>();

  constructor() {}

  handleKeyEvent(
    keyEventType: KeyEventType,
    keyEvent: KeyEvent,
    currentPlayer: Player,
    players: Player[],
  ) {
    const handlers = this._keyPressHandlerMap.get(keyEventType);
    if (handlers) {
      for (const handler of handlers) {
        switch (handler.handle(keyEvent, currentPlayer, players)) {
        }
      }
    }
  }
}
