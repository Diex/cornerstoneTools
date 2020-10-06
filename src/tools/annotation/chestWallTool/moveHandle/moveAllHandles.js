// import getDistanceWithPixelSpacing from '../../utils/getDistanceWithPixelSpacing.js';
// import getBaseData from '../getBaseData.js';
// import updatePerpendicularLine from './updatePerpendicularLine.js';

export default function(
  proposedPoint,
  measurementData,
  eventData
  // fixedPoint
) {
  const baseData = getBaseData(measurementData, eventData, fixedPoint);
  const { columnPixelSpacing, rowPixelSpacing, distanceToFixed } = baseData;

  // Calculate the length of the new line, considering the proposed point
  const newLineLength = getDistanceWithPixelSpacing(
    columnPixelSpacing,
    rowPixelSpacing,
    fixedPoint,
    proposedPoint
  );

  // Stop here if the handle tries to move before the intersection point
  if (newLineLength <= distanceToFixed) {
    return false;
  }

  // Calculate the new intersection point
  const distanceRatio = distanceToFixed / newLineLength;
  const newIntersection = {
    x: fixedPoint.x + (proposedPoint.x - fixedPoint.x) * distanceRatio,
    y: fixedPoint.y + (proposedPoint.y - fixedPoint.y) * distanceRatio,
  };

  // Calculate and the new position of the perpendicular handles
  const newLine = updatePerpendicularLine(baseData, newIntersection);

  // Update the perpendicular line handles
  measurementData.handles.perpendicularStart.x = newLine.start.x;
  measurementData.handles.perpendicularStart.y = newLine.start.y;
  measurementData.handles.perpendicularEnd.x = newLine.end.x;
  measurementData.handles.perpendicularEnd.y = newLine.end.y;

  return true;
}
