import external from '../externalModules.js';
import path from './path.js';

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
  options,
  coordSystem = 'pixel'
) {
  path(context, options, context => {
    let points = [];
    if (coordSystem === 'pixel') {
      // start = external.cornerstone.pixelToCanvas(element, start);
      // controlPointStart = external.cornerstone.pixelToCanvas(
      //   element,
      //   controlPointStart
      // );
      // controlPointEnd = external.cornerstone.pixelToCanvas(
      //   element,
      //   controlPointEnd
      // );
      // end = external.cornerstone.pixelToCanvas(element, end);

      for (let point of pts) {
        points.push(external.cornerstone.pixelToCanvas(element, point));
      }
      console.log(points);
    }

    let i;
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

    //   context.moveTo(start.x, start.y);
    //   context.bezierCurveTo(
    //     controlPointStart.x,
    //     controlPointStart.y,
    //     controlPointEnd.x,
    //     controlPointEnd.y,
    //     end.x,
    //     end.y
    //   );
  });
}
