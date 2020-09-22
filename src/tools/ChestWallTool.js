import BaseTool from './base/BaseTool.js';
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

const logger = getLogger('tools:annotation:ChestWallTool');

/**
 * @public
 * @class ChestWallTool
 * @memberof Tools.Annotation
 * @classdesc Tool for measuring distances.
 * @extends Tools.Base.BaseAnnotationTool
 */
export default class ChestWallTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'ChestWallTool',
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

    // Mode Callbacks: (element, options)
    this.activeCallback = this._initializeCanvasTool.bind(this);
    // this.enabledCallback = this._createMagnificationCanvas.bind(this);
    // this.disabledCallback = this._destroyMagnificationCanvas.bind(this);

    // this.postTouchStartCallback = this._postTouchStartCallback.bind(this);
    // this.postMouseDownCallback = this._postMouseDownCallback.bind(this);

    this._x = 50;
    this._y = 0;
  }

  _postTouchStartCallback(evt) {
    console.log('_postTouchStartCallback');
    this._initializeCanvasTool(evt.detail.element);
  }

  _postMouseDownCallback(evt) {
    console.log('_postMouseDownCallback');
    this._initializeCanvasTool(evt.detail.element);
  }

  // renderToolData(evt) {
  //   console.log('renderToolData');
  //   this._initializeCanvasTool(evt.detail.element);
  // }

  _initializeCanvasTool(element) {
    console.log('_initializeCanvasTool', element);
    const canvas = element.querySelector('canvas.cornerstone-canvas');
    const context = getNewContext(canvas);

    const width = canvas.width;
    const height = canvas.height;

    this._handle0 = {
      x: Math.floor(width * 0.2),
      y: Math.floor(height * 0.8),
      radius: 30,
    };

    this._handle1 = {
      x: Math.floor(width * 0.8),
      y: Math.floor(height * 0.8),
      radius: 30,
    };

    this._handles = [this._handle0, this._handle1];

    draw(context, ctx => {
      const lineOptions = {
        color: 'coral',
        lineWidth: 10,
      };

      drawLine(
        ctx,
        element,
        this._handle0,
        this._handle1,
        lineOptions,
        'canvas'
      );
    });
  }
}
