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
import BandClamp from './bar.js';
import getPixelSpacing from '../../../util/getPixelSpacing.js';
import zoomUtils from '../../../util/zoom/index.js';

const { correctShift, changeViewportScale } = zoomUtils;

export default function(evt) {
  const { element, image, viewport } = evt.detail;

  const toolData = getToolState(evt.currentTarget, this.name);

  const canvas = element.querySelector('canvas.cornerstone-canvas');
  const context = getNewContext(canvas);

  // Check if there's any measurement data to render to continue
  if (!toolData || !toolData.data) {
    return;
  }
  // Calculate the new scale factor based on how far the mouse has changed
  // const updatedViewport = changeViewportScale(viewport, 0, {
  //   minScale: 1,
  //   maxScale: 1,
  // });
  // external.cornerstone.setViewport(element, updatedViewport);

  const { rowPixelSpacing, colPixelSpacing } = 0.68; //getPixelSpacing(image);

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
      console.log('tooldata: >>>', toolData);
      const data = toolData.data[i];

      // if (data.visible === false) {
      //   continue;
      // }

      const handleOptions = {
        color: 'white',
        handleRadius: 5,
        drawHandlesIfActive: this.configuration.drawHandlesOnHover,
        hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
      };

      if (this.configuration.drawHandles) {
        // drawHandles(context, eventData, data.handles, handleOptions);
      }

      // Get Mouse Position
      const svgStart = external.cornerstone.pixelToCanvas(
        element,
        data.handles.blueCenter
      );

      // Rect SVG
      var radius = (50 * 100) / 150;
      var rectSVGModel = BandClamp(50, 10, 1, 1, 60, 90, 12, 12);

      // var rectSVGModel = new makerjs.models.Square(100 * rowPixelSpacing);
      rectSVGModel.units = makerjs.unitType.Millimeter;
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
      const svgmodel = makerjs.exporter.toSVG(rectSVGModel, renderOptions);

      // document.write(svgmodel);
      // https://developer.mozilla.org/en-US/docs/Web/API/URL
      var URL = window.URL || window.webkitURL || window;

      var svg = new Blob([svgmodel], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(svg);

      // let path = new Path2D(svgmodel);
      // ctx.fillStyle = 'green';
      // ctx.fill(path);

      // https://stackoverflow.com/questions/3768565/drawing-an-svg-file-on-a-html5-canvas
      var render = new Image();
      render.onload = function() {
        ctx.drawImage(render, svgStart.x, svgStart.y);
        URL.revokeObjectURL(url);
      };
      render.src = url;
    }
  });
}
