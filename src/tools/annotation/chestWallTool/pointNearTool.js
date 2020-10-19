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

export default function(element, data, coords, interactionType = 'mouse') {
  const cornerstone = external.cornerstone;
  const cornerstoneMath = external.cornerstoneMath;
  const { handles } = data;

  const distanceThreshold =
    interactionType === 'mouse' ? state.clickProximity : state.touchProximity;

  if (
    pointNearTool(
      element,
      handles.blueCenter,
      handles.blueLeft,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.blueCenter,
      handles.blueRight,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.blueCenter,
      handles.blueTop,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.redTopCenter,
      handles.redTopLeft,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.redTopCenter,
      handles.redTopRight,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.redBottomCenter,
      handles.redBottomLeft,
      coords,
      distanceThreshold
    )
  ) {
    return true;
  }

  if (
    pointNearTool(
      element,
      handles.redBottomCenter,
      handles.redBottomRight,
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
