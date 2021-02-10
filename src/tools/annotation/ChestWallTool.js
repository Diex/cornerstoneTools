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
import getPixelSpacing from '../../util/getPixelSpacing';
import calculateLongestAndShortestDiameters from './bidirectionalTool/utils/calculateLongestAndShortestDiameters';

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
        // changeMeasurementLocationCallback: emptyLocationCallback,
        // getMeasurementLocationCallback: emptyLocationCallback,
        drawHandles: true,
        drawHandlesOnHover: false,
        hideHandlesIfMoving: false,
        renderDashed: false,
        additionalData: [],
      },
      svgCursor: lengthCursor,
    };

    super(props, defaultProps);
    // todos los anotations tools tienen que definier estas funciones
    // addNewMeasurment se ejecuta cuando activo la tool y llama a createNewMeasurment
    this.addNewMeasurement = addNewMeasurement.bind(this);
    this.createNewMeasurement = createNewMeasurement.bind(this);

    this.pointNearTool = pointNearTool.bind(this);

    this.renderToolData = renderToolData.bind(this);

    // estas esta custom para los dibujos que tenemos que hacer.
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

  updateCachedStats(image, element, data) {
    // Prevent updating other tools' data
    console.log(image, element, data);
    console.log(this.name);
    if (data.toolName !== this.name) {
      return;
    }
    console.log(image, element, data);
    const pixelSpacing = getPixelSpacing(image);
    const {
      longestDiameter,
      shortestDiameter,
    } = calculateLongestAndShortestDiameters(data, pixelSpacing);

    // Set measurement text to show lesion table
    data.longestDiameter = longestDiameter;
    data.shortestDiameter = shortestDiameter;
    data.invalidated = false;
  }
}
