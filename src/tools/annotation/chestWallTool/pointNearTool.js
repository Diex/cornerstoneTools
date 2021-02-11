/*
 * ChestWallTool.pointNearTool(element, data, coords, interactionType)
 */

import { state } from '../../../store/index.js';
import external from './../../../externalModules.js';
import pointInsideBoundingBox from './../../../util/pointInsideBoundingBox.js';

const pointNearTool = (
  element,
  handleStart,
  handleEnd,
  coords,
  distanceThreshold
) => {
  const cornerstone = external.cornerstone;
  const cornerstoneMath = external.cornerstoneMath;
  const lineSegment = {
    start: cornerstone.pixelToCanvas(element, handleStart),
    end: cornerstone.pixelToCanvas(element, handleEnd),
  };

  const distanceToPoint = cornerstoneMath.lineSegment.distanceToPoint(
    lineSegment,
    coords
  );

  return distanceToPoint < distanceThreshold;
};

// Point Near Tool
export default function(element, data, coords, interactionType = 'mouse') {
  const cornerstone = external.cornerstone;
  const cornerstoneMath = external.cornerstoneMath;
  const { handles } = data;

  const distanceThreshold =
    interactionType === 'mouse' ? state.clickProximity : state.touchProximity;

  if (
    pointNearTool(
      element,
      handles.left,
      handles.right,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.left,
      handles.topLeft,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.right,
      handles.topRight,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  // If textbox is added, we should check it using this function
  // if (pointInsideBoundingBox(handles.textBox, coords)) {
  //   return true;
  // }

  return false;
}
