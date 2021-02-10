import HalfBandClamp from 'makerjs-half-band-clamp';
import makerjs from 'makerjs';

export default function(
  radius,
  band,
  tabWidth,
  tabHeight,
  gap,
  angle,
  roundFillet,
  capFillet
) {
  var half = new HalfBandClamp(radius, band, tabWidth, tabHeight, gap);

  // function tryFillet(fName, pName1, pName2, value) {
  //   var fillet = makerjs.path.fillet(
  //     half.paths[pName1],
  //     half.paths[pName2],
  //     value
  //   );
  //   if (fillet) {
  //     half.paths[fName] = fillet;
  //   }
  // }

  // tryFillet('innerFillet', 'bandInner', 'tabInner', roundFillet);
  // tryFillet('outerFillet', 'bandOuter', 'tabOuter', roundFillet);

  // tryFillet('tabInnerFillet', 'tabInner', 'tabCap', capFillet);
  // tryFillet('tabOuterFillet', 'tabOuter', 'tabCap', capFillet);

  makerjs.model.rotate(half, angle);

  let models = {
    top: half,
    bottom: makerjs.model.mirror(half, false, true),
  };

  // la función que espera convertir el dibujo en svg necesita este modelo.
  //  makerjs.model.combine(models.top, models.bottom);
  console.log(models);
  var combined = makerjs.model.combine(models.top, models.bottom);
  combined.units = makerjs.unitType.Millimeter;
  return makerjs.model.rotate(combined, 270);
}
