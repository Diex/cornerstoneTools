import { getLogger } from '../../../util/logger.js';
import { paper } from 'paper';
import external from './../../../externalModules.js';

const logger = getLogger('tools:annotation:ChestWallTool');
let index = -1;

const handleDistance = 200;

const topHandleX = handleDistance * 0.6; // set line length to 60%
const topHandleY = handleDistance * 0.8;

const bottomHandleX = handleDistance * 0.8; //  set line length to 80%
const bottomHandleY = handleDistance * 0.4;

const getHandle = (x, y, name, extraAttributes = {}) => {
  index++;

  let path = new paper.Path.Circle({
    center: new paper.Point(x, y),
    radius: 10,
    fillColor: 'red',
  });

  return Object.assign(
    {
      name,
      path,
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

  return {
    toolName: this.name,
    toolType: this.name,
    visible: true,
    active: true,
    color: undefined,
    invalidated: true,

    handles: {
      origin: getHandle(x, y, 'origin'),
      top: getHandle(x, y - handleDistance, 'top'),
      left: getHandle(x - handleDistance, y, 'left'),
      right: getHandle(x + handleDistance, y, 'right'),
      bottomLeft: getHandle(x - bottomHandleX, y - bottomHandleY, 'bottomLeft'),
      topLeft: getHandle(x - topHandleX, y - topHandleY, 'topLeft'),
      bottomRight: getHandle(
        x + bottomHandleX,
        y - bottomHandleY,
        'bottomRigth'
      ),
      topRight: getHandle(x + topHandleX, y - topHandleY, 'topRight'),
    },
  };
}
