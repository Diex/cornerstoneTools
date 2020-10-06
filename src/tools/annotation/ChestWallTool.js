import BaseAnnotationTool from './../base/BaseAnnotationTool.js';
import { lengthCursor } from './../cursors/index.js';

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
        drawHandles: true,
        drawHandlesOnHover: false,
        hideHandlesIfMoving: false,
        renderDashed: false,
      },
      svgCursor: lengthCursor,
    };

    super(props, defaultProps);

    this.addNewMeasurement = addNewMeasurement.bind(this);
    this.createNewMeasurement = createNewMeasurement.bind(this);
    this.pointNearTool = pointNearTool.bind(this);
    this.renderToolData = renderToolData.bind(this);

    this.handleSelectedCallback = handleSelectedCallback.bind(this);
    this.handleSelectedMouseCallback = handleSelectedMouseCallback.bind(this);
    this.handleSelectedTouchCallback = handleSelectedTouchCallback.bind(this);

    // TODO: implement updateCachedStats functionality
    this.updateCachedStats = updateCachedStats.bind(this);

    // Mode Callbacks: (element, options)
    // this.enabledCallback = this._createMagnificationCanvas.bind(this);
    // this.disabledCallback = this._destroyMagnificationCanvas.bind(this);

    // this.postTouchStartCallback = this._postTouchStartCallback.bind(this);
    // this.postMouseDownCallback = this._postMouseDownCallback.bind(this);

    // this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);

    this.preventNewMeasurement = false;
  }
}
