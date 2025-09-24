import { HandlerResult } from 'types/common';
import { KeyEventType, KeyHandler } from 'types/InteractionManager/types';

const baseId = 'stacking.interaction';

const keyHoldHandlers: KeyHandler[] = [];
const keyPressHandlers: KeyHandler[] = [
  {
    id: `${baseId}.press`,
    handle: (event, currentPlayer) => {
      console.log(event, currentPlayer);
      return HandlerResult.Continue;
    },
    priority: 0,
  },
];
const keyReleaseHandlers: KeyHandler[] = [];

export const keyHandlers: Record<KeyEventType, KeyHandler[]> = {
  [KeyEventType.Hold]: keyHoldHandlers,
  [KeyEventType.Press]: keyPressHandlers,
  [KeyEventType.Release]: keyReleaseHandlers,
};
