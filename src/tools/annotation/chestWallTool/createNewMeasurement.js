import { getLogger } from '../../../util/logger.js';

const logger = getLogger('tools:annotation:ChestWallTool');
let index = -1;

const handleDistance = 200;
const topRedhandleDistanceX = handleDistance * 0.6; // set line length to 60%
const topRedHandleDistanceY = handleDistance * 0.66;

const bottomRedhandleDistanceX = handleDistance * 0.8; //  set line length to 80%
const bottomRedhandleDistanceY = handleDistance * 0.33;

const getHandle = (x, y, name, extraAttributes = {}) => {
  index++;

  return Object.assign(
    {
      name,
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

      controlLeft: getHandle(
        x - topRedhandleDistanceX,
        y - topRedHandleDistanceY,
        'controlLeft'
      ),
      controlRight: getHandle(
        x + topRedhandleDistanceX,
        y - topRedHandleDistanceY,
        'controlRight'
      ),
    },
  };
}
