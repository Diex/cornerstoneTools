/*
 * ChestWallTool.updateCachedStats(image, element, data)
 */
import getPixelSpacing from '../../../util/getPixelSpacing';

export default function(image, element, data) {
  console.log('ChestWallTool:updateCachedStats:name', data.toolName, this.name);
  // Prevent updating other tools' data
  if (data.toolName !== this.name) {
    return;
  }

  // const pixelSpacing = getPixelSpacing(image);

  // calculateLongestAndShortestDiameters(data, pixelSpacing);
  // const {
  //   longestDiameter,
  //   shortestDiameter,
  // } = calculateLongestAndShortestDiameters(data, pixelSpacing);

  // Set measurement text to show lesion table
  // data.longestDiameter = longestDiameter;
  // data.shortestDiameter = shortestDiameter;
  data.centerTopLength = 100;
  data.centerRightLength = 100;
  data.centerLeftLength = 100;
  data.invalidated = false;
  console.log('ChestWallTool:data:name', data);
}

function calculateLongestAndShortestDiameters(measurementData, pixelSpacing) {
  const { rowPixelSpacing, colPixelSpacing } = pixelSpacing;
  const {
    start,
    end,
    perpendicularStart,
    perpendicularEnd,
  } = measurementData.handles;

  // Calculate the long axis length
  const dx = (start.x - end.x) * (colPixelSpacing || 1);
  const dy = (start.y - end.y) * (rowPixelSpacing || 1);
  let length = Math.sqrt(dx * dx + dy * dy);

  // Calculate the short axis length
  const wx =
    (perpendicularStart.x - perpendicularEnd.x) * (colPixelSpacing || 1);
  const wy =
    (perpendicularStart.y - perpendicularEnd.y) * (rowPixelSpacing || 1);
  let width = Math.sqrt(wx * wx + wy * wy);

  if (!width) {
    width = 0;
  }

  // Length is always longer than width
  if (width > length) {
    const tempW = width;
    const tempL = length;

    length = tempW;
    width = tempL;
  }

  return {
    longestDiameter: length.toFixed(1),
    shortestDiameter: width.toFixed(1),
  };
}
