// Hola! Churros case, section 02: the guided kitchen (production build of cinematic study 04, approved November 19, 2026).
// Loaded on demand by hola.js. Same scene, shots, and timing as the study; review tools removed.
// Character models: Microsoft Rocketbox (MIT), license notice stored with each model in characters/.
const BASE = new URL('./', import.meta.url).href;
// Hola! Churros · Section 02 · cinematic study 04 (animatic). Scene from Run the Team 14 via prototype 01, unchanged;
// only the camera type differs. Stand-ins below are grey placeholders for review, not final assets.
// 3D kitchen and team from Run the Team 14 (approved), unchanged except for the integration hooks marked 'prototype'.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// ---------- constants (cm). Plan x → X, plan y (front = 200) → Z, height → Y. Interior floor = 0.
const T = 3.5, FB = -10, GROUND = -40;          // wall thickness, body bottom, ground
const WT_IN = 196;                              // top of the vertical walls (study 01)
// study 01 roof: inner ceiling arc 196 at the walls to 208 at the center; outer arc from the wall line to 212
const arcIn = (z) => { const R = 422.7; return 208 - R + Math.sqrt(R * R - (z - 100) ** 2); };
const arcOut = (z) => { const R = 342.8; return 212 - R + Math.sqrt(R * R - (z - 100) ** 2); };
const WB = 90, WTOP = 170, DOOR_T = 175, CUT = 105;
const AX = 153.5, WR = 24, WY = GROUND + WR;    // axle x, wheel radius, wheel center
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- renderer
const stage = document.querySelector('[data-hk-stage]');   // the player in hola.js owns this element
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia('(max-width: 860px)').matches ? 1.5 : 2));   // prototype: phones capped at 1.5
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;
stage.appendChild(renderer.domElement);
const labelR = new CSS2DRenderer();
labelR.domElement.className = 'labels';
// prototype: no labels in the scene (CSS2D renderer kept but never attached or rendered)

const scene = new THREE.Scene();
scene.background = new THREE.Color('#ECE6DD');
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, 1, 4, 9000);   // cinematic study: perspective lens instead of the studies' orthographic view
// prototype: no orbit controls (no hidden gestures; the page scrolls normally)

scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a6a, 0.6));
const key = new THREE.DirectionalLight(0xfff6ea, 2.0);
key.position.set(280, 520, 400);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -380, right: 380, top: 380, bottom: -380, near: 10, far: 1800 });
key.shadow.bias = -0.0004; key.shadow.normalBias = 0.6;
scene.add(key);
const fill = new THREE.DirectionalLight(0xe8eefc, 0.55);
fill.position.set(-300, 260, -120);
scene.add(fill);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.ShadowMaterial({ opacity: .16 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = GROUND; ground.receiveShadow = true; scene.add(ground);

// ---------- textures
const tl = new THREE.TextureLoader();
const tex = (src) => { const t = tl.load(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8; return t;
}
// fine brushed grain, used as a roughness variation only (subtle)
const brushed = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 4200; i++) {
    const y = Math.random() * h, x = Math.random() * w, v = 112 + (Math.random() * 36 | 0);
    g.strokeStyle = `rgba(${v},${v},${v},.5)`; g.lineWidth = .4 + Math.random() * .8;
    g.beginPath(); g.moveTo(x - 140, y); g.lineTo(x + 140, y); g.stroke();
  }
}, false);
brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping; brushed.repeat.set(2, 2);

// wood-look printed vinyl, flat
const vinyl = canvasTex(1500, 1000, (g, w, h) => {
  const px = 5, pw = 15 * px, pl = 120 * px;
  let row = 0;
  for (let y = 0; y < h; y += pw, row++) {
    for (let x = -((row * 37) % 120) * px; x < w; x += pl) {
      const l = 0.93 + Math.random() * 0.14;
      g.fillStyle = `rgb(${146 * l | 0},${104 * l | 0},${68 * l | 0})`; g.fillRect(x, y, pl, pw);
      for (let k = 0; k < 24; k++) {
        const yy = y + Math.random() * pw;
        g.strokeStyle = `rgba(70,40,20,${.04 + Math.random() * .07})`; g.lineWidth = .6 + Math.random() * 1.2;
        g.beginPath(); g.moveTo(x, yy);
        for (let s = 0; s <= 8; s++) g.lineTo(x + s * pl / 8, yy + Math.sin(s * 1.3 + k) * 2);
        g.stroke();
      }
      g.fillStyle = 'rgba(60,35,18,.16)'; g.fillRect(x, y, 1, pw);
    }
    g.fillStyle = 'rgba(60,35,18,.14)'; g.fillRect(0, y, w, 1);
  }
});
// fine non-slip grain (bump only)
const grain = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 9000; i++) { const v = 100 + Math.random() * 60 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
}, false);
grain.wrapS = grain.wrapT = THREE.RepeatWrapping; grain.repeat.set(12, 8);

const perforated = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#cfd3d7'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#3a3a3a';
  for (let y = 8; y < h; y += 16) for (let x = 8 + ((y / 16) % 2) * 8; x < w; x += 16) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
});
perforated.wrapS = perforated.wrapT = THREE.RepeatWrapping; perforated.repeat.set(4, 6);

const wire = canvasTex(128, 128, (g, w, h) => {
  g.clearRect(0, 0, w, h); g.strokeStyle = '#d0d4d8'; g.lineWidth = 3;
  for (let i = 0; i <= w; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
});
wire.wrapS = wire.wrapT = THREE.RepeatWrapping;

// orange wave pattern for the rounded edges, matched to the wrap colors (#D6884C, stripe #C97748)
const wave = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#D6884C'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#C97748'; g.lineWidth = 22;
  for (let k = -1; k < 5; k++) {
    g.beginPath();
    for (let x = 0; x <= w; x += 4) { const y = k * 64 + 32 + Math.sin(x / w * Math.PI * 2) * 14; x ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
});
wave.wrapS = wave.wrapT = THREE.RepeatWrapping;

// ---------- materials (restrained stainless: moderate metalness, soft reflections)
const steelP = { color: 0xd6dade, metalness: .62, roughness: 1, roughnessMap: brushed, envMapIntensity: 1.15 };
const M = {
  steel: new THREE.MeshStandardMaterial({ ...steelP }),
  steelTop: new THREE.MeshStandardMaterial({ ...steelP, color: 0xdde0e3, roughness: .9 }),
  steelWall: new THREE.MeshStandardMaterial({ ...steelP, color: 0xcfd3d7, roughness: 1.1 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x8f949a, metalness: .7, roughness: .45 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xe8ebee, metalness: .9, roughness: .22 }),
  perf: new THREE.MeshStandardMaterial({ map: perforated, metalness: .6, roughness: .45 }),
  wire: new THREE.MeshStandardMaterial({ map: wire, alphaTest: .5, transparent: false, side: THREE.DoubleSide, metalness: .7, roughness: .4 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf2f0eb, roughness: .55 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0xf6f4f0, roughness: .85, side: THREE.DoubleSide }),
  roofSkin: new THREE.MeshStandardMaterial({ map: wave, color: 0xe2e2e2, roughness: .55, side: THREE.DoubleSide }),
  board: new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: .8 }),
  fridge: new THREE.MeshStandardMaterial({ color: 0xe7e6e2, roughness: .4, metalness: .05 }),
  black: new THREE.MeshStandardMaterial({ color: 0x1f1d1d, roughness: .6 }),
  red: new THREE.MeshStandardMaterial({ color: 0xc23a2e, roughness: .4 }),
  amber: new THREE.MeshStandardMaterial({ color: 0xe0782a, roughness: .35 }),
  plinth: new THREE.MeshStandardMaterial({ color: 0x3b3536, roughness: .8 }),
  oil: new THREE.MeshStandardMaterial({ color: 0x5e3a10, roughness: .35, envMapIntensity: .5 }),
  potIn: new THREE.MeshStandardMaterial({ color: 0xa3a8ad, metalness: .6, roughness: .4 }),
  floor: new THREE.MeshStandardMaterial({ map: vinyl, bumpMap: grain, bumpScale: .15, roughness: .62 }),
  grille: new THREE.MeshStandardMaterial({ color: 0x2b2a2a, metalness: .6, roughness: .5 }),
  cap: new THREE.MeshBasicMaterial({ color: 0x2F2A2B }),
  lamp: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8ee, emissiveIntensity: 1.2 }),
  chassis: new THREE.MeshStandardMaterial({ color: 0xe9e8e4, metalness: .3, roughness: .5 }),
  tire: new THREE.MeshStandardMaterial({ color: 0x1c1b1b, roughness: .9 }),
  rim: new THREE.MeshStandardMaterial({ color: 0x2a2a2c, metalness: .5, roughness: .45 }),
  fender: new THREE.MeshStandardMaterial({ color: 0x73CBD6, roughness: .45 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x8a5a3c, roughness: .8 }),
  kraft: new THREE.MeshStandardMaterial({ color: 0xc9a77c, roughness: .9 }),
  trim: new THREE.MeshStandardMaterial({ color: 0xe6e6e3, metalness: .5, roughness: .4 }),
  wrapFront: new THREE.MeshStandardMaterial({ map: tex(BASE + 'art/wrap-service-side.webp'), roughness: .45 }),
  wrapBack: new THREE.MeshStandardMaterial({ map: tex(BASE + 'art/wrap-back-side.webp'), roughness: .45 }),
  wrapEnd: new THREE.MeshStandardMaterial({ map: tex(BASE + 'art/wrap-end.webp'), roughness: .45 }),
  panelIn: new THREE.MeshStandardMaterial({ color: 0xdfe2e5, metalness: .45, roughness: .55 }),
};
const labelMat = (src) => new THREE.MeshStandardMaterial({ map: tex(src), roughness: .4 });

// ---------- scene graph
const root = new THREE.Group();
root.position.set(-150, 0, -100);
scene.add(root);
const G = {};
for (const n of ['structure', 'exterior', 'roof', 'counters', 'equipment', 'overhead', 'moving', 'caps', 'labels', 'layer-staff', 'layer-order', 'layer-added']) {
  const g = new THREE.Group(); g.name = n; G[n] = g; root.add(g);
}
const near = [];
const MECH = { levers: [] };   // moving parts operated by the staff (dough dispenser lever and plunger, filling dispenser levers)
const section = new THREE.Plane(new THREE.Vector3(0, -1, 0), CUT);

// artwork mapping by world position, aspect preserved (no stretch)
const FACE = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 };
const LONG = 300 + 2 * T, SHORT = 200 + 2 * T;
const UV = {
  front: (x, y) => [(x + T) / LONG, (y - FB) / (LONG / 1.4888)],
  back: (x, y) => [(300 + T - x) / LONG, (y - FB) / (LONG / 1.4888)],
  right: (x, y, z) => [(200 + T - z) / SHORT, (y - FB) / SHORT],
  left: (x, y, z) => [(z + T) / SHORT, (y - FB) / SHORT],
};
function mats(face, ext, base = M.steelWall, inner, innerFace) {
  const a = [base, base, base, base, base, base];
  if (face != null) a[FACE[face]] = ext;
  if (inner) a[FACE[innerFace]] = inner;
  return a;
}
function box(x0, x1, z0, z1, h0, h1, mat, parent, o = {}) {
  let g;
  if (o.r) { g = new RoundedBoxGeometry(x1 - x0, h1 - h0, z1 - z0, 2, Math.min(o.r, (x1 - x0) / 2.01, (h1 - h0) / 2.01, (z1 - z0) / 2.01)); }
  else g = new THREE.BoxGeometry(x1 - x0, h1 - h0, z1 - z0);
  g.translate((x0 + x1) / 2, (h0 + h1) / 2, (z0 + z1) / 2);
  if (o.uv) {
    const p = g.attributes.position, uv = g.attributes.uv, f = FACE[o.uvFace];
    for (let i = f * 4; i < f * 4 + 4; i++) { const [u, v] = o.uv(p.getX(i), p.getY(i), p.getZ(i)); uv.setXY(i, u, v); }
  }
  if (o.pivot) g.translate(-o.pivot[0], -o.pivot[1], -o.pivot[2]);
  const m = new THREE.Mesh(g, mat);
  m.castShadow = !o.noShadow; m.receiveShadow = true;
  if (o.name) m.name = o.name;
  parent.add(m);
  if (o.near) near.push(m);
  return m;
}
function cyl(x, z, h0, h1, r0, r1, mat, parent, o = {}) {
  const g = new THREE.CylinderGeometry(r1 ?? r0, r0, h1 - h0, o.seg || 32, 1, !!o.open, o.ts || 0, o.tl || Math.PI * 2);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, (h0 + h1) / 2, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m); return m;
}
const UPV = new THREE.Vector3(0, 1, 0);
function placeRod(m, A, B) {
  const d = new THREE.Vector3().subVectors(B, A);
  m.position.copy(A).addScaledVector(d, .5);
  m.scale.set(1, d.length(), 1);
  m.quaternion.setFromUnitVectors(UPV, d.clone().normalize());
}
function rod(a, b, r, mat, parent, seg = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, seg), mat);
  m.castShadow = true; parent.add(m); placeRod(m, new THREE.Vector3(...a), new THREE.Vector3(...b)); return m;
}
function label(text, x, h, z, o = {}) {
  const el = document.createElement('div');
  el.className = 'lbl'; el.textContent = text;
  const obj = new CSS2DObject(el); obj.position.set(x, h, z);
  obj.userData = { h, nearSide: !!o.near, overhead: !!o.overhead, ext: !!o.ext };
  G.labels.add(obj); return obj;
}
// extruded wall panel with an optional wheel-arch notch, art mapped by position
function wallPanel(shapePts, z0, depth, uvFn, mat, parent, o = {}) {
  const s = new THREE.Shape(shapePts.map(p => new THREE.Vector2(...p)));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, z0);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const [u, v] = uvFn(p.getX(i), p.getY(i), p.getZ(i)); uv.setXY(i, u, v); }
  const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; parent.add(m);
  if (o.near) near.push(m);
  return m;
}

// ---------- floor and body
box(0, 300, 0, 200, FB, 0, M.plinth, G.structure);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), M.floor);
floor.rotation.x = -Math.PI / 2; floor.position.set(150, 0.05, 100); floor.receiveShadow = true;
G.structure.add(floor);

// wheel arch (trapezoid, from the exterior elevation)
const ARCH = [[122, FB], [135.5, 14], [172.5, 14], [186, FB]];
const longLower = [[-T, FB], ...ARCH, [300 + T, FB], [300 + T, WB], [-T, WB]];
wallPanel(longLower, 200, T, UV.front, M.wrapFront, G.structure, { near: true });
wallPanel(longLower, -T, T, UV.back, M.wrapBack, G.structure);
// wheel-well liner: thin dark plate inside the wall thickness. (Before: a 3.5 cm box sharing the plane z = 200
// with the front counter's back panel, which caused z-fighting stripes inside the arch.)
for (const z of [200.25, -0.55]) box(122, 186, z, z + .3, FB, 14, M.plinth, G.structure, { noShadow: true });
// back wall, upper part (continuous stainless inside)
box(-T, 300 + T, -T, 0, 86, WT_IN, mats('nz', M.wrapBack), G.structure, { uv: UV.back, uvFace: 'nz' });
// cinematic study: steel strip over the seam where the back counter meets the wall (the lower wall panel shows its wrap art there)
box(0, 300, 0.02, 0.45, 83, 91.2, M.steelWall, G.structure, { noShadow: true });
// window sills (aluminium trim over the wall edge)
for (const [a, b] of [[20.5, 140], [160, 280]]) box(a, b, 200, 200 + T + .4, WB - .2, WB + .4, M.trim, G.structure, { near: true, noShadow: true });
box(-T - .4, 0, 40, 160, WB - .2, WB + .4, M.trim, G.structure, { noShadow: true });
// front wall: posts and top band around windows 2 (x 20.5 to 140) and 1 (x 160 to 280)
const F = (x0, x1, h0, h1) => box(x0, x1, 200, 200 + T, h0, h1, mats('pz', M.wrapFront), G.structure, { uv: UV.front, uvFace: 'pz', near: true });
F(-T, 20.5, WB, WTOP); F(140, 160, WB, WTOP); F(280, 300 + T, WB, WTOP); F(-T, 300 + T, WTOP, WT_IN);
// left end with window 3 (z 40 to 160)
const L = (z0, z1, h0, h1) => box(-T, 0, z0, z1, h0, h1, mats('nx', M.wrapEnd), G.structure, { uv: UV.left, uvFace: 'nx' });
L(0, 40, FB, WT_IN); L(160, 200, FB, WT_IN); L(40, 160, FB, WB); L(40, 160, WTOP, WT_IN);
// right end (hitch end) with the staff door (z 60 to 140)
const Rw = (z0, z1, h0, h1) => box(300, 300 + T, z0, z1, h0, h1, mats('px', M.wrapEnd), G.structure, { uv: UV.right, uvFace: 'px', near: true });
Rw(0, 60, FB, WT_IN); Rw(140, 200, FB, WT_IN); Rw(60, 140, DOOR_T, WT_IN); Rw(60, 140, FB, 0);
// light aluminium corner trims
for (const [x, z] of [[-T, -T], [300 + T, -T], [-T, 200 + T], [300 + T, 200 + T]]) box(x - 1, x + 1, z - 1, z + 1, FB, WT_IN, M.trim, G.exterior, { noShadow: true, near: x > 0 || z > 0 });
// exhaust grille: back side, near the window 3 corner, high (per back-side photo)
box(10, 42, -T - 1.2, -T, 156, 174, M.grille, G.exterior);
for (let i = 0; i < 6; i++) box(11, 41, -T - 2.4, -T - 1.2, 157.5 + i * 2.7, 158.6 + i * 2.7, M.grille, G.exterior, { noShadow: true });
// taillights at the window 3 end (vehicle rear); plate not modeled
for (const z of [12, 176]) box(-T - 1.5, -T, z, z + 12, FB + 6, FB + 22, M.amber, G.exterior);

// ---------- roof (study 01 geometry): gentle arch across the width, orange wave outside, white inside
{
  const segs = 48;
  const strip = (pts, uvs, mat) => {
    const idx = [];
    for (let i = 0; i < segs; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; G.roof.add(m); return m;
  };
  const surf = (z0, z1, x0, x1, hFn, mat, uvFn) => {
    const pos = [], uv = [];
    for (let i = 0; i <= segs; i++) {
      const z = z0 + (z1 - z0) * i / segs, h = hFn(z);
      for (const x of [x0, x1]) { pos.push(x, h, z); uv.push(...uvFn(x, z)); }
    }
    return strip(pos, uv, mat);
  };
  // stripes continue from the walls across the roof: they run front to back and repeat along the length
  surf(-T, 200 + T, -T, 300 + T, arcOut, M.roofSkin, (x, z) => [(z + T) / 44, (x + T) / 44]);
  surf(0, 200, 0, 300, z => arcIn(z) - .2, M.ceiling, (x, z) => [z / 200, x / 300]);
  // gable fill above the end walls (wave, stripes vertical)
  for (const x of [-T - .05, 300 + T + .05]) {
    const pos = [], uv = [];
    for (let i = 0; i <= segs; i++) {
      const z = -T + (200 + 2 * T) * i / segs;
      pos.push(x, WT_IN, z, x, arcOut(z), z); uv.push(WT_IN / 44, (z + T) / 44, arcOut(z) / 44, (z + T) / 44);
    }
    strip(pos, uv, M.roofSkin);
  }
  for (const x of [50, 150, 250]) {
    const lamp = new THREE.Mesh(new RoundedBoxGeometry(60, 2, 12, 2, .8), M.lamp);
    lamp.position.set(x, arcIn(100) - 1.5, 100); G.roof.add(lamp);
    const pl = new THREE.PointLight(0xfff6ea, 0.3, 380, 0); pl.position.set(x, arcIn(100) - 10, 100); G.roof.add(pl);
  }
}

// ---------- chassis, single axle, wheels, hitch, supports
{
  const E = G.exterior;
  for (const z of [26, 168]) box(-T, 300 + T, z, z + 6, FB - 10, FB - .2, M.chassis, E);
  for (const x of [-T, 300 - 3]) box(x, x + 6.5, 26, 174, FB - 8, FB - .2, M.chassis, E);
  for (const x of [80, 230]) box(x, x + 5, 26, 174, FB - 7, FB - .2, M.chassis, E);
  // axle and leaf springs
  rod([AX, WY, -6], [AX, WY, 206], 3, M.chassis, E, 16);
  for (const z of [26, 168]) box(AX - 34, AX + 34, z, z + 6, WY - 2, WY + 1.5, M.steelDark, E, { r: .8 });
  // wheels: tire, rim, hub
  const noFar = false;
  for (const zc of [200.5, -0.5]) {
    const s = zc > 100 ? 1 : -1;
    const E = noFar && s < 0 ? new THREE.Group() : G.exterior;
    const tire = new THREE.Mesh(new THREE.TorusGeometry(WR - 5.5, 5.5, 18, 40), M.tire);
    tire.position.set(AX, WY, zc); tire.scale.set(1, 1, 1.25); tire.castShadow = true; E.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(WR - 9, WR - 9, 11, 32), M.rim);
    rim.rotation.x = Math.PI / 2; rim.position.set(AX, WY, zc); E.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(5, 6, 3, 24), M.chrome);
    hub.rotation.x = Math.PI / 2; hub.position.set(AX, WY, zc + s * 6.5); E.add(hub);
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; const n = new THREE.Mesh(new THREE.SphereGeometry(.9, 8, 6), M.chrome); n.position.set(AX + Math.cos(a) * 8.5, WY + Math.sin(a) * 8.5, zc + s * 5.6); E.add(n); }
    // fender flare along the arch edge (teal, as in the photos)
    const zf = s > 0 ? [200 + T + .15, 200 + T + 6] : [-T - 6, -T - .15];
    for (let i = 0; i < 3; i++) {
      const [a, b] = [ARCH[i], ARCH[i + 1]];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const m = new THREE.Mesh(new THREE.BoxGeometry(len + 1.5, 1.6, 6), M.fender);
      m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + .8, (zf[0] + zf[1]) / 2);
      m.rotation.z = Math.atan2(b[1] - a[1], b[0] - a[0]); m.castShadow = true; E.add(m);
    }
  }
  // A-frame hitch from the right (door) end, coupler, jockey stand
  const hy = FB - 6, tip = [404, hy, 100];
  rod([300, hy, 30], tip, 3.2, M.chassis, E); rod([300, hy, 170], tip, 3.2, M.chassis, E);
  rod([336, hy, 59], [336, hy, 141], 2.5, M.chassis, E);
  box(398, 416, 95, 105, hy - 3, hy + 5, M.steelDark, E, { r: 1.5 });
  cyl(414, 100, hy + 4, hy + 8, 3.6, 3.6, M.steelDark, E);
  cyl(390, 100, GROUND + 4, hy + 2, 2.2, 2.2, M.chassis, E);
  box(384, 396, 94, 106, GROUND, GROUND + 4, M.steelDark, E);
  rod([390, hy + 6, 100], [390, hy + 16, 100], 1.4, M.chassis, E);
  // wooden step on the A-frame, below the door (seen in photos)
  for (let i = 0; i < 4; i++) box(306 + i * 11, 316 + i * 11, 64, 136, hy + 3, hy + 5.5, M.wood, E);
  // four corner support legs
  for (const [x, z] of [[2, 4], [2, 192], [294, 4], [294, 192]]) { box(x, x + 4.5, z, z + 4.5, GROUND + 2, FB, M.chassis, E); box(x - 2.5, x + 7, z - 2.5, z + 7, GROUND, GROUND + 2, M.steelDark, E); }
}

