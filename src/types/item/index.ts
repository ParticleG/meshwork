import {
  Actor,
  ActorArgs,
  BoundingBox,
  Circle,
  Color,
  Engine,
  Graphic,
  GraphicsGroup,
  Input,
  vec
} from 'excalibur';

import { EDGE_LENGTH } from 'constants/common';
import { BinaryPosition } from 'types/common';
import { RenderingFaces } from 'types/item/types';

export class FaceGroupActor extends Actor {
  position: BinaryPosition;

  private _boundingBox: BoundingBox;
  private _renderingFaces: RenderingFaces[];

  constructor(
    renderingFaces: RenderingFaces[],
    position: BinaryPosition,
    actorArgs?: ActorArgs
  ) {
    const xPositions = renderingFaces.map((face) => face.position.x);
    const yPositions = renderingFaces.map((face) => face.position.y);
    const boundingBox = new BoundingBox(
      Math.min(...xPositions),
      Math.min(...yPositions),
      Math.max(...xPositions),
      Math.max(...yPositions)
    );
    super({
      ...actorArgs,
      anchor: vec(0, 0),
      height: (boundingBox.bottom - boundingBox.top + 1) * EDGE_LENGTH,
      width: (boundingBox.right - boundingBox.left + 1) * EDGE_LENGTH
    });
    this.position = position;

    this._boundingBox = boundingBox;
    this._renderingFaces = renderingFaces;
  }

  move(position: BinaryPosition) {
    this.position = position;
    this._updateGraphics();
  }

  update(engine: Engine, delta: number) {
    if (
      engine.input.keyboard.isHeld(Input.Keys.A) &&
      this.position.x > -this._boundingBox.left
    ) {
      this.position.x -= 1;
    }
    if (
      engine.input.keyboard.isHeld(Input.Keys.D) &&
      this.position.x < 9 - this._boundingBox.right
    ) {
      this.position.x += 1;
    }
    if (
      engine.input.keyboard.isHeld(Input.Keys.S) &&
      this.position.y < 19 - this._boundingBox.bottom
    ) {
      this.position.y += 1;
    }
    this._updateGraphics();
    super.update(engine, delta);
  }

  private _updateGraphics() {
    const centerIndicatorRadius = EDGE_LENGTH * this.scale.x * 0.1;
    const graphicsGroup = new GraphicsGroup({
      members: this._renderingFaces
        .map(({ renderPosition, sprite }) => ({
          graphic: <Graphic>sprite,
          offset: vec(renderPosition.x, renderPosition.y)
        }))
        .concat([
          {
            graphic: <Graphic>new Circle({
              radius: centerIndicatorRadius,
              color: Color.White
            }),
            offset: vec(
              (EDGE_LENGTH * this.scale.x) / 2 - centerIndicatorRadius * 1.5,
              (EDGE_LENGTH * this.scale.y) / 2 - centerIndicatorRadius * 1.5
            )
          }
        ])
    });
    this.graphics.use(graphicsGroup);
    this.pos = vec(
      this.position.x * EDGE_LENGTH * this.scale.x,
      this.position.y * EDGE_LENGTH * this.scale.y
    );
  }
}
