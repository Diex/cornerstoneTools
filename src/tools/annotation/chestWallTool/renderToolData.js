/*
 * ChestWallTool.renderToolData(event)
 */

import { getToolState } from './../../../stateManagement/toolState.js';
import {
  getNewContext,
  draw,
  setShadow,
  drawLine,
  drawBezierCurve,
} from './../../../drawing/index.js';
import drawHandles from './../../../drawing/drawHandles.js';

export default function(evt) {
  const eventData = evt.detail;
  const { element, image } = eventData;

  const toolData = getToolState(evt.currentTarget, this.name);

  const canvas = element.querySelector('canvas.cornerstone-canvas');
  const context = getNewContext(canvas);

  const width = canvas.width;
  const height = canvas.height;

  // Check if there's any measurement data to render to continue
  if (!toolData || !toolData.data) {
    return;
  }

  const { data } = toolData;

  // Calculate the data measurements
  if (data.invalidated === true) {
    if (data.longestDiameter && data.shortestDiameter) {
      this.throttledUpdateCachedStats(image, element, data);
    } else {
      this.updateCachedStats(image, element, data);
    }
  }

  draw(context, ctx => {
    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];
      const { handles } = data;

      if (data.visible === false) {
        continue;
      }

      // Draw Handles

      const handleOptions = {
        color: 'blue',
        handleRadius: 10,
        drawHandlesIfActive: this.configuration.drawHandlesOnHover,
        hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
      };

      // Drawing handles connected to lines only
      const handlesDraw = [
        handles.left,
        handles.right,
        handles.topLeft,
        handles.topRight,
      ];

      if (this.configuration.drawHandles) {
        drawHandles(context, eventData, handlesDraw, handleOptions);
      }

      // Draw Lines and Bezier Curve

      lineOptions = {
        color: 'blue',
        lineWidth: 2,
      };

      drawLine(ctx, element, handles.left, handles.right, lineOptions);

      //  Render Red Handles
      lineOptions = {
        color: 'red',
        lineWidth: 2,
      };

      drawLine(ctx, element, handles.left, handles.topLeft, lineOptions);
      drawLine(ctx, element, handles.right, handles.topRight, lineOptions);

      // Draw Curves and Lines

      let lineOptions = {
        color: 'coral',
        lineWidth: 10,
      };

      drawBezierCurve(
        ctx,
        element,
        handles.left,
        handles.topLeft,
        handles.topRight,
        handles.right,
        lineOptions
      );
    }
  });
}