// ---------- back counter: stainless top, white wooden sliding doors below
const TOPR = { r: .7 };
box(0, 62.6, 0, 48, 86, 90, M.steelTop, G.counters, TOPR);
box(103.1, 267.3, 0, 48, 86, 90, M.steelTop, G.counters, TOPR);
box(267.3, 296.7, 0, 7.3, 86, 90, M.steelTop, G.counters);
box(267.3, 296.7, 41.6, 48, 86, 90, M.steelTop, G.counters);
box(296.7, 300, 0, 48, 86, 90, M.steelTop, G.counters);
box(0, 300, 46, 48.2, 84, 90, M.steelTop, G.counters, { r: .5 });
box(0, 300, 0, 46, 8, 86, M.steelWall, G.counters);
box(0, 300, 0, 43, 0, 8, M.plinth, G.counters);
const sd = (x0, x1, z, h0 = 9, h1 = 83.5) => box(x0, x1, z, z + 1.1, h0, h1, M.white, G.counters, { r: .4 });
sd(1, 32, 47); sd(30, 61.5, 45.8); sd(104, 154, 47); sd(152, 201.5, 45.8); sd(251, 299, 46.4); sd(63.5, 102.2, 46.4, 9, 46.5);
for (const [x, h0] of [[3, 55], [58.5, 55], [107, 55], [198.5, 55], [294.5, 55], [99.5, 32]]) box(x, x + 1.6, 47.9, 48.5, h0, h0 + 12, M.black, G.counters, { r: .5 });
box(202.3, 250.1, 46, 47.8, 3, 83.5, M.fridge, G.equipment, { name: 'mini-fridge', r: .8 });
box(245.5, 247, 47.8, 49.2, 50, 75, M.steelDark, G.equipment, { r: .5 });
box(206, 230, 47.8, 48, 6, 10, M.plinth, G.equipment, { noShadow: true });

// ---------- left bench: open stainless shelves
box(0, 20.5, 48, 160, 86, 90, M.steelTop, G.counters, TOPR);
box(0, 20.5, 48, 160, 43.5, 45, M.steel, G.counters, { r: .4 });
box(0, 20.5, 48, 160, 8, 9.5, M.steel, G.counters, { r: .4 });
box(17.5, 20.5, 48, 50.5, 0, 86, M.steel, G.counters, { r: .5 });
box(17.5, 20.5, 157.5, 160, 0, 86, M.steel, G.counters, { r: .5 });
box(19, 20.5, 48, 160, 81, 86, M.steel, G.counters);

// ---------- front counter: stainless top, open shelves, bins, cash drawer
box(0, 300, 160, 200, 86, 90, M.steelTop, G.counters, TOPR);
box(0, 300, 160, 161.4, 80, 86, M.steel, G.counters);
for (const x of [0, 18, 141, 223.5, 297.5]) box(x, x + 2.5, 160, 162.5, 0, 80, M.steel, G.counters, { r: .5 });
box(20.5, 141, 161, 199, 43.5, 45, M.steel, G.counters, { r: .4 });
box(20.5, 141, 161, 199, 8, 9.5, M.steel, G.counters, { r: .4 });
box(0, 300, 196, 200, 0, 86, M.steelWall, G.counters);
// ingredient tubs and spare containers on the open shelves (generic)
for (const x of [26, 52, 78, 104]) box(x, x + 20, 168, 192, 9.5, 24, M.white, G.counters, { r: 1.2 });
for (const z of [60, 86, 112]) box(2, 16, z, z + 20, 9.5, 22, M.white, G.counters, { r: 1.2 });

// ---------- equipment on the back counter
// drain trays: pans with perforated inserts
// study 03: shallow stainless pans (4.5 cm). Next to the fryer: draining pan with a raised, removable wire rack.
// Outer pan: sugar and cinnamon mixture. (Which pan held which is an assumption, pending Jackie's confirmation.)
const PAN = (x0) => { const E = G.equipment, z0 = 3.1, z1 = 45, t = .6, y0 = 90, y1 = 94.5;
  box(x0, x0 + 29, z0, z1, y0, y0 + t, M.steel, E, { r: .2 });
  box(x0, x0 + t, z0, z1, y0, y1, M.steel, E, { r: .2 }); box(x0 + 29 - t, x0 + 29, z0, z1, y0, y1, M.steel, E, { r: .2 });
  box(x0, x0 + 29, z0, z0 + t, y0, y1, M.steel, E, { r: .2 }); box(x0, x0 + 29, z1 - t, z1, y0, y1, M.steel, E, { r: .2 });
  for (const [a, b] of [[x0 - .3, x0 + .9], [x0 + 28.1, x0 + 29.3]]) box(a, b, z0 - .3, z1 + .3, y1 - .2, y1 + .3, M.steelTop, E, { r: .2, noShadow: true }); };
PAN(32.1); PAN(1.9);
const RACK_Y = 93.0;   // top of the rack wires
{ const x0 = 32.1, E = G.equipment;
  for (let x = x0 + 2; x <= x0 + 27.01; x += 1.8) rod([x, RACK_Y - .18, 5.2], [x, RACK_Y - .18, 42.9], .18, M.chrome, E, 6);
  for (const z of [6, 15, 24.5, 34, 42]) rod([x0 + 1.4, RACK_Y - .5, z], [x0 + 27.6, RACK_Y - .5, z], .22, M.chrome, E, 6);
  for (const [x, z] of [[x0 + 2.4, 6.4], [x0 + 26.6, 6.4], [x0 + 2.4, 41.6], [x0 + 26.6, 41.6]]) rod([x, 90.6, z], [x, RACK_Y - .5, z], .25, M.chrome, E, 6); }
const SUGAR_Y = 92.6;  // surface of the mixture
{ const x0 = 1.9, w = 27.8, d = 40.7, cv = document.createElement('canvas'); cv.width = 512; cv.height = 512; const g = cv.getContext('2d'), r = rnd(4242);
  g.fillStyle = '#eadcc4'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 26000; i++) { const v = r(); g.fillStyle = v < .2 ? '#8b4a22' : v < .32 ? '#a8693a' : v < .7 ? '#f6efe2' : '#d9c6a6'; const sz = .8 + r() * 1.8; g.fillRect(r() * 512, r() * 512, sz, sz); }
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
  const geo = new THREE.PlaneGeometry(w, d, 28, 40); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position;
  for (let k = 0; k < p.count; k++) { const u = p.getX(k) / w + .5, v = p.getZ(k) / d + .5; const hm = (1 - Math.pow(2 * u - 1, 6)) * (1 - Math.pow(2 * v - 1, 6)); p.setY(k, .35 * hm + .12 * (r() - .5)); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tx, roughness: .95 })); m.position.set(x0 + 14.5, SUGAR_Y - .3, 24.05); m.receiveShadow = true; m.name = 'sugar-cinnamon'; G.equipment.add(m); }
// fryer: stainless cabinet, two oil wells with wire baskets, rear two-button panel
{
  const E = G.equipment;
  box(62.6, 103.1, 5.5, 46, 48, 90, M.steel, E, { name: 'fryer', r: .6 });
  box(62.6, 103.1, 5.5, 46, 90, 92, M.steelTop, E, { r: .6 });
  for (const x0 of [64.7, 84.9]) {
    box(x0, x0 + 16, 7.3, 44.2, 91.6, 92.1, M.plinth, E, { noShadow: true });
    box(x0 + .4, x0 + 15.6, 7.7, 43.8, 91.9, 92.3, M.oil, E, { noShadow: true });
    // study 11: each basket is a group (same geometry at rest) so person 6 can lift it out of the oil
    const B = new THREE.Group(); E.add(B); if (x0 === 64.7) MECH.basket = B;
    // study 03: open basket (no top), wire-mesh sides and floor; floor at 85.5, 8 cm below the rim at 93.6
    { const cx = x0 + 8, cz = 25.8, y0 = 85.5, y1 = 93.6, hw = 7, hd = 17, h = y1 - y0;
      const face = (w, hh, x, y, z, rx, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), M.wire); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.castShadow = true; B.add(m); };
      face(2 * hw, 2 * hd, cx, y0, cz, -Math.PI / 2, 0);                                  // floor
      face(2 * hd, h, cx - hw, y0 + h / 2, cz, 0, Math.PI / 2); face(2 * hd, h, cx + hw, y0 + h / 2, cz, 0, Math.PI / 2);
      face(2 * hw, h, cx, y0 + h / 2, cz - hd, 0, 0); face(2 * hw, h, cx, y0 + h / 2, cz + hd, 0, 0); }
    for (const [a, b, c, d] of [[x0 + 1, x0 + 15, 8.8, 9.6], [x0 + 1, x0 + 15, 42, 42.8], [x0 + 1, x0 + 1.8, 8.8, 42.8], [x0 + 14.2, x0 + 15, 8.8, 42.8]]) box(a, b, c, d, 93.6, 94.2, M.chrome, B, { noShadow: true });
    rod([x0 + 8, 94, 42.8], [x0 + 8, 99, 53], .55, M.chrome, B).name = x0 === 64.7 ? 'basket1-arm' : '';
    rod([x0 + 8, 99, 53], [x0 + 8, 99.6, 61], 1.1, M.black, B).name = x0 === 64.7 ? 'basket1-grip' : '';
    rod([x0 + 4, 94, 9], [x0 + 4, 99, 4], .4, M.chrome, B);
  }
  // rear control panel, angled
  const panel = box(62.6, 103.1, 0, 5.5, 92, 104, M.steel, E, { name: 'fryer-controls', r: .6 });
  for (const [x, m] of [[88.5, M.black], [94.5, M.red]]) { const k = cyl(0, 0, 0, 1.6, 1.7, 1.7, m, E); k.rotation.x = Math.PI / 2; k.position.set(x, 99, 6.3); }
  for (const x of [70, 76]) { const k = cyl(0, 0, 0, .8, .8, .8, M.amber, E); k.rotation.x = Math.PI / 2; k.position.set(x, 99.5, 6); }
}
// holding tray (on the counter, between fryer and dough dispenser)
box(103.8, 114, 10, 40, 90, 93.5, M.steel, G.equipment, { name: 'holding-tray', r: .6 });
box(104.7, 113.1, 10.9, 39.1, 93.2, 93.6, M.potIn, G.equipment, { noShadow: true });
// cutting board directly beneath the dough dispenser
box(116, 144, 13, 42, 90, 91.8, M.board, G.equipment, { name: 'cutting-board', r: .6 });
// manual dough dispenser: tall frame, orange-branded reservoir, side lever, bottom outlet
{
  const E = G.equipment, cx = 130.1, cz = 24;
  for (const x of [117.2, 143]) { box(x - 1.2, x + 1.2, 13.4, 15.8, 91.8, 172, M.steel, E, { r: .5 }); box(x - 3, x + 3, 12, 18, 91.8, 92.6, M.steel, E); }
  box(116, 144.2, 13.4, 15.8, 168.5, 172, M.steel, E, { r: .5 });
  box(116, 144.2, 13.4, 15.8, 101, 103, M.steel, E, { r: .4 });
  for (const y of [110, 138]) { rod([117.2, y, 15], [cx, y, cz - 9.3], .7, M.steel, E); rod([143, y, 15], [cx, y, cz - 9.3], .7, M.steel, E); const ring = new THREE.Mesh(new THREE.TorusGeometry(9.4, .6, 8, 40), M.steel); ring.rotation.x = Math.PI / 2; ring.position.set(cx, y, cz); E.add(ring); }
  cyl(cx, cz, 103, 147, 9, 9, M.steel, E, { seg: 48 });
  cyl(cx, cz, 109, 141, 9.1, 9.1, labelMat(BASE + 'art/label-dough.webp'), E, { ts: Math.PI, open: true, seg: 56 });
  cyl(cx, cz, 147, 149, 9.6, 9.6, M.steelDark, E, { seg: 48 });
  cyl(cx, cz, 96.5, 103, 1.6, 7, M.steel, E);
  cyl(cx, cz, 94, 96.5, 1.1, 1.6, M.chrome, E);
  MECH.plunger = rod([cx, 149, cz], [cx, 168, cz], .9, M.chrome, E); MECH.plungerY = MECH.plunger.position.y;
  // side lever: pivot on the right post, handle toward the operator
  const piv = [145.5, 160, 18];
  cyl(145.5, 18, 158.5, 161.5, 1.8, 1.8, M.steelDark, E).rotation.z = Math.PI / 2;
  // lever: a group turning about the pivot's x axis (same geometry at rest)
  const lev = new THREE.Group(); lev.position.set(...piv); E.add(lev); MECH.dough = lev;
  const rel = (q) => [q[0] - piv[0], q[1] - piv[1], q[2] - piv[2]];
  rod([0, 0, 0], rel([cx, 158, cz]), .8, M.steel, lev);
  rod([0, 0, 0], rel([147, 132, 56]), 1, M.steel, lev).name = 'dough-lever-rod';
  rod(rel([147, 132, 56]), rel([147.5, 126, 63]), 1.8, M.black, lev).name = 'dough-lever-grip';
}
// hand-wash sink and tap
{
  const s = G.equipment;
  box(267.3, 296.7, 7.3, 41.6, 72, 73, M.steelDark, s);
  for (const [a, b, c, d] of [[267.3, 268.3, 7.3, 41.6], [295.7, 296.7, 7.3, 41.6], [267.3, 296.7, 7.3, 8.3], [267.3, 296.7, 40.6, 41.6]]) box(a, b, c, d, 72, 90, M.steel, s);
  box(266.3, 297.7, 6.3, 42.6, 89.6, 90.6, M.steelTop, s, { r: .4, noShadow: true });
  cyl(282, 24.5, 73, 73.3, 2.2, 2.2, M.black, s);
  const path = new THREE.CatmullRomCurve3([[282, 90.5, 3], [282, 114, 3], [282, 120, 9], [282, 113, 18]].map(v => new THREE.Vector3(...v)));
  const tap = new THREE.Mesh(new THREE.TubeGeometry(path, 32, 1, 12), M.chrome); tap.castShadow = true; s.add(tap);
  cyl(282, 3, 90.5, 93, 2.4, 2.4, M.chrome, s);
  rod([282, 104, 3], [282, 104, 10], .6, M.chrome, s);
}

// ---------- filling dispensers on the left bench, levers toward the aisle
[[95.7, 'DoceLeite'], [109.4, 'Nutella'], [124.2, 'Morango'], [138.8, 'Laka']].forEach(([z, f], di) => {
  const s = G.equipment;
  box(2.5, 15, z - 5.2, z + 5.2, 90, 91, M.steel, s, { r: .4 });
  cyl(8.5, z, 104, 130, 4.6, 4.6, M.steel, s);
  cyl(8.5, z, 107, 127, 4.68, 4.68, labelMat(`${BASE}art/label-${f}.webp`), s, { ts: -Math.PI / 2, open: true, seg: 40 });
  cyl(8.5, z, 130, 131.4, 4.9, 4.9, M.steelDark, s);
  cyl(8.5, z, 131.4, 133, 1.2, 1.2, M.black, s);
  cyl(8.5, z, 99, 104, 1.4, 4.6, M.steel, s);
  box(8.5, 14, z - 1.6, z + 1.6, 95, 100.5, M.chrome, s, { r: .5 });
  // outlet as in the event photo (_DSC0374): short neck under the valve into a horizontal spout toward the aisle (study 08)
  cyl(12.5, z, 93.6, 95, 1.1, 1.1, M.chrome, s);
  { const el = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), M.chrome); el.position.set(12.5, 94.4, z); s.add(el); }
  rod([12.5, 94.4, z], [20, 94.4, z], .8, M.chrome, s).name = `nozzle${di}`;
  rod([20, 94.4, z], [21.2, 94.4, z], .55, M.chrome, s).name = `nozzle${di}-tip`;
  // lever: a group turning about the valve's z axis (same geometry at rest)
  const lg = new THREE.Group(); lg.position.set(13.5, 100, z); s.add(lg); MECH.levers[di] = lg;
  rod([0, 0, 0], [19.5, 3, 0], .55, M.chrome, lg).name = `lever${di}-rod`;
  rod([19.5, 3, 0], [22.1, 3.4, 0], 1, M.black, lg).name = `lever${di}-grip`;
});

// ---------- front counter equipment
[15.2, 37, 59, 81.1, 102.9, 124.8].forEach(x => {
  box(x, x + 20, 165, 195, 90, 96, M.steel, G.equipment, { r: 1.2 });
  box(x - .4, x + 20.4, 164.6, 195.4, 95.2, 96.2, M.steelTop, G.equipment, { r: .5, noShadow: true });
  box(x + 1.4, x + 18.6, 166.4, 193.6, 95.9, 96.3, M.potIn, G.equipment, { noShadow: true });
});
// ---------- study 10: toppings in the six containers (window 2, left to right). Each one is a heaped mound shaped and
// colored like the ingredient, plus instanced pieces with their own geometry: sprinkles are rods, coconut is thin shreds,
// peanuts and cookie crumbs are irregular chunks, chocolate candies are glossy discs. Containers are not changed.
const TOPPINGS = [
  { name: 'Chocolate sprinkles', mound: 0x3a2116, n: 1500, geo: () => new THREE.CylinderGeometry(.13, .13, .62, 6), cols: [0x2b170e, 0x3d2216, 0x4a2b1b], rough: .6, lie: true, s: [.85, 1.15] },
  { name: 'Colored sprinkles', mound: 0xeae2d4, n: 1500, geo: () => new THREE.CylinderGeometry(.12, .12, .58, 6), cols: [0xf06292, 0xfdd835, 0x4fc3f7, 0x81c784, 0xffffff, 0xff8a3d, 0xba68c8], rough: .45, lie: true, s: [.85, 1.15] },
  { name: 'Shredded coconut', mound: 0xf3efe6, n: 1700, geo: () => new THREE.BoxGeometry(.62, .07, .16), cols: [0xfbfaf6, 0xf2ede2, 0xe8e0cf], rough: .9, lie: false, s: [.7, 1.3] },
  { name: 'Crushed peanuts', mound: 0xb57d47, n: 720, geo: () => new THREE.IcosahedronGeometry(.32, 0), cols: [0xd4a467, 0xe6c58f, 0x8a5530, 0xc08a50], rough: .8, lie: false, s: [.8, 1.7], squash: true },
  { name: 'Cookie crumbs', mound: 0xc4955a, n: 1500, geo: () => new THREE.DodecahedronGeometry(.17, 0), cols: [0xd9ae6e, 0xb8864a, 0xe6c48c, 0xa8743c], rough: .9, lie: false, s: [.6, 1.4], squash: true },
  { name: 'Chocolate candies', mound: 0x5a3828, n: 520, geo: () => new THREE.SphereGeometry(.56, 14, 8), cols: [0xd32f2f, 0xfbc02d, 0x1e88e5, 0x43a047, 0xf57c00, 0x6d4c41], rough: .3, lie: true, s: [.95, 1.05], disc: true },
];
const TOP_X = [15.2, 37, 59, 81.1, 102.9, 124.8];
const moundH = (u, v) => (1 - Math.pow(2 * u - 1, 6)) * (1 - Math.pow(2 * v - 1, 6));   // flat top, soft edges, u and v in 0..1
const toppingY = (x0, x, z) => { const u = (x - x0 - 1.6) / 16.8, v = (z - 166.6) / 26.8; return 96.3 + 1.15 * moundH(THREE.MathUtils.clamp(u, 0, 1), THREE.MathUtils.clamp(v, 0, 1)); };
const toppingPieces = new THREE.Group(); root.add(toppingPieces);
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
TOPPINGS.forEach((T, i) => {
  const x0 = TOP_X[i], r = rnd(1000 + i * 77);
  // mound: a heaped surface inside the container (checked as equipment)
  const g = new THREE.PlaneGeometry(16.8, 26.8, 28, 44); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let k = 0; k < p.count; k++) { const x = p.getX(k) + x0 + 10, z = p.getZ(k) + 180; p.setY(k, toppingY(x0, x, z) - .25 + .12 * (r() - .5)); p.setX(k, x); p.setZ(k, z); }
  g.computeVertexNormals();
  const mound = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: T.mound, roughness: .95 })); mound.name = `topping-${i + 1}`; mound.receiveShadow = true; G.equipment.add(mound);
  // pieces
  const geo = T.geo(); if (T.disc) geo.scale(1, .45, 1);
  const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: T.rough, metalness: 0 }), T.n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), col = new THREE.Color();
  for (let k = 0; k < T.n; k++) {
    const x = x0 + 2 + 16 * r(), z = 167 + 26 * r();
    pos.set(x, toppingY(x0, x, z) + .05, z);
    if (T.lie) e.set((r() - .5) * .5 + Math.PI / 2 * (T.disc ? 0 : 1), r() * (2 * Math.PI), (r() - .5) * .5); else e.set(r() * (2 * Math.PI), r() * (2 * Math.PI), r() * (2 * Math.PI));
    if (T.disc) e.set((r() - .5) * .6, r() * (2 * Math.PI), (r() - .5) * .6);
    q.setFromEuler(e); const s = T.s[0] + (T.s[1] - T.s[0]) * r(); sc.set(s, T.squash ? s * (.6 + .4 * r()) : s, s);
    im.setMatrixAt(k, m4.compose(pos, q, sc)); im.setColorAt(k, col.setHex(T.cols[Math.floor(r() * T.cols.length)]));
  }
  im.castShadow = false; im.receiveShadow = true; im.name = T.name; toppingPieces.add(im);
});
for (const x0 of [143.9, 184.4]) {
  box(x0 + .5, x0 + 38.5, 158.5, 198.5, 0, 53, M.steel, G.equipment, { r: 1.5 });
  box(x0, x0 + 39, 158, 199, 53, 55.5, M.steelDark, G.equipment, { r: 1 });
  box(x0 + 14, x0 + 25, 155, 158.5, .5, 3, M.black, G.equipment, { r: .5 });
}
box(235.6, 276.6, 160.5, 199, 79, 85.8, M.steel, G.equipment, { name: 'cash-drawer', r: .5 });
box(250, 262, 159.4, 160.5, 81, 83.5, M.black, G.equipment, { r: .4 });
{
  const s = G.equipment, cx = 255.6, cz = 153.7;
  cyl(cx, cz, 62, 65, 16, 16, M.black, s, { seg: 40 });
  cyl(cx, cz, 60.5, 62, 13, 13, M.steel, s);
  for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; rod([cx + Math.cos(a) * 11, 61, cz + Math.sin(a) * 11], [cx + Math.cos(a) * 16, 0, cz + Math.sin(a) * 16], 1.1, M.steel, s); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(13.6, .7, 8, 40), M.steel); ring.rotation.x = Math.PI / 2; ring.position.set(cx, 24, cz); s.add(ring);
}

