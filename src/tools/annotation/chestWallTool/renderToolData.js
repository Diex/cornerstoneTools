/*
 * ChestWallTool.renderToolData(event)
 */

import { getToolState } from './../../../stateManagement/toolState.js';
import {
  getNewContext,
  draw,
  setShadow,
  drawLine,
} from './../../../drawing/index.js';
import drawHandles from './../../../drawing/drawHandles.js';

export default function(evt) {
  // console.log('ChestWallTool: renderToolData(evt)', evt);
  const eventData = evt.detail;
  const element = evt.detail.element;

  const toolData = getToolState(evt.currentTarget, this.name);

  const canvas = element.querySelector('canvas.cornerstone-canvas');
  const context = getNewContext(canvas);

  const width = canvas.width;
  const height = canvas.height;

  draw(context, ctx => {
    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      const handleOptions = {
        color: 'blue',
        handleRadius: 5,
        drawHandlesIfActive: this.configuration.drawHandlesOnHover,
        hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
      };

      //  Render Blue Handles
      if (this.configuration.drawHandles) {
        drawHandles(context, eventData, data.handles, handleOptions);
      }

      const lineOptions = {
        color: 'blue',
        lineWidth: 5,
      };

      drawLine(
        ctx,
        element,
        data.handles.blueCenter,
        data.handles.blueLeft,
        lineOptions
      );

      drawLine(
        ctx,
        element,
        data.handles.blueCenter,
        data.handles.blueRight,
        lineOptions
      );

      drawLine(
        ctx,
        element,
        data.handles.blueCenter,
        data.handles.blueTop,
        lineOptions
      );

      //  Render Red Handles
      handleOptions.color = 'red';
      lineOptions.color = 'red';

      drawLine(
        ctx,
        element,
        data.handles.redTopCenter,
        data.handles.redTopLeft,
        lineOptions
      );

      drawLine(
        ctx,
        element,
        data.handles.redTopCenter,
        data.handles.redTopRight,
        lineOptions
      );

      drawLine(
        ctx,
        element,
        data.handles.redBottomCenter,
        data.handles.redBottomLeft,
        lineOptions
      );

      drawLine(
        ctx,
        element,
        data.handles.redBottomCenter,
        data.handles.redBottomRight,
        lineOptions
      );
    }
  });
}
