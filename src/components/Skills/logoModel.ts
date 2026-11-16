import {
  Box2,
  BufferAttribute,
  BufferGeometry,
  Color,
  ExtrudeGeometry,
  MeshStandardMaterial,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface LogoModel { // 2 merged geometries: 2 draw calls per logo
  caps: BufferGeometry; // front and back faces, logo colours
  sides: BufferGeometry; // extruded slice, a bit darker
  extent: number; // largest side of the flat logo (model units)
}

export const CAP_MATERIAL = new MeshStandardMaterial({ vertexColors: true, metalness: 0.25, roughness: 0.35 });
export const SIDE_MATERIAL = new MeshStandardMaterial({ vertexColors: true, metalness: 0.6, roughness: 0.3 });

const DEPTH = 0.12; // thickness: 12% of the logo's width ("mini gap")
const BEVEL = 0.015; // bevel: 1.5% of the width
const LAYER = 0.05; // each later path sits slightly in front, so layers never z-fight
const SIDE_SHADE = 0.6; // sides are this much darker than the faces
const CURVE_SEGMENTS = 8; // plenty for logos drawn ~50px wide

const flattenGradients = (text: string): string => { // url(#gradient) → average colour: gradients can't be extruded
  const svg = new DOMParser().parseFromString(text, 'image/svg+xml');
  const average = (id: string) => {
    const stops = svg.querySelectorAll(`[id="${id}"] stop`);
    if (!stops.length) return '#000000';
    const sum = new Color(0, 0, 0);
    stops.forEach((stop) => {
      const value = stop.getAttribute('stop-color') ?? /stop-color:\s*([^;]+)/.exec(stop.getAttribute('style') ?? '')?.[1];
      sum.add(new Color(value ?? '#000000'));
    });
    return `#${sum.multiplyScalar(1 / stops.length).getHexString()}`;
  };
  return text
    .replace(/(fill|stroke)="url\(#([^)]+)\)"/g, (_, attribute: string, id: string) => `${attribute}="${average(id)}"`)
    .replace(/(fill|stroke)(\s*:\s*)url\(#([^)]+)\)/g, (_, property: string, colon: string, id: string) => `${property}${colon}${average(id)}`);
};

const isDecoration = (node: Element | null): boolean => { // mask/clip/pattern shapes and blend overlays; filter groups kept
  for (let element = node; element; element = element.parentElement) {
    if (/mix-blend-mode/.test(element.getAttribute('style') ?? '')) return true;
    if (['mask', 'clipPath', 'defs', 'pattern', 'symbol'].includes(element.tagName)) return true;
  }
  return false;
};

const extractGroups = (geometry: BufferGeometry, materialIndex: number, color: Color): BufferGeometry => {
  const ranges = geometry.groups.filter((group) => group.materialIndex === materialIndex);
  const count = ranges.reduce((total, group) => total + group.count, 0);
  const result = new BufferGeometry();

  for (const name of ['position', 'normal', 'uv']) {
    const source = geometry.getAttribute(name);
    const values = new Float32Array(count * source.itemSize);
    let offset = 0;
    ranges.forEach(({ start, count: length }) => {
      values.set(source.array.subarray(start * source.itemSize, (start + length) * source.itemSize), offset);
      offset += length * source.itemSize;
    });
    result.setAttribute(name, new BufferAttribute(values, source.itemSize));
  }

  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) colors.set([color.r, color.g, color.b], i * 3);
  result.setAttribute('color', new BufferAttribute(colors, 3));
  return result;
};

const build = (text: string): LogoModel => {
  const { paths } = new SVGLoader().parse(flattenGradients(text));

  const layers = paths.flatMap((path) => {
    const style = path.userData?.style ?? {};
    const node = path.userData?.node as Element | undefined;
    const fill: string = style.fill ?? '#000';
    if (fill === 'none' || fill === 'transparent' || isDecoration(node ?? null)) return [];
    if ((style.fillOpacity ?? 1) < 0.4 || (style.opacity ?? 1) < 0.4) return [];
    const shapes = SVGLoader.createShapes(path);
    return shapes.length ? [{ color: path.color.clone(), shapes }] : [];
  });

  const flat = new Box2();
  layers.forEach(({ shapes }) => shapes.forEach((shape) => shape.getPoints().forEach((p) => flat.expandByPoint(p))));
  const width = Math.max(flat.max.x - flat.min.x, flat.max.y - flat.min.y) || 1;
  const depth = width * DEPTH;
  const bevel = width * BEVEL;

  const caps: BufferGeometry[] = [];
  const sides: BufferGeometry[] = [];
  layers.forEach(({ color, shapes }, i) => {
    const extruded = new ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 3,
      curveSegments: CURVE_SEGMENTS,
    });
    extruded.translate(0, 0, -i * depth * LAYER); // later layers in front (the model is flipped later)
    caps.push(extractGroups(extruded, 0, color));
    sides.push(extractGroups(extruded, 1, color.clone().multiplyScalar(SIDE_SHADE)));
    extruded.dispose();
  });

  const model = {
    caps: (caps.length ? mergeGeometries(caps) : null) ?? new BufferGeometry(),
    sides: (sides.length ? mergeGeometries(sides) : null) ?? new BufferGeometry(),
    extent: width,
  };
  [...caps, ...sides].forEach((geometry) => geometry.dispose());

  model.caps.computeBoundingBox();
  model.sides.computeBoundingBox();
  const bounds = model.caps.boundingBox?.clone();
  if (bounds && model.sides.boundingBox) bounds.union(model.sides.boundingBox);
  if (bounds && !bounds.isEmpty()) {
    const centre = bounds.getCenter(bounds.min.clone());
    model.caps.translate(-centre.x, -centre.y, -centre.z);
    model.sides.translate(-centre.x, -centre.y, -centre.z);
  }
  return model;
};

const cache = new Map<string, Promise<LogoModel>>();

export const loadLogoModel = (url: string): Promise<LogoModel> => { // built once per URL, cached
  let model = cache.get(url);
  if (!model) {
    model = fetch(url)
      .then((response) => response.text())
      .then(build);
    cache.set(url, model);
  }
  return model;
};