// ---------- overhead (inside, above the counters)
// hood: canopy sheet with front skirt and grease filters (bottom 165, 44 cm deep)
{
  const E = G.overhead;
  const sheet = new THREE.MeshStandardMaterial({ ...steelP, side: THREE.DoubleSide });
  const quad = (pts) => {
    const g = new THREE.BufferGeometry();
    const [a, b, c, d] = pts; g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3));
    g.computeVertexNormals(); const m = new THREE.Mesh(g, sheet); m.castShadow = true; E.add(m); return m;
  };
  const yb = 172, yt = 186;
  quad([[0, yb, 44], [117, yb, 44], [100, yt, 12], [17, yt, 12]]);   // sloped front
  quad([[0, yb, 0], [0, yb, 44], [17, yt, 12], [17, yt, 0]]);         // left side
  quad([[117, yb, 0], [117, yb, 44], [100, yt, 12], [100, yt, 0]]);   // right side
  quad([[17, yt, 0], [100, yt, 0], [100, yt, 12], [17, yt, 12]]);     // top
  box(0, 117, 42.8, 44, 165, yb, M.steel, E, { r: .4 });             // front skirt
  box(0, 1.2, 0, 44, 165, yb, M.steel, E); box(115.8, 117, 0, 44, 165, yb, M.steel, E);
  box(0, 117, 0, 44, 164.4, 165.2, M.steel, E, { r: .3 });
  box(3, 114, 3, 41, 165.2, 165.6, M.grille, E, { noShadow: true });
  for (let i = 0; i < 4; i++) box(5 + i * 27.5, 30 + i * 27.5, 6, 38, 165.6, 166.4, M.steelDark, E, { noShadow: true });
  label('Hood', 58, 182, 26, { overhead: true });
}
// open upper shelves (no doors), tucked under the rounded ceiling
function shelf(x0, x1, z0, z1, h0, nearSide) {
  const o = { near: nearSide }, h1 = WT_IN - .5;
  box(x0, x1, z0, z1, h0, h0 + 1.5, M.steel, G.overhead, { ...o, r: .3 });
  const alongX = (x1 - x0) > (z1 - z0);
  if (alongX) { box(x0, x0 + 1, z0, z1, h0, h1, M.steel, G.overhead, o); box(x1 - 1, x1, z0, z1, h0, h1, M.steel, G.overhead, o); }
  else { box(x0, x1, z0, z0 + 1, h0, h1, M.steel, G.overhead, o); box(x0, x1, z1 - 1, z1, h0, h1, M.steel, G.overhead, o); }
  if (alongX) { const lz = z0 < 100 ? [z1 - 1, z1] : [z0, z0 + 1]; box(x0, x1, lz[0], lz[1], h0, h0 + 4, M.steel, G.overhead, o); }
  else box(x1 - 1, x1, z0, z1, h0, h0 + 4, M.steel, G.overhead, o);
}
// suspended rear cabinet with two sliding doors (rear elevation 'prateleira superior porta correr', x 143 to 300, from 170 cm)
{
  const E = G.overhead;
  box(143.1, 300, 0, 30, 170, WT_IN - .5, M.steel, E, { name: 'rear-cabinet', r: .6 });
  box(144.5, 222.5, 30, 31.1, 171.2, WT_IN - 1.8, M.white, E, { r: .4 });
  box(220.5, 298.6, 31.1, 32.2, 171.2, WT_IN - 1.8, M.white, E, { r: .4 });
  box(143.1, 300, 29.6, 32.6, 169.6, 171.2, M.steel, E, { r: .4 });
  for (const x of [147.5, 293.5]) box(x, x + 1.6, 32.2, 32.8, 176, 188, M.black, E, { r: .4, noShadow: true });
}
shelf(0, 20, 48, 170, 170, false);
shelf(20.5, 300, 170, 200, 170, true);
// packaging stacks on the front upper shelf (plain, formats not modeled)
for (let i = 0; i < 9; i++) { const x = 30 + i * 29; box(x, x + 20, 176, 194, 171.5, 171.5 + 3 + (i % 3) * 1.5, M.kraft, G.overhead, { near: true, r: .4 }); }
// water tanks 1 and 2, concealed behind a stainless panel
box(228, 300, 0, 30, 123, 170, M.steel, G.overhead, { name: 'water-tanks', r: .5 });
box(263.6, 264.4, 30, 30.4, 124, 169, M.steelDark, G.overhead, { noShadow: true });
for (const [x, y] of [[231, 126], [231, 167], [261, 126], [261, 167], [267, 126], [267, 167], [297, 126], [297, 167]]) { const b = cyl(0, 0, 0, .5, .5, .5, M.chrome, G.overhead); b.rotation.x = Math.PI / 2; b.position.set(x, y, 30.3); }

// ---------- moving parts (independent): window panels, service counter, door
const panels = [];
function frontPanel(x0, x1) {
  const pv = [0, WTOP, 200 + T];
  const g = new THREE.Group(); g.position.set(...pv); G.moving.add(g);
  box(x0 + .3, x1 - .3, 200.2, 200 + T, WB + .3, WTOP - .3, mats('pz', M.wrapFront, M.panelIn), g, { uv: UV.front, uvFace: 'pz', pivot: pv, near: true });
  box(x0 + .3, x1 - .3, 200 + T, 200 + T + .8, WTOP - 1.2, WTOP, M.trim, g, { pivot: pv, near: true, noShadow: true });
  const s = [x0 + 8, x1 - 8].map(x => ({ m: rod([0, 0, 0], [0, 1, 0], .7, M.chrome, G.moving), wall: new THREE.Vector3(x, WB + 22, 200 + T + 1), loc: new THREE.Vector3(x, -50, 1.5) }));
  s.forEach(q => near.push(q.m));
  panels.push({ g, axis: 'x', sign: -1, struts: s });
}
frontPanel(160, 280); frontPanel(20.5, 140);
{
  const pv = [-T, WTOP, 0];
  const g = new THREE.Group(); g.position.set(...pv); G.moving.add(g);
  box(-T, -.2, 40.3, 159.7, WB + .3, WTOP - .3, mats('nx', M.wrapEnd, M.panelIn), g, { uv: UV.left, uvFace: 'nx', pivot: pv });
  box(-T - .8, -T, 40.3, 159.7, WTOP - 1.2, WTOP, M.trim, g, { pivot: pv, noShadow: true });
  const s = [48, 152].map(z => ({ m: rod([0, 0, 0], [0, 1, 0], .7, M.chrome, G.moving), wall: new THREE.Vector3(-T - 1, WB + 22, z), loc: new THREE.Vector3(-1.5, -50, z) }));
  panels.push({ g, axis: 'z', sign: -1, struts: s });
}
const ctr = new THREE.Group(); ctr.position.set(0, 86, 200 + T); G.moving.add(ctr);
box(15, 285, 200 + T, 228.5, 86, 88.5, M.steelTop, ctr, { pivot: [0, 86, 200 + T], name: 'service-counter', r: .6 });
box(15, 285, 226.5, 228.5, 82.5, 88.5, M.steelTop, ctr, { pivot: [0, 86, 200 + T], r: .4 });
const braces = [45, 255].map(x => ({ m: rod([0, 0, 0], [0, 1, 0], .9, M.steelDark, G.moving), wall: new THREE.Vector3(x, 56, 200 + T + .5), loc: new THREE.Vector3(x, 0, 21) }));
for (const x of [45, 255]) box(x - 3, x + 3, 200 + T, 200 + T + 1, 53, 59, M.steelDark, G.moving, { noShadow: true });
const door = new THREE.Group(); door.position.set(300 + T, 0, 60); G.moving.add(door);
const dp = [300 + T, 0, 60];
box(300.3, 300 + T, 60.4, 139.6, 0.4, DOOR_T - .4, mats('px', M.wrapEnd, M.steel, M.white, 'nx'), door, { uv: UV.right, uvFace: 'px', pivot: dp, near: true });
box(299.3, 300.3, 128, 131, 98, 112, M.black, door, { pivot: dp, near: true, r: .4 });
box(300 + T, 300 + T + 1, 128, 131, 98, 112, M.black, door, { pivot: dp, near: true, r: .4 });
for (const y of [20, 150]) box(300 + T, 300 + T + .8, 60.4, 63, y, y + 12, M.chrome, door, { pivot: dp, near: true, noShadow: true });
const doorCap = box(300.3, 300 + T, 60.4, 139.6, CUT, CUT + .6, M.cap, door, { pivot: dp });

// section caps
for (const [x0, x1] of [[-T, 20.5], [140, 160], [280, 300 + T]]) box(x0, x1, 200, 200 + T, CUT, CUT + .6, M.cap, G.caps);
for (const [z0, z1] of [[0, 60], [140, 200]]) box(300, 300 + T, z0, z1, CUT, CUT + .6, M.cap, G.caps);

// clone materials of near meshes so only they are clipped
const clipped = [];
for (const m of near) {
  const arr = Array.isArray(m.material) ? m.material : [m.material];
  const cl = arr.map(x => { const c = x.clone(); c.side = THREE.DoubleSide; c.clipShadows = true; clipped.push(c); return c; });
  m.material = Array.isArray(m.material) ? cl : cl[0];
}

// ---------- labels
label('Drain trays', 31, 100, 24);
label('Fryer', 83, 106, 30);
label('Holding tray', 109, 96, 44);
label('Dough dispenser', 130, 178, 24);
label('Cutting board', 130, 94, 48);
label('Sink', 282, 96, 30);
label('Mini-fridge (under)', 226, 60, 50);
label('Rear storage · sliding doors', 125, 30, 50);
label('Filling dispensers ×4 · open shelves below', 10, 138, 117);
label('Toppings ×6', 70, 100, 180);
label('Bins (under)', 184, 60, 156);
label('Cash drawer', 256, 80, 158);
label('Stool (removable)', 256, 30, 138);
label('Water tanks (behind panel)', 264, 146, 34, { overhead: true });
label('Upper cabinet · sliding doors', 220, 190, 32, { overhead: true });
label('Upper shelf · packaging', 160, 182, 185, { overhead: true, near: true });
label('Window 3 · ventilation', -10, 175, 100);
label('Window 2', 80, 160, 205, { near: true });
label('Window 1', 220, 160, 205, { near: true });
label('Service counter', 150, 80, 222);
label('Staff door', 306, 110, 100);

