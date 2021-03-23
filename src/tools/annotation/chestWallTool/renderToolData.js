/*
 * ChestWallTool.renderToolData(event)
 */
import { paper } from 'paper';
import external from './../../../externalModules.js';
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
        handles.origin,
      ];

      paper.view.viewSize = new paper.Size(width, height);

      handlesToDraw.forEach(element => {
        element.path.position.x = element.x;
        element.path.position.y = element.y;
      });
      // if (!this.path) {
      //   this.path = new paper.Path({
      //     segments: [
      //       px2point(element, handles.left),
      //       px2point(element, handles.top),
      //       px2point(element, handles.right),
      //     ],
      //     center: [handles.origin.x, 0],
      //     strokeColor: 'red',
      //     strokeWidth: 2,
      //     fillColor: null,
      //   });

      //   new paper.Path.Circle({
      //     center: px2point(element, handles.top),
      //     radius: 10,
      //     fillColor: 'red',
      //   });

      //   new paper.Path.Circle({
      //     center: px2point(element, handles.origin),
      //     radius: 10,
      //     fillColor: 'red',
      //   });
      // }

      console.log(this.path);

      // let oxy = external.cornerstone.pixelToCanvas(element, handles.origin);
      // this.path.position = new paper.Point(oxy.x, oxy.y);
      paper.view.update();

      if (this.configuration.drawHandles) {
        drawHandles(context, eventData, handlesToDraw, handleOptions);
      }

      // drawHandles(context, eventData, handles.origin, handleOptions);

      // // Draw Main Line
      // lineOptions = {
      //   color: 'yellow',
      //   lineWidth: 2,
      // };

      // drawLine(ctx, element, handles.left, handles.origin, lineOptions);
      // // drawLine(contextSVG, element, handles.left, handles.origin, lineOptions);
      // drawLine(ctx, element, handles.right, handles.origin, lineOptions);
      // // drawLine(contextSVG, element, handles.right, handles.origin, lineOptions);
      // drawLine(ctx, element, handles.origin, handles.top, lineOptions);
      // // drawLine(contextSVG, element, handles.origin, handles.top, lineOptions);

      // // Draw Bezier Curve

      // let lineOptions = {
      //   color: 'red',
      //   lineWidth: 1,
      // };

      // erkomCurve(ctx, element, handlesToDraw, handles.origin, lineOptions);

      // // erkomCurve(
      // //   contextSVG,
      // //   element,
      // //   handlesToDraw,
      // //   handles.origin,
      // //   lineOptions,
      // //   ''
      // // );

      // window.chestWallToolSVG = contextSVG.getSerializedSvg(true);
    }
  });

  function px2point(element, handle) {
    let p = external.cornerstone.pixelToCanvas(element, handle);
    return new paper.Point(p.x, p.y);
  }
}
