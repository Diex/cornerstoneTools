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
  console.log(data);

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
        color: 'white',
        handleRadius: 10,
        drawHandlesIfActive: this.configuration.drawHandlesOnHover,
        hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
      };

      const handlesToDraw = [
        handles.origin,
        handles.top,
        handles.left,
        handles.right,
        handles.controlLeft,
        handles.controlRight,
      ];

      if (this.configuration.drawHandles) {
        drawHandles(context, eventData, handlesToDraw, handleOptions);
      }

      // Draw Main Line
      lineOptions = {
        color: 'yellow',
        lineWidth: 2,
      };

      drawLine(ctx, element, handles.left, handles.origin, lineOptions);
      drawLine(ctx, element, handles.right, handles.origin, lineOptions);
      drawLine(ctx, element, handles.origin, handles.top, lineOptions);

      //  Draw Control Handles
      lineOptions = {
        color: 'red',
        lineWidth: 2,
      };

      // drawLine(ctx, element, handles.left, handles.topLeft, lineOptions);
      // drawLine(ctx, element, handles.right, handles.topRight, lineOptions);

      // Draw Bezier Curve

      let lineOptions = {
        color: 'white',
        lineWidth: 1,
      };

      // start,
      // controlPointStart,
      // controlPointEnd,
      // end,
      drawBezierCurve(
        ctx,
        element,
        handles.left,
        handles.controlLeft,
        handles.controlLeft,
        handles.top,
        lineOptions
      );

      drawBezierCurve(
        ctx,
        element,
        handles.right,
        handles.controlRight,
        handles.controlRight,
        handles.top,
        lineOptions
      );
    }
  });
}
