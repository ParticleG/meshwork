import { KeyEvent } from 'excalibur';

import { HandlerBase } from 'types/common';
import { Player } from 'types/Player';

export enum KeyEventType {
  Hold = 'Hold',
  Press = 'Press',
  Release = 'Release',
}

export type KeyHandler = HandlerBase<[KeyEvent, Player, Player[]]>;

// export enum InteractionType {
//   Aim = 'Aim',
//   Flip = 'Flip',
//   Merge = 'Merge',
//   Move = 'Move',
//   Rotate = 'Rotate',
//   Split = 'Split',
//   Swap = 'Swap',
//   Switch = 'Switch',
//   UseProp = 'UseProp',
// }
//
// export enum FlipDirection {
//   Horizontal = 'Horizontal',
//   Vertical = 'Vertical',
// }
//
// export enum MoveDirection {
//   Down = 'Down',
//   Left = 'Left',
//   Right = 'Right',
//   Up = 'Up',
// }
//
// export enum RotateDirection {
//   Clockwise = 'Clockwise',
//   CounterClockwise = 'CounterClockwise',
//   Half = 'Half',
// }
//
// export interface AimInteraction {
//   type: InteractionType.Aim;
//   data: {
//     index: number;
//   };
// }
//
// export interface FlipInteraction {
//   type: InteractionType.Flip;
//   data: {
//     direction: FlipDirection;
//   };
// }
//
// export interface MergeInteraction {
//   type: InteractionType.Merge;
//   data: Record<string, never>;
// }
//
// export interface MoveInteraction {
//   type: InteractionType.Move;
//   data: {
//     direction: MoveDirection;
//   };
// }
//
// export interface RotateInteraction {
//   type: InteractionType.Rotate;
//   data: {
//     direction: RotateDirection;
//   };
// }
//
// export interface SplitInteraction {
//   type: InteractionType.Split;
//   data: Record<string, never>;
// }
//
// export interface SwapInteraction {
//   type: InteractionType.Swap;
//   data: {
//     index: number;
//   };
// }
//
// export interface SwitchInteraction {
//   type: InteractionType.Switch;
//   data: {
//     index: number;
//   };
// }
//
// export interface UsePropInteraction {
//   type: InteractionType.UseProp;
//   data: {
//     index: number;
//   };
// }
//
// export type Interaction =
//   | AimInteraction
//   | FlipInteraction
//   | MergeInteraction
//   | MoveInteraction
//   | RotateInteraction
//   | SplitInteraction
//   | SwapInteraction
//   | SwitchInteraction
//   | UsePropInteraction;