// ---------- Run the Team 04: three rigged Rocketbox people, static at their stations
// Models: Microsoft Rocketbox (MIT; notice stored with each model in assets/characters/).
//   1 Register & service: Female_Adult_08, simple dark T-shirt and trousers (recolored from grey T-shirt and jeans)
//   2 Shaping & frying: Chef_Female_01, dark chef jacket and cap (recolored), original white apron
//   3 Filling, toppings & handover: Male_Adult_11, dark short-sleeve work shirt and trousers (recolored)
// Persons 1 and 3 get a white waist apron generated from their own body surface and skinned to pelvis and thighs.
const teamMats = [];
const V3 = (a) => new THREE.Vector3(...a);
const roleLabels = [];
const ROLES = [
  { n: 1, text: 'Register & service', x: 255.6, z: 146, top: 156 },
  { n: 2, text: 'Shaping & frying', x: 118, z: 78, top: 174 },
  { n: 3, text: 'Filling, toppings & handover', x: 60, z: 125, top: 181 },
  { n: 4, text: 'Toppings', x: 102, z: 138, top: 168 },
  { n: 5, text: 'Order control & handover', x: 196, z: 138, top: 178 },
  { n: 6, text: 'Frying, draining & sugar', x: 58, z: 76, top: 176 },
  { n: 7, text: 'Toppings, left half', x: 80, z: 145, top: 162 },
  { n: 8, text: 'Replenishment', x: 230, z: 74, top: 172 },
];
// study 09: team sizes from Team Plan 01 (approved). Roles per size; the 8 person setup is the next step.
const TEAMS = {
  8: { title: 'Busy event', note: 'Busiest stations doubled: dough and frying split, two people on toppings, one keeping everyone stocked.', people: [1, 2, 3, 4, 5, 6, 7, 8],
       roles: { 1: 'Register & orders', 2: 'Dough & shaping', 3: 'Fillings', 4: 'Toppings, right half', 5: 'Order control & handover', 6: 'Frying, draining & sugar', 7: 'Toppings, left half', 8: 'Replenishment' } },
  3: { title: 'Quiet day', note: 'Reduced operation: one person covers filling, toppings, and handover.', people: [1, 2, 3],
       roles: { 1: 'Register & service', 2: 'Shaping & frying', 3: 'Filling, toppings & handover' } },
  5: { title: 'Normal event', note: 'Each person holds one station; the churro moves hand to hand along the left side.', people: [1, 2, 3, 4, 5],
       roles: { 1: 'Register & orders', 2: 'Dough & frying', 3: 'Fillings', 4: 'Toppings', 5: 'Order control & handover' } },
};
let teamSize = 5;
function roleLabel(r) {
  const el = document.createElement('div'); el.className = 'lbl role';
  el.innerHTML = `<b>${r.n}</b><span class="long">${r.text}</span>`;
  el.setAttribute('aria-label', `${r.n}, ${r.text}`);
  const o = new CSS2DObject(el); o.position.set(r.x, r.top + 5, r.z); o.userData = { el, n: r.n }; G['layer-staff'].add(o); roleLabels.push(o);
}
const _q = new THREE.Quaternion(), _p = new THREE.Quaternion();
function aim(bone, child, target) {
  bone.updateWorldMatrix(true, true);
  const b = bone.getWorldPosition(new THREE.Vector3()), c = child.getWorldPosition(new THREE.Vector3());
  const qd = new THREE.Quaternion().setFromUnitVectors(c.sub(b).normalize(), target.clone().sub(b).normalize());
  bone.quaternion.copy(bone.parent.getWorldQuaternion(_p).invert().multiply(qd.multiply(bone.getWorldQuaternion(_q))));
  bone.updateWorldMatrix(false, true);
}
function turnWorld(bone, axis, angle) {
  bone.updateWorldMatrix(true, false);
  const nw = new THREE.Quaternion().setFromAxisAngle(axis, angle).multiply(bone.getWorldQuaternion(_q));
  bone.quaternion.copy(bone.parent.getWorldQuaternion(_p).invert().multiply(nw));
  bone.updateWorldMatrix(false, true);
}
function twoBoneIK(up, fore, hand, target, pole) {
  up.updateWorldMatrix(true, true);
  const S = up.getWorldPosition(new THREE.Vector3());
  const a = fore.position.length(), b = hand.position.length();
  const d = Math.min(target.distanceTo(S), a + b - .05), dir = target.clone().sub(S).normalize();
  const cosA = (a * a + d * d - b * b) / (2 * a * d), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
  const pv = pole.clone().sub(S); const perp = pv.sub(dir.clone().multiplyScalar(pv.dot(dir))).normalize();
  const elbow = S.clone().addScaledVector(dir, a * cosA).addScaledVector(perp, a * sinA);
  aim(up, fore, elbow); aim(fore, hand, S.clone().addScaledVector(dir, d));
}
// study 12: white work apron tied at the waist, shaped on the body's envelope (rest pose) so it never sinks into the
// trousers: the front depth at each point is the highest body point within a wide window, then dilated, plus a gap.
// A dark tie runs around the waist over the apron and its two ends hang at the back, as on person 2's apron.
function addApron(mesh, B, { top, bottom, half = 21 }) {
  const geo = mesh.geometry, pos = geo.attributes.position, v = new THREE.Vector3(), pts = [], ring = [];
  for (let i = 0; i < pos.count; i++) { mesh.getVertexPosition(i, v); v.applyMatrix4(mesh.matrixWorld);
    if (v.y > bottom - 10 && v.y < top + 10 && Math.abs(v.x) < half + 12) { if (v.z > -6) pts.push(v.clone()); if (Math.abs(v.y - top) < 3.5 && Math.abs(v.x) < 26) ring.push(v.clone()); } }
  const cols = 24, rows = 28, W = 7, gap = 1.5;
  const raw = [];
  let rowPrev = 10;
  for (let r = 0; r <= rows; r++) {
    const y = top - (top - bottom) * r / rows, row = [];
    let zr = -Infinity; for (const q of pts) if (Math.abs(q.y - y) < W && Math.abs(q.x) < half) zr = Math.max(zr, q.z);
    if (!isFinite(zr)) zr = rowPrev; rowPrev = zr;
    for (let c = 0; c <= cols; c++) { const x = -half + 2 * half * c / cols; let zl = -Infinity; for (const q of pts) if (Math.abs(q.y - y) < W && Math.abs(q.x - x) < W) zl = Math.max(zl, q.z); row.push(Math.max(zl, zr - x * x / 60)); }
    raw.push(row);
  }
  const Z = raw.map((row, r) => row.map((_, c) => { let m = -Infinity; for (let dr = -2; dr <= 2; dr++) for (let dc = -1; dc <= 1; dc++) { const rr = raw[r + dr], v2 = rr && rr[c + dc]; if (v2 !== undefined) m = Math.max(m, v2); } return m + gap; }));
  const P = [], UVs = [], SI = [], SW = [], idx = [];
  const bi = (n) => mesh.skeleton.bones.indexOf(B(n));
  const iP = bi('Pelvis'), iL = bi('L_Thigh'), iR = bi('R_Thigh'), hipY = B('Pelvis').getWorldPosition(new THREE.Vector3()).y;
  const inv = mesh.matrixWorld.clone().invert();
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
    const y = top - (top - bottom) * r / rows, x = -half + 2 * half * c / cols;
    P.push(...new THREE.Vector3(x, y, Z[r][c]).applyMatrix4(inv).toArray()); UVs.push(c / cols, 1 - r / rows);
    const wt = THREE.MathUtils.smoothstep(y, hipY + 2, hipY - 22), side = THREE.MathUtils.clamp(.5 + x / 14, 0, 1);
    SI.push(iP, iL, iR, 0); SW.push(1 - wt, wt * side, wt * (1 - side), 0);
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const a = r * (cols + 1) + c, b2 = a + cols + 1; idx.push(a, b2, a + 1, b2, b2 + 1, a + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UVs, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(SI, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(SW, 4));
  g.setIndex(idx); g.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xf3f1ec, roughness: .85, sheen: .4, sheenColor: 0xffffff, side: THREE.DoubleSide }); teamMats.push(mat);
  const ap = new THREE.SkinnedMesh(g, mat); ap.castShadow = ap.receiveShadow = true; ap.frustumCulled = false; ap.userData.part = 'apron';
  mesh.parent.add(ap); ap.position.copy(mesh.position); ap.quaternion.copy(mesh.quaternion); ap.scale.copy(mesh.scale); ap.bind(mesh.skeleton, mesh.bindMatrix);
  // waist tie: a band around the body at the apron top, over the apron at the front, and two ends hanging at the back
  const N = 56, H = 2.6, TP = [], TI = [], TSI = [], TSW = [];
  const zFront = (x) => { const c = Math.round((x + half) / (2 * half) * cols); return c >= 0 && c <= cols ? Z[0][c] : -Infinity; };
  const radius = (a) => { const d = new THREE.Vector2(Math.sin(a), Math.cos(a)); let m = 6; for (const q of ring) { const pr = q.x * d.x + q.z * d.y, perp = Math.abs(q.x * d.y - q.z * d.x); if (perp < 3.2) m = Math.max(m, pr); } return m; };
  const rad = []; for (let k = 0; k < N; k++) rad.push(radius(k / N * TAU));
  for (let k = 0; k <= N; k++) {
    const a = k / N * TAU, rs = [rad[(k - 1 + N) % N], rad[k % N], rad[(k + 1) % N]]; let rr = Math.max(...rs) + .7;
    const x = Math.sin(a) * rr; let z = Math.cos(a) * rr; const zf = zFront(x); if (Math.cos(a) > 0 && Math.abs(x) < half && zf + .35 > z) { z = zf + .35; rr = Math.hypot(x, z); }
    for (const dy of [H / 2, -H / 2]) { TP.push(...new THREE.Vector3(x, top - .4 + dy, z).applyMatrix4(inv).toArray()); TSI.push(iP, 0, 0, 0); TSW.push(1, 0, 0, 0); }
  }
  for (let k = 0; k < N; k++) { const a = 2 * k, b2 = a + 2; TI.push(a, a + 1, b2, a + 1, b2 + 1, b2); }
  // hanging ends at the back (a small knot and two strips)
  const back = rad[N / 2] + 1.1, base = TP.length / 3;
  const strip = (dx, len, tilt) => { const s0 = TP.length / 3; for (let j = 0; j <= 6; j++) { const t = j / 6, y = top - .4 - t * len, x = dx + tilt * t * len; for (const ox of [-1.1, 1.1]) { TP.push(...new THREE.Vector3(x + ox, y, -back - .3 * t).applyMatrix4(inv).toArray()); TSI.push(iP, 0, 0, 0); TSW.push(1, 0, 0, 0); } } for (let j = 0; j < 6; j++) { const a = s0 + 2 * j; TI.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } };
  strip(-1.4, 24, -.12); strip(1.4, 21, .14);
  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.Float32BufferAttribute(TP, 3)); tg.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(TSI, 4)); tg.setAttribute('skinWeight', new THREE.Float32BufferAttribute(TSW, 4));
  tg.setIndex(TI); tg.computeVertexNormals();
  const tm = new THREE.MeshStandardMaterial({ color: 0x1d1a1b, roughness: .8, side: THREE.DoubleSide }); teamMats.push(tm);
  const tie = new THREE.SkinnedMesh(tg, tm); tie.castShadow = true; tie.frustumCulled = false; tie.userData.part = 'apron';
  mesh.parent.add(tie); tie.position.copy(mesh.position); tie.quaternion.copy(mesh.quaternion); tie.scale.copy(mesh.scale); tie.bind(mesh.skeleton, mesh.bindMatrix);
  return [ap, tie];
}
// study 12: dark chef cap like person 2's (straight crown, flat top, a band near the bottom), sized from the skull only and
// set down to the forehead; hair that would sit inside the cap is pressed against the skull (hat hair), so nothing pokes out.
function addCap(mesh, B, hairMat, opt = {}) {
  const head = B('Head'), hi = mesh.skeleton.bones.indexOf(head), v = new THREE.Vector3(), inv = head.matrixWorld.clone().invert();
  const si = mesh.geometry.attributes.skinIndex, sw = mesh.geometry.attributes.skinWeight, pos = mesh.geometry.attributes.position, hairIdx = new Set();
  const mats = [].concat(mesh.material); for (const gr of mesh.geometry.groups) if (hairMat && mats[gr.materialIndex] === hairMat) for (let k = gr.start; k < gr.start + gr.count; k++) hairIdx.add(mesh.geometry.index ? mesh.geometry.index.getX(k) : k);
  const upL = new THREE.Vector3(0, 1, 0).transformDirection(inv).normalize(), fwdL = new THREE.Vector3(0, 0, 1).transformDirection(inv).normalize(), sideL = new THREE.Vector3().crossVectors(upL, fwdL).normalize();
  const skull = [], hairV = [];
  const headSet = new Set(); head.traverse(b => { if (b.isBone) headSet.add(mesh.skeleton.bones.indexOf(b)); });   // head and its child bones (hair strands, ponytail)
  const others = [];
  for (let i = 0; i < si.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (headSet.has(si.getComponent(i, k))) w += sw.getComponent(i, k);
    mesh.getVertexPosition(i, v); v.applyMatrix4(mesh.matrixWorld).applyMatrix4(inv); if (w < .5) { others.push([i, v.clone()]); continue; } (hairIdx.has(i) ? hairV : skull).push([i, v.clone()]); }
  const hTop = Math.min(Math.max(...skull.map(([, p]) => p.dot(upL))), 20.5);   // skull top; volume hair modeled in the head mesh is ignored
  const capH = opt.h || 8.7, baseH = hTop - 7.2;
  const band = skull.filter(([, p]) => p.dot(upL) > baseH - .5 && p.dot(upL) < baseH + 3).map(([, p]) => p);
  const pct = (arr, q) => { const a = arr.slice().sort((x, y) => x - y); return a[Math.floor(q * (a.length - 1))]; };
  // center at the middle of the head's extent (the face has more vertices than the back of the head)
  const fw = band.map(p => p.dot(fwdL)), sd = band.map(p => p.dot(sideL));
  const cF = (pct(fw, .04) + pct(fw, .96)) / 2, cS = (pct(sd, .04) + pct(sd, .96)) / 2;
  let rf = pct(band.map(p => Math.abs(p.dot(fwdL) - cF)), .85), rs = pct(band.map(p => Math.abs(p.dot(sideL) - cS)), .85);
  rf = THREE.MathUtils.clamp(rf + .9, 9.4, 11.6); rs = THREE.MathUtils.clamp(rs + .8, 7.8, 9.4);
  // hat hair: hair inside the cap's footprint and above its lower edge is pulled inside the crown
  const meshInv = mesh.matrixWorld.clone().invert(), hw = head.matrixWorld;
  const inCap = ([, p]) => { const e = Math.hypot((p.dot(fwdL) - cF) / rf, (p.dot(sideL) - cS) / rs); return p.dot(upL) > baseH + .4 && e < 1.6; };
  for (const [i, p] of [...hairV, ...skull.filter(([, p]) => p.dot(upL) > baseH + .4), ...others.filter(inCap)]) {
    const h = p.dot(upL) - baseH; if (h < (hairIdx.has(i) ? -1.5 : .4)) continue;
    let f = p.dot(fwdL) - cF, s = p.dot(sideL) - cS; const e = Math.hypot(f / rf, s / rs);
    if (h < 0 && e > 1.15) continue;                          // hair below the cap and well outside it stays as it is
    const k = Math.min(1, .93 / Math.max(e, 1e-6)); f *= k; s *= k;
    const hh = Math.min(h, capH - .8);
    const q = upL.clone().multiplyScalar(baseH + hh).add(fwdL.clone().multiplyScalar(cF + f)).add(sideL.clone().multiplyScalar(cS + s));
    // write back in the geometry's bind space (rest pose = bind pose for these models)
    const g = q.applyMatrix4(hw).applyMatrix4(meshInv); pos.setXYZ(i, g.x, g.y, g.z);
  }
  pos.needsUpdate = true;
  const prof = [[0, 0], [1, 0], [1.01, .4], [1.02, capH - 1.2], [.97, capH - .25], [.82, capH], [0, capH]].map(([r, h]) => new THREE.Vector2(r, h));
  const g = new THREE.LatheGeometry(prof, 44); g.scale(rs, 1, rf);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x272324, roughness: .85 });
  const cap = new THREE.Mesh(g, capMat); cap.castShadow = true; cap.userData.part = 'cap';
  const bandG = new THREE.CylinderGeometry(1, 1, 1.6, 44, 1, true); bandG.scale(rs + .18, 1, rf + .18); bandG.translate(0, 2.2, 0);
  const bandM = new THREE.Mesh(bandG, new THREE.MeshStandardMaterial({ color: 0x1c191a, roughness: .9, side: THREE.DoubleSide })); bandM.userData.part = 'cap'; cap.add(bandM);
  cap.position.copy(upL.clone().multiplyScalar(baseH).add(fwdL.clone().multiplyScalar(cF)).add(sideL.clone().multiplyScalar(cS)));
  cap.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(sideL, upL, fwdL)); head.add(cap); teamMats.push(capMat, bandM.material);
  cap.userData.mats = [capMat, bandM.material];
  return cap;
}
// the models reference their original .tga files; those are replaced below by WebP textures, so skip them quietly
const FBX_MGR = new THREE.LoadingManager(); FBX_MGR.addHandler(/\.tga$/i, { setPath() { return this; }, load: () => new THREE.Texture() });
async function loadPerson(dir, file, pose) {
  const fbx = await new FBXLoader(FBX_MGR).loadAsync(`${BASE}characters/${dir}/${file}`);
  const C = `${BASE}characters/${dir}/`;   // WebP textures: heads 1024 px, bodies and hair 512 px (compared November 19, 2026)
  const body = new THREE.MeshStandardMaterial({ map: tex(C + 'body_color.webp'), normalMap: tl.load(C + 'body_normal.webp'), roughness: .8 });
  const head = new THREE.MeshStandardMaterial({ map: tex(C + 'head_color.webp'), normalMap: tl.load(C + 'head_normal.webp'), roughness: .62 });
  const hair = pose.hair ? new THREE.MeshStandardMaterial({ map: tex(C + 'hair_color.webp'), alphaTest: .45, side: THREE.DoubleSide, roughness: .7 }) : null;
  const mats = [body, head]; if (hair) mats.push(hair); teamMats.push(...mats);
  let mesh;
  fbx.traverse(o => { if (o.isSkinnedMesh) { mesh = o; o.material = [].concat(o.material).map(m => /opacity/i.test(m.name) && hair ? hair : /head/i.test(m.name) ? head : body); o.castShadow = o.receiveShadow = true; o.frustumCulled = false; } });
  fbx.animations = [];
  const map = new Map(); fbx.traverse(o => { if (o.isBone) map.set(o.name, o); });
  const B = (n) => map.get('Bip01_' + n);
  fbx.updateMatrixWorld(true);
  if (pose.apron) for (const m of addApron(mesh, B, pose.apron)) mats.push(m.material);
  if (pose.cap) mats.push(...addCap(mesh, B, hair, typeof pose.cap === 'object' ? pose.cap : {}).userData.mats);
  const rest = [...map.values()].map(b => [b, b.quaternion.clone(), b.position.clone()]);
  const fingers = { L: [], R: [] };
  for (const [n, b] of map) { const m = n.match(/^Bip01_([LR])_Finger\d(\d)$/); if (m && (m[2] === '1' || m[2] === '2')) fingers[m[1]].push(b); }
  // study 08: palm-side vertices of each hand (hand-local, rest pose) for placing the palm on an object, and the
  // indices of every hand and finger vertex for the mesh contact check
  const palm = { L: [], R: [] }, handVerts = { L: [], R: [] };
  { const si = mesh.geometry.attributes.skinIndex, sw = mesh.geometry.attributes.skinWeight, bones = mesh.skeleton.bones, v = new THREE.Vector3();
    mesh.skeleton.update();
    for (const L of ['L', 'R']) {
      const hb = B(L + '_Hand'), hi = bones.indexOf(hb), inv = hb.matrixWorld.clone().invert();
      const fi = new Set(bones.map((b, i) => (b.name.startsWith(`Bip01_${L}_Finger`) || b === hb) ? i : -1).filter(i => i >= 0));
      for (let i = 0; i < si.count; i++) {
        let w = 0, wf = 0; for (let k = 0; k < 4; k++) { const j = si.getComponent(i, k), q = sw.getComponent(i, k); if (j === hi) w += q; if (fi.has(j)) wf += q; }
        if (wf > .6) handVerts[L].push(i);
        if (w < .85) continue; mesh.getVertexPosition(i, v); v.applyMatrix4(mesh.matrixWorld).applyMatrix4(inv); if (v.x > 2.5 && v.x < 9.4 && v.y > 0 && v.y < 3.3 && Math.abs(v.z) < 4.5) palm[L].push(v.clone());   // palm pad only (no cuff or sleeve)
      }
    }
  }
  return { fbx, mesh, B, rest, fingers, pose, palm, handVerts, mats, vis: 1, visTo: 1 };
}
// palm faces `down`, fingers point along `fwd` (both world). Biped hands: fingers along local +X, palm normal local +Y.
function orientHand(hand, fwd, down) {
  const F = fwd.clone().normalize(), D = down.clone().sub(F.clone().multiplyScalar(down.dot(F))).normalize();
  const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(F, D, new THREE.Vector3().crossVectors(F, D)));
  hand.quaternion.copy(hand.parent.getWorldQuaternion(_p).invert().multiply(q)); hand.updateWorldMatrix(false, true);
}
const ZERO = { lean: 0, nod: 0, turn: 0, twist: 0, weight: 0, hands: { L: { d: [0, 0, 0], curl: 0 }, R: { d: [0, 0, 0], curl: 0 } } };
// full pose from the rest skeleton every time: approved static pose + small idle offsets (dyn), in the person's own frame
function applyPose(P, dyn = ZERO, ph = P.ref ?? .5) {
  const { fbx, B, rest, fingers, pose } = P, grp = fbx.parent;
  for (const [b, q, p] of rest) { b.quaternion.copy(q); b.position.copy(p); }
  if (pose.sit) fbx.position.y = pose.sit.drop;
  grp.updateMatrixWorld(true);
  const gq = grp.getWorldQuaternion(new THREE.Quaternion());
  const ax = (x, y, z) => new THREE.Vector3(x, y, z).applyQuaternion(gq);
  const pt = (a) => grp.localToWorld(V3(a));
  if (pose.sit) for (const s of [1, -1]) {
    const L = s > 0 ? 'L' : 'R', hip = B(L + '_Thigh').getWorldPosition(new THREE.Vector3());
    const knee = hip.clone().add(ax(s * 1.5, -pose.sit.kneeDrop, pose.sit.thigh));
    aim(B(L + '_Thigh'), B(L + '_Calf'), knee);
    const kl = grp.worldToLocal(knee.clone());
    aim(B(L + '_Calf'), B(L + '_Foot'), pt([kl.x + s * .5, pose.sit.ankleY, kl.z - pose.sit.ankleBack]));
  }
  if (pose.stance) { turnWorld(B('L_Thigh'), ax(0, 0, 1), -pose.stance); turnWorld(B('R_Thigh'), ax(0, 0, 1), pose.stance); }   // narrower stance (feet closer together)
  const w = (pose.weight || 0) + dyn.weight;
  if (w) { turnWorld(B('Pelvis'), ax(0, 0, 1), w); turnWorld(B('Spine'), ax(0, 0, 1), -w * 1.4); }
  turnWorld(B('Spine1'), ax(1, 0, 0), (pose.lean || 0) + dyn.lean + (P.leanAt ? P.leanAt(ph) : 0));
  const tw = (pose.twist || 0) + dyn.twist; if (tw) turnWorld(B('Spine1'), ax(0, 1, 0), tw);
  const act = P.action ? P.action(ph, { pt, ax, P }) : {};
  for (const s of [1, -1]) {
    const L = s > 0 ? 'L' : 'R', h = pose.hands[L], d = dyn.hands[L], A = act[L];
    if (A && A.hand) { handPose(P, L, A, pt(A.pole || h.pole)); continue; }
    if (A) {   // hand driven by a work action: world wrist target and hand frame, then the fingers close on the object
      twoBoneIK(B(L + '_UpperArm'), B(L + '_Forearm'), B(L + '_Hand'), A.wrist, pt(A.pole || h.pole));
      orientHand(B(L + '_Hand'), A.fwd, A.down);
      P.reach = P.reach || {}; P.reach[L] = B(L + '_Hand').getWorldPosition(new THREE.Vector3()).distanceTo(A.wrist);
      if (A.relax) relaxWrist(P, L, A, pt(A.pole || h.pole));
      if (A.fingers) poseFingers(P, L, A.fingers); else for (const f of fingers[L]) f.rotation.z += A.curl;
      continue;
    }
    const wr = [h.wrist[0] + d.d[0], h.wrist[1] + d.d[1], h.wrist[2] + d.d[2]];
    twoBoneIK(B(L + '_UpperArm'), B(L + '_Forearm'), B(L + '_Hand'), pt(wr), pt(h.pole));
    if (h.flat) orientHand(B(L + '_Hand'), ax(...h.flat), ax(0, -1, 0));
    else turnWorld(B(L + '_Hand'), ax(0, 0, 1), s * (h.palm ?? .9));
    for (const f of fingers[L]) f.rotation.z += (h.curl ?? .35) + d.curl;
  }
  turnWorld(B('Head'), ax(1, 0, 0), (pose.nod || 0) + dyn.nod);
  turnWorld(B('Head'), ax(0, 1, 0), (pose.turn || 0) + dyn.turn);
  fbx.updateMatrixWorld(true);
}
// ---------- idle motion: slow, small, unsynchronized; different per role
const TAU = Math.PI * 2;
const noise = (t, s) => (Math.sin(t * 1.0 + s) * .5 + Math.sin(t * 2.31 + s * 1.7) * .3 + Math.sin(t * 4.13 + s * 2.9) * .2);
const smooth = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
// a soft bump of length `dur` that recurs roughly every `period` seconds, with a different offset each time
function pulse(t, period, dur, seed) {
  const k = Math.floor((t + seed) / period), j = (Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453) % 1;
  const start = Math.abs(j) * (period - dur - .5), x = (t + seed) - k * period - start;
  return x < 0 || x > dur ? 0 : smooth(Math.min(x, dur - x) / Math.min(.7, dur / 2));
}
const IDLE = {
  // 1 · register: posture settles, looks down to the cash area now and then, right hand shifts and taps near the drawer
  1: (t) => { const g = pulse(t, 11.3, 2.6, 1.7), tap = pulse(t, 7.1, .9, 4.2);
    return { lean: .012 * Math.sin(TAU * t / 4.6) + .02 * noise(t * .08, 1), nod: .2 * g + .02 * noise(t * .2, 2), turn: .14 * g + .05 * noise(t * .07, 3), twist: .03 * noise(t * .05, 4), weight: 0,
      hands: { R: { d: [1.6 * noise(t * .19, 5) - 1.5 * g, .8 * tap, 1.4 * noise(t * .17, 6)], curl: .05 * noise(t * .3, 7) }, L: { d: [.7 * noise(t * .11, 8), 0, .9 * noise(t * .13, 9)], curl: .06 * noise(t * .23, 10) } } }; },
  // 2 · shaping and frying: short alternating strokes over the board, glances toward the fryer, weight shifts
  2: (t) => { const g = pulse(t, 8.7, 2.1, .4), a = .6 + .4 * noise(t * .1, 11);
    return { lean: .012 * Math.sin(TAU * t / 4.1 + 1) + .015 * noise(t * .09, 12), nod: -.1 * g + .02 * noise(t * .2, 13), turn: .32 * g + .03 * noise(t * .12, 14), twist: .04 * g, weight: .012 * noise(t * .06, 15),
      hands: { L: { d: [0, 1 + .8 * Math.max(0, Math.sin(TAU * t / 2.7)), 1.7 * a * Math.sin(TAU * t / 2.7)], curl: -.03 + .05 * Math.sin(TAU * t / 2.7) }, R: { d: [0, 1 + .8 * Math.max(0, Math.sin(TAU * t / 2.7 + 2.5)), 1.7 * a * Math.sin(TAU * t / 2.7 + 2.5)], curl: -.03 + .05 * Math.sin(TAU * t / 2.7 + 2.5) } } }; },
  // 3 · filling and toppings: hand hovers over the levers and moves between the fourth and third, torso and head drift toward the topping side
  3: (t) => { const g = pulse(t, 9.4, 3.2, 2.2), look = pulse(t, 12.6, 2.4, 6.1);
    return { lean: .012 * Math.sin(TAU * t / 4.9 + 2) + .015 * noise(t * .08, 16), nod: .02 * noise(t * .18, 17) + .06 * look, turn: -.28 * look + .04 * noise(t * .1, 18), twist: .05 * noise(t * .07, 19) - .06 * look, weight: .01 * noise(t * .05, 20),
      hands: { R: { d: [-9.5 * g, 1.1 * noise(t * .25, 21), -5.7 * g], curl: .06 * noise(t * .3, 22) }, L: { d: [1.4 * noise(t * .16, 23), .8 * noise(t * .21, 24), 1.4 * noise(t * .14, 25)], curl: .05 * noise(t * .27, 26) } } }; },
};
const PEOPLE = [];
const APRON = { m04: { top: 98, bottom: 56, half: 21, gap: 1.2, band: 7 }, f14: { top: 96, bottom: 58, half: 19, gap: 1.2, band: 7 }, m14: { top: 97, bottom: 55, half: 21, gap: 1.2, band: 7 }, f17: { top: 97, bottom: 60, half: 19, gap: 1.2, band: 7 }, m09: { top: 98, bottom: 56, half: 21, gap: 1.2, band: 7 } };
function place(P, r, rotY, pid) {
  const g = new THREE.Group(); g.add(P.fbx); g.position.set(r.x, 0, r.z); g.rotation.y = rotY; g.userData.pid = pid;
  G['layer-staff'].add(g); roleLabel(r); P.pid = pid; P.seed = pid * 3.7; PEOPLE.push(P); applyPose(P);
}
// ---------- work actions (phase 0..1 per person), props held in the hands
const deg = THREE.MathUtils.degToRad;
const rootPt = (a) => root.localToWorld(V3(a));
const dirW = (a, m) => V3(a).normalize().transformDirection(m);
// ---------- grips (study 08): the palm is placed against the object, then every finger closes joint by joint
// (base, middle, tip) until each phalanx touches the object's surface. Distances are signed (cm, world).
const TIPLEN = [2.6, 2.3, 2.3, 2.1, 1.7], FRAD = [.85, .72, .72, .68, .6];   // distal length and finger radius from the mesh
const FNAME = ['thumb', 'index', 'middle', 'ring', 'pinky'];
const chainOf = (P, L, f) => [P.B(`${L}_Finger${f}`), P.B(`${L}_Finger${f}1`), P.B(`${L}_Finger${f}2`)];
const sdCapsule = (a, b, r) => { const ab = b.clone().sub(a), l2 = ab.lengthSq(), t = new THREE.Vector3(); return (p) => { const s = THREE.MathUtils.clamp(t.copy(p).sub(a).dot(ab) / l2, 0, 1); return t.copy(a).addScaledVector(ab, s).distanceTo(p) - r; }; };
const sdUnion = (...fs) => (p) => { let m = Infinity; for (const f of fs) { const d = f(p); if (d < m) m = d; } return m; };
const sdAbove = (y) => (p) => p.y - y;
const _g = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], _e = new THREE.Vector3();
function segClear(bones, f, sdf) {   // clearance of each phalanx (proximal, middle, distal) to the surface
  bones[0].getWorldPosition(_g[0]); bones[1].getWorldPosition(_g[1]); bones[2].getWorldPosition(_g[2]); bones[2].localToWorld(_g[3].set(TIPLEN[f], 0, 0));
  const out = [Infinity, Infinity, Infinity];
  for (let k = 0; k < 3; k++) for (let i = 1; i <= 5; i++) { _e.lerpVectors(_g[k], _g[k + 1], i / 5); const d = sdf(_e) - FRAD[f] * (k === 2 ? .9 : 1); if (d < out[k]) out[k] = d; }
  return out;
}
const STEP = .02;
function closeFinger(bones, f, sdf, { from = [0, 0, 0], rate = [1, 1.1, .8], max = [1.45, 1.65, 1.2] } = {}) {
  const q0 = bones.map(b => b.quaternion.clone()), ang = from.slice(), on = [true, true, true];
  const set = () => { for (let j = 0; j < 3; j++) { bones[j].quaternion.copy(q0[j]); bones[j].rotateZ(ang[j]); } };
  set();
  // starting inside the object: open the finger (down to slightly extended) until it is clear, then close
  for (let k = 0; k < 40 && Math.min(...segClear(bones, f, sdf)) < 0; k++) { for (let j = 0; j < 3; j++) ang[j] = Math.max(-.25, ang[j] - .05); set(); }
  if (Math.min(...segClear(bones, f, sdf)) < 0) return { ang, inside: true };
  for (let it = 0; it < 300 && on.some(Boolean); it++) {
    const prev = ang.slice();
    for (let j = 0; j < 3; j++) if (on[j]) { ang[j] += rate[j] * STEP; if (ang[j] >= max[j]) { ang[j] = max[j]; on[j] = false; } }
    set();
    const k = segClear(bones, f, sdf).findIndex(v => v < 0);
    if (k >= 0) { for (let j = 0; j < 3; j++) ang[j] = prev[j]; set(); for (let j = 0; j <= k; j++) on[j] = false; }
  }

  return { ang };
}
// thumb: flex its two outer joints until the chain length matches the distance to the target, aim the base joint
// at the target, then roll it about that line so the thumb pad faces the object
function thumbTo(P, L, T, sdf, { bend = [1, .8], gapTo = null, roll = 180 } = {}) {
  const b = chainOf(P, L, 0), base = b[0].getWorldPosition(new THREE.Vector3());
  const q1 = b[1].quaternion.clone(), q2 = b[2].quaternion.clone(), tip = new THREE.Vector3();
  const tipW = () => b[2].localToWorld(tip.set(TIPLEN[0], 0, 0));
  const flex = (s) => { b[1].quaternion.copy(q1); b[1].rotateZ(bend[0] * s); b[2].quaternion.copy(q2); b[2].rotateZ(bend[1] * s); b[0].updateWorldMatrix(false, true); };
  const D = T.distanceTo(base);
  let lo = 0, hi = 1.4; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; flex(m); if (tipW().distanceTo(base) > D) lo = m; else hi = m; }
  flex(lo);
  const qd = new THREE.Quaternion().setFromUnitVectors(tipW().sub(base).normalize(), T.clone().sub(base).normalize());
  const wq = b[0].getWorldQuaternion(new THREE.Quaternion()), pq = b[0].parent.getWorldQuaternion(new THREE.Quaternion()).invert();
  b[0].quaternion.copy(pq.clone().multiply(qd.multiply(wq))); b[0].updateWorldMatrix(false, true);
  // roll: the pad (distal phalanx +Y) toward the object, and no phalanx inside it
  const axis = T.clone().sub(base).normalize(), q0 = b[0].quaternion.clone(), e = .05;
  const g = new THREE.Vector3(sdf(T.clone().setX(T.x + e)) - sdf(T.clone().setX(T.x - e)), sdf(T.clone().setY(T.y + e)) - sdf(T.clone().setY(T.y - e)), sdf(T.clone().setZ(T.z + e)) - sdf(T.clone().setZ(T.z - e))).normalize().negate();
  let best = -Infinity, bestQ = q0;
  const kMax = Math.round(roll / 10);
  for (let k = -kMax; k <= kMax; k++) {
    const r = new THREE.Quaternion().setFromAxisAngle(axis, k * Math.PI / 18), w0 = b[0].parent.getWorldQuaternion(new THREE.Quaternion());
    b[0].quaternion.copy(w0.clone().invert().multiply(r.multiply(w0.clone().multiply(q0)))); b[0].updateWorldMatrix(false, true);
    const pad = new THREE.Vector3(0, 1, 0).transformDirection(b[2].matrixWorld), c = segClear(b, 0, sdf);
    const score = pad.dot(g) + Math.min(0, c[0], c[1]) * 2 - (roll < 180 ? .012 * Math.abs(k) : 0);
    if (score > best) { best = score; bestQ = b[0].quaternion.clone(); }
  }
  b[0].quaternion.copy(bestQ); b[0].updateWorldMatrix(false, true);
}
// spec: { sdf, close: { f: {from, rate, max} }, set: { f: [a0, a1, a2] }, spread: { f: angle toward the pinky side }, thumb: [rx, ry, rz] }
function poseFingers(P, L, spec) {
  const sg = L === 'R' ? 1 : -1;
  for (let f = 0; f < 5; f++) {
    const b = chainOf(P, L, f);
    if (f === 0 && spec.thumbAt) { thumbTo(P, L, spec.thumbAt, spec.sdf, spec.thumbOpt); continue; }
    if (f === 0 && spec.thumb) { const [x, y, z] = spec.thumb; b[0].rotateX(sg * x); b[0].rotateY(sg * y); b[0].rotateZ(z); }
    if (f > 0 && spec.spread && spec.spread[f]) b[0].rotateY(sg * spec.spread[f]);
    if (spec.close && spec.close[f]) closeFinger(b, f, (spec.sdfOf && spec.sdfOf[f]) || spec.sdf, spec.close[f]);
    else { const a = (spec.set && spec.set[f]) || [.15, .2, .1]; for (let j = 0; j < 3; j++) b[j].rotateZ(a[j]); }
  }
  P.fbx.updateMatrixWorld(true);
}
// hand frame from the direction the thumb should point (along the held object) and the palm normal (palm toward the object)
// tilt: the handle runs diagonally across the palm (its thumb end leans toward the fingertips), as in a real power grip
function gripFrame(L, thumb, palm, tilt = 0) {
  const s = L === 'R' ? 1 : -1, u = thumb.clone().normalize();
  const Y = palm.clone().addScaledVector(u, -palm.dot(u)).normalize();
  const Z0 = u.clone().multiplyScalar(s), X0 = new THREE.Vector3().crossVectors(Y, Z0), c = Math.cos(tilt), n = Math.sin(tilt);
  return { fwd: Z0.clone().multiplyScalar(s * n).addScaledVector(X0, c), down: Y };
}
// wrist position that puts the hand's line (gx along the fingers, centered across the palm) on the object's axis point C,
// then backs the hand off along the palm normal until the palm surface is `gap` cm from the object
// study 13: hand frame for a handle, aligned with the arm: the fingers continue the line from the shoulder to the handle
// (so the wrist stays near neutral), the handle crosses the palm, and the thumb points along the handle on the side that
// puts the palm where `palm` asks (for example palm down for an overhand grip).
function armFrame(P, L, axis, C, palm, tilt = 0) {
  const F = C.clone().sub(P.B(L + '_UpperArm').getWorldPosition(new THREE.Vector3())).normalize();
  let best = null;
  for (const sgn of [1, -1]) {
    const thumb = axis.clone().multiplyScalar(sgn), s = L === 'R' ? 1 : -1, Z0 = thumb.clone().multiplyScalar(s);
    const X0 = F.clone().addScaledVector(Z0, -F.dot(Z0)).normalize(), Y = new THREE.Vector3().crossVectors(Z0, X0);
    const c = Math.cos(tilt), n = Math.sin(tilt), fwd = Z0.clone().multiplyScalar(s * n).addScaledVector(X0, c);
    const score = Y.dot(palm); if (!best || score > best.score) best = { fwd, down: Y, score };
  }
  return { fwd: best.fwd, down: best.down };
}
// wrist limits (relative to the rest pose of the hand on the forearm): flexion -55..65 degrees, deviation +-22 degrees.
// If the grip asks for more, the hand is turned back inside the limits and placed on the object again. Then half of the
// remaining twist about the forearm axis goes to the forearm (there are no twist bones in these rigs), so the wrist
// never carries the whole rotation.
const WRIST = { bend: deg(60) };
function relaxWrist(P, L, A, poleW) {
  const B = P.B, fa = B(L + '_Forearm'), hand = B(L + '_Hand'), qn = P.rest.find(r => r[0] === hand)[1];
  const Q = () => { const qf = fa.getWorldQuaternion(new THREE.Quaternion()), qh = hand.getWorldQuaternion(new THREE.Quaternion()); return qn.clone().invert().multiply(qf.invert().multiply(qh)); };
  // bend limit: angle between the forearm axis and the hand axis (fingers) at most 60 degrees; if more, turn the hand
  // toward the forearm and place it on the object again (two passes, since the arm moves with it)
  const X1 = V3([1, 0, 0]);
  P.wristLog = P.wristLog || {};
  for (let pass = 0; pass < 2; pass++) {
    const fx = X1.clone().transformDirection(fa.matrixWorld), hq = hand.getWorldQuaternion(new THREE.Quaternion()), hx = X1.clone().applyQuaternion(hq);
    const th = fx.angleTo(hx); if (pass === 0) P.wristLog[L] = { bend: THREE.MathUtils.radToDeg(th) };
    if (th <= WRIST.bend + .01 || !A.reslide) break;
    const axis = new THREE.Vector3().crossVectors(hx, fx).normalize(), nq = new THREE.Quaternion().setFromAxisAngle(axis, th - WRIST.bend).multiply(hq);
    const fwd = X1.clone().applyQuaternion(nq), down = V3([0, 1, 0]).applyQuaternion(nq), wrist = A.reslide(fwd, down);
    twoBoneIK(B(L + '_UpperArm'), fa, hand, wrist, poleW); orientHand(hand, fwd, down);
    P.reach[L] = hand.getWorldPosition(new THREE.Vector3()).distanceTo(wrist); P.wristLog[L].clamped = true;
  }
  const q = Q();
  // share the twist with the forearm
  const t2 = new THREE.Quaternion(q.x, 0, 0, q.w).normalize(), phi = 2 * Math.atan2(t2.x, t2.w);
  const hw = hand.getWorldQuaternion(new THREE.Quaternion());
  fa.rotateX(phi * .5); fa.updateWorldMatrix(false, true);
  hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(hw)); hand.updateWorldMatrix(false, true);
}
function slideOn(P, L, fwd, down, C, sdf, { gx = 7.4, gap = .12 } = {}) {
  const Q = frameQ(fwd, down);
  const off = V3([gx, 0, L === 'R' ? -.9 : .9]).applyQuaternion(Q), v = new THREE.Vector3();
  const at = (d) => C.clone().sub(off).addScaledVector(down, -d);
  const clear = (d) => { const H = at(d); let m = Infinity; for (const p of P.palm[L]) { const q = sdf(v.copy(p).applyQuaternion(Q).add(H)); if (q < m) m = q; } return m; };
  // approach from outside and stop at the first contact (a thin rod would let a bisection pass straight through it)
  let hi = 14; while (hi > -8 && clear(hi - .25) >= gap) hi -= .25;
  let lo = hi - .25; for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (clear(mid) < gap) lo = mid; else hi = mid; }
  return at(hi);
}
function frameQ(fwd, down) {   // same frame as orientHand: fingers along fwd, palm toward down
  const F = fwd.clone().normalize(), D = down.clone().sub(F.clone().multiplyScalar(down.dot(F))).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(F, D, new THREE.Vector3().crossVectors(F, D)));
}
// world point from the grip frame: x along the fingers, y along the palm normal, z toward the thumb side
const inFrame = (L, C, fwd, down, x, y, z) => { const Z = new THREE.Vector3().crossVectors(fwd, down).normalize().multiplyScalar(L === 'R' ? 1 : -1); return C.clone().addScaledVector(fwd.clone().normalize(), x).addScaledVector(down, y).addScaledVector(Z, z); };
// a grip that is re-placed if the wrist limits turn the hand (study 13)
const relaxGrip = (P, L, f, C, sdf, opts, fingers) => ({ wrist: slideOn(P, L, f.fwd, f.down, C, sdf, opts), ...f, relax: true, reslide: (fw, dn) => slideOn(P, L, fw, dn, C, sdf, opts), fingers: { ...fingers, thumbOpt: { roll: 75 } } });
const POWER = (max = [1.45, 1.65, 1.2]) => ({ 1: { rate: [1, 1.1, .8], max }, 2: { rate: [1, 1.1, .8], max }, 3: { rate: [1, 1.1, .8], max }, 4: { rate: [1, 1.1, .8], max } });

