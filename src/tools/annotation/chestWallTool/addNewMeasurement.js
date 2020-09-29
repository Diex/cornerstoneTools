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

export default function(evt, tool) {
  logger.log('addNewMeasurement');

  evt.preventDefault();
  evt.stopPropagation();
  const eventData = evt.detail;
  const element = eventData.element;
  const measurementData = this.createNewMeasurement(evt);

  if (!measurementData) {
    return;
  }

  addToolState(element, this.name, measurementData);

  external.cornerstone.updateImage(element);

  const handleMover =
    Object.keys(measurementData.handles).length === 1
      ? moveHandle
      : moveNewHandle;

  handleMover(
    eventData,
    this.name,
    measurementData,
    measurementData.handles.end,
    this.options,
    'mouse',
    success => {
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

        triggerEvent(element, eventType, eventData);
      } else {
        removeToolState(element, this.name, measurementData);
      }
    }
  );
}
