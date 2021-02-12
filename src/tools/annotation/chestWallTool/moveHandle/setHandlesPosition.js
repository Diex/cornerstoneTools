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

  console.log(handle);

  if (handle.name === 'origin') {
    // console.log(handles);
    for (let element in handles) {
      console.log(element);
      handles[element].x += diffX;
      handles[element].y += diffY;
    }
  }

  if (handle.name === 'right') {
    // Left handle selected
    connectedHandle = handles.right;
    connectedHandle.x -= diffX;
    connectedHandle.y += diffY;
  } else if (handle.name === 'left') {
    // Right handle selected
    connectedHandle = handles.left;

    connectedHandle.x -= diffX;
    connectedHandle.y += diffY;
  }

  handle.x = proposedPoint.x;
  handle.y = proposedPoint.y;
}
