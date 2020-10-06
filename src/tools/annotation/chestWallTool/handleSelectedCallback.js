export default function(evt, toolData, handle, interactionType = 'mouse') {
  console.log('ChestWallTool.handleSelectedCallback');
  if (interactionType === 'touch') {
    this.handleSelectedTouchCallback(evt);
  } else {
    this.handleSelectedMouseCallback(evt);
  }
}
