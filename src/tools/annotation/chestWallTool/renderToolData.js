/*
 * ChestWallTool.renderToolData(event)
 */

import { getToolState } from './../../../stateManagement/toolState.js';
import {
  getNewContext,
  draw,
  setShadow,
  drawLine,
  drawRect,
  fillBox,
} from './../../../drawing/index.js';
import drawHandles from './../../../drawing/drawHandles.js';
import makerjs from 'makerjs';
import external from '../../../externalModules.js';

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
      // console.log('diex: >>>', toolData);

      const data = toolData.data[i];

      // console.log(data);

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
        // drawHandles(context, eventData, data.handles, handleOptions);
      }

      const lineOptions = {
        color: 'green',
        lineWidth: 5,
      };

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.blueCenter,
      //   data.handles.blueLeft,
      //   lineOptions
      // );

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.blueCenter,
      //   data.handles.blueRight,
      //   lineOptions
      // );

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.blueCenter,
      //   data.handles.blueTop,
      //   lineOptions
      // );

      // //  Render Red Handles
      // handleOptions.color = 'red';
      // lineOptions.color = 'red';

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.redTopCenter,
      //   data.handles.redTopLeft,
      //   lineOptions
      // );

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.redTopCenter,
      //   data.handles.redTopRight,
      //   lineOptions
      // );

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.redBottomCenter,
      //   data.handles.redBottomLeft,
      //   lineOptions
      // );

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.redBottomCenter,
      //   data.handles.redBottomRight,
      //   lineOptions
      // );

      /// Rendering SVG

      // blue temporal background
      // fillBox(
      //   ctx,
      //   { left: 0, top: 0, width: 800, height: 800 },
      //   'cornflowerblue'
      // );

      // Get Mouse Position
      const svgStart = external.cornerstone.pixelToCanvas(
        element,
        data.handles.blueCenter
      );

      // Rect SVG
      var rectSVGModel = new makerjs.models.Rectangle(100, 100);

      // Straight Face
      var renderOptions = {
        // origin: [svgStart.x, svgStart.y],
        annotate: false,
        // flow: { size: 8 },
        svgAttrs: {
          // id: 'drawing',
          // style: 'margin-left:' + 0 + 'px; margin-top:' + 0 + 'px',
          // stroke: 'white',
          // fill: 'white',
        },
        strokeWidth: 2 + 'px',
        // fontSize: 14 + 'px',
        scale: 1,
        fill: '#f00',
        stroke: '#fff',
        // useSvgPathOnly: false,
      };

      // SVG image
      const svgImage = makerjs.exporter.toSVG(rectSVGModel, renderOptions);
      // const svgImage = makerjs.exporter.toSVG(rectSVGModel);

      // const svgImage = makerjs.exporter.toSVG(rectSVGModel);

      var DOMURL = window.URL || window.webkitURL || window;

      var svg = new Blob([svgImage], { type: 'image/svg+xml' });
      var url = DOMURL.createObjectURL(svg);

      var img1 = new Image();
      img1.onload = function() {
        ctx.drawImage(img1, svgStart.x, svgStart.y);
        DOMURL.revokeObjectURL(url);
      };
      img1.src = url;
    }
  });
}
