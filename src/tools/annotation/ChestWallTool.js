import BaseAnnotationTool from './../base/BaseAnnotationTool.js';
import { lengthCursor } from './../cursors/index.js';
import throttle from '../../util/throttle';

// Custom functionality
import addNewMeasurement from './chestWallTool/addNewMeasurement';
import createNewMeasurement from './chestWallTool/createNewMeasurement';
import pointNearTool from './chestWallTool/pointNearTool';
import renderToolData from './chestWallTool/renderToolData';
import updateCachedStats from './chestWallTool/updateCachedStats';

import handleSelectedCallback from './chestWallTool/handleSelectedCallback.js';
import handleSelectedMouseCallback from './chestWallTool/handleSelectedMouseCallback.js';
import handleSelectedTouchCallback from './chestWallTool/handleSelectedTouchCallback.js';

// const logger = getLogger('tools:annotation:ChestWallTool');
const emptyLocationCallback = (measurementData, eventData, doneCallback) =>
  doneCallback();

/**
 * @public
 * @class ChestWallTool
 * @memberof Tools.Annotation
 * @classdesc Tool for measuring distances.
 * @extends Tools.Base.BaseAnnotationTool
 */

export default class ChestWallTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'ChestWall',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        changeMeasurementLocationCallback: emptyLocationCallback,
        getMeasurementLocationCallback: emptyLocationCallback,
        drawHandles: true,
        drawHandlesOnHover: true,
        hideHandlesIfMoving: false,
        renderDashed: false,
      },
      svgCursor: lengthCursor,
    };

    super(props, defaultProps);

    this.createNewMeasurement = createNewMeasurement.bind(this);
    this.pointNearTool = pointNearTool.bind(this);
    this.renderToolData = renderToolData.bind(this);
    this.addNewMeasurement = addNewMeasurement.bind(this);

    this.handleSelectedCallback = handleSelectedCallback.bind(this);
    this.handleSelectedMouseCallback = handleSelectedMouseCallback.bind(this);
    this.handleSelectedTouchCallback = handleSelectedTouchCallback.bind(this);

    this.updateCachedStats = updateCachedStats.bind(this);
    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);

    // Mode Callbacks: (element, options)
    // this.enabledCallback = this._createMagnificationCanvas.bind(this);
    // this.disabledCallback = this._destroyMagnificationCanvas.bind(this);

    // this.postTouchStartCallback = this._postTouchStartCallback.bind(this);
    // this.postMouseDownCallback = this._postMouseDownCallback.bind(this);
  }
}
