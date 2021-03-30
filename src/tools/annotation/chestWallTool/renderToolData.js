/*
 * ChestWallTool.renderToolData(event)
 */
import { paper } from 'paper';
import external from './../../../externalModules.js';
import { getToolState } from './../../../stateManagement/toolState.js';
import { getNewContext, draw } from './../../../drawing/index.js';
import drawHandles from './../../../drawing/drawHandles.js';
import getPixelSpacing from './../../../util/getPixelSpacing';

// // Won't work using es6 import...
// const Canvas2Svg = require('./canvas2svg');

export default function(evt) {
  const eventData = evt.detail;
  const { element, image } = eventData;

  const toolData = getToolState(evt.currentTarget, this.name);

  const canvas = element.querySelector('canvas.cornerstone-canvas');
  const context = getNewContext(canvas);

  const width = canvas.width;
  const height = canvas.height;

  const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

  // Check if there's any measurement data to render to continue
  if (!toolData || !toolData.data) {
    return;
  }

  const { data } = toolData;

  // Calculate the data measurements
  // haga hago los calculos que fueran necesarios para actualizar la tool...
  if (data.invalidated === true) {
    // if (data.longestDiameter && data.shortestDiameter) {
    //   this.throttledUpdateCachedStats(image, element, data);
    // } else {
    //   this.updateCachedStats(image, element, data);
    // }
  }

  draw(context, ctx => {
    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];
      const { handles, curve } = data;

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
        // handles.origin,
      ];

      paper.view.viewSize = new paper.Size(width, height);
      // console.log('curve: ', curve);

      let inner = curve.children[0];
      let outer = curve.children[1];

      handlesToDraw.forEach(el => {
        // path.segments[handlesToDraw.indexOf(el)].point = px2point(element, el);
        let index = handlesToDraw.indexOf(el);

        inner.segments[index].point = px2point(element, el);

        let offset = inner.getOffsetOf(inner.segments[index].point);
        let normal = inner.getNormalAt(offset);
        let pos = inner.segments[index].point.add(normal.multiply(20));
        outer.segments[index].point = pos;
      });

      let ja = curve.children[2];
      let jb = curve.children[3];

      ja.segments[0].point = inner.segments[0].point;
      ja.segments[1].point = outer.segments[0].point;
      // console.log(inner.segments);
      // console.log(inner.segments.length);
      jb.segments[0].point = inner.segments[inner.segments.length - 1].point;
      jb.segments[1].point = outer.segments[outer.segments.length - 1].point;

      if (this.configuration.drawHandles) {
        drawHandles(context, eventData, handlesToDraw, handleOptions);
      }

      // console.log(curve.children);
      curve.children.forEach(path => {
        path.smooth();
        // console.log(path);
      });

      paper.view.update();
      paper.project.activeLayer.scale(1.0 / rowPixelSpacing);
      window.chestWallToolSVG = paper.project.exportSVG({ bounds: 'content' }); //contextSVG.getSerializedSvg(true);
    }
  });

  function px2point(element, handle) {
    let p = external.cornerstone.pixelToCanvas(element, handle);
    return new paper.Point(p.x, p.y);
  }
}
