/*
 * ChestWallTool.createNewMeasurement(event)
 * NOTE:: createNewMeasurement is customized to receive event objet instead eventData
 * because we need to skip the creation of a new measurement if there's an existing one
 */
import { getToolState } from './../../../stateManagement/toolState.js';
/*
 * ChestWallTool.addNewMeasurement(evt, tool)
 * NOTE: this function implements the same functionality that default addNewMeasurement function has
 * The only difference is that we send the event objet instead of eventData when we call to createNewMeasurement function
 */

import EVENTS from './../../../events.js';
import external from './../../../externalModules.js';
import {
  addToolState,
  removeToolState,
} from './../../../stateManagement/toolState.js';
import { moveHandle, moveNewHandle } from './../../../manipulators/index.js';

import { getLogger } from '../../../util/logger.js';
import triggerEvent from '../../../util/triggerEvent.js';

// import * as sbp from 'svg-blueprint';

const logger = getLogger('eventDispatchers:mouseEventHandlers');

export default function(evt, interactionType) {
  const eventData = evt.detail;
  const { element, image, buttons } = eventData;

  const config = this.configuration;

  if (checkPixelSpacing(image)) {
    return;
  }

  // evt.preventDefault();
  // evt.stopPropagation();

  // moved from createNewMeasure
  // This avoids to create multiple tool handlers at the same time
  const toolData = getToolState(evt.currentTarget, this.name);
  if (toolData && toolData.data && toolData.data.length) {
    return;
  }

  // retro as seen on bidirectionalTool
  const measurementData = this.createNewMeasurement(eventData);

  // Associate this data with this imageId so we can render it and manipulate it
  addToolState(element, this.name, measurementData);
  external.cornerstone.updateImage(element);

  // const handleMover =
  //   Object.keys(measurementData.handles).length === 1
  //     ? moveHandle
  //     : moveNewHandle;

  const timestamp = new Date().getTime();
  const { blueCenter } = measurementData.handles;
  // agarra la tool y mueve (el ndale que le dpaso)
  const doneCallback = () => {
    measurementData.active = false;
    external.cornerstone.updateImage(element);
  };

  moveHandle(
    eventData,
    this.name,
    measurementData,
    blueCenter,
    {}, // this.options,
    interactionType, // 'mouse',
    success => {
      // ver esto...
      if (!success) {
        removeToolState(element, this.name, measurementData);
        return;
      }
      if (measurementData.cancelled) {
        return;
      }

      if (success) {
        const eventType = EVENTS.MEASUREMENT_COMPLETED;
        const eventData = {
          toolName: this.name,
          toolType: this.name, // Deprecation notice: toolType will be replaced by toolName
          element,
          measurementData,
        };
        measurementData.active = false;
        external.cornerstone.updateImage(element);
        // triggerEvent(element, eventType, eventData);
        console.log('modifiedData:');
        console.log(eventData);
        triggerEvent(element, EVENTS.MEASUREMENT_MODIFIED, eventData);
        triggerEvent(element, EVENTS.MEASUREMENT_COMPLETED, eventData);
      } else {
        removeToolState(element, this.name, measurementData);
      }
    }
  );
}

const checkPixelSpacing = image => {
  const imagePlane = external.cornerstone.metaData.get(
    'imagePlaneModule',
    image.imageId
  );
  let rowPixelSpacing = image.rowPixelSpacing;
  let colPixelSpacing = image.columnPixelSpacing;

  if (imagePlane) {
    rowPixelSpacing =
      imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing;
    colPixelSpacing =
      imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing;
  }

  // LT-29 Disable Target Measurements when pixel spacing is not available
  return !rowPixelSpacing || !colPixelSpacing;
};
