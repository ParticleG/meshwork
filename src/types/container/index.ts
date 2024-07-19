import { Actor, GraphicsGroup, vec } from 'excalibur';

import {
  ModifyHandler,
  Frame,
  ModifyHandlerType,
  PositionedFace,
} from 'types/container/types';
import { BinaryPosition } from 'types/common';

export class FrameActor extends Actor {
  public column: number;
  public row: number;

  private _field: Frame;
  private _modifyHandlersMap = new Map<ModifyHandlerType, ModifyHandler[]>([
    [ModifyHandlerType.AfterExtract, []],
    [ModifyHandlerType.AfterInsert, []],
    [ModifyHandlerType.BeforeExtract, []],
    [ModifyHandlerType.BeforeInsert, []],
  ]);

  constructor(column: number, row: number) {
    super({
      anchor: vec(0, 0),
      height: 800,
      width: 800,
    });
    this.column = column;
    this.row = row;
    this._field = new Frame(column, row);
  }

  morphField(
    column: number,
    row: number,
    rearrangeRule: (context: FrameActor, column: number, row: number) => Frame,
  ) {
    this._field = rearrangeRule(this, column, row);
    this.column = column;
    this.row = row;
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
    let positionedFaces: PositionedFace[] = positions.map((position) => ({
      position,
      value: this._field[position.x][position.y],
    }));
    const beforeModifyHandlers = this._modifyHandlersMap.get(
      ModifyHandlerType.BeforeExtract,
    );
    if (beforeModifyHandlers) {
      for (const handler of beforeModifyHandlers) {
        const result = handler.handle(this, positionedFaces);
        if (!result) {
          break;
        }
        positionedFaces = result;
      }
    }

    const extracted = positionedFaces.map(({ position }) => ({
      position,
      value: this._field[position.x][position.y],
    }));

    positionedFaces = extracted;

    const afterModifyHandlers = this._modifyHandlersMap.get(
      ModifyHandlerType.AfterExtract,
    );
    if (afterModifyHandlers) {
      for (const handler of afterModifyHandlers) {
        const result = handler.handle(this, positionedFaces);
        if (!result) {
          break;
        }
        positionedFaces = result;
      }
    }

    this._updateGraphics();

    return extracted;
  }

  insert(positionedFaces: PositionedFace[]) {
    const beforeModifyHandlers = this._modifyHandlersMap.get(
      ModifyHandlerType.BeforeInsert,
    );
    if (beforeModifyHandlers) {
      for (const handler of beforeModifyHandlers) {
        const result = handler.handle(this, positionedFaces);
        if (!result) {
          break;
        }
        positionedFaces = result;
      }
    }

    positionedFaces.forEach(({ position: { x, y }, value }) => {
      this._field[x][y] = value;
    });

    const afterModifyHandlers = this._modifyHandlersMap.get(
      ModifyHandlerType.AfterInsert,
    );
    if (afterModifyHandlers) {
      for (const handler of afterModifyHandlers) {
        const result = handler.handle(this, positionedFaces);
        if (!result) {
          break;
        }
        positionedFaces = result;
      }
    }

    this._updateGraphics();
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

  private _updateGraphics() {
    const members = this._field.flatMap((column, i) =>
      column.flatMap((face, j) =>
        face
          ? {
              graphic: face.sprite,
              offset: vec(i * face.width, j * face.height),
            }
          : [],
      ),
    );
    this.graphics.use(new GraphicsGroup({ members }));
  }
}
