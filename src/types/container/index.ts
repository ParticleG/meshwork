import { Actor, Color, Engine, GraphicsGroup, Rectangle, vec } from 'excalibur';
import { GraphicsGrouping } from 'excalibur/build/dist/Graphics/GraphicsGroup';

import { EDGE_LENGTH } from 'constants/common';
import { BinaryPosition, HandlerResult } from 'types/common';
import {
  ModifyHandler,
  Frame,
  ModifyHandlerType,
  PositionedFace,
} from 'types/container/types';

export class FrameActor extends Actor {
  fieldSize: BinaryPosition;

  private _frame: Frame;
  private _modifyHandlersMap = new Map<ModifyHandlerType, ModifyHandler[]>([
    [ModifyHandlerType.AfterExtract, []],
    [ModifyHandlerType.AfterInsert, []],
    [ModifyHandlerType.BeforeExtract, []],
    [ModifyHandlerType.BeforeInsert, []],
  ]);

  constructor(fieldSize: BinaryPosition) {
    super({
      anchor: vec(0, 0),
      height: EDGE_LENGTH * fieldSize.y,
      width: EDGE_LENGTH * fieldSize.x,
    });
    this.fieldSize = fieldSize;

    this._frame = new Frame(fieldSize.x, fieldSize.y);
  }

  morphField(
    fieldSize: BinaryPosition,
    rearrangeRule: (context: FrameActor, fieldSize: BinaryPosition) => Frame,
  ) {
    this.fieldSize = fieldSize;

    this._frame = rearrangeRule(this, fieldSize);
  }

  addModifyHandler(
    handlerType: ModifyHandlerType,
    modifyHandler: ModifyHandler,
  ) {
    const handlers = this._modifyHandlersMap.get(handlerType);
    if (
      handlers &&
      !handlers.find((handler) => handler.id === modifyHandler.id)
    ) {
      handlers.push(modifyHandler);
      handlers.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.id < b.id ? -1 : 1;
        }
        return b.priority - a.priority;
      });
    }
  }

  extract(positions: BinaryPosition[]): PositionedFace[] {
    const extracted: PositionedFace[] = [];
    let handlerResult: HandlerResult = HandlerResult.Continue;
    let positionedFaces: PositionedFace[] = positions.map((position) => ({
      position,
      value: this._frame[position.x][position.y],
    }));
    for (const handler of this._modifyHandlersMap.get(
      ModifyHandlerType.BeforeExtract,
    ) ?? []) {
      handlerResult = handler.handle(this, positionedFaces);
      if (handlerResult === HandlerResult.Abort) {
        return extracted;
      } else if (handlerResult === HandlerResult.Break) {
        break;
      }
    }

    if (handlerResult !== HandlerResult.Skip) {
      positionedFaces.forEach(({ position: { x, y } }) => {
        extracted.push({
          position: { x, y },
          value: this._frame[x][y],
        });
        this._frame[x][y] = undefined;
      });
      positionedFaces = extracted;
    }

    for (const handler of this._modifyHandlersMap.get(
      ModifyHandlerType.AfterExtract,
    ) ?? []) {
      handlerResult = handler.handle(this, positionedFaces);
      if (handlerResult === HandlerResult.Abort) {
        return extracted;
      } else if (handlerResult === HandlerResult.Break) {
        break;
      }
    }

    return extracted;
  }

  insert(positionedFaces: PositionedFace[]) {
    let handlerResult: HandlerResult = HandlerResult.Continue;
    for (const handler of this._modifyHandlersMap.get(
      ModifyHandlerType.BeforeInsert,
    ) ?? []) {
      handlerResult = handler.handle(this, positionedFaces);
      if (handlerResult === HandlerResult.Abort) {
        return;
      } else if (handlerResult === HandlerResult.Break) {
        break;
      }
    }

    if (handlerResult !== HandlerResult.Skip) {
      positionedFaces.forEach(({ position: { x, y }, value }) => {
        this._frame[x][y] = value;
      });
    }

    for (const handler of this._modifyHandlersMap.get(
      ModifyHandlerType.AfterInsert,
    ) ?? []) {
      handlerResult = handler.handle(this, positionedFaces);
      if (handlerResult === HandlerResult.Abort) {
        return;
      } else if (handlerResult === HandlerResult.Break) {
        break;
      }
    }
  }

  removeModifyHandler(handlerType: ModifyHandlerType, id: string) {
    const handlers = this._modifyHandlersMap.get(handlerType);
    if (handlers) {
      const index = handlers.findIndex((handler) => handler.id === id);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  get size() {
    const { bottom, left, right, top } = this.graphics.bounds;
    return { height: bottom - top, width: right - left };
  }

  update(engine: Engine, delta: number) {
    this._updateGraphics();
    super.update(engine, delta);
  }

  private _updateGraphics() {
    const member: GraphicsGrouping[] = [
      {
        graphic: new Rectangle({
          color: Color.Transparent,
          strokeColor: Color.LightGray,
          lineWidth: EDGE_LENGTH * 0.15,
          height: this.height,
          width: this.width,
        }),
        offset: vec(0, 0),
      },
    ];
    const graphicsGroup = new GraphicsGroup({
      members: member.concat(
        this._frame.flatMap((column, columnIndex) =>
          column.flatMap((face, faceIndex) =>
            face
              ? {
                  graphic: face.sprite,
                  offset: vec(
                    columnIndex * face.width,
                    faceIndex * face.height,
                  ),
                }
              : [],
          ),
        ),
      ),
    });
    this.graphics.use(graphicsGroup);
  }
}
