import BaseTool from './base/BaseTool.js';
import BaseAnnotationTool from './base/BaseAnnotationTool.js';
// State
import { getToolState } from './../stateManagement/toolState.js';
import toolStyle from './../stateManagement/toolStyle.js';
import toolColors from './../stateManagement/toolColors.js';
// Drawing
import {
  getNewContext,
  draw,
  setShadow,
  drawLine,
} from './../drawing/index.js';
import drawLinkedTextBox from './../drawing/drawLinkedTextBox.js';
import drawHandles from './../drawing/drawHandles.js';
import lineSegDistance from './../util/lineSegDistance.js';
import { lengthCursor } from './cursors/index.js';
import { getLogger } from '../util/logger.js';
import getPixelSpacing from '../util/getPixelSpacing';
import throttle from '../util/throttle';
import { getModule } from '../store/index';
import external from './../externalModules.js';

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
    console.log('ChestWallTool: renderToolData');
    const eventData = evt.detail;
    const element = evt.detail.element;

    const toolData = getToolState(evt.currentTarget, this.name);

    console.log('toolData', toolData);

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
          handleRadius: 20,
          drawHandlesIfActive: this.configuration.drawHandlesOnHover,
          hideHandlesIfMoving: this.configuration.hideHandlesIfMoving,
        };

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
          // 'canvas'
        );

        // drawLine(
        //   ctx,
        //   element,
        //   data.handles.blueCenterTop,
        //   data.handles.blueCenterBottom,
        //   lineOptions
        //   // 'canvas'
        // );
      }

      // external.cornerstone.updateImage(evt.detail.element);
    });
  }

  createNewMeasurement(eventData) {
    console.log('ChestWallTool: createNewMeasurement', eventData);
    const goodEventData =
      eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      logger.error(
        `required eventData not supplied to tool ${this.name}'s createNewMeasurement`
      );

      return;
    }

    console.log('eventData', eventData);
    const element = eventData.element;

    // // const toolData = getToolState(evt.currentTarget, this.name);
    // console.log('element', element);

    const canvas = element.querySelector('canvas.cornerstone-canvas');
    const context = getNewContext(canvas);

    const width = canvas.width;
    const height = canvas.height;

    // const startCanvas = external.cornerstone.pixelToCanvas(element, {
    //   x: Math.floor(width * 0.2),
    //   y: Math.floor(height * 0.8),
    // });
    //
    // const endCanvas = external.cornerstone.pixelToCanvas(element, {
    //   x: Math.floor(width * 0.8),
    //   y: Math.floor(height * 0.8),
    // });

    // console.log('ChestWallTool: createNewMeasurement MESSRE');
    // console.log(startCanvas);
    // console.log(endCanvas);

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        blueLeft: {
          // x: Math.floor(width * 0.2),
          // y: Math.floor(height * 0.8),
          // ...startCanvas,
          x: 100,
          y: 100,
          highlight: true,
          active: false,
          radius: 20,
        },
        blueRight: {
          // x: Math.floor(width * 0.8),
          // y: Math.floor(height * 0.8),
          // ...endCanvas,
          x: 200,
          y: 200,
          highlight: true,
          active: false,
          radius: 20,
        },
        // blueCenterTop: {
        //   x: Math.floor(width / 2),
        //   y: Math.floor(height * 0.2),
        //   highlight: true,
        //   active: false,
        //   radius: 20,
        // },
        // blueCenterBottom: {
        //   x: Math.floor(width / 2),
        //   y: Math.floor(height * 0.8),
        //   highlight: true,
        //   active: false,
        //   radius: 20,
        // },
        // },
        // {
        //   blueHandleTop: {
        //     x,
        //     y,
        //     highlight: true,
        //     active: false,
        //   },
        //   blueHandleCenter: {
        //     x,
        //     y,
        //     highlight: true,
        //     active: false,
        //   },
        //   blueHandleLeft: {
        //     x,
        //     y,
        //     highlight: true,
        //     active: false,
        //   },
        //   blueHandleRight: {
        //     x,
        //     y,
        //     highlight: true,
        //     active: false,
        //   },
        // start: {
        //   x,
        //   y,
        //   highlight: true,
        //   active: false,
        // },
        // end: {
        //   x,
        //   y,
        //   highlight: true,
        //   active: true,
        // },
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

  updateCachedStats(image, element, data) {
    console.log('ChestWallTool: updateCachedStats');
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    console.log(image);
    console.log(element);
    console.log(data);
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
