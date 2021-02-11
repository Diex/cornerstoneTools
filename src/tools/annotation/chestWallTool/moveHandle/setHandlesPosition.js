// Update connected handles if dragged one is connected to another handle
export default function(handle, eventData, data, distanceFromTool) {
  const proposedPoint = {
    x: eventData.currentPoints.image.x + distanceFromTool.x,
    y: eventData.currentPoints.image.y + distanceFromTool.y,
  };

  const handles = data.handles;

  const diffY = proposedPoint.y - handle.y;
  const diffX = proposedPoint.x - handle.x;

  let connectedHandle;

  if (handle.index === 1) {
    // Left handle selected
    connectedHandle = handles.right;

    connectedHandle.x -= diffX;
    connectedHandle.y += diffY;
  } else if (handle.index === 2) {
    // Right handle selected
    connectedHandle = handles.left;

    connectedHandle.x -= diffX;
    connectedHandle.y += diffY;
  }

  handle.x = proposedPoint.x;
  handle.y = proposedPoint.y;
}
