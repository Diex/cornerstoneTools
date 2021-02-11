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

const logger = getLogger('eventDispatchers:mouseEventHandlers');

export default function(evt, interactionType) {
  const eventData = evt.detail;
  const { element, image, buttons } = eventData;

  evt.preventDefault();
  evt.stopPropagation();

  // 'this' es la extension ChestWallTool.js
  const toolState = getToolState(evt.currentTarget, this.name);

  // moved from createNewMeasure
  // This avoids to create multiple tool handlers at the same time
  if (toolState && toolState.data && toolState.data.length) {
    console.log('ChestWallTool:toolState:', toolState);
    return;
  }

  // aca cambia porque le mandamos el evt completo
  const measurementData = this.createNewMeasurement(evt);

  console.log('ChestWallTool:measurementData:', measurementData);

  if (!measurementData) {
    return;
  }

  // Associate this data with this imageId so we can render it and manipulate it
  addToolState(element, this.name, measurementData);
  external.cornerstone.updateImage(element);

  // todo esto no tiene sentido...
  /*
  moveHandle(
    eventData,
    this.name,
    measurementData,
    measurementData.handles.center,
    {}, // this.options,
    interactionType, // 'mouse',
    success => {
      // ver esto...
      // if (!success) {
      //   removeToolState(element, this.name, measurementData);
      //   return;
      // }

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
        triggerEvent(element, EVENTS.MEASUREMENT_MODIFIED, eventData);
        triggerEvent(element, EVENTS.MEASUREMENT_COMPLETED, eventData);
      } else {
        removeToolState(element, this.name, measurementData);
      }
    }
  );
  */
}
