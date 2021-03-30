import { getLogger } from '../../../util/logger.js';
import { paper } from 'paper';

const logger = getLogger('tools:annotation:ChestWallTool');
let index = -1;

const handleDistance = 200;

const topHandleX = handleDistance * 0.6;
const topHandleY = handleDistance * 0.8;

const bottomHandleX = handleDistance * 0.8;
const bottomHandleY = handleDistance * 0.4;

const getHandle = (x, y, name, extraAttributes = {}) => {
  index++;

  let point = new paper.Point(x, y);

  return Object.assign(
    {
      name,
      point,
      x,
      y,
      index,
      drawnIndependently: false,
      allowedOutsideImage: true,
      highlight: true,
      active: false,
    },
    extraAttributes
  );
};

const getPath = handles => {
  console.log(handles);
  let inner = new paper.Path();
  let outer = new paper.Path();

  let ja = new paper.Path();
  let jb = new paper.Path();

  inner.strokeColor = 'red';
  outer.strokeColor = 'red';
  ja.strokeColor = 'red';
  jb.strokeColor = 'red';
  let curve = new paper.Group([inner, outer, ja, jb]);

  Object.values(handles).forEach(el => {
    if (el.name == 'origin') return;
    inner.add(el.point);
  });

  inner.segments.forEach(segment => {
    // calculet offset for point
    let offset = inner.getOffsetOf(segment.point);
    // console.log('offset:', offset);
    // calculate normal
    let normal = inner.getNormalAt(offset);
    // console.log('normal:', normal);
    // displace
    let pos = segment.point.add(normal.multiply(2));
    // console.log('pos:', pos);
    // add to second path
    outer.add(pos);
    // path.add(el.point);
  });

  ja.add(inner.segments[0], outer.segments[0]);
  jb.add(
    inner.segments[inner.segments.lenght - 1],
    outer.segments[outer.segments.lenght - 1]
  );
  return curve;
};

// const getSetgment = (one, two) => {
//   return new paper.
// }

export default function(evt) {
  // console.log('ChestWallTool:createNewMeasurement(evt)', evt);

  const eventData = evt.detail;

  const goodEventData =
    eventData && eventData.currentPoints && eventData.currentPoints.image;

  if (!goodEventData) {
    logger.error(
      `required eventData not supplied to tool ${this.name}'s createNewMeasurement`
    );
    return;
  }

  // paperjs canvas
  // esto tiene que ir aca porque es donde primero aparece el evento de la tool
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
  const canvas = evt.detail.element.querySelector('canvas.cornerstone-canvas');
  var otherCanvas = document.createElement('canvas');
  otherCanvas.setAttribute('style', 'position: absolute');
  canvas.parentNode.insertBefore(otherCanvas, canvas);
  paper.setup(otherCanvas);
  paper.view.autoUpdate = false;

  // ----------------------------------------------------------------------

  const { x, y } = eventData.currentPoints.image;

  let handles = {
    bottomLeft: getHandle(x - bottomHandleX, y - bottomHandleY, 'bottomLeft'),
    left: getHandle(x - handleDistance, y, 'left'),
    topLeft: getHandle(x - topHandleX, y - topHandleY, 'topLeft'),
    top: getHandle(x, y - handleDistance, 'top'),
    topRight: getHandle(x + topHandleX, y - topHandleY, 'topRight'),
    right: getHandle(x + handleDistance, y, 'right'),
    bottomRight: getHandle(x + bottomHandleX, y - bottomHandleY, 'bottomRigth'),
    origin: getHandle(x, y, 'origin'),
  };

  return {
    toolName: this.name,
    toolType: this.name,
    visible: true,
    active: true,
    color: undefined,
    invalidated: true,
    handles,
    curve: getPath(handles),
  };
}
