import BaseAnnotationTool from './../base/BaseAnnotationTool.js';
// State
import { getToolState } from './../../stateManagement/toolState.js';
import toolStyle from './../../stateManagement/toolStyle.js';
import toolColors from './../../stateManagement/toolColors.js';
// Drawing
import {
  getNewContext,
  draw,
  setShadow,
  drawLine,
} from './../../drawing/index.js';
import drawLinkedTextBox from './../../drawing/drawLinkedTextBox.js';
import drawHandles from './../../drawing/drawHandles.js';
import lineSegDistance from './../../util/lineSegDistance.js';
import { lengthCursor } from './../cursors/index.js';
import { getLogger } from '../../util/logger.js';
import getPixelSpacing from '../../util/getPixelSpacing';
import throttle from '../../util/throttle';
import { getModule } from '../../store/index';
import external from './../../externalModules.js';

// Custom functionality
import addNewMeasurement from './chestWallTool/addNewMeasurement';

const logger = getLogger('tools:annotation:ChestWallTool');

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
      // svgCursor: lengthCursor,
    };

    super(props, defaultProps);

    this.addNewMeasurement = addNewMeasurement.bind(this);
    // this.createNewMeasurement = this._createNewMeasurement.bind(this);
    // console.log('ChestWallTool.addNewMeasurement', addNewMeasurement);
    // console.log('this.addNewMeasurement', this.addNewMeasurement);
    // Mode Callbacks: (element, options)
    // this.activeCallback = this._initializeCanvasTool.bind(this);
    // this.enabledCallback = this._createMagnificationCanvas.bind(this);
    // this.disabledCallback = this._destroyMagnificationCanvas.bind(this);

    // this.postTouchStartCallback = this._postTouchStartCallback.bind(this);
    // this.postMouseDownCallback = this._postMouseDownCallback.bind(this);

    // this._x = 50;
    // this._y = 0;
    // this.preventNewMeasurement = false;
    // this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
  }

  // _postTouchStartCallback(evt) {
  //   console.log('_postTouchStartCallback');
  //   // this._initializeCanvasTool(evt.detail.element);
  // }
  //
  // _postMouseDownCallback(evt) {
  //   console.log('_postMouseDownCallback');
  //   // this._initializeCanvasTool(evt.detail.element);
  //   this._initializeCanvasTool(evt);
  // }

  // renderToolData(evt) {
  //   console.log('renderToolData');
  //   this._initializeCanvasTool(evt.detail.element);
  // }

  renderToolData(evt) {
    console.log('ChestWallTool: renderToolData(evt)', evt);
    const eventData = evt.detail;
    const element = evt.detail.element;

    const toolData = getToolState(evt.currentTarget, this.name);

    const canvas = element.querySelector('canvas.cornerstone-canvas');
    const context = getNewContext(canvas);

    const width = canvas.width;
    const height = canvas.height;

    draw(context, ctx => {
      for (let i = 0; i < toolData.data.length; i++) {
        const data = toolData.data[i];

        if (data.visible === false) {
          continue;
        }

        const handleOptions = {
          color: 'blue',
          handleRadius: 5,
          drawHandlesIfActive: this.configuration.drawHandlesOnHover,
          hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
        };

        //  Render Blue Handles
        if (this.configuration.drawHandles) {
          drawHandles(context, eventData, data.handles, handleOptions);
        }

        const lineOptions = {
          color: 'blue',
          lineWidth: 5,
        };

        drawLine(
          ctx,
          element,
          data.handles.blueLeft,
          data.handles.blueRight,
          lineOptions
        );

        drawLine(
          ctx,
          element,
          data.handles.blueCenterTop,
          data.handles.blueCenterBottom,
          lineOptions
        );

        //  Render Red Handles
        handleOptions.color = 'red';
        lineOptions.color = 'red';

        drawLine(
          ctx,
          element,
          data.handles.redTopLeft,
          data.handles.redTopRight,
          lineOptions
        );

        drawLine(
          ctx,
          element,
          data.handles.redBottomLeft,
          data.handles.redBottomRight,
          lineOptions
        );
      }
    });
  }

  createNewMeasurement(evt) {
    const eventData = evt.detail;
    const element = eventData.element;

    console.log('ChestWallTool: createNewMeasurement(eventData)', eventData);

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

    const canvas = element.querySelector('canvas.cornerstone-canvas');
    const context = getNewContext(canvas);

    const width = canvas.width;
    const height = canvas.height;

    const getHandle = (x, y, index, extraAttributes = {}) =>
      Object.assign(
        {
          x,
          y,
          index,
          drawnIndependently: false,
          allowedOutsideImage: false,
          highlight: true,
          active: false,
        },
        extraAttributes
      );

    const handleDistance = 100;
    const topRedhandleDistanceX = handleDistance * 0.6;
    const topRedHandleDistanceY = handleDistance * 0.66;

    const bottomRedhandleDistanceX = handleDistance * 0.8;
    const bottomRedhandleDistanceY = handleDistance * 0.33;

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        // Blue Handles
        blueCenterBottom: getHandle(x, y),
        blueLeft: getHandle(x - handleDistance, y),
        blueRight: getHandle(x + handleDistance, y),
        blueCenterTop: getHandle(x, y - handleDistance),

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

  // NOTE:: createNewMeasurement is customized to receive event objet instead eventData
  // because we need to skip the creation of a new measurement if there's an existing one

  updateCachedStats(image, element, data) {
    console.log('ChestWallTool: updateCachedStats');
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    // console.log(image);
    // console.log(element);
    // console.log(data);
    // Set rowPixelSpacing and columnPixelSpacing to 1 if they are undefined (or zero)
    // const dx =
    //   (data.handles.end.x - data.handles.start.x) * (colPixelSpacing || 1);
    // const dy =
    //   (data.handles.end.y - data.handles.start.y) * (rowPixelSpacing || 1);
    //
    // // Calculate the length, and create the text variable with the millimeters or pixels suffix
    // const length = Math.sqrt(dx * dx + dy * dy);
    //
    // // Store the length inside the tool for outside access
    // data.length = length;
    // data.invalidated = false;
  }

  pointNearTool(element, data, coords, interactionType) {
    return false;
  }
}
