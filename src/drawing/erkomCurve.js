import external from '../externalModules.js';
import path from './path.js';
var Victor = require('victor');
/**
 * Draw a line between `start` and `end`.
 *
 * @public
 * @method drawLine
 * @memberof Drawing
 *
 * @param {CanvasRenderingContext2D} context
 * @param {HTMLElement} element - The DOM Element to draw on
 * @param {Object} start - `{ x, y } in either pixel or canvas coordinates.
 * @param {Object} end - `{ x, y }` in either pixel or canvas coordinates.
 * @param {Object} options - See {@link path}
 * @param {String} [coordSystem='pixel'] - Can be "pixel" (default) or "canvas". The coordinate
 *     system of the points passed in to the function. If "pixel" then cornerstone.pixelToCanvas
 *     is used to transform the points from pixel to canvas coordinates.
 * @returns {undefined}
 */
export default function erkomCurve(
  context,
  element,
  pts,
  origin,
  options,
  coordSystem = 'pixel'
) {
  path(context, options, context => {
    let points = [];

    if (coordSystem === 'pixel') {
      for (let point of pts) {
        points.push(external.cornerstone.pixelToCanvas(element, point));
      }
    }

    let i;
    // outer path
    // move to the first point
    context.moveTo(points[0].x, points[0].y);
    for (i = 1; i < points.length - 2; i++) {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // curve through the last two points
    context.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );

    // inner path
    let width = 20;
    const neworigin = external.cornerstone.pixelToCanvas(element, origin);
    let oh = new Victor(neworigin.x, neworigin.y);

    // console.log(oh);
    points = [];
    if (coordSystem === 'pixel') {
      for (let point of pts) {
        const a = external.cornerstone.pixelToCanvas(element, point);

        // direction
        const av = new Victor(a.x, a.y);
        const ref = av
          .subtract(oh)
          .normalize()
          .multiplyScalar(width); //.normalize(); // pointing origin

        const to = new Victor(a.x, a.y).add(ref);

        points.push(to);
      }
    }

    // console.log(points);

    // move to the first point
    // console.log(points);
    context.moveTo(points[0].x, points[0].y);
    for (i = 1; i < points.length - 2; i++) {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // curve through the last two points
    context.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );

    context.moveTo(points[0].x, points[0].y);
    const a = external.cornerstone.pixelToCanvas(element, pts[0]);
    context.lineTo(a.x, a.y);

    context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    const b = external.cornerstone.pixelToCanvas(element, pts[pts.length - 1]);
    context.lineTo(b.x, b.y);
  });
}
