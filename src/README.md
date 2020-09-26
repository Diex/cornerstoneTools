<div align="center">
<h1>CODE REFERENCE</h1>
</div>

<hr />

## ChestWallTool

- [ChestWallTool.js](https://github.com/Diex/cornerstoneTools/blob/erkom-viewer/src/tools/ChestWallTool.js)

## MagnifyTool

Esta herramienta crea un canvas sobre el canvas principal que dibuja la imagen, sirve como referencia si hay que armar un canvas para dibujar la herramienta de Erkom

- [MagnifyTool.js](https://github.com/Diex/cornerstoneTools/blob/erkom-viewer/src/tools/MagnifyTool.js)

## BidirectionalTool

Esta herramienta tiene una customización para dibujar y desplazar ciertas lineas y handles.
Es una muy buena referencia, ya que implementa el desplazamiento de lineas sobre un eje, y la manipulación de las mismas moviendo los handles.

Tiene una customización mas especifica sobre los eventos del mouse y otras cosas mas, que otras herramientas no implementan. Creo que es la mas customizada, e implementa algunas cosas similares que se pueden usar como referencia.

Este es el archivo principal de la herramienta:

- [BidirectionalTool.js](https://github.com/Diex/cornerstoneTools/blob/erkom-viewer/src/tools/annotation/BidirectionalTool.js)

Y este esta es la carpeta con distintos módulos, donde implementa los distintos callbacks y su funcionalidad customizada.
Fijate que en la función de renderToolData llama a updatePerpendicularLineHandles para actualizar la linea perpendicular.
Hace otras cosas, al momento esa es la que pude ver, pero creo esta herramienta puede ser una buena referencia por su complejidad y customización.

- [bidirectionalTool](https://github.com/Diex/cornerstoneTools/blob/erkom-viewer/src/tools/annotation/bidirectionalTool)

### Descripcion de funciones

BaseTool y BaseAnnotationTool

- **renderToolData(evt)**: esta funcion se encarga de dibujar el contenido en el canvas.

- **createNewMeasurement(eventData)**: esta funcion se utiliza para configurar las medidas, es decir cada vez que se agrega una medida, esta funcion es ejecutada para setear la data en el STATE de la app, y para que renderToolData la reciba en el objeto "evt"

- **updateCachedStats(image, element, data)**: si no me equivoco, esta es para actualizar la data creaada en createNewMeasurement cuando algo se modifica.

- **pointNearTool(element, data, coords, interactionType)**: esta funcion es para devolver true/false indicando si el mouse está sobre alguna de las lineas o handles.
