/*
 * ChestWallTool.renderToolData(event)
 */

import { getToolState } from './../../../stateManagement/toolState.js';
import {
  getNewContext,
  draw,
  drawLine,
  erkomCurve,
} from './../../../drawing/index.js';
import drawHandles from './../../../drawing/drawHandles.js';

// Won't work using es6 import...
const Canvas2Svg = require('./canvas2svg');

export default function(evt) {
  const eventData = evt.detail;
  const { element, image } = eventData;

  const toolData = getToolState(evt.currentTarget, this.name);

  const canvas = element.querySelector('canvas.cornerstone-canvas');
  const context = getNewContext(canvas);

  const width = canvas.width;
  const height = canvas.height;

  // SVG Context
  const contextSVG = new window.C2S(width, height);

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
        color: 'white',
        handleRadius: 10,
        drawHandlesIfActive: this.configuration.drawHandlesOnHover,
        hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
      };

      const handlesToDraw = [
        handles.left,
        handles.bottomLeft,
        handles.topLeft,
        handles.top,
        handles.topRight,
        handles.bottomRight,
        handles.right,
      ];

      if (this.configuration.drawHandles) {
        drawHandles(context, eventData, handlesToDraw, handleOptions);
      }

      drawHandles(context, eventData, handles.origin, handleOptions);
      drawHandles(contextSVG, eventData, handles.origin, handleOptions);

      // Draw Main Line
      lineOptions = {
        color: 'yellow',
        lineWidth: 2,
      };

      drawLine(ctx, element, handles.left, handles.origin, lineOptions);
      drawLine(contextSVG, element, handles.left, handles.origin, lineOptions);
      drawLine(ctx, element, handles.right, handles.origin, lineOptions);
      drawLine(contextSVG, element, handles.right, handles.origin, lineOptions);
      drawLine(ctx, element, handles.origin, handles.top, lineOptions);
      drawLine(contextSVG, element, handles.origin, handles.top, lineOptions);

      // Draw Bezier Curve

      let lineOptions = {
        color: 'red',
        lineWidth: 1,
      };

      erkomCurve(ctx, element, handlesToDraw, handles.origin, lineOptions);
      erkomCurve(
        contextSVG,
        element,
        handlesToDraw,
        handles.origin,
        lineOptions
      );

      window.chestWallToolSVG = contextSVG.getSerializedSvg(true);
    }
  });
}
