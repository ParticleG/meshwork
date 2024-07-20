import { Actor, ActorArgs, GraphicsGroup, vec } from 'excalibur';

import { RenderingFaces } from 'types/item/types';

export class FaceGroupActor extends Actor {
  private _renderingFaces: RenderingFaces[];

  constructor(renderingFaces: RenderingFaces[], actorArgs?: ActorArgs) {
    super(actorArgs);
    this._renderingFaces = renderingFaces;

    this._updateGraphics();
  }

  private _updateGraphics() {
    const group = new GraphicsGroup({
      members: this._renderingFaces.map(({ renderPosition, sprite }) => {
        return {
          graphic: sprite,
          offset: vec(renderPosition.x, renderPosition.y),
        };
      }),
    });
    this.graphics.use(group);
  }
}
