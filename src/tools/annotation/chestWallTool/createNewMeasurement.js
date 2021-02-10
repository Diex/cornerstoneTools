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
  console.log('ChestWallTool:createNewMeasurement(evt)', evt);

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
      // start: getHandle(x, y, 'start'),
      // end: getHandle(x, y, 'end'),

      center: getHandle(x, y),
      left: getHandle(x - handleDistance, y),
      right: getHandle(x + handleDistance, y),
      top: getHandle(x, y - handleDistance),

      topLeft: getHandle(x - topRedhandleDistanceX, y - topRedHandleDistanceY),
      topRight: getHandle(x + topRedhandleDistanceX, y - topRedHandleDistanceY),

      // Blue Handles
      // blueCenter: getHandle(x, y),
      // blueLeft: getHandle(x - handleDistance, y),
      // blueRight: getHandle(x + handleDistance, y),
      // blueTop: getHandle(x, y - handleDistance),

      // Red Handles
      // redTopCenter: getHandle(x, y - topRedHandleDistanceY),
      // redTopLeft: getHandle(
      //   x - topRedhandleDistanceX,
      //   y - topRedHandleDistanceY
      // ),
      // redTopRight: getHandle(
      //   x + topRedhandleDistanceX,
      //   y - topRedHandleDistanceY
      // ),

      // redBottomCenter: getHandle(x, y - bottomRedhandleDistanceY),
      // redBottomLeft: getHandle(
      //   x - bottomRedhandleDistanceX,
      //   y - bottomRedhandleDistanceY
      // ),
      // redBottomRight: getHandle(
      //   x + bottomRedhandleDistanceX,
      //   y - bottomRedhandleDistanceY
      // ),
      // textBox: getHandle(x - 50, y - 70, {
      //   highlight: false,
      //   hasMoved: true,
      //   active: false,
      //   movesIndependently: false,
      //   drawnIndependently: true,
      //   allowedOutsideImage: true,
      //   hasBoundingBox: true,
      // }),
    },
  };
}
