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

import HalfBandClamp from 'makerjs-half-band-clamp';

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

  function BandClamp(
    radius,
    band,
    tabWidth,
    tabHeight,
    gap,
    angle,
    roundFillet,
    capFillet
  ) {
    var half = new HalfBandClamp(radius, band, tabWidth, tabHeight, gap);

    function tryFillet(fName, pName1, pName2, value) {
      var fillet = makerjs.path.fillet(
        half.paths[pName1],
        half.paths[pName2],
        value
      );
      if (fillet) {
        half.paths[fName] = fillet;
      }
    }

    tryFillet('innerFillet', 'bandInner', 'tabInner', roundFillet);
    tryFillet('outerFillet', 'bandOuter', 'tabOuter', roundFillet);

    tryFillet('tabInnerFillet', 'tabInner', 'tabCap', capFillet);
    tryFillet('tabOuterFillet', 'tabOuter', 'tabCap', capFillet);

    makerjs.model.rotate(half, angle / 2);

    this.models = {
      top: half,
      bottom: makerjs.model.mirror(half, false, true),
    };

    return makerjs.model.combine(this.models.top, this.models.bottom);
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
        drawHandles(context, eventData, data.handles, handleOptions);
      }

      // const lineOptions = {
      //   color: 'green',
      //   lineWidth: 5,
      // };

      // drawLine(
      //   ctx,
      //   element,
      //   data.handles.blueCenter,
      //   data.handles.blueLeft,
      //   lineOptions
      // );

      // Get Mouse Position
      const svgStart = external.cornerstone.pixelToCanvas(
        element,
        data.handles.blueCenter
      );

      // var makerjs = require('makerjs');

      // Rect SVG
      // var rectSVGModel = new makerjs.models.Rectangle(100, 100);
      var rectSVGModel = BandClamp(100, 10, 20, 20, 20, 180, 12, 12);

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