// 1 · writing an order: tripod grip. The pen rests in the web between thumb and index; thumb, index, and middle close on it.
// The pen tip is on the order pad; the left hand holds the pad's upper left corner flat.
const PAD = { c: [251.2, 90.255, 172], rot: .32, w: 10, d: 14 };      // pad center (root, top surface), turned for a right-handed writer
const PEN_A = V3([5.0, 1.5, 4.9]), PEN_B = V3([10.3, 4.6, 0.9]);        // pen axis in the right hand's frame: web, pinch point under the index pad
const PEN_DIR = PEN_B.clone().sub(PEN_A).normalize(), PEN_TIP = PEN_B.clone().addScaledVector(PEN_DIR, 3.8), PEN_LEN = 13.75;
function action1(ph, { pt, ax, P }) {
  const pad = (u, v) => { const c = Math.cos(PAD.rot), s = Math.sin(PAD.rot); return rootPt([PAD.c[0] + u * c + v * s, PAD.c[1], PAD.c[2] - u * s + v * c]); };
  // right hand: pen tip on the lower right of the pad, moving along one line through the phase
  const tip = pad(-2.6 + 2.4 * ph, -3.4).setY(rootPt([0, PAD.c[1] + .08, 0]).y);
  const fwd = ax(.42, -.22, .88), down = ax(.62, -.78, -.12);
  const Q = frameQ(fwd, down);
  const wristR = tip.clone().sub(PEN_TIP.clone().applyQuaternion(Q));
  const penW = (q) => q.clone().applyQuaternion(Q).add(wristR);
  const penSdf = sdCapsule(penW(PEN_TIP), penW(PEN_TIP.clone().addScaledVector(PEN_DIR, -PEN_LEN)), .45);
  // left hand: flat on the pad's upper left corner, fingertips resting on the paper
  const fL = ax(-.35, 0, 1).normalize(), dL = ax(0, -1, 0);
  const padTop = sdAbove(rootPt([0, PAD.c[1], 0]).y);
  const wristL = slideOn(P, 'L', fL, dL, pad(4.6, 5.4), padTop, { gx: 5.5, gap: .9 });
  return {
    R: { wrist: wristR, fwd, down, fingers: { sdf: penSdf,
      thumbAt: penW(PEN_B.clone().add(V3([-.4, -.3, 1.45]))),
      close: { 1: { from: [.45, .55, .2], rate: [.6, 1, .6], max: [1.1, 1.5, 1] }, 2: { from: [.5, .7, .25], rate: [.6, 1, .5], max: [.95, 1.2, .55] } }, set: { 3: [1.0, 1.25, .7], 4: [1.1, 1.2, .65] }, spread: { 2: .04, 3: .1, 4: .18 } } },
    L: { wrist: wristL, fwd: fL, down: dL, fingers: { sdf: padTop,
      thumb: [-.1, .25, -.25],
      close: { 0: { from: [0, 0, 0], rate: [.3, 1, .6], max: [.4, .6, .5] }, 1: { from: [.1, 0, 0], rate: [1, .9, .5], max: [.6, .5, .4] }, 2: { from: [.1, 0, 0], rate: [1, .9, .5], max: [.6, .5, .4] }, 3: { from: [.1, 0, 0], rate: [1, .9, .5], max: [.6, .5, .4] }, 4: { from: [.1, 0, 0], rate: [1, .9, .5], max: [.6, .5, .4] } },
      spread: { 1: -.1, 3: .06, 4: .14 } } },
  };
}
// 2 · dough dispenser: right hand closed around the lever grip in a handshake grip (thumb up toward the pivot);
// the lever turns about its pivot (0 to 22 degrees) and the plunger follows. The hand is solved on the grip at every phase.
const DOUGH_MAX = 22;
function action2(ph, { P }) {
  const lev = MECH.dough; lev.rotation.x = deg(DOUGH_MAX) * ph; lev.updateMatrixWorld(true);
  MECH.plunger.position.y = MECH.plungerY - 9 * ph;
  const piv = [145.5, 160, 18], g0 = lev.localToWorld(V3([147 - piv[0], 132 - piv[1], 56 - piv[2]])), g1 = lev.localToWorld(V3([147.5 - piv[0], 126 - piv[1], 63 - piv[2]]));
  const sdf = sdUnion(sdCapsule(g0, g1, 1.8), sdCapsule(lev.localToWorld(V3([0, 0, 0])), g0, 1));
  const A = g1.clone().sub(g0).normalize(), C = g0.clone().addScaledVector(A, 4.6);
  const { fwd, down } = gripFrame('R', A.clone().negate(), dirW([-1, 0, -.25], root.matrixWorld), deg(30));
  return { R: { wrist: slideOn(P, 'R', fwd, down, C, sdf), fwd, down, pole: [-75, 150, 0], fingers: { sdf, thumbAt: inFrame('R', C, fwd, down, -.6, 3.4, .8), close: POWER(), spread: { 3: .04, 4: .1 } } } };
}
// 3 · filling: the churro is on the third dispenser's horizontal spout, coaxial with it; the left hand holds its far end,
// the right hand closes over the end of that dispenser's lever and pulls it down (0 to 15 degrees).
const NOZ = [20, 94.4, 124.2], CH_LEN = 24, CH_IN = 2.6, LEVER_MAX = 15;   // spout axis end (root), churro length, how far it sits over the spout
// static pose study: phase 0..1 only moves the mechanisms (lever travel) and the pen along one line
const AUTO = {
  6: (t) => cycle(t, [[.9, 0, 1], [1.3, 1, 1], [.9, 1, 0], [1.7, 0, 0]]),                       // lift the basket, shake and drain, lower
  7: (t) => ((t + 1.1) % 2.9) / 2.9,                                                          // spoon along the churro, own rhythm
  8: (t) => cycle(t, [[1.2, 0, 0], [1.1, 0, 1], [.9, 1, 1], [1.1, 1, 0], [1.4, 0, 0]]),      // set the box down on the counter, pick it up
  4: (t) => (t % 2.6) / 2.6,                                                                   // spoon passes along the churro
  5: (t) => cycle(t, [[1.6, 0, 0], [1.1, 0, 1], [.7, 1, 1], [1.0, 1, 0], [1.2, 0, 0]]),     // holds, hands the tray out, returns
  1: (t) => cycle(t, [[2.6, 0, 1], [.9, 1, 1], [.5, 1, 0], [1.4, 0, 0]]),
  2: (t) => cycle(t, [[1.3, 0, 1], [.6, 1, 1], [1.0, 1, 0], [1.9, 0, 0]]),
  3: (t) => cycle(t, [[.6, 0, 1], [1.1, 1, 1], [.5, 1, 0], [1.6, 0, 0]]),
};
// automatic validation cycles: different rhythms with pauses (seconds)
function cycle(t, parts) {   // parts: [[duration, from, to], ...] -> phase
  const total = parts.reduce((a, q) => a + q[0], 0); let x = ((t % total) + total) % total;
  for (const [dur, a, b] of parts) { if (x <= dur) return a + (b - a) * smooth(x / dur); x -= dur; }
  return parts[parts.length - 1][2];
}
// idle on top of the actions: breathing, posture, head (scaled by the intensity control); hands belong to the actions
const IDLE2 = {
  // 4 · toppings and 5 · order control: breathing and small head movement only (static work poses)
  4: (t) => { const g = pulse(t, 10.3, 2.4, 3.1); return { lean: .012 * Math.sin(TAU * t / 4.4 + .5) + .01 * noise(t * .08, 31), nod: .02 * noise(t * .2, 32) - .12 * g, turn: .02 * noise(t * .1, 33) + .1 * g, twist: 0, weight: .01 * noise(t * .05, 34), hands: ZERO.hands }; },
  6: (t) => ({ lean: .012 * Math.sin(TAU * t / 4.3 + 2.5) + .01 * noise(t * .08, 51), nod: .02 * noise(t * .2, 52), turn: .02 * noise(t * .1, 53), twist: 0, weight: .01 * noise(t * .05, 54), hands: ZERO.hands }),
  7: (t) => ({ lean: .012 * Math.sin(TAU * t / 4.7 + .8) + .01 * noise(t * .08, 61), nod: .02 * noise(t * .2, 62), turn: .02 * noise(t * .1, 63), twist: 0, weight: .01 * noise(t * .05, 64), hands: ZERO.hands }),
  8: (t) => ({ lean: .012 * Math.sin(TAU * t / 5.3 + 1.9) + .01 * noise(t * .08, 71), nod: .02 * noise(t * .2, 72), turn: .02 * noise(t * .1, 73), twist: 0, weight: .01 * noise(t * .05, 74), hands: ZERO.hands }),
  5: (t) => { const g = pulse(t, 7.9, 2.0, 5.3); return { lean: .012 * Math.sin(TAU * t / 5.1 + 1.5) + .01 * noise(t * .08, 41), nod: .02 * noise(t * .2, 42) - .1 * g, turn: .03 * noise(t * .1, 43) - .25 * g, twist: 0, weight: .012 * noise(t * .05, 44), hands: ZERO.hands }; },
  1: (t) => { const g = pulse(t, 9.7, 2.2, 1.3); return { lean: .012 * Math.sin(TAU * t / 4.6) + .01 * noise(t * .08, 1), nod: -.2 * g + .02 * noise(t * .2, 2), turn: .02 * noise(t * .1, 3), twist: 0, weight: 0, hands: ZERO.hands, glance: g }; },
  2: (t) => { const g = pulse(t, 8.9, 1.9, .4); return { lean: .012 * Math.sin(TAU * t / 4.1 + 1) + .01 * noise(t * .09, 12), nod: .02 * noise(t * .2, 13) - .1 * g, turn: .3 * g + .02 * noise(t * .12, 14), twist: 0, weight: .01 * noise(t * .06, 15), hands: ZERO.hands }; },
  3: (t) => ({ lean: .012 * Math.sin(TAU * t / 4.9 + 2) + .01 * noise(t * .08, 16), nod: .03 * noise(t * .18, 17), turn: .03 * noise(t * .1, 18), twist: 0, weight: .008 * noise(t * .05, 20), hands: ZERO.hands }),
};
let actionMode = 'manual', actionManual = .5;
function frameState(P, t) {
  const tt = t + P.seed * 5, raw = IDLE2[P.pid](tt);
  let ph = actionMode === 'auto' ? AUTO[P.pid](tt) : actionManual;
  if (P.pid === 1 && actionMode === 'auto' && raw.glance > .2) ph = P.lastPh ?? ph;
  P.lastPh = ph;
  return [scaleDyn(raw, gain), ph];
}
function buildProps(p1, p3) {
  const E = G['layer-staff'];
  // order pad, turned for a right-handed writer
  const padTex = canvasTex(256, 360, (g, w, h) => { g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,90,110,.35)'; g.lineWidth = 2; for (let y = 50; y < h; y += 26) { g.beginPath(); g.moveTo(16, y); g.lineTo(w - 16, y); g.stroke(); } g.fillStyle = 'rgba(40,40,40,.55)'; for (let k = 0; k < 4; k++) g.fillRect(20, 58 + k * 26, 60 + (k * 37) % 90, 3); });
  const pad = new THREE.Mesh(new THREE.BoxGeometry(PAD.w, .25, PAD.d), [M.white, M.white, new THREE.MeshStandardMaterial({ map: padTex, roughness: .9 }), M.white, M.white, M.white]);
  pad.position.set(PAD.c[0], PAD.c[1] - .125, PAD.c[2]); pad.rotation.y = PAD.rot; pad.castShadow = pad.receiveShadow = true; pad.userData.prop = 'pad'; E.add(pad); P_PROPS.push(pad);
  // pen: fixed in the right hand's frame along the tripod axis (tip, then the body toward the web)
  const pen = new THREE.Group(); pen.userData.prop = 'pen';
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 12.5, 16), new THREE.MeshStandardMaterial({ color: 0x1f2a44, roughness: .4 })); body.position.y = 7.5; body.castShadow = true; body.userData.prop = 'pen';
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(.45, .08, 1.25, 16), M.chrome); cone.position.y = .62; cone.userData.prop = 'pen';
  pen.add(body, cone); pen.position.copy(PEN_TIP); pen.quaternion.setFromUnitVectors(V3([0, 1, 0]), PEN_DIR.clone().negate());
  p1.B('R_Hand').add(pen);
  // churro: star-ridged, golden; sits coaxially on the third spout (placed by the action every frame)
  const star = new THREE.Shape(); for (let k = 0; k <= 16; k++) { const a = k / 16 * TAU, r = k % 2 ? 1.25 : 1.7; k ? star.lineTo(Math.cos(a) * r, Math.sin(a) * r) : star.moveTo(r, 0); }
  const cg = new THREE.ExtrudeGeometry(star, { depth: CH_LEN, bevelEnabled: true, bevelThickness: .4, bevelSize: .2, bevelSegments: 2, curveSegments: 2 });
  const churro = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: 0xc7843f, roughness: .75 })); churro.castShadow = true; churro.userData.prop = 'churro';
  churro.quaternion.setFromUnitVectors(V3([0, 0, 1]), V3([1, 0, 0])); E.add(churro); MECH.churro = churro;
}
const P_PROPS = [];
// ---------- study 10: work actions for person 4 (toppings) and person 5 (order control and handover)
function makeChurro(len = CH_LEN) {
  const star = new THREE.Shape(); for (let k = 0; k <= 16; k++) { const a = k / 16 * TAU, r = k % 2 ? 1.25 : 1.7; k ? star.lineTo(Math.cos(a) * r, Math.sin(a) * r) : star.moveTo(r, 0); }
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth: len, bevelEnabled: true, bevelThickness: .4, bevelSize: .2, bevelSegments: 2, curveSegments: 2 }), new THREE.MeshStandardMaterial({ color: 0xc7843f, roughness: .75 }));
  m.castShadow = true; return m;
}
// a few pieces scattered on top of a churro (local frame of the churro: axis +z from 0 to len, top +y)
function sprinkleOn(parent, len, topping, n, z0, z1, seed) {
  const T = TOPPINGS[topping], geo = T.geo(); if (T.disc) geo.scale(1, .45, 1);
  const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: T.rough }), n), r = rnd(seed), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
  for (let k = 0; k < n; k++) { const a = (r() - .5) * 1.9, z = z0 + (z1 - z0) * r(); q.setFromEuler(new THREE.Euler(r() * TAU, r() * TAU, r() * TAU)); if (T.disc) q.setFromEuler(new THREE.Euler(-a * .8, r() * TAU, 0, 'ZYX'));
    im.setMatrixAt(k, m4.compose(V3([Math.sin(a) * 1.75, Math.cos(a) * 1.75 + .1, z]), q, V3([.9, .9, .9]))); im.setColorAt(k, col.setHex(T.cols[Math.floor(r() * T.cols.length)])); }
  im.userData.prop = 'toppings'; parent.add(im); return im;
}
// 4 · toppings: churro held level in the left hand above the fifth container (cookie crumbs); a spoon in the right hand
// sprinkles crumbs along it: the bowl travels a few centimeters along the churro and tilts to pour, then comes back.
const P4C = { y: 107.5, z: 166, dx: -4 };                 // churro: level, along x, from her x + dx (root cm)
const P7C = { y: 107.5, z: 166, dx: -22, s0: 6.5 };   // stroke starts a little further from person 3                // person 7: same gesture over the shredded coconut (third container, left half)
// 5 · handover: the open Hola! tray (proportions from the production die line) with a ready Churros Recheado, two toppings
// one on each half. Both hands carry it from below, thumbs on the near wall; it moves toward window 1 and back.
const TRAY = { L: 22, W: 4.6, H: 4.7, t: .14 };
function action5(ph, { pt, P }) {
  const e = smooth(ph), tr = MECH.tray;
  const c = pt([0, 99.5 + 3.5 * e, 25 + 11 * e]);           // tray center in his frame: in front of him, then out toward the window
  tr.position.copy(root.worldToLocal(c.clone())); tr.rotation.set(0, 0, 0);
  const h = V3([TRAY.L / 2, TRAY.H / 2, TRAY.W / 2]), v = new THREE.Vector3();
  const sdf = (p) => { v.copy(p).sub(c); const qx = Math.abs(v.x) - h.x, qy = Math.abs(v.y) - h.y, qz = Math.abs(v.z) - h.z; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0); };
  const fwd = dirW([0, .15, 1], root.matrixWorld), down = dirW([0, 1, 0], root.matrixWorld);
  const base = (s) => c.clone().add(V3([s * (TRAY.L / 2 - 4.2), -TRAY.H / 2, 0]));
  const hand = (L, s) => ({ wrist: slideOn(P, L, fwd, down, base(s), sdf, { gx: 6.2, gap: .2 }), fwd, down, fingers: { sdf, thumbAt: c.clone().add(V3([s * (TRAY.L / 2 - 3.2), TRAY.H / 2 + 1.5, -TRAY.W / 2 - 1.0])), close: POWER([.9, 1.1, .8]) } });
  return { L: hand('L', 1), R: hand('R', -1) };
}
// 6 · frying: the right hand holds the first basket's grip and lifts the basket out of the oil, shakes it to drain, and
// lowers it back; the left hand rests on the drain tray rim. The basket is a part of the fryer, moved by the action.
// 8 · replenishment: a plain kraft supply box carried in both hands, set down on the back counter by the fridge and picked
// up again. Palms on the box sides, fingers forward, thumbs up.
const SUP = { w: 30, h: 16, d: 20 };
function action8(ph, { pt, ax, P }) {
  const e = smooth(ph), b = MECH.supply;
  const c = pt([0, 104 - 5.85 * e, 26 + 14 * e]);           // his frame: held in front of the waist, then down on the counter top (90 cm)
  b.position.copy(root.worldToLocal(c.clone())); b.rotation.set(0, 0, 0);
  const h = V3([SUP.w / 2, SUP.h / 2, SUP.d / 2]), v = new THREE.Vector3();
  const sdf = (p) => { v.copy(p).sub(c); const qx = Math.abs(v.x) - h.x, qy = Math.abs(v.y) - h.y, qz = Math.abs(v.z) - h.z; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0); };
  const hand = (L, s) => { const f = gripFrame(L, ax(0, 1, 0), ax(-s, 0, 0), 0); const C = c.clone().add(ax(s * SUP.w / 2, -2.5, -3)); return { wrist: slideOn(P, L, f.fwd, f.down, C, sdf, { gx: 6.5, gap: .55 }), ...f, fingers: { sdf, thumbAt: c.clone().add(ax(s * (SUP.w / 2 + 1.3), 4.5, -6)), close: POWER([.2, .25, .15]) } }; };
  return { L: hand('L', 1), R: hand('R', -1) };
}
function buildSupply() {
  const kraftBox = new THREE.MeshStandardMaterial({ color: 0xb08457, roughness: .9 }), tape = new THREE.MeshStandardMaterial({ color: 0xd9c9a8, roughness: .5 });
  const b = new THREE.Group(); b.userData.prop = 'supply box';
  const m = new THREE.Mesh(new RoundedBoxGeometry(SUP.w, SUP.h, SUP.d, 2, .4), kraftBox); m.castShadow = m.receiveShadow = true; m.userData.prop = 'supply box'; b.add(m);
  const t = new THREE.Mesh(new THREE.BoxGeometry(SUP.w + .1, .05, 5), tape); t.position.y = SUP.h / 2 + .03; t.userData.prop = 'supply box'; b.add(t);
  G['layer-staff'].add(b); MECH.supply = b; return b;
}
// ---------- study 14: hands driven from the forearm, with fixed hand poses per grip
// The hand starts from its rest relation to the forearm (as modeled in the rig) and turns only by bounded wrist movements:
// twist about the hand axis, deviation within the palm plane, flexion toward the palm. A small search picks the combination
// that best fits the object and the palm direction; the arm then moves so the grip point lands on the object. No extra
// forearm twist (these rigs have no twist bones), no per-frame finger solving: fingers and thumb use fixed poses per grip.
const WRANGE = { tw: [-60, 60, 10], dev: [-25, 25, 12.5], flex: [-50, 60, 10] };
const WQ = (() => { const r = (a, b, s) => { const o = []; for (let v = a; v <= b + 1e-6; v += s) o.push(v); return o; };
  const out = []; for (const tw of r(...WRANGE.tw)) for (const dv of r(...WRANGE.dev)) for (const fx of r(...WRANGE.flex)) {
    const q = new THREE.Quaternion().setFromAxisAngle(V3([1, 0, 0]), deg(tw)).multiply(new THREE.Quaternion().setFromAxisAngle(V3([0, 1, 0]), deg(dv))).multiply(new THREE.Quaternion().setFromAxisAngle(V3([0, 0, 1]), deg(fx)));
    out.push({ tw, dv, fx, q, cost: .004 * (Math.abs(tw) + Math.abs(dv) + Math.abs(fx)) }); } return out; })();
