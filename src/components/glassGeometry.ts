type Point = [number, number];
const impact: Point = [49, 45];
const count = 18;
const boundary: Point[] = Array.from({ length: count }, (_, i) => {
  const angle = (i + Math.sin(i * 8.73) * 0.23) / count * Math.PI * 2;
  const dx = Math.cos(angle), dy = Math.sin(angle);
  const distance = Math.min(
    dx > 0 ? (100-impact[0])/dx : dx < 0 ? -impact[0]/dx : Infinity,
    dy > 0 ? (100-impact[1])/dy : dy < 0 ? -impact[1]/dy : Infinity,
  );
  return [impact[0]+dx*distance, impact[1]+dy*distance];
});
const rings = [0.16, 0.42, 0.72, 1].map((radius, ring) => boundary.map(([x,y],i): Point => {
  const variation = ring === 3 ? 1 : 0.85 + ((i*7+ring*3)%9)/30;
  return [impact[0]+(x-impact[0])*radius*variation, impact[1]+(y-impact[1])*radius*variation];
}));
const polygons: Point[][] = [];
for (let i=0;i<count;i++) {
  const next=(i+1)%count;
  polygons.push([impact,rings[0][i],rings[0][next]]);
  for (let ring=1;ring<rings.length;ring++) {
    const a=rings[ring-1][i], b=rings[ring-1][next];
    const c=rings[ring][next], d=rings[ring][i];
    // Mixed triangles and quadrilaterals avoid a uniform mosaic.
    if ((i+ring)%3!==0) polygons.push([a,b,d],[b,c,d]);
    else polygons.push([a,b,c,d]);
  }
}
// Close the four corners left between boundary rays.
for (const corner of [[0,0],[100,0],[100,100],[0,100]] as Point[]) {
  for (let i=0;i<count;i++) {
    const a=boundary[i], b=boundary[(i+1)%count];
    if ((Math.abs(a[0]-corner[0])<0.001 && Math.abs(b[1]-corner[1])<0.001) ||
        (Math.abs(a[1]-corner[1])<0.001 && Math.abs(b[0]-corner[0])<0.001)) {
      polygons.push([a,corner,b]); break;
    }
  }
}

export default polygons;
