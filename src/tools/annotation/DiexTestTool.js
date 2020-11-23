// import csTools from 'cornerstone-tools';
// const BaseTool = csTools.importInternal('base/BaseTool');
// NOTE: if you're creating a tool inside the CornerstoneTools repository
// you can import BaseTool directly from `src/tools/base`.
import BaseTool from './../base/BaseTool.js';
export default class DiexTestTool extends BaseTool {
  constructor(name = 'HelloWorld') {
    super({
      name: 'DiexTestTool',
      supportedInteractionTypes: ['Mouse'],
    });
  }

  preMouseDownCallback(evt) {
    console.log('Hello cornerstoneTools!');
  }

  activeCallback(element) {
    console.log(`Hello element ${element.uuid}!`);
  }

  disabledCallback(element) {
    console.log(`Goodbye element ${element.uuid}!`);
  }
}