// grips: object radius, finger flexion per joint (base, middle, tip), thumb placement, channel angle across the palm
const GRIPS = {
  fist:   { r: 1.2, curl: { 1: [.85, .95, .62], 2: [.9, 1.0, .66], 3: [.92, 1.0, .64], 4: [.95, .95, .58] }, spread: { 3: .04, 4: .1 }, thumb: 'over', A: 30 },
  churro: { r: 1.8, curl: { 1: [.68, .82, .52], 2: [.72, .86, .56], 3: [.75, .86, .56], 4: [.8, .84, .52] }, spread: { 3: .04, 4: .1 }, thumb: 'over', A: 22 },
  spoon:  { r: .45, curl: { 1: [.45, .7, .42], 2: [.7, .95, .58], 3: [.92, 1.1, .66], 4: [1.0, 1.1, .62] }, spread: { 2: .02, 3: .06, 4: .12 }, thumb: 'pinch', A: 42 },
  press:  { r: 1.0, curl: { 1: [.28, .38, .22], 2: [.32, .42, .24], 3: [.36, .46, .26], 4: [.42, .48, .28] }, spread: { 1: -.04, 3: .04, 4: .09 }, thumb: 'side', A: 8 },
};
const HD = new Map();
function handData(P, L) {
  const k = P.pid + L; if (HD.has(k)) return HD.get(k);
  const ys = P.palm[L].filter(p => p.x > 3 && p.x < 9).map(p => p.y).sort((a, b) => a - b);
  const d = { palmY: ys[Math.floor(.8 * (ys.length - 1))], thumb: {} }; HD.set(k, d); return d;
}
function gripLocal(P, L, G) {
  const zs = L === 'R' ? 1 : -1, hd = handData(P, L);
  const aL = V3([Math.sin(deg(G.A)), 0, Math.cos(deg(G.A)) * zs]).normalize();      // object axis across the palm, thumb end toward the fingertips
  const cL = V3([6.6, hd.palmY + G.r + .15, .3 * zs]);                                 // where that axis passes (hand-local)
  return { aL, cL };
}
function applyGripPose(P, L, gname) {
  const G = GRIPS[gname], sg = L === 'R' ? 1 : -1, hand = P.B(L + '_Hand'), hd = handData(P, L);
  for (let f = 1; f < 5; f++) { const b = chainOf(P, L, f); if (G.spread[f]) b[0].rotateY(sg * G.spread[f]); for (let j = 0; j < 3; j++) b[j].rotateZ(G.curl[f][j]); }
  const tb = chainOf(P, L, 0), cached = hd.thumb[gname];
  if (cached) { for (let j = 0; j < 3; j++) tb[j].quaternion.copy(cached[j]); hand.updateWorldMatrix(false, true); return; }
  hand.updateWorldMatrix(false, true);
  const zs = L === 'R' ? 1 : -1, idx = chainOf(P, L, 1), Y = V3([0, 1, 0]).transformDirection(hand.matrixWorld), Z = V3([0, 0, zs]).transformDirection(hand.matrixWorld), X = V3([1, 0, 0]).transformDirection(hand.matrixWorld);
  const pip = idx[2].getWorldPosition(new THREE.Vector3()), base = idx[0].getWorldPosition(new THREE.Vector3());
  const T = G.thumb === 'over' ? pip.clone().addScaledVector(Y, 1.1).addScaledVector(Z, .4)
          : G.thumb === 'pinch' ? pip.clone().addScaledVector(Z, 1.2).addScaledVector(Y, .5)
          : base.clone().addScaledVector(X, 2.6).addScaledVector(Z, 1.9).addScaledVector(Y, .7);
  thumbTo(P, L, T, (p) => p.distanceTo(T) - .6, { roll: 40 });
  hd.thumb[gname] = tb.map(b => b.quaternion.clone());
}
// A = { grip, at | tip(), tipLocal: 'grip' | 'bowl', palm, wPalm, axis, wAxis, free, after(hand, Q, cW, aW, bW, dW) }
function handPose(P, L, A, poleW) {
  const up = P.B(L + '_UpperArm'), fa = P.B(L + '_Forearm'), hand = P.B(L + '_Hand'), G = GRIPS[A.grip];
  const { aL, cL } = gripLocal(P, L, G), qn = P.rest.find(r => r[0] === hand)[1], Yl = V3([0, 1, 0]);
  const dL = aL.clone().addScaledVector(Yl, .35).normalize(), bL = cL.clone().addScaledVector(dL, 9.5);   // spoon: handle direction and bowl
  const tL = A.tipLocal === 'bowl' ? bL : cL, target = A.tip ? A.tip() : A.at.clone();
  let wrist = target.clone(), best = null, pole = poleW.clone(); const v = new THREE.Vector3(), qa = new THREE.Vector3(), qp = new THREE.Vector3();
  const sh = up.getWorldPosition(new THREE.Vector3());
  const search = (base) => { let b = null; for (const c of WQ) {
      const Q = base.clone().multiply(c.q); let s = c.cost;
      if (A.wAxis) { qa.copy(aL).applyQuaternion(Q); const d = qa.dot(A.axis); s += A.wAxis * Math.acos(Math.min(1, A.free ? Math.abs(d) : d)); }
      if (A.wPalm) { qp.copy(Yl).applyQuaternion(Q); s += A.wPalm * Math.acos(THREE.MathUtils.clamp(qp.dot(A.palm), -1, 1)); }
      if (!b || s < b.s) b = { s, c, Q }; } return b; };
  for (let it = 0; it < 4; it++) {
    if (it === 0) {   // the shoulder turns the elbow about the shoulder-to-wrist line (up to 50 degrees) to bring the hand round
      const axis = wrist.clone().sub(sh).normalize(); let bp = null;
      for (let a = -50; a <= 50; a += 10) {
        const pw = poleW.clone().sub(sh).applyAxisAngle(axis, deg(a)).add(sh);
        twoBoneIK(up, fa, hand, wrist, pw); const r = search(fa.getWorldQuaternion(new THREE.Quaternion()).multiply(qn)); r.s += .003 * Math.abs(a);
        if (!bp || r.s < bp.s) bp = { s: r.s, pw }; }
      pole = bp.pw;
    }
    twoBoneIK(up, fa, hand, wrist, pole);
    best = search(fa.getWorldQuaternion(new THREE.Quaternion()).multiply(qn));
    hand.quaternion.copy(qn).multiply(best.c.q); hand.updateWorldMatrix(false, true);
    const tipW = hand.getWorldPosition(v).clone().add(tL.clone().applyQuaternion(best.Q));
    wrist.add(target.clone().sub(tipW));
  }
  twoBoneIK(up, fa, hand, wrist, pole); hand.quaternion.copy(qn).multiply(best.c.q); hand.updateWorldMatrix(false, true);
  const hp = hand.getWorldPosition(new THREE.Vector3());
  P.reach = P.reach || {}; P.reach[L] = hp.clone().add(tL.clone().applyQuaternion(best.Q)).distanceTo(target);
  P.wristLog = P.wristLog || {}; P.wristLog[L] = { tw: best.c.tw, dev: best.c.dv, flex: best.c.fx };
  applyGripPose(P, L, A.grip);
  if (A.after) A.after(hand, best.Q, hp.clone().add(cL.clone().applyQuaternion(best.Q)), aL.clone().applyQuaternion(best.Q), hp.clone().add(bL.clone().applyQuaternion(best.Q)), dL.clone().applyQuaternion(best.Q));
}
const DOWN = V3([0, -1, 0]);
// 3 · filling: right palm on the end of the third lever, pressing it down; left fist around the churro on the spout
function action3(ph, { P }) {
  const lg = MECH.levers[2]; lg.rotation.z = -deg(LEVER_MAX) * ph; lg.updateMatrixWorld(true);
  const ax3 = dirW([1, 0, 0], root.matrixWorld), ch0 = rootPt([NOZ[0] - CH_IN, NOZ[1], NOZ[2]]);
  if (MECH.churro) MECH.churro.position.copy(root.worldToLocal(ch0.clone()));
  const k0 = lg.localToWorld(V3([19.5, 3, 0])), k1 = lg.localToWorld(V3([22.1, 3.4, 0]));
  return {
    R: { hand: true, grip: 'press', at: k0.clone().lerp(k1, .5), palm: DOWN, wPalm: 1.2, axis: k1.clone().sub(k0).normalize(), wAxis: .3, free: true },
    L: { hand: true, grip: 'churro', at: ch0.clone().addScaledVector(ax3, CH_LEN - 3.5), axis: ax3, wAxis: 1, free: true, palm: dirW([0, -.6, -.8], root.matrixWorld), wPalm: .35 },
  };
}
// 6 · frying: fist around the first basket's grip (thumb on top, like a pan handle), lift, shake, lower
function action6(ph) {
  const e = smooth(ph), B = MECH.basket;
  B.position.set(.35 * e * Math.sin(ph * TAU * 5), 11 * e, 0); B.updateMatrixWorld(true);
  const g0 = B.localToWorld(V3([72.7, 99, 53])), g1 = B.localToWorld(V3([72.7, 99.6, 61]));
  return { R: { hand: true, grip: 'fist', at: g0.clone().lerp(g1, .55), axis: g1.clone().sub(g0).normalize(), wAxis: 1, free: true, palm: dirW([-1, -.3, 0], root.matrixWorld), wPalm: .25 } };
}
// 4 and 7 · toppings: the left hand holds the churro still (overhand); the right hand slides the spoon along its top,
// from near the free end over about 12 cm and back. The churro and spoon are carried by the hands.
const action4 = (ph, ctx) => toppingAction(ph, ctx, P4C, MECH.c4, MECH.spoon);
const action7 = (ph, ctx) => toppingAction(ph, ctx, P7C, MECH.c7, MECH.spoon7);
function toppingAction(ph, { P }, C, churro, spoon) {
  const x0 = P.fbx.parent.position.x + C.dx, u = (1 - Math.cos(ph * TAU)) / 2;
  const left = rootPt([x0 + CH_LEN, C.y, C.z]), e = V3([-1, 0, 0]);            // churro level along x, its left end held, extending to her right
  churro.position.copy(root.worldToLocal(left.clone())); churro.quaternion.setFromUnitVectors(V3([0, 0, 1]), e); P.chAx = { left, e };
  return {
    L: { hand: true, grip: 'churro', at: left.clone().addScaledVector(e, 4.5), palm: DOWN, wPalm: .6, axis: e, wAxis: 1.5, free: true },
    R: { hand: true, grip: 'spoon', tipLocal: 'bowl', palm: dirW([.25, -1, .1], root.matrixWorld), wPalm: 1,
      tip: () => { const c = P.chAx; return c.left.clone().addScaledVector(c.e, 22.5 - 11.5 * u).add(V3([0, 2.7, 0])); },
      after: (hand, Q, cW, aW, bW, dW) => { const Yv = dW.clone().negate(), Z = V3([0, 1, 0]).applyQuaternion(Q); Z.addScaledVector(Yv, -Z.dot(Yv)).normalize();
        spoon.position.copy(root.worldToLocal(bW.clone())); spoon.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(Yv, Z), Yv, Z)); } },
  };
}
function buildProps45(p4, p5) {
  const E = G['layer-staff'];
  // person 4: churro with crumbs already on its top, and the spoon with crumbs in the bowl
  const k4 = toppingKit(4, 11); MECH.c4 = k4.churro; MECH.spoon = k4.spoon; p4.props = [k4.churro, k4.spoon];
  // person 5: the open tray with the production artwork outside and kraft inside, a churro in it
  buildTray(); p5.props = [MECH.tray];
}
function toppingKit(top, seed) {
  const E = G['layer-staff'];
  const c4 = makeChurro(); c4.userData.prop = 'churro'; c4.quaternion.setFromUnitVectors(V3([0, 0, 1]), V3([1, 0, 0])); E.add(c4);
  sprinkleOn(c4, CH_LEN, top, 90, 3, 15, seed);
  const sp = new THREE.Group(); sp.userData.prop = 'spoon';
  const steel = new THREE.MeshStandardMaterial({ color: 0xd7dadd, metalness: .9, roughness: .25 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(.32, .42, 12.5, 12), steel); handle.position.y = 8.6; handle.userData.prop = 'spoon';
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.42, .25, 2.4, 12), steel); neck.position.y = 2.2; neck.userData.prop = 'spoon';
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), steel); bowl.scale.set(1.55, 2.1, .55); bowl.userData.prop = 'spoon';
  sp.add(handle, neck, bowl);
  const crumbs = new THREE.InstancedMesh(TOPPINGS[top].geo(), new THREE.MeshStandardMaterial({ roughness: .9 }), 40), rr = rnd(seed + 5), m4 = new THREE.Matrix4(), col = new THREE.Color();
  for (let k = 0; k < 40; k++) { const a = rr() * TAU, r = Math.sqrt(rr()); crumbs.setMatrixAt(k, m4.compose(V3([Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.6, .45 + .2 * rr()]), new THREE.Quaternion().setFromEuler(new THREE.Euler(rr() * 6, rr() * 6, rr() * 6)), V3([.9, .9, .9]))); crumbs.setColorAt(k, col.setHex(TOPPINGS[top].cols[k % TOPPINGS[top].cols.length])); }
  crumbs.userData.prop = 'spoon'; sp.add(crumbs);
  sp.traverse(o => { if (o.isMesh) o.castShadow = true; }); E.add(sp);
  return { churro: c4, spoon: sp };
}
function buildTray() {
  const E = G['layer-staff'];
  const side = tex(BASE + 'art/tray-side.webp'), endT = tex(BASE + 'art/tray-end.webp');
  const kraft = new THREE.MeshStandardMaterial({ color: 0xb48c60, roughness: .95 }), art = new THREE.MeshStandardMaterial({ map: side, roughness: .7 }), artEnd = new THREE.MeshStandardMaterial({ map: endT, roughness: .7 });
  const tr = new THREE.Group(); tr.userData.prop = 'package';
  const { L, W, H, t: th } = TRAY;
  const add = (g, mats, x, y, z) => { const m = new THREE.Mesh(g, mats); m.position.set(x, y, z); m.castShadow = true; m.userData.prop = 'package'; tr.add(m); return m; };
  add(new THREE.BoxGeometry(L, th, W), kraft, 0, -H / 2 + th / 2, 0);
  for (const s of [1, -1]) {
    // long walls: artwork outside (box face +z or -z), kraft inside and on the edges
    const mats = [kraft, kraft, kraft, kraft, s > 0 ? art : kraft, s > 0 ? kraft : art];
    add(new THREE.BoxGeometry(L, H, th), mats, 0, 0, s * (W / 2 - th / 2));
    const mE = [s > 0 ? artEnd : kraft, s > 0 ? kraft : artEnd, kraft, kraft, kraft, kraft];
    add(new THREE.BoxGeometry(th, H * .82, W - 2 * th), mE, s * (L / 2 - th / 2), -H * .09, 0);
  }
  const c5 = makeChurro(20); c5.quaternion.setFromUnitVectors(V3([0, 0, 1]), V3([1, 0, 0])); c5.position.set(-10, -H / 2 + 1.85, 0); c5.userData.prop = 'package'; tr.add(c5);
  // filling on top, then two toppings, one on each half (as in the product photos)
  const fill = new THREE.Mesh(new THREE.CapsuleGeometry(.75, 17, 4, 10), new THREE.MeshStandardMaterial({ color: 0x4a2412, roughness: .35 })); fill.rotation.z = Math.PI / 2; fill.scale.set(1, 1, .55); fill.position.set(0, -H / 2 + 3.55, 0); fill.userData.prop = 'package'; tr.add(fill);
  sprinkleOn(c5, 20, 0, 70, 1.5, 9.5, 21).userData.prop = 'package';
  sprinkleOn(c5, 20, 5, 9, 11, 18.5, 22).userData.prop = 'package';
  E.add(tr); MECH.tray = tr;
}

