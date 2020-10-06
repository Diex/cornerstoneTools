/*
 * ChestWallTool.createNewMeasurement(event)
 * NOTE:: createNewMeasurement is customized to receive event objet instead eventData
 * because we need to skip the creation of a new measurement if there's an existing one
 */
import { getToolState } from './../../../stateManagement/toolState.js';
import { getLogger } from '../../../util/logger.js';

const logger = getLogger('tools:annotation:ChestWallTool');
let index = -1;

const getHandle = (x, y, extraAttributes = {}) => {
  index++;

  return Object.assign(
    {
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
  const eventData = evt.detail;

  console.log('ChestWallTool: createNewMeasurement(evt)', evt);

  const goodEventData =
    eventData && eventData.currentPoints && eventData.currentPoints.image;

  if (!goodEventData) {
    logger.error(
      `required eventData not supplied to tool ${this.name}'s createNewMeasurement`
    );

    return;
  }

  const toolData = getToolState(evt.currentTarget, this.name);

  console.log('createNewMeasurement.toolData', toolData);
  // This avoid to create multiple tool handlers at the same time
  if (toolData && toolData.data && toolData.data.length) {
    return;
  }

  const { x, y } = eventData.currentPoints.image;

  const handleDistance = 100;
  const topRedhandleDistanceX = handleDistance * 0.6;
  const topRedHandleDistanceY = handleDistance * 0.66;

  const bottomRedhandleDistanceX = handleDistance * 0.8;
  const bottomRedhandleDistanceY = handleDistance * 0.33;

  return {
    // toolName: this.name,
    // toolType: this.name,
    visible: true,
    active: true,
    color: undefined,
    invalidated: true,
    handles: {
      // Blue Handles
      blueCenter: getHandle(x, y),
      blueLeft: getHandle(x - handleDistance, y),
      blueRight: getHandle(x + handleDistance, y),
      blueTop: getHandle(x, y - handleDistance),

      // Red Handles
      redTopCenter: getHandle(x, y - topRedHandleDistanceY),
      redTopLeft: getHandle(
        x - topRedhandleDistanceX,
        y - topRedHandleDistanceY
      ),
      redTopRight: getHandle(
        x + topRedhandleDistanceX,
        y - topRedHandleDistanceY
      ),

      redBottomCenter: getHandle(x, y - bottomRedhandleDistanceY),
      redBottomLeft: getHandle(
        x - bottomRedhandleDistanceX,
        y - bottomRedhandleDistanceY
      ),
      redBottomRight: getHandle(
        x + bottomRedhandleDistanceX,
        y - bottomRedhandleDistanceY
      ),
      // textBox: {
      //   active: false,
      //   hasMoved: false,
      //   movesIndependently: false,
      //   drawnIndependently: true,
      //   allowedOutsideImage: true,
      //   hasBoundingBox: true,
      // },
    },
  };
}