// ---------- study 09: team size switch, fades, panel, optional zones and route layer
const SHOW = { 3: [1, 2, 3], 5: [1, 2, 3, 4, 5], 8: [1, 2, 3, 4, 5, 6, 7, 8] };
const NEW_IN = { 3: [], 5: [4, 5], 8: [6, 7, 8] };
const STAND = { 4: { 3: [102, 138], 5: [102, 138], 8: [127, 138] }, 3: { 3: [60, 125], 5: [60, 125], 8: [50, 114] } };   // person 4 moves to the right half when person 7 joins
function setTeam(n, instant = false) {
  if (!TEAMS[n]) return;
  teamSize = n;
  for (const P of PEOPLE) {
    P.visTo = SHOW[n].includes(P.pid) ? 1 : 0; if (instant || reduce) P.vis = P.visTo;
    const st = STAND[P.pid]; if (st) { P.posFrom = P.fbx.parent.position.clone(); P.posTo = V3([st[n][0], 0, st[n][1]]); P.posT = instant || reduce ? 1 : 0; if (P.posT === 1) P.fbx.parent.position.copy(P.posTo); }
  }
  for (const o of roleLabels) { const txt = TEAMS[n].roles[o.userData.n]; if (txt) { o.userData.el.querySelector('.long').textContent = txt; o.userData.el.setAttribute('aria-label', `${o.userData.n}, ${txt}`); } }
  document.querySelectorAll('[data-team]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.team === n));
  const T = TEAMS[n];
  document.getElementById('teamPanel').innerHTML = `<span class="cnt">${T.people.length} people</span><span style="font-weight:700">${T.title}</span><p class="ttl">${T.note}</p><ul>${T.people.map(k => `<li class="${NEW_IN[n].includes(k) ? 'new' : ''}"><b>${k}</b>${T.roles[k]}</li>`).join('')}</ul>`;
  drawZones(n);
  if (!instant && t === 1 && !run && ['kitchen', 'top', 'close', 'team'].includes(curView)) animateTo(1, { view: 'team' });
  updateUI();
}
// number badges: if two overlap on screen, nudge the later one up (runs a few times a second, not every frame)
function declutter() {
  const els = roleLabels.filter(o => o.visible).map(o => o.userData.el);
  for (const e of els) e.style.translate = '';
  const r = els.map(e => [e, e.getBoundingClientRect()]).filter(([, b]) => b.width).sort((a, b) => b[1].top - a[1].top);
  const placed = [];
  for (const [e, b] of r) { let dy = 0, moved = true, k = 0;
    while (moved && k++ < 8) { moved = false; for (const q of placed) if (b.left < q.right + 2 && b.right > q.left - 2 && b.top - dy < q.bottom + 2 && b.bottom - dy > q.top - 2) { dy += (b.bottom - dy) - q.top + 3; moved = true; } }
    if (dy) e.style.translate = `0 ${-dy}px`; placed.push({ left: b.left, right: b.right, top: b.top - dy, bottom: b.bottom - dy }); }
}
// prototype: no number badges, so no decluttering
let fadeLast = 0;
function teamFade(now) {
  const dt = Math.min(.1, (now - (fadeLast || now)) / 1000); fadeLast = now;
  for (const P of PEOPLE) {
    if (P.vis !== P.visTo) { const s = Math.sign(P.visTo - P.vis); P.vis = THREE.MathUtils.clamp(P.vis + s * dt / .6, 0, 1); }
    if (P.posTo && P.posT < 1) { P.posT = Math.min(1, P.posT + dt / .8); P.fbx.parent.position.lerpVectors(P.posFrom, P.posTo, smooth(P.posT)); P.fbx.parent.updateMatrixWorld(true); if (!idleOnNow()) applyPose(P, ZERO, actionMode === 'manual' ? actionManual : P.ref); }
    const lb = roleLabels.find(o => o.userData.n === P.pid); if (lb && P.posTo) { lb.position.x = P.fbx.parent.position.x; lb.position.z = P.fbx.parent.position.z; }
  }
}
// floor layer: work zones (Team Plan 01), hand-off points, and the churro route along the counters
const zoneCanvas = document.createElement('canvas'); zoneCanvas.width = 1200; zoneCanvas.height = 800;
const zoneTex = new THREE.CanvasTexture(zoneCanvas); zoneTex.colorSpace = THREE.SRGBColorSpace; zoneTex.anisotropy = 8;
const zonePlane = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), new THREE.MeshBasicMaterial({ map: zoneTex, transparent: true, depthWrite: false, toneMapped: false }));
zonePlane.rotation.x = -Math.PI / 2; zonePlane.position.set(150, .6, 100); zonePlane.renderOrder = 2;
const overlay = new THREE.Group(); overlay.add(zonePlane); root.add(overlay); overlay.visible = false;
const ZONES = {
  3: { z: [[1, 224, 124, 66, 34], [2, 24, 52, 128, 42], [3, 24, 98, 196, 60]], shared: [] },
  5: { z: [[1, 224, 124, 66, 34], [2, 24, 52, 128, 40], [3, 24, 94, 50, 52], [4, 64, 120, 86, 38], [5, 154, 120, 68, 38]], shared: [[56, 128, 16, 22], [205, 150, 30, 10]] },
  8: { z: [[1, 224, 124, 66, 34], [2, 106, 52, 46, 40], [6, 24, 52, 80, 40], [3, 24, 94, 50, 40], [7, 58, 126, 46, 32], [4, 106, 120, 46, 38], [5, 154, 120, 68, 38], [8, 160, 52, 138, 40]], shared: [[100, 54, 10, 30], [48, 132, 12, 18], [102, 150, 6, 10], [205, 150, 30, 10]] },
};
function drawZones(n) {
  const g = zoneCanvas.getContext('2d'), k = 4; g.clearRect(0, 0, 1200, 800);
  const rr = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x * k, y * k, w * k, h * k, r * k); };
  for (const [p, x, y, w, h] of ZONES[n].z) {
    rr(x, y, w, h, 6); g.fillStyle = NEW_IN[n].includes(p) ? 'rgba(46,143,149,.30)' : 'rgba(85,197,203,.30)'; g.fill();
    g.setLineDash([14, 9]); g.lineWidth = 5; g.strokeStyle = 'rgba(46,143,149,.95)'; g.stroke(); g.setLineDash([]);
    g.beginPath(); g.arc((x + 9) * k, (y + 9) * k, 6.5 * k, 0, TAU); g.fillStyle = NEW_IN[n].includes(p) ? '#2E8F95' : '#2F2A2B'; g.fill();
    g.fillStyle = '#FFF2DF'; g.font = `800 ${8 * k}px "DM Sans", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(p, (x + 9) * k, (y + 9.4) * k);
  }
  for (const [x, y, w, h] of ZONES[n].shared) {
    g.save(); rr(x, y, w, h, 3); g.clip(); g.strokeStyle = 'rgba(213,55,98,.75)'; g.lineWidth = 5;
    for (let d = -h; d < w + h; d += 4) { g.beginPath(); g.moveTo((x + d) * k, (y + h) * k); g.lineTo((x + d + h) * k, y * k); g.stroke(); } g.restore();
    rr(x, y, w, h, 3); g.lineWidth = 4; g.strokeStyle = '#D53762'; g.stroke();
  }
  zoneTex.needsUpdate = true;
}
// churro route: dough → holding tray → fryer → drain trays and sugar → fillings → toppings → handover at window 1 (dashed, above the counters)
{
  const pts = [[130, 101, 30], [110, 101, 26], [83, 101, 26], [32, 101, 26], [16, 101, 62], [16, 101, 117], [30, 101, 150], [80, 101, 178], [150, 101, 186], [212, 101, 188]].map(a => V3(a));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .2), L = curve.getLength(), mat = new THREE.MeshBasicMaterial({ color: 0xD53762, toneMapped: false });
  for (let d = 0; d < L - 3; d += 7) { const a = curve.getPointAt(d / L), b = curve.getPointAt(Math.min(1, (d + 4) / L)); const m = rod(a.toArray(), b.toArray(), .55, mat, overlay, 8); m.castShadow = false; }
  const end = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 16), mat); end.position.copy(pts[pts.length - 1]); end.quaternion.setFromUnitVectors(V3([0, 1, 0]), pts[9].clone().sub(pts[8]).normalize()); overlay.add(end);
}
let zonesOn = false;

const teamReady = (async () => {
  // approved poses in each person's own frame: origin under the hips, facing +z, +x = the person's left
  const [p1, p2, p3] = await Promise.all([
    // 1 · seated on the 65 cm stool, tall-stool posture; left hand resting flat on the counter, right hand at the counter edge above the cash drawer
    loadPerson('female_adult_08', 'Female_Adult_08.fbx', {
      hair: true, sit: { drop: -14.4, kneeDrop: 23, thigh: 30, ankleY: 6.2, ankleBack: 3.5 },
      lean: .06, nod: .2, turn: -.06,
      hands: { L: { wrist: [7.5, 96.6, 21], pole: [45, 85, -15], flat: [-.55, -.05, 1], curl: .07 }, R: { wrist: [-9, 95.6, 20.5], pole: [-45, 85, -15], flat: [.35, -.06, 1], curl: .1 } },
    }),
    // 2 · at the back counter: wrists above the cutting board and holding tray (unchanged)
    loadPerson('chef_female_01', 'Chef_Female_01.fbx', {
      lean: .16, nod: .32, turn: .06, weight: .02,
      hands: { L: { wrist: [11, 104, 24], pole: [40, 100, -20] }, R: { wrist: [-12, 105, 23], pole: [-40, 100, -20] } },
    }),
    // 3 · turned toward the dispensers, right hand above the fourth lever (unchanged)
    loadPerson('male_adult_11', 'Male_Adult_11.fbx', {
      apron: { top: 96, bottom: 52, half: 21 }, cap: { h: 7.4 }, lean: .3,   // slightly lower crown: he leans under the left upper shelf
      nod: .32, turn: -.04, weight: -.02, twist: -.08,
      hands: { R: { wrist: [-5, 113, 26], pole: [-40, 100, -20], palm: .7, curl: .5 }, L: { wrist: [12, 106, 25], pole: [14, 75, -30], palm: .9, curl: .4 } },
    }),
  ]);
  const [p4, p5] = await Promise.all([
    // 4 · toppings (Female_Adult_17): facing the six containers at window 2; right hand above a container, left hand at the counter edge
    loadPerson('female_adult_17', 'Female_Adult_17.fbx', {
      hair: true, apron: APRON.f17, cap: true, lean: .2, nod: .34, turn: .04, weight: .015,
      hands: { R: { wrist: [-6, 107, 29], pole: [-45, 90, -15], flat: [.2, -.4, 1], curl: .55 }, L: { wrist: [17, 96.5, 18.5], pole: [45, 85, -15], flat: [-1, -.04, .3], curl: .2 } },
    }),
    // 5 · order control and handover (Male_Adult_09): at window 1 beside the register, hands on the counter, head toward the register and the rail
    loadPerson('male_adult_09', 'Male_Adult_09.fbx', {
      hair: true, apron: APRON.m09, cap: true, lean: .07, nod: .04, turn: .2, weight: -.02,
      hands: { R: { wrist: [-13, 96.5, 23], pole: [-45, 85, -15], flat: [.35, -.06, 1], curl: .1 }, L: { wrist: [9, 96.5, 22], pole: [45, 85, -15], flat: [-.3, -.06, 1], curl: .1 } },
    }),
  ]);
  const [p6, p7, p8] = await Promise.all([
    // 6 · frying, draining, sugar and cinnamon (Male_Adult_04): at the fryer, facing the back counter; left hand on the drain tray rim
    loadPerson('male_adult_04', 'Male_Adult_04.fbx', {
      hair: true, apron: APRON.m04, cap: true, lean: .04, nod: .3, turn: -.05, weight: .01,
      hands: { R: { wrist: [-12, 105, 23], pole: [-45, 95, -15] }, L: { wrist: [15, 97, 24.5], pole: [45, 90, -15], flat: [-1, -.04, .25], curl: .2 } },
    }),
    // 7 · toppings, left half (Female_Adult_14): same spoon gesture as person 4, over the colored sprinkles
    loadPerson('female_adult_14', 'Female_Adult_14.fbx', {
      hair: true, apron: APRON.f14, cap: true, lean: .2, nod: .34, turn: -.04, weight: -.01, stance: .06,
      hands: { R: { wrist: [-6, 107, 29], pole: [-4, 60, -25] }, L: { wrist: [17, 96.5, 18.5], pole: [45, 85, -15] } },
    }),
    // 8 · replenishment (Male_Adult_14): back counter by the fridge and the sink, with a supply box
    loadPerson('male_adult_14', 'Male_Adult_14.fbx', {
      apron: APRON.m14, cap: true, lean: .08, nod: .3, turn: 0, weight: .01,
      hands: { R: { wrist: [-15, 100, 20], pole: [-45, 85, -15] }, L: { wrist: [15, 100, 20], pole: [45, 85, -15] } },
    }),
  ]);
  place(p1, ROLES[0], 0, 1);
  place(p2, ROLES[1], Math.PI, 2);
  place(p3, ROLES[2], Math.atan2(-1, .6), 3);
  place(p4, ROLES[3], 0, 4);
  place(p5, ROLES[4], 0, 5);
  place(p6, ROLES[5], Math.PI, 6);
  place(p7, ROLES[6], 0, 7); p7.fbx.position.y = 1;   // her shoes sit 1 cm below the hip origin in this model
  place(p8, ROLES[7], Math.PI, 8);
  p6.action = action6; p7.action = action7; p8.action = action8; p8.leanAt = (ph) => .22 * smooth(ph);
  p1.action = action1; p2.action = action2; p3.action = action3; p4.action = action4; p5.action = action5; p5.leanAt = (ph) => .2 * smooth(ph);
  p1.ref = .5; p2.ref = .5; p3.ref = .5;   // same as the phase slider default
  buildProps(p1, p3); buildProps45(p4, p5);
  { const k7 = toppingKit(2, 31); MECH.c7 = k7.churro; MECH.spoon7 = k7.spoon; p7.props = [k7.churro, k7.spoon]; }
  p8.props = [buildSupply()];
  // every prop that lives outside its person's group follows that person's visibility and fade (study 11 fix)
  p1.props = P_PROPS.slice(); p3.props = [MECH.churro];
  const shared = new Set(Object.values(M));
  for (const P of PEOPLE) { P.props = P.props || []; P.propMats = []; for (const o of P.props) o.traverse(q => { if (q.isMesh) for (const m of [].concat(q.material)) if (!shared.has(m) && !P.propMats.includes(m)) P.propMats.push(m); }); }
  for (const P of PEOPLE) applyPose(P);
  G['layer-staff'].traverse(o => { if (o.isMesh) o.castShadow = true; });
})();


// =====================================================================================================
// cinematic study 04: animatic layer. One clock (0 to 96 s).
// Performance (from profiling study 01): people are posed from baked tables instead of solving arm and hand IK every
// frame; shadows update only when something that casts them changes; the interior is not drawn while the trailer is
// closed; shaders are compiled before the first frame that needs them.
// =====================================================================================================
import { SHOTS } from './shots.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
actionMode = 'auto';
const gain = 1;
const scaleDyn = (d, g) => ({ lean: d.lean * g, nod: d.nod * g, turn: d.turn * g, twist: d.twist * g, weight: d.weight * g,
  hands: { L: { d: d.hands.L.d.map(v => v * g), curl: d.hands.L.curl * g }, R: { d: d.hands.R.d.map(v => v * g), curl: d.hands.R.curl * g } } });
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
const EASE = { io: (v) => v < .5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2, out: (v) => 1 - Math.pow(1 - v, 3), in: (v) => v * v * v, lin: (v) => v };
const seg = (t, a, b) => ease(clamp01((t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const L2W = (a) => root.localToWorld(V3(a));
const win = (c, a, b, f = .35) => clamp01(Math.min((c - a) / f, (b - c) / f));
G.labels.visible = false; overlay.visible = false; for (const o of roleLabels) o.visible = false;
renderer.shadowMap.autoUpdate = false; let shadowDirty = true;
// phones: people get a soft contact shadow instead of re-rendering the shadow map every frame (measured: 23 ms render at 4x CPU)
const PHONE = matchMedia('(max-width: 860px)').matches;
const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 2, 32, 32, 32); r.addColorStop(0, 'rgba(40,25,20,.55)'); r.addColorStop(1, 'rgba(40,25,20,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; })();

// ---------- reveal (approved phases)
const roofMats = []; let lampMat = null;
G.roof.traverse(o => { if (o.isMesh) { const isLamp = o.material === M.lamp; o.material = isLamp ? (lampMat ||= M.lamp.clone()) : o.material.clone(); if (!isLamp) { o.material.transparent = true; roofMats.push(o.material); } } });
for (const c of clipped) { c.clippingPlanes = [section]; c.needsUpdate = true; }
const tmp = new THREE.Vector3(); let lastR = -1;
const INTERIOR = [G.counters, G.equipment, toppingPieces];
function applyReveal(r) {
  if (r === lastR) return; lastR = r; shadowDirty = true;
  for (const g of INTERIOR) g.visible = r > 0;        // closed trailer: nothing inside is drawn
  const win_ = seg(r, 0, .3), ctrO = seg(r, .05, .35), roofP = seg(r, .2, .6), cutP = seg(r, .4, .85), wa = THREE.MathUtils.degToRad(75) * win_;
  for (const p of panels) { p.g.rotation[p.axis] = p.sign * wa; p.g.updateMatrixWorld(); for (const sr of p.struts) { sr.m.visible = win_ > .06; if (sr.m.visible) { tmp.copy(sr.loc); p.g.localToWorld(tmp); root.worldToLocal(tmp); placeRod(sr.m, sr.wall, tmp); } } }
  ctr.rotation.x = THREE.MathUtils.degToRad(90) * (1 - ctrO); ctr.updateMatrixWorld();
  for (const b of braces) { b.m.visible = ctrO > .5; if (b.m.visible) { tmp.copy(b.loc); ctr.localToWorld(tmp); root.worldToLocal(tmp); placeRod(b.m, b.wall, tmp); } }
  G.roof.position.y = 70 * roofP; G.roof.visible = roofP < .995;
  for (const m of roofMats) { m.opacity = 1 - roofP; m.depthWrite = roofP < .05; }
  for (const o of G.roof.children) if (o.material === lampMat || o.isLight) o.visible = roofP < .02;
  const c = 230 + (CUT - 230) * cutP; section.constant = c;
  const capsOn = c <= WTOP - 2; G.caps.visible = capsOn; doorCap.visible = capsOn; G.caps.position.y = c - CUT; doorCap.position.y = c - CUT;
}

// ---------- camera: shot list, perspective; on phones each shot keeps pk of its desktop width
const KEYS = []; { let prev = null; for (const s of SHOTS) { const from = s.from || prev; KEYS.push({ ...s, A: from, B: s.to }); prev = s.to; } }
const REF_ASPECT = 1.3; let aspect = 1.3;
function camAt(c) {
  const k = KEYS.findLast(s => c >= s.t[0]) || KEYS[0];
  const e = (EASE[k.ease] || EASE.io)(clamp01((c - k.t[0]) / (k.t[1] - k.t[0])));
  if (k.orbit) { const o = k.orbit, an = THREE.MathUtils.degToRad(lerp(o.a[0], o.a[1], e)), r = lerp(o.r[0], o.r[1], e);   // a true arc around the trailer
    return { p: [o.c[0] + Math.cos(an) * r, lerp(o.y[0], o.y[1], e), o.c[2] + Math.sin(an) * r], l: o.l, f: k.f, pk: k.pk, shot: k }; }
  return { p: k.A.p.map((v, i) => lerp(v, k.B.p[i], e)), l: k.A.l.map((v, i) => lerp(v, k.B.l[i], e)), f: lerp(k.A.f, k.B.f, e), pk: lerp(k.A.pk ?? .9, k.B.pk ?? .9, e), shot: k };
}
function placeCamera(C) {
  camera.position.copy(L2W(C.p)); camera.up.set(0, 1, 0); camera.lookAt(L2W(C.l));
  let v = C.f;
  if (aspect < REF_ASPECT) { const h = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(v) / 2) * REF_ASPECT) * C.pk; v = Math.max(v, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect))); }
  camera.fov = v; camera.aspect = aspect; camera.updateProjectionMatrix();
}
function resize() { const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; aspect = w / h; renderer.setSize(w, h, false); }
new ResizeObserver(resize).observe(stage); resize();

// ---------- station key light (no tint)
const spot = new THREE.SpotLight(0xffd2a8, 0, 0, .42, .85, 0); spot.castShadow = false; scene.add(spot, spot.target);
let spotI = 0;
function keyLight(shot) {
  spotI += ((shot.light ? 1 : 0) - spotI) * .12;
  if (shot.light) { const t = L2W(shot.light); spot.target.position.copy(t); spot.position.copy(t).add(new THREE.Vector3(30, 140, 60)); }
  spot.intensity = 2.0 * spotI;
}

// ---------- labels: one treatment for every label (pill, leader line, dot on the object), kept inside the frame
const layer = document.createElement('div'); layer.className = 'hk-tags'; layer.setAttribute('aria-hidden', 'true'); stage.appendChild(layer);
const tagEls = new Map();
function tagEl(key, text, kind) { if (!tagEls.has(key)) { const d = document.createElement('div'); d.className = 'hk-tag ' + kind; d.innerHTML = `<span>${text}</span><i></i>`; layer.appendChild(d); tagEls.set(key, d); } return tagEls.get(key); }
const pv = new THREE.Vector3();
function showTag(key, text, at, o, kind = 'lead') {
  const d = tagEl(key, text, kind); if (o <= .01) { if (d.style.opacity !== '0') d.style.opacity = 0; return; }
  pv.copy(L2W(at)).project(camera); if (pv.z >= 1) { d.style.opacity = 0; return; }
  const W = stage.clientWidth, H = stage.clientHeight, x = (pv.x * .5 + .5) * W, y = (-pv.y * .5 + .5) * H;
  const pill = d.firstChild, pw = pill.offsetWidth, m = 12, left = x - pw / 2, right = x + pw / 2;
  const dx = left < m ? m - left : right > W - m ? W - m - right : 0;
  d.style.opacity = o; d.style.transform = `translate(${x}px, ${y}px)`; pill.style.transform = `translate(calc(-50% + ${dx}px), 0)`;
}

// ---------- dimension lines (part 1)
const ink = new THREE.MeshBasicMaterial({ color: 0x400849, transparent: true, toneMapped: false });
const dimG = new THREE.Group(); root.add(dimG);
const dimLen = rod([0, -39, 216], [300, -39, 216], .7, ink, dimG, 8), dimWid = rod([316, -39, 0], [316, -39, 200], .7, ink, dimG, 8);
for (const a of [[0, 216], [300, 216]]) rod([a[0], -39, a[1] - 7], [a[0], -39, a[1] + 7], .55, ink, dimG, 8);
for (const a of [[316, 0], [316, 200]]) rod([a[0] - 7, -39, a[1]], [a[0] + 7, -39, a[1]], .55, ink, dimG, 8);
dimG.traverse(o => { if (o.isMesh) o.castShadow = false; });
function dims(c) {
  const a = seg(c, 4.0, 5.2), b = seg(c, 4.8, 6.0), out = 1 - seg(c, 8.6, 9.2);
  placeRod(dimLen, V3([150 - 150 * a, -39, 216]), V3([150 + 150 * a + .01, -39, 216]));
  placeRod(dimWid, V3([316, -39, 100 - 100 * b]), V3([316, -39, 100 + 100 * b + .01]));
  ink.opacity = out; dimG.visible = c > 4 && out > 0;
  showTag('d3', '3 m', [150, -39, 216], win(c, 4.6, 9.2) * out, 'dim');
  showTag('d2', '2 m', [316, -39, 100], win(c, 5.4, 9.2) * out, 'dim');
  showTag('d6', '6 m²', [150, 222, 100], win(c, 6.0, 9.2) * out, 'dim big');
}

// ---------- part 3: the order, as states at each station (no people). Every placement rests on a real surface.
const grey = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: .5, metalness: .3 });
const rail = new THREE.Group(); root.add(rail);
rod([100, 168, 195], [282, 168, 195], .5, grey, rail); rod([100, 163, 195], [282, 163, 195], .5, grey, rail);
// the real order ticket (Comanda de Pedidos, 2015), 640 px texture; this order: Nutella filling (the spout it is filled at), M&M's
const ticketCv = document.createElement('canvas'); ticketCv.width = 640; ticketCv.height = 1230;
const ticketTex = new THREE.CanvasTexture(ticketCv); ticketTex.colorSpace = THREE.SRGBColorSpace; ticketTex.anisotropy = 8;
{ const img = new Image(); img.onload = () => { const g = ticketCv.getContext('2d'); g.drawImage(img, 0, 0, 640, 1230);
    g.strokeStyle = '#1f3c8f'; g.lineWidth = 3.2; g.lineCap = 'round';
    for (const [x, y] of [[76, 324], [76, 560]]) { g.beginPath(); g.moveTo(x - 10, y - 9); g.quadraticCurveTo(x, y + 1, x + 11, y + 10); g.moveTo(x + 10, y - 10); g.quadraticCurveTo(x - 1, y, x - 9, y + 11); g.stroke(); }
    ticketTex.needsUpdate = true; shadowDirty = true; };
  img.src = BASE + 'art/ticket.webp'; }
const paper = new THREE.MeshStandardMaterial({ color: 0xf6f4ef, roughness: .9 }), ticketFace = new THREE.MeshStandardMaterial({ map: ticketTex, roughness: .85 });
const ticket = new THREE.Mesh(new THREE.BoxGeometry(7.5, .1, 14.4), [paper, paper, ticketFace, paper, paper, paper]); ticket.castShadow = true; root.add(ticket);
const CH = 19.5, CR = 1.9;                                     // CR: outer radius of the churro, ridges and bevel included                                               // the order's churro, cm (fits the Hola! tray, 22 cm)
const RAW = new THREE.Color(0xead2a4), GOLD = new THREE.Color(0xc7843f), SUGAR = new THREE.Color(0xd9a56a);
const churro = makeChurro(CH); root.add(churro);              // geometry runs along +z from 0 to CH
const plainMat = churro.material;
const sugarMat = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'), r = rnd(99); g.fillStyle = '#c98a4b'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5000; i++) { const v = r(); g.fillStyle = v < .55 ? 'rgba(250,244,232,.9)' : v < .8 ? 'rgba(139,74,34,.75)' : 'rgba(225,200,160,.9)'; g.fillRect(r() * 256, r() * 256, 1.4, 1.4); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(.25, .25); return new THREE.MeshStandardMaterial({ map: t, roughness: .9 }); })();
{ const d = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), sugarMat); d.position.set(150, -60, 100); root.add(d); }   // keeps the material compiled at load
const fillBead = new THREE.Mesh(new THREE.CapsuleGeometry(.75, CH - 3.5, 4, 10), new THREE.MeshStandardMaterial({ color: 0x4a2412, roughness: .35 }));
fillBead.rotation.x = Math.PI / 2; fillBead.scale.set(1, 1, .55); fillBead.position.set(0, 1.75, CH / 2); churro.add(fillBead);
const candies = sprinkleOn(churro, CH, 5, 60, 2, CH - 2, 77);
// dough strand: star profile swept along the path from inside the nozzle, down onto the board, then along it
const STAR = (() => { const s = new THREE.Shape(); for (let k = 0; k <= 16; k++) { const a = k / 16 * TAU, r = k % 2 ? 1.25 : 1.7; k ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(r, 0); } return s; })();
const NOZ_TIP = [130.1, 94.0, 24];                             // dough dispenser outlet (bottom of the chrome tip)
const BOARD_Y = 91.8 + CR;                                     // board top + churro radius
const LAY = [V3([130.1, 95.4, 24]), V3([130.1, 94.2, 24.6]), V3([129.4, BOARD_Y, 26.6])];
const LAY_DIR = V3([-11.7, 0, 15.3]).normalize();              // diagonal across the board, stays on it
const strandMat = new THREE.MeshStandardMaterial({ color: RAW, roughness: .8 });
const strand = new THREE.Mesh(new THREE.BufferGeometry(), strandMat); strand.castShadow = true; root.add(strand); strand.visible = false;
let strandLen = -1;
function buildStrand(len) {
  if (Math.abs(len - strandLen) < .25) return; strandLen = len;
  const pts = [...LAY]; const end = LAY[2].clone().addScaledVector(LAY_DIR, Math.max(.3, len)); pts.push(LAY[2].clone().addScaledVector(LAY_DIR, Math.max(.15, len / 2)), end);
  const path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  strand.geometry.dispose(); strand.geometry = new THREE.ExtrudeGeometry(STAR, { steps: 40, bevelEnabled: false, extrudePath: path });
}
const boardPiece = { p: LAY[2].clone(), q: new THREE.Quaternion().setFromUnitVectors(V3([0, 0, 1]), LAY_DIR) };
const ALONG_X = new THREE.Quaternion().setFromUnitVectors(V3([0, 0, 1]), V3([1, 0, 0])), ALONG_Z = new THREE.Quaternion();
// state table: [from, position of the churro's start (local), orientation, color, filled, toppings]
const DRAIN = [46.6, RACK_Y + CR, 24 - CH / 2], SUGAR_T = [16.4, SUGAR_Y + CR - .6, 24 - CH / 2];   // on the rack; settled into the mixture
const STATES = [
  [44.9, boardPiece.p.toArray(), boardPiece.q, 'raw', 0, 0],
  [46.0, [72.7, 92.0, 25.8 - CH / 2], ALONG_Z, 'fry', 0, 0],          // floating in the oil inside the open basket (oil top 92.3, basket floor 85.5)
  [49.5, DRAIN, ALONG_Z, 'gold', 0, 0],
  [51.5, SUGAR_T, ALONG_Z, 'sugar', 0, 0],
  [53.5, [21.2 - 2.6, 94.4, 109.4], ALONG_X, 'sugar', 1, 0],             // pushed 2.6 cm onto the Nutella spout
  [57.0, [134.8 - CH / 2, 97.45 + CR, 180], ALONG_X, 'sugar', 1, 1],     // resting on the candy mound (container 6)
  [60.0, [205 - CH / 2, 90.28 + CR, 186], ALONG_X, 'sugar', 1, 1],      // inside the Hola! tray on the front counter, window 1
];
let tray = null;
function order(c) {
  const on = c >= 30 && c < 66.8; rail.visible = c >= 30 && c < 66;
  // ticket: pad, then rail, then beside the tray
  ticket.visible = on;
  if (c < 36) { ticket.position.set(251.2, 90.36, 172); ticket.rotation.set(0, .32, 0); }
  else if (c < 60) { ticket.position.set(234, 168 - 7.4, 195.6); ticket.rotation.set(Math.PI / 2, 0, 0); }   // hung by its top edge from the rail
  else { ticket.position.set(222, 90.12, 188); ticket.rotation.set(0, -.25, 0); }
  // dough: lever and plunger, the strand growing out of the nozzle
  const lev = c < 42.4 ? 0 : c < 44.6 ? EASE.io((c - 42.4) / 2.2) : 1 - EASE.io(clamp01((c - 45.0) / .8));
  MECH.dough.rotation.x = deg(DOUGH_MAX) * lev; MECH.plunger.position.y = MECH.plungerY - 9 * lev;
  strand.visible = c >= 42.6 && c < 44.9;
  if (strand.visible) buildStrand(CH * EASE.io(clamp01((c - 42.6) / 2.0)) - 2.2);
  const st = STATES.findLast(s => c >= s[0]);
  churro.visible = on && !!st && c < 66.8;
  if (st) {
    churro.position.set(...st[1]); churro.quaternion.copy(st[2]);
    churro.material = st[3] === 'sugar' ? sugarMat : plainMat; const m = plainMat;
    if (st[3] === 'raw') m.color.copy(RAW); else if (st[3] === 'fry') m.color.copy(RAW).lerp(GOLD, seg(c, 46.4, 49.2)); else if (st[3] === 'gold') m.color.copy(GOLD);
    fillBead.visible = !!st[4]; candies.visible = !!st[5];
  }
  if (tray) tray.visible = on && c >= 60;
}
// dashed production path: dough → fryer → drain → sugar → fillings → toppings → window 1 (on the counter surfaces)
const ROUTE = [[129, 93.4, 33], [100, 94.5, 34], [72.7, 94.6, 30], [46.6, 98.4, 30], [16.4, 98.4, 30], [12, 92.6, 60], [12, 92.6, 100], [24, 96, 112], [24, 92.6, 140], [40, 97, 176], [80, 97.4, 176], [134.8, 101, 176], [170, 91.8, 186], [196, 91.8, 186]];
const routeCurve = new THREE.CatmullRomCurve3(ROUTE.map(V3), false, 'catmullrom', .3), RL = routeCurve.getLength();
const routeMat = new THREE.MeshBasicMaterial({ color: 0xff5a0a, transparent: true, toneMapped: false, depthTest: true });
const routeG = new THREE.Group(); root.add(routeG); const dashes = [];
for (let d = 0; d < RL - 8; d += 13) { const a = routeCurve.getPointAt(d / RL), b = routeCurve.getPointAt((d + 8) / RL); const m = rod(a.toArray(), b.toArray(), 1.9, routeMat, routeG, 10); m.castShadow = false; m.renderOrder = 4; dashes.push([d, m]); }
{ const end = routeCurve.getPointAt(1), dir = end.clone().sub(routeCurve.getPointAt(1 - 4 / RL)).normalize(); const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 9, 20), routeMat); cone.position.copy(end).addScaledVector(dir, 2); cone.quaternion.setFromUnitVectors(V3([0, 1, 0]), dir); routeG.add(cone); dashes.push([RL, cone]); }
function route(c) {
  routeG.visible = c > 63.4 && c < 66.8; if (!routeG.visible) return;
  const reach = RL * seg(c, 63.4, 65.6); for (const [d, m] of dashes) m.visible = d <= reach;
  routeMat.opacity = 1 - seg(c, 66.0, 66.8);
}

// ---------- people (part 4 only), posed from baked tables
const POS = { 4: [[102, 138], [127, 138]], 3: [[60, 125], [50, 114]] };
const JOIN = { 1: 66.6, 2: 66.6, 3: 66.6, 4: 74.6, 5: 74.6, 6: 83.0, 7: 83.0, 8: 83.0 };
let teamLoaded = false;
const BN = 72, BAKE = new Map(), queue = [];
const bnOf = (pid) => (pid === 4 || pid === 7 ? 144 : BN);   // the spoon strokes are the fastest actions: sampled twice as densely
const posKey = (P) => `${P.pid}@${P.fbx.parent.position.x.toFixed(1)},${P.fbx.parent.position.z.toFixed(1)}`;
function bakeTargets(P) { const s = new Set([P.fbx]); P.fbx.traverse(o => { if (o.isBone) s.add(o); }); for (const o of P.props || []) s.add(o); for (const v of Object.values(MECH)) if (v && v.isObject3D) s.add(v); for (const l of MECH.levers) s.add(l); return [...s]; }
function bakeStep(budget) {
  const t0 = performance.now();
  // study 04: one timeline per person and their objects. A job keeps its own working state across frames (the actions
  // read the current position of the objects they move), and the scene's state is put back after every chunk.
  if (!queue.length) return;
  const shared = bakeTargets({ fbx: new THREE.Object3D(), props: [] }), save = () => shared.map(o => [o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]);
  const scene0 = save(), load = (st) => { for (const [o, p, q, sc] of st) { o.position.copy(p); o.quaternion.copy(q); o.scale.copy(sc); } };
  if (queue[0].work) load(queue[0].work);
  while (queue.length && performance.now() - t0 < budget) {
    const j = queue[0], P = j.P;
    P.fbx.parent.position.set(j.pos[0], 0, j.pos[1]); P.fbx.parent.updateMatrixWorld(true);
    applyPose(P, ZERO, j.i / j.bn);
    // study 04: the spoon is held, so it moves with the right hand. The approved action placed it on its own stroke path,
    // which the hand followed only approximately (measured: up to 7.5 cm for person 7 in Run the Team 14 itself).
    const spoon = (P.pid === 4 || P.pid === 7) && (P.props || []).find(o => o.userData.prop === 'spoon');
    if (spoon) { const H = P.B('R_Hand'); H.updateWorldMatrix(true, false); spoon.updateWorldMatrix(true, false);
      if (!j.rel) j.rel = H.matrixWorld.clone().invert().multiply(spoon.matrixWorld);
      const m = spoon.parent.matrixWorld.clone().invert().multiply(H.matrixWorld).multiply(j.rel); m.decompose(spoon.position, spoon.quaternion, spoon.scale); }
    const row = j.buf.subarray(j.i * j.objs.length * 10); j.objs.forEach((o, k) => { o.position.toArray(row, k * 10); o.quaternion.toArray(row, k * 10 + 3); o.scale.toArray(row, k * 10 + 7); });
    if (++j.i > j.bn) {   // keep only what this person's action actually moves
      const n = j.objs.length, keep = [];
      // every bone of this person is restored every frame (study 03 fix: bones left out of the table kept whatever
      // rotation was applied last, so the head turned a little more each frame); shared equipment only if it moves
      const own = new Set([P.fbx]); P.fbx.traverse(o => own.add(o)); for (const o of P.props || []) own.add(o);   // own props always restored
      for (let k = 0; k < n; k++) { let moves = own.has(j.objs[k]); for (let r = 1; r <= j.bn && !moves; r++) for (let q = 0; q < 10; q++) if (Math.abs(j.buf[r * n * 10 + k * 10 + q] - j.buf[k * 10 + q]) > 1e-5) { moves = true; break; } if (moves) keep.push(k); }
      const data = new Float32Array((j.bn + 1) * keep.length * 10); for (let r = 0; r <= j.bn; r++) keep.forEach((k, kk) => data.set(j.buf.subarray(r * n * 10 + k * 10, r * n * 10 + k * 10 + 10), (r * keep.length + kk) * 10));
      BAKE.set(j.key, { objs: keep.map(k => j.objs[k]), data, bn: j.bn }); queue.shift();
      if (queue.length) { load(scene0); if (queue[0].work) load(queue[0].work); }
    }
  }
  if (queue.length) queue[0].work = save();
  load(scene0);   // equipment back where the scene left it
}
const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
let livePoses = 0;
function posePerson(P, c) {
  const ph = AUTO[P.pid](c + P.seed * 5), tb = BAKE.get(posKey(P));   // the person's own cycle, no pause for a glance (head look is off)
  if (!tb) { applyPose(P, ZERO, ph); livePoses++; return; }   // not baked yet, or between two spots (idle head motion off)
  const x = clamp01(ph) * tb.bn, a = Math.min(tb.bn - 1, Math.floor(x)), k = x - a, n = tb.objs.length, D = tb.data;
  for (let i = 0; i < n; i++) { const o = tb.objs[i], ia = (a * n + i) * 10, ib = ((a + 1) * n + i) * 10;
    o.position.set(lerp(D[ia], D[ib], k), lerp(D[ia + 1], D[ib + 1], k), lerp(D[ia + 2], D[ib + 2], k));
    qa.fromArray(D, ia + 3); qb.fromArray(D, ib + 3); o.quaternion.slerpQuaternions(qa, qb, k);
    o.scale.set(lerp(D[ia + 7], D[ib + 7], k), lerp(D[ia + 8], D[ib + 8], k), lerp(D[ia + 9], D[ib + 9], k)); }
  // study 03: independent head and idle motion are off; the head keeps each approved working pose
}
teamReady.then(() => {
  for (const P of PEOPLE) { const spots = POS[P.pid] || [[P.fbx.parent.position.x, P.fbx.parent.position.z]]; for (const pos of spots) { P.fbx.parent.position.set(pos[0], 0, pos[1]); const objs = bakeTargets(P); queue.push({ P, pos, key: posKey(P), i: 0, bn: bnOf(P.pid), objs, buf: new Float32Array((bnOf(P.pid) + 1) * objs.length * 10) }); } }
  for (const P of PEOPLE) for (const o of P.props || []) if (o.userData.prop === 'package') { tray = o.clone(true); }
  if (tray) { tray.traverse(o => { if (o.isMesh && (o.geometry.type === 'ExtrudeGeometry' || o.geometry.type === 'CapsuleGeometry' || o.isInstancedMesh)) o.visible = false; }); tray.position.set(205, 90.0 + TRAY.H / 2, 186); tray.quaternion.identity(); tray.visible = false; root.add(tray); }
  if (PHONE) for (const P of PEOPLE) { P.fbx.parent.traverse(o => { o.castShadow = false; }); for (const o of P.props || []) o.traverse(q => { q.castShadow = false; });
    const b = new THREE.Mesh(new THREE.PlaneGeometry(62, 46), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, toneMapped: false })); b.rotation.x = -Math.PI / 2; b.position.y = .4; b.renderOrder = 1; P.fbx.parent.add(b); P.blob = b; }
  teamLoaded = true; warm();
});
function team(c) {
  if (!teamLoaded || c < 66) { if (G['layer-staff'].visible) { G['layer-staff'].visible = false; shadowDirty = true; } return; }
  let any = false; const k8 = EASE.io(clamp01((c - 83.0) / .8));
  for (const P of PEOPLE) {
    const f = smooth(clamp01((c - JOIN[P.pid]) / .6));
    if (POS[P.pid]) { const [a, b] = POS[P.pid]; P.fbx.parent.position.set(lerp(a[0], b[0], k8), 0, lerp(a[1], b[1], k8)); P.fbx.parent.updateMatrixWorld(true); }
    P.vis = f; P.fbx.parent.visible = f > .01; any ||= f > .01;
    for (const m of P.mats) { m.opacity = f; m.transparent = f < 1; m.depthWrite = f > .5; }
    for (const o of P.props || []) o.visible = f > .01;
    for (const m of P.propMats || []) { m.opacity = f; m.transparent = f < 1; m.depthWrite = f > .5; }
    if (P.blob) P.blob.material.opacity = f;
  }
  if (G['layer-staff'].visible !== any) shadowDirty = true;
  G['layer-staff'].visible = any;
  if (any) { for (const P of PEOPLE) if (P.vis > .01) posePerson(P, c); if (!PHONE) shadowDirty = true; }
}

// ---------- static geometry merged per material (draw calls: about 455 kitchen meshes into a few dozen). Moving parts stay separate.
function mergeStatic() {
  const moving = new Set(); for (const v of [MECH.dough, MECH.plunger, MECH.basket, ...MECH.levers]) if (v) v.traverse(o => moving.add(o));
  let before = 0, after = 0;
  for (const g of [G.structure, G.exterior, G.counters, G.equipment, G.overhead]) {
    g.updateMatrixWorld(true); const inv = g.matrixWorld.clone().invert(), buckets = new Map();
    g.traverse(o => { if (!o.isMesh || o.isInstancedMesh || moving.has(o) || Array.isArray(o.material) || !o.visible) return;
      const k = `${o.material.uuid}|${o.castShadow}|${o.receiveShadow}|${o.renderOrder}`; (buckets.get(k) || buckets.set(k, []).get(k)).push(o); });
    for (const list of buckets.values()) {
      before += list.length; if (list.length < 2) { after++; continue; }
      const geos = list.map(o => { let ge = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); for (const n of Object.keys(ge.attributes)) if (!['position', 'normal', 'uv'].includes(n)) ge.deleteAttribute(n); if (!ge.attributes.uv) ge.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(ge.attributes.position.count * 2), 2)); ge.clearGroups(); return ge.applyMatrix4(inv.clone().multiply(o.matrixWorld)); });
      const merged = mergeGeometries(geos, false); if (!merged) { after += list.length; continue; }
      const m = new THREE.Mesh(merged, list[0].material); m.castShadow = list[0].castShadow; m.receiveShadow = list[0].receiveShadow; m.renderOrder = list[0].renderOrder;
      for (const o of list) o.parent.remove(o); g.add(m); after++;
    }
  }
  return { before, after };
}
const MERGE = mergeStatic();

// ---------- shader warm-up: compile everything once, so the first reveal or the first person does not stall
function warm() {
  const saved = []; const show = (o) => { saved.push([o, o.visible]); o.visible = true; };
  root.traverse(o => { if (o.isMesh || o.isGroup) show(o); });
  for (const P of PEOPLE) for (const m of P.mats) m.transparent = false;
  renderer.compile(scene, camera); renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera);
  for (const [o, v] of saved) o.visible = v; lastR = -1; shadowDirty = true;
}
warm();

// ---------- one frame, with per-phase timing for the profiler
const PERF = { n: 0, reveal: 0, camera: 0, order: 0, team: 0, tags: 0, render: 0, max: 0, calls: 0, tris: 0, shadowFrames: 0, live: 0 };
let overheadOn = true, frameNo = 0, lastC = '';
export function frame(c) {
  const t0 = performance.now(); frameNo++;
  bakeStep(c < 66 ? 4 : 2);
  applyReveal(c < 9.6 ? 0 : clamp01((c - 9.6) / 3.4));
  const oh = !(c > 63.2 && c < 67.4) && lastR > 0; if (oh !== overheadOn) { overheadOn = oh; G.overhead.visible = oh; shadowDirty = true; }
  const t1 = performance.now();
  const C = camAt(c); placeCamera(C); dims(c); keyLight(C.shot); const t2 = performance.now();   // override: review close-ups only
  order(c); route(c);
  const sig = c >= 30 && c < 67 ? `${STATES.findLastIndex(x => c >= x[0])}|${strand.visible ? strandLen.toFixed(1) : ''}|${MECH.dough.rotation.x.toFixed(3)}|${ticket.position.y}|${routeG.visible}` : '';
  if (sig !== lastC) { shadowDirty = true; lastC = sig; } const t3 = performance.now();
  livePoses = 0; team(c); const t4 = performance.now();
  for (const s of KEYS) if (s.label) showTag('l' + s.id, s.label[0], s.label[1], win(c, s.t[0] + .5, s.t[1] - .1, .3));
  const t5 = performance.now();
  if (shadowDirty) { renderer.shadowMap.needsUpdate = true; shadowDirty = false; PERF.shadowFrames++; }
  renderer.render(scene, camera); const t6 = performance.now();
  PERF.n++; PERF.reveal += t1 - t0; PERF.camera += t2 - t1; PERF.order += t3 - t2; PERF.team += t4 - t3; PERF.tags += t5 - t4; PERF.render += t6 - t5; PERF.max = Math.max(PERF.max, t6 - t0);
  PERF.calls += renderer.info.render.calls; PERF.tris += renderer.info.render.triangles; PERF.live += livePoses;
  return C.shot;
}
export const isTeamReady = () => teamLoaded;
export const isBaked = () => teamLoaded && !queue.length;
export { teamReady };
export const perfInfo = () => ({ merged: MERGE, programs: renderer.info.programs.length, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, pixelRatio: renderer.getPixelRatio(), baked: BAKE.size, queue: queue.length });
// names the inherited review hooks expect (the orthographic study camera is not used here)
function setCam() {} function fit() {} const VIEWS = {}; const V = () => [];
export const perf = PERF;
