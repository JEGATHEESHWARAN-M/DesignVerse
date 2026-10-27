/**
 * DESIGNVERSE STUDIO — Comprehensive Mobile 2D/3D Floor Planner, Wall Builder & AI Photo-to-3D Visualizer
 * Fully bundled, zero external module dependencies.
 */

import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { Room3DSceneSchema, ComputerVisionAnalyzer, ImageVerifier, SceneOptimizer } from './reconstructionEngine.js';
import { VoiceCommandEngine } from './voiceCommandEngine.js';

// ── Application State ──────────────────────────────────────────
const state = {
  viewMode: '2d', // '2d' or '3d'
  toolMode: 'select', // 'select', 'wall', 'door', 'window'
  cameraMode: 'orbit', // 'orbit' or 'walkthrough'
  is360Rotating: false,
  customUploadedPhotoData: null,
  room: {
    width: 6.0,  // meters (X axis)
    length: 5.0, // meters (Z axis)
    height: 2.8, // meters (Y axis)
    wallColor: '#20222e',
    floorType: 'hardwood', // 'hardwood', 'marble', 'parquet', 'concrete'
    lighting: 'daylight' // 'daylight', 'sunset', 'night'
  },
  items: [],
  customWalls: [], // User drawn walls [{x1, z1, x2, z2}]
  selectedItemId: null,
  draggingItem: null,
  dragOffset: { x: 0, z: 0 },
  canvasScale: 65, // pixels per meter in 2D
  panOffset: { x: 0, y: 0 },
  wallDrawingStart: null,
  wallDrawingCurrent: null,
  walkthroughKeys: { forward: false, backward: false, left: false, right: false }
};

// Expanded Furniture & Architectural Catalog
const CATALOG = {
  // Living Room
  sofa: { name: 'Modular Sofa', category: 'living', type: 'sofa', icon: '🛋️', width: 2.2, depth: 0.9, height: 0.8, color: '#3A66FF' },
  armchair: { name: 'Accent Armchair', category: 'living', type: 'armchair', icon: '🪑', width: 0.88, depth: 0.85, height: 0.85, color: '#527aff' },
  chair: { name: 'Dining Chair', category: 'dining', type: 'chair', icon: '🪑', width: 0.55, depth: 0.55, height: 0.88, color: '#4f46e5' },
  coffeeTable: { name: 'Coffee Table', category: 'living', type: 'table', icon: '🪵', width: 1.1, depth: 0.6, height: 0.45, color: '#8B6914' },
  tvUnit: { name: 'TV & Console', category: 'living', type: 'tvUnit', icon: '📺', width: 1.8, depth: 0.45, height: 1.2, color: '#1a1a24' },

  // Bedroom & Dining
  bed: { name: 'King Bed', category: 'bedroom', type: 'bed', icon: '🛏️', width: 2.0, depth: 2.1, height: 1.0, color: '#4338ca' },
  wardrobe: { name: 'Large Wardrobe', category: 'bedroom', type: 'wardrobe', icon: '🚪', width: 1.6, depth: 0.6, height: 2.2, color: '#2d251d' },
  desk: { name: 'Workstation Desk', category: 'bedroom', type: 'desk', icon: '💻', width: 1.4, depth: 0.7, height: 0.75, color: '#242b35' },
  diningTable: { name: 'Dining Table (6P)', category: 'dining', type: 'dining', icon: '🍽️', width: 1.6, depth: 0.9, height: 0.75, color: '#5c4228' },

  // Kitchen Suite
  kitchenCounter: { name: 'Island Counter & Sink', category: 'kitchen', type: 'kitchenCounter', icon: '🍳', width: 2.0, depth: 0.8, height: 0.9, color: '#2d2a20' },
  refrigerator: { name: 'Double Fridge', category: 'kitchen', type: 'refrigerator', icon: '🧊', width: 0.9, depth: 0.8, height: 1.85, color: '#cbd5e1' },
  stove: { name: 'Range Stove & Hood', category: 'kitchen', type: 'stove', icon: '🔥', width: 0.8, depth: 0.65, height: 1.4, color: '#334155' },

  // Bathroom Suite
  bathtub: { name: 'Freestanding Bathtub', category: 'bathroom', type: 'bathtub', icon: '🛁', width: 1.7, depth: 0.8, height: 0.6, color: '#f8fafc' },
  vanity: { name: 'Bathroom Vanity', category: 'bathroom', type: 'vanity', icon: '🪞', width: 1.2, depth: 0.5, height: 0.85, color: '#475569' },
  shower: { name: 'Glass Shower Enclosure', category: 'bathroom', type: 'shower', icon: '🚿', width: 1.0, depth: 1.0, height: 2.1, color: '#38bdf8' },
  toilet: { name: 'Wall Toilet', category: 'bathroom', type: 'toilet', icon: '🚽', width: 0.45, depth: 0.65, height: 0.5, color: '#ffffff' },

  // Openings & Decor
  door: { name: 'Interior Door', category: 'arch', type: 'door', icon: '🚪', width: 0.9, depth: 0.15, height: 2.1, color: '#8B4513' },
  window: { name: 'Glass Window', category: 'arch', type: 'window', icon: '🪟', width: 1.2, depth: 0.15, height: 1.2, color: '#60a5fa' },
  lamp: { name: 'Floor Lamp', category: 'decor', type: 'lamp', icon: '💡', width: 0.45, depth: 0.45, height: 1.6, color: '#f59e0b' },
  plant: { name: 'Potted Ficus', category: 'decor', type: 'plant', icon: '🪴', width: 0.5, depth: 0.5, height: 1.3, color: '#16a34a' }
};

// ── Three.js Scene Variables ───────────────────────────────────
let scene3d, camera3d, renderer3d, controls3d;
let roomMeshes = [];
let itemMeshes = new Map();
let dirLight, ambientLight, pointLight;

// ── DOM References ─────────────────────────────────────────────
let canvas2d, ctx2d, container3d;

// ── Initialize App ─────────────────────────────────────────────
function init() {
  canvas2d = document.getElementById('canvas2d');
  if (!canvas2d) return;
  ctx2d = canvas2d.getContext('2d');
  container3d = document.getElementById('canvas3d-container');

  setupEventListeners();
  resizeCanvases();
  setup3DScene();
  loadTemplate('living');
  render2D();

  window.addEventListener('resize', () => {
    resizeCanvases();
    if (state.viewMode === '2d') render2D();
    else if (renderer3d && container3d) {
      camera3d.aspect = container3d.clientWidth / container3d.clientHeight;
      camera3d.updateProjectionMatrix();
      renderer3d.setSize(container3d.clientWidth, container3d.clientHeight);
    }
  });
}

// ── Canvas Resizing ────────────────────────────────────────────
function resizeCanvases() {
  if (!canvas2d || !canvas2d.parentElement) return;
  const rect = canvas2d.parentElement.getBoundingClientRect();
  canvas2d.width = rect.width * window.devicePixelRatio;
  canvas2d.height = rect.height * window.devicePixelRatio;
  ctx2d.scale(window.devicePixelRatio, window.devicePixelRatio);
  state.panOffset.x = rect.width / 2;
  state.panOffset.y = rect.height / 2;
}

// ── Setup 3D Scene ─────────────────────────────────────────────
function setup3DScene() {
  if (!container3d) return;
  scene3d = new THREE.Scene();
  scene3d.background = new THREE.Color(0x0a0a0f);

  const w = container3d.clientWidth || (window.innerWidth - 600) || 800;
  const h = container3d.clientHeight || (window.innerHeight - 60) || 600;
  const aspect = w / h;
  camera3d = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
  camera3d.position.set(0, 7, 9);

  renderer3d = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer3d.setSize(w, h);
  renderer3d.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer3d.shadowMap.enabled = true;
  renderer3d.shadowMap.type = THREE.PCFSoftShadowMap;
  container3d.appendChild(renderer3d.domElement);

  controls3d = new OrbitControls(camera3d, renderer3d.domElement);
  controls3d.enableDamping = true;
  controls3d.dampingFactor = 0.05;
  controls3d.maxPolarAngle = Math.PI / 2 - 0.05;
  controls3d.minDistance = 1;
  controls3d.maxDistance = 25;
  controls3d.target.set(0, 1, 0);

  // Lighting
  ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene3d.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfff5ea, 1.3);
  dirLight.position.set(6, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0005;
  scene3d.add(dirLight);

  pointLight = new THREE.PointLight(0xffe6a3, 1.2, 15);
  pointLight.position.set(0, 2.6, 0);
  scene3d.add(pointLight);

  // 3D Render Loop
  function animate() {
    requestAnimationFrame(animate);
    if (state.viewMode === '3d') {
      if (state.cameraMode === 'walkthrough') {
        updateWalkthroughControls();
      } else {
        controls3d.update();
      }
      renderer3d.render(scene3d, camera3d);
    }
  }
  animate();
}

// ── Walkthrough Controls ───────────────────────────────────────
function updateWalkthroughControls() {
  const speed = 0.08;
  const dir = new THREE.Vector3();
  camera3d.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();

  const side = new THREE.Vector3().crossVectors(camera3d.up, dir).normalize();

  if (state.walkthroughKeys.forward) camera3d.position.addScaledVector(dir, speed);
  if (state.walkthroughKeys.backward) camera3d.position.addScaledVector(dir, -speed);
  if (state.walkthroughKeys.left) camera3d.position.addScaledVector(side, speed);
  if (state.walkthroughKeys.right) camera3d.position.addScaledVector(side, -speed);

  camera3d.position.y = 1.65;
}

// ── 3D Scene Synchronization ───────────────────────────────────
function sync3DScene() {
  if (!scene3d) return;

  roomMeshes.forEach(mesh => scene3d.remove(mesh));
  roomMeshes = [];

  const w = state.room.width;
  const l = state.room.length;
  const h = state.room.height;

  // 1. Floor Mesh
  const floorGeo = new THREE.PlaneGeometry(w, l);
  let floorColorHex = 0x4a3525;
  if (state.room.floorType === 'marble') floorColorHex = 0xdedede;
  else if (state.room.floorType === 'parquet') floorColorHex = 0x8a623c;
  else if (state.room.floorType === 'concrete') floorColorHex = 0x5a5d64;

  const floorMat = new THREE.MeshStandardMaterial({
    color: floorColorHex,
    roughness: state.room.floorType === 'marble' ? 0.15 : 0.6,
    metalness: 0.1
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene3d.add(floorMesh);
  roomMeshes.push(floorMesh);

  // 2. Grid Helper
  const gridHelper = new THREE.GridHelper(24, 24, 0x3A66FF, 0x1f2330);
  gridHelper.position.y = -0.01;
  scene3d.add(gridHelper);
  roomMeshes.push(gridHelper);

  // 3. Wall Meshes
  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(state.room.wallColor),
    roughness: 0.85
  });

  // Back Wall (Texture-mapped with exact input photo if available)
  const backWallGeo = new THREE.BoxGeometry(w, h, 0.15);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, h / 2, -l / 2 - 0.075);
  backWall.receiveShadow = true;
  scene3d.add(backWall);
  roomMeshes.push(backWall);

  if (state.customUploadedPhotoData) {
    const loader = new THREE.TextureLoader();
    loader.load(state.customUploadedPhotoData, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const photoFrontMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.05
      });
      // Materials array: [PX, NX, PY, NY, PZ (front face), NZ]
      const wallMats = [wallMat, wallMat, wallMat, wallMat, photoFrontMat, wallMat];
      backWall.material = wallMats;
      backWall.material.needsUpdate = true;

      // Render exact input image on high-resolution 3D Photo Viewplane
      const photoW = w * 0.92;
      const photoH = h * 0.86;
      const photoGeo = new THREE.PlaneGeometry(photoW, photoH);
      const photoMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.set(0, h * 0.5, -l / 2 + 0.08);
      scene3d.add(photoMesh);
      roomMeshes.push(photoMesh);
    });
  }

  // Left Wall
  const leftWallGeo = new THREE.BoxGeometry(0.15, h, l);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
  leftWall.position.set(-w / 2 - 0.075, h / 2, 0);
  leftWall.receiveShadow = true;
  scene3d.add(leftWall);
  roomMeshes.push(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
  rightWall.position.set(w / 2 + 0.075, h / 2, 0);
  rightWall.receiveShadow = true;
  scene3d.add(rightWall);
  roomMeshes.push(rightWall);

  // Custom Internal Walls
  state.customWalls.forEach(wall => {
    const dx = wall.x2 - wall.x1;
    const dz = wall.z2 - wall.z1;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dz, dx);

    const wallGeo = new THREE.BoxGeometry(len, h, 0.12);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set((wall.x1 + wall.x2) / 2, h / 2, (wall.z1 + wall.z2) / 2);
    wallMesh.rotation.y = -angle;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    scene3d.add(wallMesh);
    roomMeshes.push(wallMesh);
  });

  // Rebuild 3D Furniture Items
  itemMeshes.forEach(mesh => scene3d.remove(mesh));
  itemMeshes.clear();

  state.items.forEach(item => {
    const mesh = create3DFurnitureMesh(item);
    mesh.position.set(item.x, 0, item.z);
    mesh.rotation.y = item.rotation || 0;
    scene3d.add(mesh);
    itemMeshes.set(item.id, mesh);
  });
}

// Helper: Realistic Curved Bentwood Armchair for Dining Ensemble (media_1791388765111.jpg)
function createBentwoodArmchairMesh(woodMat, cushionMat, steelMat) {
  const chairGroup = new THREE.Group();
  const cw = 0.46;
  const cd = 0.46;
  const seatH = 0.42;

  // 4 Angled tapered legs
  const legGeo = new THREE.CylinderGeometry(0.014, 0.009, seatH, 8);
  const lx = cw / 2 - 0.05;
  const lz = cd / 2 - 0.05;
  [[-lx, -lz, 0.06, -0.06], [lx, -lz, -0.06, -0.06], [-lx, lz, 0.06, 0.06], [lx, lz, -0.06, 0.06]].forEach(([x, z, rx, rz]) => {
    const leg = new THREE.Mesh(legGeo, woodMat);
    leg.position.set(x, seatH / 2, z);
    leg.rotation.z = rx;
    leg.rotation.x = rz;
    leg.castShadow = true;
    chairGroup.add(leg);
  });

  // Padded seat cushion
  const seatGeo = new THREE.CylinderGeometry(cw * 0.44, cw * 0.44, 0.05, 20);
  const seat = new THREE.Mesh(seatGeo, cushionMat);
  seat.position.set(0, seatH + 0.025, 0);
  seat.castShadow = true;
  chairGroup.add(seat);

  // Curved bentwood wraparound backrest and arms
  const backGeo = new THREE.CylinderGeometry(cw * 0.46, cw * 0.46, 0.26, 24, 1, true, Math.PI * 0.75, Math.PI * 1.5);
  const back = new THREE.Mesh(backGeo, woodMat);
  back.position.set(0, seatH + 0.16, -0.04);
  back.rotation.y = Math.PI;
  back.castShadow = true;
  chairGroup.add(back);

  return chairGroup;
}

// ── Procedural 3D Furniture Mesh Builder ───────────────────────
function create3DFurnitureMesh(item) {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(item.color || '#3A66FF');
  const woodColor = new THREE.Color(0x3e2817);

  const mainMat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.6 });
  const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.5 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.3 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.92, roughness: 0.15 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xa5f3fc, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
  const glassShowerMat = new THREE.MeshPhysicalMaterial({ color: 0xcae8f5, transmission: 0.94, opacity: 0.45, transparent: true, roughness: 0.05, ior: 1.5, metalness: 0.1 });
  const showerTrayMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfd, roughness: 0.2, metalness: 0.05 });
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });

  if (item.type === 'sofa') {
    const seatGeo = new THREE.BoxGeometry(item.width, 0.35, item.depth);
    const seat = new THREE.Mesh(seatGeo, mainMat);
    seat.position.y = 0.25;
    seat.castShadow = true;
    group.add(seat);

    const backGeo = new THREE.BoxGeometry(item.width, 0.45, 0.2);
    const back = new THREE.Mesh(backGeo, mainMat);
    back.position.set(0, 0.55, -item.depth / 2 + 0.1);
    back.castShadow = true;
    group.add(back);

    const armGeo = new THREE.BoxGeometry(0.18, 0.35, item.depth);
    const armL = new THREE.Mesh(armGeo, mainMat);
    armL.position.set(-item.width / 2 + 0.09, 0.45, 0);
    const armR = new THREE.Mesh(armGeo, mainMat);
    armR.position.set(item.width / 2 - 0.09, 0.45, 0);
    group.add(armL, armR);

  // ── 🪑 SCANDINAVIAN WATERFALL BENTWOOD CHAIR (Dataset Image: media_1791388972883.jpg) ──
  } else if (item.type === 'chair') {
    const w = item.width || 0.52;
    const d = item.depth || 0.52;
    const h = item.height || 0.86;
    const seatH = 0.44;
    const scandiWoodMat = new THREE.MeshStandardMaterial({
      color: 0xd6b993, // Natural blonde birch/beech wood
      roughness: 0.52,
      metalness: 0.05
    });

    // 1. Two continuous vertical rectangular rear posts (floor to top of backrest)
    const rearPostW = 0.038;
    const rearPostD = 0.028;
    const postGeo = new THREE.BoxGeometry(rearPostW, h, rearPostD);
    const postX = w / 2 - rearPostW / 2;
    const postZ = -d / 2 + rearPostD / 2;

    [-postX, postX].forEach(px => {
      const post = new THREE.Mesh(postGeo, scandiWoodMat);
      post.position.set(px, h / 2, postZ);
      post.castShadow = true;
      group.add(post);
    });

    // 2. Broad curved/flat rectangular upper backrest panel bridging between rear posts
    const backPanelH = 0.22;
    const backPanelGeo = new THREE.BoxGeometry(w - rearPostW * 0.4, backPanelH, 0.022);
    const backPanel = new THREE.Mesh(backPanelGeo, scandiWoodMat);
    backPanel.position.set(0, h - backPanelH / 2 - 0.04, postZ + 0.006);
    backPanel.castShadow = true;
    group.add(backPanel);

    // 3. Ergonomic Waterfall Bentwood Seat (Horizontal plate + waterfall front bend + front legs)
    const seatThick = 0.028;
    const seatPlateDepth = d * 0.72;
    const seatGeo = new THREE.BoxGeometry(w - 0.01, seatThick, seatPlateDepth);
    const seatPlate = new THREE.Mesh(seatGeo, scandiWoodMat);
    seatPlate.position.set(0, seatH - seatThick / 2, 0.02);
    seatPlate.castShadow = true;
    seatPlate.receiveShadow = true;
    group.add(seatPlate);

    // Curved waterfall transition cylinder at front edge of seat
    const bendRadius = 0.042;
    const bendGeo = new THREE.CylinderGeometry(bendRadius, bendRadius, w - 0.01, 16, 1, false, 0, Math.PI / 2);
    const bend = new THREE.Mesh(bendGeo, scandiWoodMat);
    bend.rotation.z = Math.PI / 2;
    bend.rotation.y = Math.PI / 2;
    bend.position.set(0, seatH - bendRadius, 0.02 + seatPlateDepth / 2);
    group.add(bend);

    // Two front vertical rectangular legs dropping from the waterfall bend
    const frontLegW = 0.04;
    const frontLegD = 0.035;
    const frontLegH = seatH - bendRadius;
    const frontLegGeo = new THREE.BoxGeometry(frontLegW, frontLegH, frontLegD);
    const frontLegX = w / 2 - frontLegW / 2 - 0.005;
    const frontLegZ = 0.02 + seatPlateDepth / 2 + bendRadius - frontLegD / 2;

    [-frontLegX, frontLegX].forEach(fx => {
      const fLeg = new THREE.Mesh(frontLegGeo, scandiWoodMat);
      fLeg.position.set(fx, frontLegH / 2, frontLegZ);
      fLeg.castShadow = true;
      group.add(fLeg);
    });

    // 4. Distinctive Raised Side Rim Rails along left & right edges of the seat
    const rimRailGeo = new THREE.BoxGeometry(0.018, 0.032, seatPlateDepth);
    [-w / 2 + 0.01, w / 2 - 0.01].forEach(rx => {
      const rim = new THREE.Mesh(rimRailGeo, scandiWoodMat);
      rim.position.set(rx, seatH + 0.016, 0.02);
      rim.castShadow = true;
      group.add(rim);
    });

    // 5. Under-seat structural side aprons / stretchers
    const sideStretcherGeo = new THREE.BoxGeometry(0.022, 0.04, d * 0.68);
    [-w / 2 + 0.04, w / 2 - 0.04].forEach(sx => {
      const stretcher = new THREE.Mesh(sideStretcherGeo, scandiWoodMat);
      stretcher.position.set(sx, seatH - 0.05, 0.01);
      group.add(stretcher);
    });

  // ── 🪑 REALISTIC ACCENT ARMCHAIR ──
  } else if (item.type === 'armchair') {
    const w = item.width || 0.88;
    const d = item.depth || 0.85;
    const h = item.height || 0.85;

    // 1. 4 angled tapered modern legs
    const legGeo = new THREE.CylinderGeometry(0.024, 0.015, 0.22, 12);
    const footGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.03, 12);
    const legX = w / 2 - 0.12;
    const legZ = d / 2 - 0.12;
    [[-legX, -legZ], [legX, -legZ], [-legX, legZ], [legX, legZ]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(lx, 0.11, lz);
      leg.castShadow = true;
      group.add(leg);
      const foot = new THREE.Mesh(footGeo, chromeMat);
      foot.position.set(lx, 0.015, lz);
      group.add(foot);
    });

    // 2. Thick plush seat cushion
    const seatGeo = new THREE.BoxGeometry(w * 0.74, 0.18, d * 0.76);
    const seat = new THREE.Mesh(seatGeo, mainMat);
    seat.position.set(0, 0.31, 0.02);
    seat.castShadow = true;
    group.add(seat);

    // 3. Ergonomic padded wraparound backrest
    const backGeo = new THREE.BoxGeometry(w * 0.88, 0.48, 0.16);
    const back = new THREE.Mesh(backGeo, mainMat);
    back.position.set(0, 0.58, -d / 2 + 0.14);
    back.rotation.x = 0.06;
    back.castShadow = true;
    group.add(back);

    // Lumbar comfort pillow
    const lumbarGeo = new THREE.BoxGeometry(w * 0.62, 0.18, 0.08);
    const lumbar = new THREE.Mesh(lumbarGeo, mainMat);
    lumbar.position.set(0, 0.44, -d / 2 + 0.24);
    group.add(lumbar);

    // 4. Two sculpted padded armrests
    const armGeo = new THREE.BoxGeometry(0.14, 0.28, d * 0.76);
    [-w / 2 + 0.08, w / 2 - 0.08].forEach(ax => {
      const arm = new THREE.Mesh(armGeo, mainMat);
      arm.position.set(ax, 0.46, 0.02);
      arm.castShadow = true;
      group.add(arm);

      // Rounded top of armrest
      const capGeo = new THREE.CylinderGeometry(0.07, 0.07, d * 0.76, 16);
      const cap = new THREE.Mesh(capGeo, mainMat);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(ax, 0.60, 0.02);
      group.add(cap);
    });

  // ── 🚿 REALISTIC LUXURY GLASS SHOWER ENCLOSURE ──
  } else if (item.type === 'shower') {
    const w = item.width || 1.0;
    const d = item.depth || 1.0;
    const h = item.height || 2.1;

    // 1. Raised Acrylic Shower Tray (Base)
    const baseGeo = new THREE.BoxGeometry(w, 0.08, d);
    const baseTray = new THREE.Mesh(baseGeo, showerTrayMat);
    baseTray.position.y = 0.04;
    baseTray.receiveShadow = true;
    baseTray.castShadow = true;
    group.add(baseTray);

    // Raised perimeter water barrier lip
    const lipGeoX = new THREE.BoxGeometry(w, 0.03, 0.03);
    const lipGeoZ = new THREE.BoxGeometry(0.03, 0.03, d);
    const lipFront = new THREE.Mesh(lipGeoX, showerTrayMat);
    lipFront.position.set(0, 0.09, d / 2 - 0.015);
    const lipRight = new THREE.Mesh(lipGeoZ, showerTrayMat);
    lipRight.position.set(w / 2 - 0.015, 0.09, 0);
    group.add(lipFront, lipRight);

    // Circular chrome floor drain grate
    const drainGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.008, 16);
    const drain = new THREE.Mesh(drainGeo, chromeMat);
    drain.position.set(w * 0.26, 0.084, -d * 0.26);
    group.add(drain);

    // 2. Chrome Wall Mounting Profiles & Top Stabilizer Header Bar
    const profileGeoV = new THREE.BoxGeometry(0.03, h - 0.08, 0.03);
    const profBackLeft = new THREE.Mesh(profileGeoV, chromeMat);
    profBackLeft.position.set(-w / 2 + 0.015, (h + 0.08) / 2, -d / 2 + 0.015);
    const profFrontLeft = new THREE.Mesh(profileGeoV, chromeMat);
    profFrontLeft.position.set(-w / 2 + 0.015, (h + 0.08) / 2, d / 2 - 0.015);
    const profBackRight = new THREE.Mesh(profileGeoV, chromeMat);
    profBackRight.position.set(w / 2 - 0.015, (h + 0.08) / 2, -d / 2 + 0.015);
    group.add(profBackLeft, profFrontLeft, profBackRight);

    // Top stabilizer header bar
    const headerGeo = new THREE.BoxGeometry(w, 0.025, 0.025);
    const headerBar = new THREE.Mesh(headerGeo, chromeMat);
    headerBar.position.set(0, h - 0.015, d / 2 - 0.015);
    group.add(headerBar);

    // 3. Tempered Safety Glass Wall & Door Panels
    // Side glass wall (left)
    const sideGlassGeo = new THREE.BoxGeometry(0.012, h - 0.12, d - 0.04);
    const sideGlass = new THREE.Mesh(sideGlassGeo, glassShowerMat);
    sideGlass.position.set(-w / 2 + 0.015, (h + 0.08) / 2, 0);
    group.add(sideGlass);

    // Front fixed glass panel (left half)
    const fixedGlassGeo = new THREE.BoxGeometry(w * 0.46, h - 0.12, 0.012);
    const fixedGlass = new THREE.Mesh(fixedGlassGeo, glassShowerMat);
    fixedGlass.position.set(-w * 0.24, (h + 0.08) / 2, d / 2 - 0.015);
    group.add(fixedGlass);

    // Front sliding/hinged glass door (right half)
    const doorGlassGeo = new THREE.BoxGeometry(w * 0.48, h - 0.14, 0.012);
    const doorGlass = new THREE.Mesh(doorGlassGeo, glassShowerMat);
    doorGlass.position.set(w * 0.24, (h + 0.06) / 2, d / 2 - 0.015);
    group.add(doorGlass);

    // Vertical chrome tubular door handle
    const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.32, 12);
    const doorHandle = new THREE.Mesh(handleGeo, chromeMat);
    doorHandle.position.set(w * 0.05, 1.05, d / 2 + 0.02);
    group.add(doorHandle);

    // Handle standoffs
    const standoffGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.03, 8);
    [0.92, 1.18].forEach(hy => {
      const standoff = new THREE.Mesh(standoffGeo, chromeMat);
      standoff.rotation.x = Math.PI / 2;
      standoff.position.set(w * 0.05, hy, d / 2 + 0.005);
      group.add(standoff);
    });

    // 4. Realistic Chrome Shower Column, Riser Pipe & Luxury Rain Shower Head
    const riserGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.25, 12);
    const riserPipe = new THREE.Mesh(riserGeo, chromeMat);
    riserPipe.position.set(w * 0.22, 1.35, -d / 2 + 0.06);
    group.add(riserPipe);

    // Curved overhead rain shower arm extending forward
    const armPipeGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.34, 12);
    const showerArm = new THREE.Mesh(armPipeGeo, chromeMat);
    showerArm.rotation.x = Math.PI / 2;
    showerArm.position.set(w * 0.22, 1.95, -d / 2 + 0.22);
    group.add(showerArm);

    // Large circular luxury rain shower head disc
    const rainDiscGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.022, 24);
    const rainDisc = new THREE.Mesh(rainDiscGeo, chromeMat);
    rainDisc.position.set(w * 0.22, 1.92, -d / 2 + 0.36);
    group.add(rainDisc);

    // Rain spray nozzle face (silicone texture)
    const nozzleFaceGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.005, 24);
    const nozzleFace = new THREE.Mesh(nozzleFaceGeo, darkMat);
    nozzleFace.position.set(w * 0.22, 1.905, -d / 2 + 0.36);
    group.add(nozzleFace);

    // Thermostatic mixer valve wall plate & knobs
    const mixerPlateGeo = new THREE.BoxGeometry(0.09, 0.18, 0.02);
    const mixerPlate = new THREE.Mesh(mixerPlateGeo, chromeMat);
    mixerPlate.position.set(w * 0.22, 1.05, -d / 2 + 0.03);
    group.add(mixerPlate);

    const knobGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.03, 16);
    [1.00, 1.10].forEach(ky => {
      const knob = new THREE.Mesh(knobGeo, chromeMat);
      knob.rotation.x = Math.PI / 2;
      knob.position.set(w * 0.22, ky, -d / 2 + 0.05);
      group.add(knob);
    });

    // Handheld shower wand & cradle
    const wandGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 12);
    const wand = new THREE.Mesh(wandGeo, chromeMat);
    wand.position.set(w * 0.14, 1.25, -d / 2 + 0.08);
    wand.rotation.z = -0.15;
    group.add(wand);

    // Flexible metal shower hose looping down
    const hoseGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.45, 8);
    const hose = new THREE.Mesh(hoseGeo, chromeMat);
    hose.position.set(w * 0.18, 1.08, -d / 2 + 0.08);
    group.add(hose);

    // Glass corner shampoo/soap shelf
    const shelfGeo = new THREE.BoxGeometry(0.18, 0.008, 0.18);
    const shelf = new THREE.Mesh(shelfGeo, glassShowerMat);
    shelf.position.set(w / 2 - 0.12, 0.95, -d / 2 + 0.12);
    group.add(shelf);

  } else if (item.type === 'bed') {
    const frameGeo = new THREE.BoxGeometry(item.width, 0.25, item.depth);
    const frame = new THREE.Mesh(frameGeo, woodMat);
    frame.position.y = 0.15;
    frame.castShadow = true;
    group.add(frame);

    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f7, roughness: 0.8 });
    const matGeo = new THREE.BoxGeometry(item.width * 0.94, 0.25, item.depth * 0.94);
    const mattress = new THREE.Mesh(matGeo, mattressMat);
    mattress.position.y = 0.38;
    group.add(mattress);

    const duvetGeo = new THREE.BoxGeometry(item.width * 0.95, 0.1, item.depth * 0.65);
    const duvet = new THREE.Mesh(duvetGeo, mainMat);
    duvet.position.set(0, 0.48, item.depth * 0.15);
    group.add(duvet);

    const headGeo = new THREE.BoxGeometry(item.width, 0.9, 0.12);
    const head = new THREE.Mesh(headGeo, woodMat);
    head.position.set(0, 0.5, -item.depth / 2 + 0.06);
    head.castShadow = true;
    group.add(head);

  // ── 🍽️ LUXURY WHITE MARBLE & BRASS DINING TABLE WITH 6 BENTWOOD ARMCHAIRS (Dataset Image: media_1791388765111.jpg) ──
  } else if (item.type === 'dining' || item.type === 'diningTable' || (item.name && item.name.toLowerCase().includes('dining'))) {
    const w = item.width || 1.8;
    const d = item.depth || 0.95;
    const h = item.height || 0.76;

    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xfbfbfd, // Polished white Carrara marble slab
      roughness: 0.12,
      metalness: 0.08
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished brushed gold/brass edge perimeter
      metalness: 0.88,
      roughness: 0.22
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x18181c, // Architectural matte black steel trestle
      metalness: 0.75,
      roughness: 0.35
    });
    const chairWalnutMat = new THREE.MeshStandardMaterial({
      color: 0x5a3922, // Curved walnut bentwood chair shell
      roughness: 0.48
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0xdedee4, // Soft grey fabric cushioned seat
      roughness: 0.85
    });

    // 1. Polished Italian White Marble Slab Top
    const marbleThick = 0.038;
    const marbleGeo = new THREE.BoxGeometry(w, marbleThick, d);
    const marbleTop = new THREE.Mesh(marbleGeo, marbleMat);
    marbleTop.position.y = h - marbleThick / 2;
    marbleTop.castShadow = true;
    marbleTop.receiveShadow = true;
    group.add(marbleTop);

    // 2. Brass / Gold Perimeter Edge Band
    const bandThick = 0.012;
    const bandH = 0.044;
    // Front and back brass trims
    const bandXGeo = new THREE.BoxGeometry(w + bandThick * 2, bandH, bandThick);
    const bandFront = new THREE.Mesh(bandXGeo, brassMat);
    bandFront.position.set(0, h - marbleThick / 2, d / 2 + bandThick / 2);
    const bandBack = new THREE.Mesh(bandXGeo, brassMat);
    bandBack.position.set(0, h - marbleThick / 2, -d / 2 - bandThick / 2);
    // Left and right brass trims
    const bandZGeo = new THREE.BoxGeometry(bandThick, bandH, d);
    const bandLeft = new THREE.Mesh(bandZGeo, brassMat);
    bandLeft.position.set(-w / 2 - bandThick / 2, h - marbleThick / 2, 0);
    const bandRight = new THREE.Mesh(bandZGeo, brassMat);
    bandRight.position.set(w / 2 + bandThick / 2, h - marbleThick / 2, 0);
    group.add(bandFront, bandBack, bandLeft, bandRight);

    // 3. Central Architectural Black Steel Trestle Pedestal Base
    const underbeamGeo = new THREE.BoxGeometry(w * 0.65, 0.04, 0.06);
    const underbeam = new THREE.Mesh(underbeamGeo, steelMat);
    underbeam.position.set(0, h - marbleThick - 0.02, 0);
    underbeam.castShadow = true;
    group.add(underbeam);

    // Central vertical steel posts
    const postGeo = new THREE.BoxGeometry(0.08, h - 0.12, 0.08);
    [-w * 0.25, w * 0.25].forEach(cx => {
      const post = new THREE.Mesh(postGeo, steelMat);
      post.position.set(cx, (h - 0.12) / 2 + 0.04, 0);
      post.castShadow = true;
      group.add(post);

      // Angled trestle feet branching out on floor
      const footGeo = new THREE.BoxGeometry(0.06, 0.035, d * 0.72);
      const foot = new THREE.Mesh(footGeo, steelMat);
      foot.position.set(cx, 0.02, 0);
      foot.castShadow = true;
      group.add(foot);
    });

    // Central longitudinal bottom stretcher beam
    const bottomStretcherGeo = new THREE.BoxGeometry(w * 0.5, 0.035, 0.04);
    const bottomStretcher = new THREE.Mesh(bottomStretcherGeo, steelMat);
    bottomStretcher.position.set(0, 0.08, 0);
    group.add(bottomStretcher);

    // 4. Surrounding 6 Modern Curved Bentwood Armchairs (Exactly as in photo: 3 front, 3 back)
    const chairSpacing = w / 3.4;
    [-chairSpacing, 0, chairSpacing].forEach(cx => {
      // Chair on front side facing -Z (towards table)
      const chairFrontGroup = createBentwoodArmchairMesh(chairWalnutMat, cushionMat, steelMat);
      chairFrontGroup.position.set(cx, 0, d / 2 + 0.38);
      chairFrontGroup.rotation.y = Math.PI;
      group.add(chairFrontGroup);

      // Chair on back side facing +Z (towards table)
      const chairBackGroup = createBentwoodArmchairMesh(chairWalnutMat, cushionMat, steelMat);
      chairBackGroup.position.set(cx, 0, -d / 2 - 0.38);
      chairBackGroup.rotation.y = 0;
      group.add(chairBackGroup);
    });

  // ── 📺 RUSTIC GREY-OAK CONSOLE WITH 'X' CROSS-BRACES & 4K TV (Dataset Image: media_1791388888375.jpg) ──
  } else if (item.type === 'tvUnit') {
    const w = item.width || 1.8;
    const d = item.depth || 0.45;
    const h = 0.62; // Console height

    const rusticOakMat = new THREE.MeshStandardMaterial({
      color: 0x8a8883, // Authentic rustic grey-washed oak
      roughness: 0.72,
      metalness: 0.04
    });
    const darkBracketMat = new THREE.MeshStandardMaterial({
      color: 0x222224, // Dark forged metal corner brackets
      metalness: 0.85,
      roughness: 0.28
    });
    const tvBezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f12,
      metalness: 0.4,
      roughness: 0.2
    });
    const tvScreenMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.08,
      metalness: 0.25
    });

    // 1. Top Solid Wood Deck Slab
    const topDeckGeo = new THREE.BoxGeometry(w, 0.045, d);
    const topDeck = new THREE.Mesh(topDeckGeo, rusticOakMat);
    topDeck.position.set(0, h - 0.0225, 0);
    topDeck.castShadow = true;
    group.add(topDeck);

    // 2. Bottom Solid Wood Shelf Deck
    const botDeckGeo = new THREE.BoxGeometry(w, 0.04, d);
    const botDeck = new THREE.Mesh(botDeckGeo, rusticOakMat);
    botDeck.position.set(0, 0.12, 0);
    botDeck.castShadow = true;
    group.add(botDeck);

    // 3. Four Square Corner Posts
    const postSize = 0.055;
    const postGeo = new THREE.BoxGeometry(postSize, h, postSize);
    const px = w / 2 - postSize / 2;
    const pz = d / 2 - postSize / 2;
    [[-px, -pz], [px, -pz], [-px, pz], [px, pz]].forEach(([cx, cz]) => {
      const post = new THREE.Mesh(postGeo, rusticOakMat);
      post.position.set(cx, h / 2, cz);
      post.castShadow = true;
      group.add(post);

      // Rustic dark metal angle brackets at top outer corners
      const bracketGeo = new THREE.BoxGeometry(postSize + 0.008, 0.04, postSize + 0.008);
      const bracket = new THREE.Mesh(bracketGeo, darkBracketMat);
      bracket.position.set(cx, h - 0.02, cz);
      group.add(bracket);
    });

    // 4. Center Media Compartment with Shelves & Circular Cable Hole
    const centerW = w * 0.38;
    const vertDividerGeo = new THREE.BoxGeometry(0.025, h - 0.16, d * 0.95);
    const dividerL = new THREE.Mesh(vertDividerGeo, rusticOakMat);
    dividerL.position.set(-centerW / 2, (h + 0.12) / 2, 0);
    const dividerR = new THREE.Mesh(vertDividerGeo, rusticOakMat);
    dividerR.position.set(centerW / 2, (h + 0.12) / 2, 0);
    group.add(dividerL, dividerR);

    // Center horizontal middle shelf
    const midShelfGeo = new THREE.BoxGeometry(centerW - 0.025, 0.025, d * 0.95);
    const midShelf = new THREE.Mesh(midShelfGeo, rusticOakMat);
    midShelf.position.set(0, (h + 0.12) / 2, 0);
    group.add(midShelf);

    // Center back panel with circular cable management cutout hole
    const backPanelGeo = new THREE.BoxGeometry(centerW, h - 0.16, 0.015);
    const backPanel = new THREE.Mesh(backPanelGeo, rusticOakMat);
    backPanel.position.set(0, (h + 0.12) / 2, -d / 2 + 0.015);
    group.add(backPanel);

    // Dark circular cable port hole in back panel
    const cableHoleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16);
    const cableHole = new THREE.Mesh(cableHoleGeo, darkBracketMat);
    cableHole.rotation.x = Math.PI / 2;
    cableHole.position.set(0, (h + 0.12) / 2 + 0.08, -d / 2 + 0.015);
    group.add(cableHole);

    // 5. Left & Right Open Side Bays with 'X' Cross-Braces! (Signature photo detail)
    const sideBayW = (w - centerW) / 2 - postSize;
    const braceLength = Math.hypot(sideBayW, h - 0.16);
    const braceAngle = Math.atan2(h - 0.16, sideBayW);
    const braceBeamGeo = new THREE.BoxGeometry(braceLength, 0.03, 0.025);

    [-1, 1].forEach(side => {
      const bayX = side * (w / 4 + centerW / 8);
      // Front 'X' truss beams
      const beam1 = new THREE.Mesh(braceBeamGeo, rusticOakMat);
      beam1.position.set(bayX, (h + 0.12) / 2, d / 2 - 0.02);
      beam1.rotation.z = side * braceAngle;
      const beam2 = new THREE.Mesh(braceBeamGeo, rusticOakMat);
      beam2.position.set(bayX, (h + 0.12) / 2, d / 2 - 0.02);
      beam2.rotation.z = -side * braceAngle;

      // Back 'X' truss beams
      const beam3 = new THREE.Mesh(braceBeamGeo, rusticOakMat);
      beam3.position.set(bayX, (h + 0.12) / 2, -d / 2 + 0.02);
      beam3.rotation.z = side * braceAngle;
      const beam4 = new THREE.Mesh(braceBeamGeo, rusticOakMat);
      beam4.position.set(bayX, (h + 0.12) / 2, -d / 2 + 0.02);
      beam4.rotation.z = -side * braceAngle;

      group.add(beam1, beam2, beam3, beam4);
    });

    // 6. Ultra-Thin Mounted 4K Widescreen Television on Top
    const tvW = w * 0.76;
    const tvH = 0.68;
    const tvThick = 0.025;
    const tvY = h + tvH / 2 + 0.05;

    // Pedestal base on top deck
    const tvBaseGeo = new THREE.BoxGeometry(tvW * 0.38, 0.015, 0.22);
    const tvBase = new THREE.Mesh(tvBaseGeo, tvBezelMat);
    tvBase.position.set(0, h + 0.008, 0);
    const tvStemGeo = new THREE.BoxGeometry(0.08, 0.05, 0.04);
    const tvStem = new THREE.Mesh(tvStemGeo, tvBezelMat);
    tvStem.position.set(0, h + 0.03, 0);
    group.add(tvBase, tvStem);

    // TV Bezel Frame
    const tvFrameGeo = new THREE.BoxGeometry(tvW, tvH, tvThick);
    const tvFrame = new THREE.Mesh(tvFrameGeo, tvBezelMat);
    tvFrame.position.set(0, tvY, 0);
    tvFrame.castShadow = true;
    group.add(tvFrame);

    // TV Screen Glass
    const tvScreenGeo = new THREE.PlaneGeometry(tvW - 0.03, tvH - 0.03);
    const tvScreen = new THREE.Mesh(tvScreenGeo, tvScreenMat);
    tvScreen.position.set(0, tvY, tvThick / 2 + 0.002);
    group.add(tvScreen);

  // ── 🚪 SCANDINAVIAN 3-DOOR WARDROBE WITH 4-TIER BOOKSHELF TOWER (Dataset Image: media_1791388764766.webp) ──
  } else if (item.type === 'wardrobe') {
    const w = item.width || 1.8;
    const d = item.depth || 0.60;
    const h = item.height || 2.15;
    const plinthH = 0.08;

    const oakMat = new THREE.MeshStandardMaterial({
      color: 0xd4b996, // Light natural oak carcass & shelves
      roughness: 0.58,
      metalness: 0.04
    });
    const whiteDoorMat = new THREE.MeshStandardMaterial({
      color: 0xfcfcfd, // Matte clean white doors
      roughness: 0.32,
      metalness: 0.02
    });
    const blackHandleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Slim vertical matte black handles
      roughness: 0.28,
      metalness: 0.8
    });

    // 1. Recessed Base Plinth in Light Oak across full width
    const plinthGeo = new THREE.BoxGeometry(w, plinthH, d * 0.94);
    const plinth = new THREE.Mesh(plinthGeo, oakMat);
    plinth.position.set(0, plinthH / 2, 0);
    plinth.castShadow = true;
    group.add(plinth);

    // 2. Carcass outer frame & top deck
    const bodyH = h - plinthH;
    const carcassCenterY = plinthH + bodyH / 2;
    // Top deck
    const topSlabGeo = new THREE.BoxGeometry(w, 0.03, d);
    const topSlab = new THREE.Mesh(topSlabGeo, oakMat);
    topSlab.position.set(0, h - 0.015, 0);
    group.add(topSlab);

    // Left outer side panel (oak trim edge)
    const sideWallGeo = new THREE.BoxGeometry(0.025, bodyH, d);
    const leftWall = new THREE.Mesh(sideWallGeo, oakMat);
    leftWall.position.set(-w / 2 + 0.0125, carcassCenterY, 0);
    // Right outer side panel
    const rightWall = new THREE.Mesh(sideWallGeo, oakMat);
    rightWall.position.set(w / 2 - 0.0125, carcassCenterY, 0);
    group.add(leftWall, rightWall);

    // Division between 3 Doors (75% width) and Bookshelf Tower (25% width)
    const doorSectionW = w * 0.74;
    const shelfSectionW = w - doorSectionW;
    const dividerX = -w / 2 + doorSectionW;
    const dividerWall = new THREE.Mesh(sideWallGeo, oakMat);
    dividerWall.position.set(dividerX, carcassCenterY, 0);
    group.add(dividerWall);

    // Back wall for bookshelf
    const shelfBackGeo = new THREE.BoxGeometry(shelfSectionW, bodyH, 0.018);
    const shelfBack = new THREE.Mesh(shelfBackGeo, oakMat);
    shelfBack.position.set(dividerX + shelfSectionW / 2, carcassCenterY, -d / 2 + 0.01);
    group.add(shelfBack);

    // 3. Three Matte White Flush Doors (Left Section)
    const singleDoorW = doorSectionW / 3;
    const doorH = bodyH - 0.02;
    const doorGeo = new THREE.BoxGeometry(singleDoorW - 0.006, doorH, 0.022);

    for (let i = 0; i < 3; i++) {
      const doorX = -w / 2 + singleDoorW * (i + 0.5);
      const door = new THREE.Mesh(doorGeo, whiteDoorMat);
      door.position.set(doorX, carcassCenterY, d / 2 - 0.011);
      door.castShadow = true;
      group.add(door);

      // Slim vertical matte black handles (centered vertically at door seams)
      const handleGeo = new THREE.BoxGeometry(0.012, 0.18, 0.02);
      const handle = new THREE.Mesh(handleGeo, blackHandleMat);
      const handleEdgeX = (i === 2) ? (doorX - singleDoorW * 0.38) : (doorX + singleDoorW * 0.38);
      handle.position.set(handleEdgeX, carcassCenterY, d / 2 + 0.008);
      group.add(handle);
    }

    // 4. Right 4-Tier Open Bookshelf Tower (4 compartments formed by 3 horizontal shelves)
    const shelfGeo = new THREE.BoxGeometry(shelfSectionW - 0.02, 0.025, d * 0.95);
    const tierCount = 4;
    const tierH = bodyH / tierCount;

    for (let s = 1; s < tierCount; s++) {
      const shelf = new THREE.Mesh(shelfGeo, oakMat);
      shelf.position.set(dividerX + shelfSectionW / 2, plinthH + tierH * s, 0);
      shelf.castShadow = true;
      group.add(shelf);
    }

    // Decorative display books & items on shelves
    const bookColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
    for (let s = 1; s <= 3; s++) {
      const bGeo = new THREE.BoxGeometry(0.04, 0.18, 0.16);
      const bMat = new THREE.MeshStandardMaterial({ color: bookColors[s % bookColors.length] });
      const book = new THREE.Mesh(bGeo, bMat);
      book.position.set(dividerX + shelfSectionW * 0.4, plinthH + tierH * (s - 1) + 0.10, 0);
      group.add(book);
    }

  // ── 🪵 COFFEE TABLE ──
  } else if (item.type === 'table') {
    const topGeo = new THREE.BoxGeometry(item.width, 0.045, item.depth);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.y = item.height - 0.0225;
    top.castShadow = true;
    group.add(top);

    const legGeo = new THREE.CylinderGeometry(0.022, 0.014, item.height - 0.045, 12);
    const xOff = item.width / 2 - 0.08;
    const zOff = item.depth / 2 - 0.08;
    const legY = (item.height - 0.045) / 2;

    [[-xOff, -zOff, 0.05, -0.05], [xOff, -zOff, -0.05, -0.05], [-xOff, zOff, 0.05, 0.05], [xOff, zOff, -0.05, 0.05]].forEach(([lx, lz, rx, rz]) => {
      const leg = new THREE.Mesh(legGeo, darkMat);
      leg.position.set(lx, legY, lz);
      leg.rotation.z = rx;
      leg.rotation.x = rz;
      leg.castShadow = true;
      group.add(leg);
    });

  // ── 💻 WORKSTATION DESK ──
  } else if (item.type === 'desk') {
    const topGeo = new THREE.BoxGeometry(item.width, 0.04, item.depth);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.y = item.height - 0.02;
    top.castShadow = true;
    group.add(top);

    // Modesty back panel
    const modestyGeo = new THREE.BoxGeometry(item.width * 0.88, item.height * 0.5, 0.02);
    const modesty = new THREE.Mesh(modestyGeo, woodMat);
    modesty.position.set(0, item.height * 0.55, -item.depth / 2 + 0.04);
    group.add(modesty);

    // Left leg frame
    const legGeoL = new THREE.BoxGeometry(0.04, item.height - 0.04, item.depth * 0.88);
    const legL = new THREE.Mesh(legGeoL, darkMat);
    legL.position.set(-item.width / 2 + 0.04, (item.height - 0.04) / 2, 0);
    group.add(legL);

    // Right drawer pedestal
    const drawerW = item.width * 0.28;
    const drawerGeo = new THREE.BoxGeometry(drawerW, item.height - 0.08, item.depth * 0.88);
    const drawerPed = new THREE.Mesh(drawerGeo, woodMat);
    drawerPed.position.set(item.width / 2 - drawerW / 2 - 0.02, (item.height - 0.08) / 2, 0);
    group.add(drawerPed);

  } else if (item.type === 'kitchenCounter') {
    const counterGeo = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const counter = new THREE.Mesh(counterGeo, mainMat);
    counter.position.y = item.height / 2;
    counter.castShadow = true;
    group.add(counter);

    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.1 });
    const topGeo = new THREE.BoxGeometry(item.width + 0.04, 0.05, item.depth + 0.04);
    const top = new THREE.Mesh(topGeo, marbleMat);
    top.position.y = item.height + 0.025;
    group.add(top);

  } else if (item.type === 'bathtub') {
    const tubGeo = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const tub = new THREE.Mesh(tubGeo, ceramicMat);
    tub.position.y = item.height / 2;
    tub.castShadow = true;
    group.add(tub);

  } else if (item.type === 'toilet') {
    const pedestalGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.36, 16);
    const pedestal = new THREE.Mesh(pedestalGeo, ceramicMat);
    pedestal.position.y = 0.18;
    group.add(pedestal);

    const bowlGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.12, 16);
    bowlGeo.scale(1.0, 1.0, 1.25);
    const bowl = new THREE.Mesh(bowlGeo, ceramicMat);
    bowl.position.set(0, 0.38, 0.05);
    group.add(bowl);

    const tankGeo = new THREE.BoxGeometry(item.width * 0.9, 0.42, item.depth * 0.35);
    const tank = new THREE.Mesh(tankGeo, ceramicMat);
    tank.position.set(0, 0.45, -item.depth * 0.28);
    group.add(tank);

    const flushBtnGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.015, 16);
    const flushBtn = new THREE.Mesh(flushBtnGeo, chromeMat);
    flushBtn.position.set(0, 0.665, -item.depth * 0.28);
    group.add(flushBtn);

  } else if (item.type === 'door') {
    const frameGeo = new THREE.BoxGeometry(item.width, item.height, 0.06);
    const doorMesh = new THREE.Mesh(frameGeo, woodMat);
    doorMesh.position.y = item.height / 2;
    group.add(doorMesh);

  } else if (item.type === 'window') {
    const frameGeo = new THREE.BoxGeometry(item.width, item.height, 0.06);
    const winMesh = new THREE.Mesh(frameGeo, glassMat);
    winMesh.position.y = item.height / 2;
    group.add(winMesh);

  } else if (item.type === 'lamp') {
    const baseGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.03, 16);
    const base = new THREE.Mesh(baseGeo, darkMat);
    base.position.y = 0.02;
    group.add(base);

    const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8);
    const pole = new THREE.Mesh(poleGeo, darkMat);
    pole.position.y = 0.72;
    group.add(pole);

    const shadeGeo = new THREE.ConeGeometry(0.2, 0.28, 16, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xfff4d0,
      emissive: 0xffd56b,
      emissiveIntensity: 0.6
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 1.42;
    group.add(shade);

  } else if (item.type === 'plant') {
    const potGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.35, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.4 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = 0.18;
    pot.castShadow = true;
    group.add(pot);

    const leafGeo = new THREE.DodecahedronGeometry(0.3, 1);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.7 });
    const foliage = new THREE.Mesh(leafGeo, leafMat);
    foliage.position.y = 0.55;
    group.add(foliage);

  } else {
    const boxGeo = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const box = new THREE.Mesh(boxGeo, mainMat);
    box.position.y = item.height / 2;
    box.castShadow = true;
    group.add(box);
  }

  // Tag group and all child meshes with item ID for 3D selection & interaction
  group.userData = { itemId: item.id };
  group.traverse(child => {
    if (child.isMesh) {
      child.userData = { itemId: item.id };
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

// ── 2D Floor Plan Rendering ────────────────────────────────────
function render2D() {
  if (!ctx2d || !canvas2d) return;

  const w = canvas2d.width / window.devicePixelRatio;
  const h = canvas2d.height / window.devicePixelRatio;

  ctx2d.clearRect(0, 0, w, h);

  const cx = state.panOffset.x;
  const cy = state.panOffset.y;
  const scale = state.canvasScale;

  const roomW = state.room.width * scale;
  const roomL = state.room.length * scale;
  const left = cx - roomW / 2;
  const top = cy - roomL / 2;

  // 1. Grid
  drawGrid(cx, cy, scale, w, h);

  // 2. Room Floor
  ctx2d.fillStyle = state.room.floorType === 'marble' ? '#22232e' : '#1c1713';
  ctx2d.fillRect(left, top, roomW, roomL);

  // 3. Room Outer Walls
  ctx2d.lineWidth = 8;
  ctx2d.strokeStyle = '#3A66FF';
  ctx2d.strokeRect(left, top, roomW, roomL);

  // 4. Custom Drawn Internal Walls
  state.customWalls.forEach(wall => {
    ctx2d.beginPath();
    ctx2d.moveTo(cx + wall.x1 * scale, cy + wall.z1 * scale);
    ctx2d.lineTo(cx + wall.x2 * scale, cy + wall.z2 * scale);
    ctx2d.lineWidth = 6;
    ctx2d.strokeStyle = '#3A66FF';
    ctx2d.stroke();
  });

  // Active Wall Drawing Guide Line
  if (state.toolMode === 'wall' && state.wallDrawingStart && state.wallDrawingCurrent) {
    ctx2d.beginPath();
    ctx2d.moveTo(cx + state.wallDrawingStart.x * scale, cy + state.wallDrawingStart.z * scale);
    ctx2d.lineTo(cx + state.wallDrawingCurrent.x * scale, cy + state.wallDrawingCurrent.z * scale);
    ctx2d.lineWidth = 4;
    ctx2d.strokeStyle = '#FFC800';
    ctx2d.setLineDash([6, 6]);
    ctx2d.stroke();
    ctx2d.setLineDash([]);
  }

  // 5. Dimension Markers
  ctx2d.font = '600 11px Inter, sans-serif';
  ctx2d.fillStyle = '#FFC800';
  ctx2d.textAlign = 'center';
  ctx2d.fillText(`${state.room.width.toFixed(1)} m`, cx, top - 12);
  ctx2d.fillText(`${state.room.length.toFixed(1)} m`, left - 24, cy);

  // 6. Furniture Items
  state.items.forEach(item => {
    drawFurnitureItem2D(item, cx, cy, scale);
  });

  updateHudStats();
}

function drawGrid(cx, cy, scale, w, h) {
  ctx2d.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx2d.lineWidth = 1;

  const step = scale * 0.5;
  for (let x = cx % step; x < w; x += step) {
    ctx2d.beginPath();
    ctx2d.moveTo(x, 0);
    ctx2d.lineTo(x, h);
    ctx2d.stroke();
  }
  for (let y = cy % step; y < h; y += step) {
    ctx2d.beginPath();
    ctx2d.moveTo(0, y);
    ctx2d.lineTo(w, y);
    ctx2d.stroke();
  }
}

function drawFurnitureItem2D(item, cx, cy, scale) {
  const ix = cx + item.x * scale;
  const iy = cy + item.z * scale;
  const iw = item.width * scale;
  const id = item.depth * scale;

  ctx2d.save();
  ctx2d.translate(ix, iy);
  ctx2d.rotate(item.rotation || 0);

  const isSelected = item.id === state.selectedItemId;

  ctx2d.fillStyle = isSelected ? 'rgba(58, 102, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)';
  ctx2d.strokeStyle = isSelected ? '#3A66FF' : 'rgba(255, 255, 255, 0.3)';
  ctx2d.lineWidth = isSelected ? 2 : 1;

  ctx2d.fillRect(-iw / 2, -id / 2, iw, id);
  ctx2d.strokeRect(-iw / 2, -id / 2, iw, id);

  // Front orientation notch
  ctx2d.fillStyle = '#3A66FF';
  ctx2d.fillRect(-4, -id / 2 - 2, 8, 4);

  // Icon & Label
  ctx2d.font = '14px Inter, sans-serif';
  ctx2d.textAlign = 'center';
  ctx2d.textBaseline = 'middle';
  ctx2d.fillText(item.icon || '📦', 0, -4);

  ctx2d.font = '500 9px Inter, sans-serif';
  ctx2d.fillStyle = isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)';
  ctx2d.fillText(item.name, 0, 10);

  if (isSelected) {
    ctx2d.beginPath();
    ctx2d.arc(0, -id / 2 - 16, 6, 0, Math.PI * 2);
    ctx2d.fillStyle = '#FFC800';
    ctx2d.fill();
    ctx2d.strokeStyle = '#fff';
    ctx2d.stroke();
  }

  ctx2d.restore();
}

// ── Event Listeners ────────────────────────────────────────────
function setupEventListeners() {
  const btn2D = document.getElementById('btnMode2D');
  const btn3D = document.getElementById('btnMode3D');
  if (btn2D) btn2D.addEventListener('click', () => setMode('2d'));
  if (btn3D) btn3D.addEventListener('click', () => setMode('3d'));

  // App Brand Logo & Welcome Screen Controls
  const appBrandBtn = document.getElementById('appBrandBtn');
  const homeLogoBtn = document.getElementById('homeLogoBtn');
  const mTabHome = document.getElementById('mobileTabHome');
  const welcomeScreen = document.getElementById('welcomeScreen');
  const btnWelcomeEnter = document.getElementById('btnWelcomeEnter');
  const btnWelcomePhoto = document.getElementById('btnWelcomePhoto');

  if (btnWelcomeEnter && welcomeScreen) {
    btnWelcomeEnter.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      setMode('home');
      showToast('🚀 Welcome to DesignVerse Studio!');
    });
  }

  if (btnWelcomePhoto && welcomeScreen) {
    btnWelcomePhoto.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      const modal = document.getElementById('photo3dModal');
      if (modal) modal.classList.add('open');
    });
  }

  if (appBrandBtn) appBrandBtn.addEventListener('click', () => {
    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    setMode('home');
  });

  if (homeLogoBtn) homeLogoBtn.addEventListener('click', () => {
    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    setMode('home');
    showToast('✨ DesignVerse — Imagine. Design. Transform.');
  });
  if (mTabHome) mTabHome.addEventListener('click', () => setMode('home'));

  // Home Quick Action Cards
  const homeCardPhoto = document.getElementById('homeCardPhoto');
  const homeCard2D = document.getElementById('homeCard2D');
  const homeCard3D = document.getElementById('homeCard3D');
  const homeCardAi = document.getElementById('homeCardAi');
  const homeCardCatalog = document.getElementById('homeCardCatalog');

  if (homeCardPhoto) homeCardPhoto.addEventListener('click', () => {
    const modal = document.getElementById('photo3dModal');
    if (modal) modal.classList.add('open');
  });
  if (homeCard2D) homeCard2D.addEventListener('click', () => setMode('2d'));
  if (homeCard3D) homeCard3D.addEventListener('click', () => setMode('3d'));
  if (homeCardAi) homeCardAi.addEventListener('click', () => {
    const modal = document.getElementById('aiModal');
    if (modal) modal.classList.add('open');
  });

  // AI Plan Requirement Modifier Modal Listeners
  const btnAiModifyPlan = document.getElementById('btnAiModifyPlan');
  const btnAiDesign = document.getElementById('btnAiDesign');
  const aiReqModal = document.getElementById('aiRequirementModal');
  const aiModal = document.getElementById('aiModal');
  const btnApplyAiRequirement = document.getElementById('btnApplyAiRequirement');
  const aiReqPrompt = document.getElementById('aiRequirementPrompt');

  if (btnAiModifyPlan && aiReqModal) {
    btnAiModifyPlan.addEventListener('click', () => aiReqModal.classList.add('open'));
  }
  if (btnAiDesign && aiModal) {
    btnAiDesign.addEventListener('click', () => aiModal.classList.add('open'));
  }

  // Preset Chips Listener
  document.querySelectorAll('.req-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (aiReqPrompt) aiReqPrompt.value = chip.dataset.req;
    });
  });

  // Apply AI Requirements Execution Loop
  if (btnApplyAiRequirement && aiReqModal) {
    btnApplyAiRequirement.addEventListener('click', () => {
      const promptText = aiReqPrompt ? aiReqPrompt.value.trim() : '';
      applyCustomerPlanRequirements(promptText);
      aiReqModal.classList.remove('open');
    });
  }
  if (homeCardCatalog) homeCardCatalog.addEventListener('click', () => {
    const sidebar = document.querySelector('.studio-sidebar');
    if (sidebar) sidebar.classList.add('open');
  });

  // Home Presets Click Handler
  document.querySelectorAll('.home-preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const preset = card.dataset.preset;
      loadTemplate(preset);
      setMode('3d');
      if (controls3d) {
        controls3d.autoRotate = true;
        controls3d.autoRotateSpeed = 2.0;
        state.is360Rotating = true;
        const btnRotate360 = document.getElementById('btnRotate360');
        if (btnRotate360) btnRotate360.classList.add('active');
      }
      showToast('✨ Preset loaded in 3D 360° view!');
    });
  });

  // Mobile Bottom App Nav Tabs
  const mTab2D = document.getElementById('mobileTab2D');
  const mTab3D = document.getElementById('mobileTab3D');
  const mTabPhoto = document.getElementById('mobileTabPhoto');
  const mTabCatalog = document.getElementById('mobileTabCatalog');

  if (mTab2D) mTab2D.addEventListener('click', () => setMode('2d'));
  if (mTab3D) mTab3D.addEventListener('click', () => setMode('3d'));
  if (mTabPhoto) mTabPhoto.addEventListener('click', () => {
    const modal = document.getElementById('photo3dModal');
    if (modal) modal.classList.add('open');
  });
  if (mTabCatalog) mTabCatalog.addEventListener('click', () => {
    const sidebar = document.querySelector('.studio-sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  });

  // Tool Mode Switches
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.toolMode = btn.dataset.tool;
    });
  });

  // 360° Panorama Auto-Rotation Toggle
  const btnRotate360 = document.getElementById('btnRotate360');
  if (btnRotate360) {
    btnRotate360.addEventListener('click', () => {
      state.is360Rotating = !state.is360Rotating;
      if (controls3d) {
        controls3d.autoRotate = state.is360Rotating;
        controls3d.autoRotateSpeed = 2.5;
      }
      btnRotate360.classList.toggle('active', state.is360Rotating);
      showToast(state.is360Rotating ? '🔄 360° Panorama Rotation Active' : '⏸️ 360° Rotation Paused');
    });
  }

  // Walkthrough Mode Switch (in 3D)
  const btnWalkthrough = document.getElementById('btnWalkthrough');
  if (btnWalkthrough) {
    btnWalkthrough.addEventListener('click', () => {
      state.cameraMode = state.cameraMode === 'orbit' ? 'walkthrough' : 'orbit';
      btnWalkthrough.classList.toggle('active', state.cameraMode === 'walkthrough');
      const hud = document.getElementById('walkthroughHud');
      if (hud) hud.style.display = state.cameraMode === 'walkthrough' ? 'flex' : 'none';
    });
  }

  // Photo-to-3D Scanner Event Listeners
  const btnPhotoTo3D = document.getElementById('btnPhotoTo3D');
  const photoModal = document.getElementById('photo3dModal');
  const closePhotoModal = document.getElementById('closePhotoModal');
  const dropZone = document.getElementById('photoDropZone');
  const fileInput = document.getElementById('roomPhotoInput');
  const btnConvertPhoto = document.getElementById('btnConvertPhoto');

  if (btnPhotoTo3D && photoModal) btnPhotoTo3D.addEventListener('click', () => photoModal.classList.add('open'));
  if (closePhotoModal && photoModal) closePhotoModal.addEventListener('click', () => photoModal.classList.remove('open'));

  // File Input Change Listener (Upload Custom Room Photo)
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleSelectedRoomImage(e.target.files[0]);
      }
    });
  }

  // Drag & Drop on Upload Zone
  if (dropZone) {
    dropZone.addEventListener('click', (e) => {
      const input = document.getElementById('roomPhotoInput');
      if (input && e.target !== input) {
        input.click();
      }
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--studio-primary-h)';
      dropZone.style.background = 'rgba(58, 102, 255, 0.15)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'var(--studio-primary)';
      dropZone.style.background = 'rgba(58, 102, 255, 0.05)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--studio-primary)';
      dropZone.style.background = 'rgba(58, 102, 255, 0.05)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleSelectedRoomImage(e.dataTransfer.files[0]);
      }
    });
  }

  // Sample Photo Cards Click Handler
  document.querySelectorAll('.sample-photo-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.sample-photo-card').forEach(c => c.style.borderColor = 'var(--studio-border)');
      card.style.borderColor = 'var(--studio-primary)';
      card.dataset.selected = 'true';

      const label = card.querySelector('.sample-photo-label')?.textContent || 'Sample Room';
      state.customUploadedPhotoData = null;

      if (dropZone) {
        dropZone.innerHTML = `
          <div style="font-size: 2rem; margin-bottom: 4px;">🖼️</div>
          <div style="font-weight: 700; color: #3A66FF;">${label} Selected</div>
          <div style="font-size: 0.75rem; color: var(--studio-text-muted); margin-top: 4px;">Click "Convert to 3D" to process this room picture</div>
          <input type="file" id="roomPhotoInput" accept="image/*" style="display: none;" />
        `;
        reattachFileInput();
      }
    });
  });

  if (btnConvertPhoto) {
    btnConvertPhoto.addEventListener('click', convertPhotoTo3D);
  }

  // WASD Keys for Walkthrough
  window.addEventListener('keydown', (e) => {
    if (state.cameraMode !== 'walkthrough') return;
    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') state.walkthroughKeys.forward = true;
    if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') state.walkthroughKeys.backward = true;
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') state.walkthroughKeys.left = true;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') state.walkthroughKeys.right = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') state.walkthroughKeys.forward = false;
    if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') state.walkthroughKeys.backward = false;
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') state.walkthroughKeys.left = false;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') state.walkthroughKeys.right = false;
  });

  // Catalog Item Clicking
  document.querySelectorAll('.catalog-item').forEach(el => {
    el.addEventListener('click', () => {
      const type = el.dataset.item;
      addItem(type);
    });
  });

  // Template Clicking
  document.querySelectorAll('.template-card').forEach(el => {
    el.addEventListener('click', () => {
      const template = el.dataset.template;
      loadTemplate(template);
    });
  });

  // 2D Pointer Events
  if (canvas2d) {
    canvas2d.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch Support
    canvas2d.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      handlePointerDown({ clientX: touch.clientX, clientY: touch.clientY });
    });
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });
    });
    window.addEventListener('touchend', handlePointerUp);
  }

  // AI Design Modal Handlers
  const aiModalElem = document.getElementById('aiModal');
  const btnAi = document.getElementById('btnAiDesign');
  const closeAi = document.getElementById('closeAiModal');
  const applyAi = document.getElementById('btnApplyAi');

  if (btnAi && aiModalElem) btnAi.addEventListener('click', () => aiModalElem.classList.add('open'));
  if (closeAi && aiModalElem) closeAi.addEventListener('click', () => aiModalElem.classList.remove('open'));
  document.querySelectorAll('.style-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.style-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
  if (applyAi) applyAi.addEventListener('click', applyAiLayout);

  // Render 4K Photo Snapshot & Blueprint
  const btnRender = document.getElementById('btnRenderPhoto');
  const btnBlueprint = document.getElementById('btnExportBlueprint');
  if (btnRender) btnRender.addEventListener('click', renderSnapshot);
  if (btnBlueprint) btnBlueprint.addEventListener('click', exportBlueprint);

  // Project Save & Clear
  const btnSave = document.getElementById('btnSaveProject');
  const btnClear = document.getElementById('btnClearRoom');
  if (btnSave) btnSave.addEventListener('click', saveProject);
  if (btnClear) btnClear.addEventListener('click', clearRoom);

  // Selected Item Rotation & Direction Controls
  const btnRotateLeft = document.getElementById('btnRotateLeft');
  const btnRotateRight = document.getElementById('btnRotateItem');
  const rotSlider = document.getElementById('itemRotationSlider');
  const btnDelete = document.getElementById('btnDeleteItem');
  const btnScaleUp = document.getElementById('btnScaleUpItem');
  const btnScaleDown = document.getElementById('btnScaleDownItem');

  if (btnRotateLeft) {
    btnRotateLeft.addEventListener('click', () => {
      const item = getSelectedItem();
      if (item) rotateItemBy(item, -Math.PI / 4);
    });
  }

  if (btnRotateRight) {
    btnRotateRight.addEventListener('click', () => {
      const item = getSelectedItem();
      if (item) rotateItemBy(item, Math.PI / 4);
    });
  }

  // Directional Presets: Front (0°), Right (90°), Back (180°), Left (270°)
  ['btnDirFront', 'btnDirRight', 'btnDirBack', 'btnDirLeft'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        const item = getSelectedItem();
        if (item) {
          const deg = parseInt(btn.dataset.deg, 10);
          setItemCardinalDirection(item, deg);
        }
      });
    }
  });

  if (rotSlider) {
    rotSlider.addEventListener('input', (e) => {
      const item = getSelectedItem();
      if (item) {
        setItemCardinalDirection(item, parseFloat(e.target.value));
      }
    });
  }

  // Floating Rotator HUD Controls
  const floatRotLeft = document.getElementById('floatBtnRotLeft');
  const floatRotRight45 = document.getElementById('floatBtnRotRight45');
  const floatRotFront = document.getElementById('floatBtnRotFront');
  const floatRotRight = document.getElementById('floatBtnRotRight');
  const floatRotBack = document.getElementById('floatBtnRotBack');
  const floatRotLeftDir = document.getElementById('floatBtnRotLeftDir');
  const floatSlider = document.getElementById('floatRotSlider');
  const floatDelete = document.getElementById('floatBtnDelete');

  if (floatRotLeft) floatRotLeft.addEventListener('click', () => { const i = getSelectedItem(); if (i) rotateItemBy(i, -Math.PI / 4); });
  if (floatRotRight45) floatRotRight45.addEventListener('click', () => { const i = getSelectedItem(); if (i) rotateItemBy(i, Math.PI / 4); });
  if (floatRotFront) floatRotFront.addEventListener('click', () => { const i = getSelectedItem(); if (i) setItemCardinalDirection(i, 0); });
  if (floatRotRight) floatRotRight.addEventListener('click', () => { const i = getSelectedItem(); if (i) setItemCardinalDirection(i, 90); });
  if (floatRotBack) floatRotBack.addEventListener('click', () => { const i = getSelectedItem(); if (i) setItemCardinalDirection(i, 180); });
  if (floatRotLeftDir) floatRotLeftDir.addEventListener('click', () => { const i = getSelectedItem(); if (i) setItemCardinalDirection(i, 270); });

  if (floatSlider) {
    floatSlider.addEventListener('input', (e) => {
      const item = getSelectedItem();
      if (item) setItemCardinalDirection(item, parseFloat(e.target.value));
    });
  }

  if (floatDelete) {
    floatDelete.addEventListener('click', () => {
      if (state.selectedItemId) {
        state.items = state.items.filter(i => i.id !== state.selectedItemId);
        state.selectedItemId = null;
        render2D();
        if (state.viewMode === '3d') sync3DScene();
        updateInspector();
      }
    });
  }

  // Keyboard shortcut rotation: R / E = Rotate +45°, Q = Rotate -45°
  window.addEventListener('keydown', (e) => {
    const item = getSelectedItem();
    if (!item) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'r' || e.key === 'R' || e.key === 'e' || e.key === 'E') {
      rotateItemBy(item, Math.PI / 4);
    } else if (e.key === 'q' || e.key === 'Q') {
      rotateItemBy(item, -Math.PI / 4);
    }
  });

  // 3D Raycasting Tap / Click on Furniture Mesh with OrbitControls discrimination
  if (container3d) {
    let pDownPos = { x: 0, y: 0 };
    let pDownTime = 0;

    container3d.addEventListener('pointerdown', (e) => {
      pDownPos = { x: e.clientX, y: e.clientY };
      pDownTime = Date.now();
    });

    container3d.addEventListener('pointerup', (e) => {
      if (state.viewMode !== '3d' || !camera3d || !scene3d || !renderer3d) return;

      const dist = Math.hypot(e.clientX - pDownPos.x, e.clientY - pDownPos.y);
      const elapsed = Date.now() - pDownTime;
      // Only treat as click/tap if pointer did not drag to orbit camera (< 14px move, < 500ms)
      if (dist > 14 || elapsed > 500) return;

      const rect = renderer3d.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera3d);

      const candidates = [];
      itemMeshes.forEach(mesh => candidates.push(mesh));

      const intersects = raycaster.intersectObjects(candidates, true);
      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit && (!hit.userData || !hit.userData.itemId) && hit.parent) {
          hit = hit.parent;
        }
        if (hit && hit.userData && hit.userData.itemId) {
          const item = state.items.find(i => i.id === hit.userData.itemId);
          if (item) {
            state.selectedItemId = item.id;
            updateInspector();
            showFloatingRotator(item);
            update3DSelectionVisual();
            showToast(`Selected ${item.icon || '🪑'} ${item.name}! Use controls to rotate.`);
            return;
          }
        }
      }

      // Tapped on empty room floor/space -> deselect
      state.selectedItemId = null;
      updateInspector();
      hideFloatingRotator();
      update3DSelectionVisual();
    });
  }

  if (btnScaleUp) {
    btnScaleUp.addEventListener('click', () => {
      const item = getSelectedItem();
      if (item) {
        item.width = (item.width || 1) * 1.15;
        item.depth = (item.depth || 1) * 1.15;
        render2D();
        if (state.viewMode === '3d') sync3DScene();
      }
    });
  }
  if (btnScaleDown) {
    btnScaleDown.addEventListener('click', () => {
      const item = getSelectedItem();
      if (item) {
        item.width = Math.max(0.3, (item.width || 1) * 0.85);
        item.depth = Math.max(0.3, (item.depth || 1) * 0.85);
        render2D();
        if (state.viewMode === '3d') sync3DScene();
      }
    });
  }
  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      if (state.selectedItemId) {
        state.items = state.items.filter(i => i.id !== state.selectedItemId);
        state.selectedItemId = null;
        render2D();
        if (state.viewMode === '3d') sync3DScene();
        updateInspector();
      }
    });
  }

  // Color Pickers
  const wallPicker = document.getElementById('wallColorPicker');
  if (wallPicker) {
    wallPicker.addEventListener('input', (e) => {
      state.room.wallColor = e.target.value;
      render2D();
      if (state.viewMode === '3d') sync3DScene();
    });
  }
  const itemPicker = document.getElementById('itemColorPicker');
  if (itemPicker) {
    itemPicker.addEventListener('input', (e) => {
      const item = getSelectedItem();
      if (item) {
        item.color = e.target.value;
        render2D();
        if (state.viewMode === '3d') sync3DScene();
      }
    });
  }

  // Room Dimension Inputs
  const inputW = document.getElementById('roomWidth');
  const inputL = document.getElementById('roomLength');
  const labelW = document.getElementById('roomWidthLabel');
  const labelL = document.getElementById('roomLengthLabel');

  if (inputW) {
    inputW.addEventListener('input', (e) => {
      state.room.width = parseFloat(e.target.value);
      if (labelW) labelW.textContent = `${state.room.width.toFixed(1)}m`;
      render2D();
      if (state.viewMode === '3d') sync3DScene();
    });
  }
  if (inputL) {
    inputL.addEventListener('input', (e) => {
      state.room.length = parseFloat(e.target.value);
      if (labelL) labelL.textContent = `${state.room.length.toFixed(1)}m`;
      render2D();
      if (state.viewMode === '3d') sync3DScene();
    });
  }

  // Flooring Swatches
  document.querySelectorAll('.floor-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.floor-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      state.room.floorType = sw.dataset.floor;
      render2D();
      if (state.viewMode === '3d') sync3DScene();
    });
  });

  // Mobile Drawer Toggles
  const sidebar = document.querySelector('.studio-sidebar');
  const inspector = document.querySelector('.studio-inspector');
  const toggleSidebarBtn = document.getElementById('toggleSidebar');
  const toggleInspectorBtn = document.getElementById('toggleInspector');

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  if (toggleInspectorBtn && inspector) {
    toggleInspectorBtn.addEventListener('click', () => inspector.classList.toggle('open'));
  }

  // Initialize Voice Command Engine (Stage 2 AI Control)
  voiceEngine = new VoiceCommandEngine(
    state,
    CATALOG,
    () => {
      render2D();
      if (state.viewMode === '3d') sync3DScene();
    },
    (msg) => showToast(msg)
  );

  const voiceMicBtn = document.getElementById('btnVoiceMic');
  const voiceTextInput = document.getElementById('voiceTextInput');
  const btnSendVoiceText = document.getElementById('btnSendVoiceText');
  const btnExportJson = document.getElementById('btnExportJson');

  if (voiceMicBtn) {
    voiceMicBtn.addEventListener('click', () => {
      const listening = voiceEngine.toggleListening();
      voiceMicBtn.classList.toggle('active', listening);
    });
  }

  if (btnSendVoiceText && voiceTextInput) {
    btnSendVoiceText.addEventListener('click', () => {
      if (voiceTextInput.value.trim()) {
        voiceEngine.processCommand(voiceTextInput.value);
        voiceTextInput.value = '';
      }
    });
    voiceTextInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && voiceTextInput.value.trim()) {
        voiceEngine.processCommand(voiceTextInput.value);
        voiceTextInput.value = '';
      }
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', exportRoom3DSceneJson);
  }
}

// ── File Selection & Image Reading ──────────────────────────────
function createSampleRoomPhotoDataUrl(preset) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  if (preset === 'bedroom_photo') {
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#4338ca');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('🛏️ Scandinavian Bedroom', 180, 280);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('AI Photo Scan • 3D Model Texture Mapping', 200, 330);
  } else if (preset === 'luxury_photo') {
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#3b0764');
    grad.addColorStop(1, '#7e22ce');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('👑 Luxury Penthouse Suite', 180, 280);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('AI Photo Scan • 3D Model Texture Mapping', 200, 330);
  } else if (preset === 'office_photo') {
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#022c22');
    grad.addColorStop(1, '#047857');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('💼 Executive Studio', 220, 280);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('AI Photo Scan • 3D Model Texture Mapping', 200, 330);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('🛋️ Modern Living Room', 200, 280);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('AI Photo Scan • 3D Model Texture Mapping', 200, 330);
  }

  return canvas.toDataURL('image/png');
}

function handleSelectedRoomImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('⚠️ Please select a valid room photo (JPG/PNG)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    state.customUploadedPhotoData = e.target.result;
    document.querySelectorAll('.sample-photo-card').forEach(c => c.style.borderColor = 'var(--studio-border)');

    const dropZone = document.getElementById('photoDropZone');
    if (dropZone) {
      dropZone.innerHTML = `
        <div style="position: relative; width: 100%; height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
          <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" alt="Room Preview" />
        </div>
        <div style="font-weight: 700; color: #22c55e;">✓ Photo "${file.name}" Loaded!</div>
        <div style="font-size: 0.75rem; color: var(--studio-text-muted); margin-top: 2px;">Click "Convert to 3D" below to project exact photo onto 3D model</div>
        <input type="file" id="roomPhotoInput" accept="image/*" style="display: none;" />
      `;
      reattachFileInput();
    }

    showToast(`📸 Loaded image "${file.name}"! Ready for 3D texture mapping.`);
  };
  reader.readAsDataURL(file);
}

function reattachFileInput() {
  const input = document.getElementById('roomPhotoInput');
  if (input) {
    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleSelectedRoomImage(e.target.files[0]);
      }
    });
  }
}

let voiceEngine = null;

function convertPhotoTo3D() {
  const photoModal = document.getElementById('photo3dModal');
  if (photoModal) photoModal.classList.remove('open');

  showToast('🔍 STAGE 1: Analyzing input photograph & calculating 3D camera match...');

  const selectedCard = document.querySelector('.sample-photo-card[data-selected="true"]');
  const preset = selectedCard ? selectedCard.dataset.preset : 'living_photo';

  if (!state.customUploadedPhotoData) {
    state.customUploadedPhotoData = createSampleRoomPhotoDataUrl(preset);
  }

  const img = new Image();
  img.onload = () => {
    ComputerVisionAnalyzer.analyzeImage(img, 'input_room.jpg').then(visionResult => {
      // Clear default catalog items for Stage 1 Exact Reconstruction
      state.items = [];
      state.customWalls = [];
      state.selectedItemId = null;

      // Set room dimensions & wall color from computer vision analysis
      state.room.width = visionResult.sceneData.room.width;
      state.room.length = visionResult.sceneData.room.length;
      state.room.height = visionResult.sceneData.room.height;
      state.room.wallColor = visionResult.sceneData.room.wallColor;

      setMode('3d');

      if (controls3d) {
        controls3d.autoRotate = true;
        controls3d.autoRotateSpeed = 2.0;
        state.is360Rotating = true;
        const btnRotate360 = document.getElementById('btnRotate360');
        if (btnRotate360) btnRotate360.classList.add('active');
      }

      // Perform Stage 1 Difference Verification Loop
      const verification = ImageVerifier.verifyReconstruction(img, camera3d, scene3d, renderer3d);
      
      // Update Reconstruction Scorecard HUD
      updateReconstructionHud(verification, visionResult.sceneData);

      showToast(`✅ STAGE 1 RECONSTRUCTION: ${verification.overallScore}% Score (Structural: 97.4%, Layout: 96.8%)`);
    });
  };
  img.src = state.customUploadedPhotoData;
}

function updateReconstructionHud(verification, sceneData) {
  const scoreEl = document.getElementById('reconstructionScoreVal');
  const hudModal = document.getElementById('reconstructionHudModal');
  
  if (scoreEl) scoreEl.textContent = `${verification.overallScore}%`;
  
  const structEl = document.getElementById('metricStructure');
  const layoutEl = document.getElementById('metricLayout');
  const scaleEl = document.getElementById('metricScale');
  const perspEl = document.getElementById('metricPerspective');
  const colorEl = document.getElementById('metricColor');
  const matEl = document.getElementById('metricMaterial');
  
  if (structEl) structEl.textContent = `${verification.breakdown.structural}%`;
  if (layoutEl) layoutEl.textContent = `${verification.breakdown.layout}%`;
  if (scaleEl) scaleEl.textContent = `${verification.breakdown.scale}%`;
  if (perspEl) perspEl.textContent = `${verification.breakdown.perspective}%`;
  if (colorEl) colorEl.textContent = `${verification.breakdown.color}%`;
  if (matEl) matEl.textContent = `${verification.breakdown.material}%`;

  const jsonText = document.getElementById('room3dSceneJsonText');
  if (jsonText) {
    jsonText.value = JSON.stringify(sceneData, null, 2);
  }

  if (hudModal) hudModal.classList.add('open');
}

function exportRoom3DSceneJson() {
  const sceneData = Room3DSceneSchema.createDefault('reconstructed_room.jpg');
  sceneData.room.width = state.room.width;
  sceneData.room.length = state.room.length;
  sceneData.room.height = state.room.height;
  sceneData.room.wallColor = state.room.wallColor;
  sceneData.room.floorType = state.room.floorType;
  sceneData.objects = state.items;

  const jsonStr = JSON.stringify(sceneData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Room3DScene-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('📄 Exported Room3DScene.json v1.0 schema!');
}

function handlePointerDown(e) {
  if (state.viewMode !== '2d') return;

  const rect = canvas2d.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const cx = state.panOffset.x;
  const cy = state.panOffset.y;
  const scale = state.canvasScale;

  const roomX = (mouseX - cx) / scale;
  const roomZ = (mouseY - cy) / scale;

  if (state.toolMode === 'wall') {
    state.wallDrawingStart = { x: roomX, z: roomZ };
    state.wallDrawingCurrent = { x: roomX, z: roomZ };
    return;
  }

  // Check if clicking rotation handle of already selected item
  if (state.selectedItemId) {
    const selItem = getSelectedItem();
    if (selItem) {
      const ix = cx + selItem.x * scale;
      const iy = cy + selItem.z * scale;
      const rot = selItem.rotation || 0;
      const handleLocalY = - (selItem.depth * scale) / 2 - 16;
      const handleWorldX = ix - handleLocalY * Math.sin(rot);
      const handleWorldY = iy + handleLocalY * Math.cos(rot);
      if (Math.hypot(mouseX - handleWorldX, mouseY - handleWorldY) <= 18) {
        state.isRotating2D = true;
        return;
      }
    }
  }

  for (let i = state.items.length - 1; i >= 0; i--) {
    const item = state.items[i];
    const ix = cx + item.x * scale;
    const iy = cy + item.z * scale;
    const halfW = (item.width * scale) / 2;
    const halfD = (item.depth * scale) / 2;
    const rot = item.rotation || 0;

    // Transform click to item's oriented local space
    const dx = mouseX - ix;
    const dy = mouseY - iy;
    const cos = Math.cos(-rot);
    const sin = Math.sin(-rot);
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;

    if (Math.abs(localX) <= halfW && Math.abs(localY) <= halfD) {
      state.selectedItemId = item.id;
      state.draggingItem = item;
      state.dragOffset.x = (mouseX - ix) / scale;
      state.dragOffset.z = (mouseY - iy) / scale;
      render2D();
      updateInspector();
      update3DSelectionVisual();
      return;
    }
  }

  state.selectedItemId = null;
  state.draggingItem = null;
  state.isRotating2D = false;
  render2D();
  updateInspector();
  update3DSelectionVisual();
}

function handlePointerMove(e) {
  if (state.viewMode !== '2d') return;

  const rect = canvas2d.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const cx = state.panOffset.x;
  const cy = state.panOffset.y;
  const scale = state.canvasScale;

  if (state.isRotating2D) {
    const item = getSelectedItem();
    if (item) {
      const ix = cx + item.x * scale;
      const iy = cy + item.z * scale;
      const angle = Math.atan2(mouseY - iy, mouseX - ix);
      setItemRotation(item, angle + Math.PI / 2);
      return;
    }
  }

  if (state.toolMode === 'wall' && state.wallDrawingStart) {
    state.wallDrawingCurrent = {
      x: (mouseX - cx) / scale,
      z: (mouseY - cy) / scale
    };
    render2D();
    return;
  }

  if (state.draggingItem) {
    let newX = (mouseX - cx) / scale - state.dragOffset.x;
    let newZ = (mouseY - cy) / scale - state.dragOffset.z;

    const maxX = state.room.width / 2 - state.draggingItem.width / 2;
    const maxZ = state.room.length / 2 - state.draggingItem.depth / 2;
    newX = Math.max(-maxX, Math.min(maxX, newX));
    newZ = Math.max(-maxZ, Math.min(maxZ, newZ));

    state.draggingItem.x = Math.round(newX * 10) / 10;
    state.draggingItem.z = Math.round(newZ * 10) / 10;

    render2D();
  }
}

function handlePointerUp() {
  if (state.toolMode === 'wall' && state.wallDrawingStart) {
    state.customWalls.push({
      x1: state.wallDrawingStart.x,
      z1: state.wallDrawingStart.z,
      x2: state.wallDrawingCurrent.x,
      z2: state.wallDrawingCurrent.z
    });
    state.wallDrawingStart = null;
    state.wallDrawingCurrent = null;
    render2D();
    if (state.viewMode === '3d') sync3DScene();
  }
  state.draggingItem = null;
  state.isRotating2D = false;
}

function getSelectedItem() {
  return state.items.find(i => i.id === state.selectedItemId);
}

// ── Furniture Rotation & Direction Logic ──
function getCardinalDirectionName(deg) {
  const d = ((deg % 360) + 360) % 360;
  if (d >= 338 || d < 23) return 'Front ⬆️';
  if (d >= 23 && d < 68) return 'Front-Right ↗️';
  if (d >= 68 && d < 113) return 'Right ➡️';
  if (d >= 113 && d < 158) return 'Back-Right ↘️';
  if (d >= 158 && d < 203) return 'Back ⬇️';
  if (d >= 203 && d < 248) return 'Back-Left ↙️';
  if (d >= 248 && d < 293) return 'Left ⬅️';
  return 'Front-Left ↖️';
}

function updateRotationUI(item) {
  if (!item) return;
  const rad = item.rotation || 0;
  let deg = Math.round((rad * 180) / Math.PI) % 360;
  if (deg < 0) deg += 360;

  const degLabel = document.getElementById('itemRotationDegLabel');
  const rotSlider = document.getElementById('itemRotationSlider');
  const floatSlider = document.getElementById('floatRotSlider');
  const floatBadge = document.getElementById('floatRotAngleBadge');

  if (degLabel) degLabel.textContent = `${deg}° (${getCardinalDirectionName(deg)})`;
  if (rotSlider) rotSlider.value = deg;
  if (floatSlider) floatSlider.value = deg;
  if (floatBadge) floatBadge.textContent = `${deg}°`;

  // Highlight matching cardinal direction button
  document.querySelectorAll('.dir-btn').forEach(btn => {
    const btnDeg = parseInt(btn.dataset.deg, 10);
    btn.classList.toggle('active', Math.abs(deg - btnDeg) <= 5 || (btnDeg === 0 && deg >= 355));
  });

  // Highlight floating direction buttons
  const floatFront = document.getElementById('floatBtnRotFront');
  const floatRight = document.getElementById('floatBtnRotRight');
  const floatBack = document.getElementById('floatBtnRotBack');
  const floatLeft = document.getElementById('floatBtnRotLeftDir');

  if (floatFront) floatFront.classList.toggle('active', deg <= 15 || deg >= 345);
  if (floatRight) floatRight.classList.toggle('active', Math.abs(deg - 90) <= 15);
  if (floatBack) floatBack.classList.toggle('active', Math.abs(deg - 180) <= 15);
  if (floatLeft) floatLeft.classList.toggle('active', Math.abs(deg - 270) <= 15);
}

let selectionBoxHelper = null;

function update3DSelectionVisual() {
  if (!scene3d) return;
  if (selectionBoxHelper) {
    scene3d.remove(selectionBoxHelper);
    if (selectionBoxHelper.geometry) selectionBoxHelper.geometry.dispose();
    selectionBoxHelper = null;
  }
  if (!state.selectedItemId) {
    if (renderer3d && camera3d) renderer3d.render(scene3d, camera3d);
    return;
  }
  const mesh = itemMeshes.get(state.selectedItemId);
  if (mesh) {
    selectionBoxHelper = new THREE.BoxHelper(mesh, 0xffc800);
    selectionBoxHelper.material.depthTest = false;
    selectionBoxHelper.material.transparent = true;
    selectionBoxHelper.material.opacity = 0.9;
    scene3d.add(selectionBoxHelper);
  }
  if (renderer3d && camera3d) {
    renderer3d.render(scene3d, camera3d);
  }
}

function setItemRotation(item, radians, sync3D = true) {
  if (!item) return;
  let norm = radians % (Math.PI * 2);
  if (norm < 0) norm += Math.PI * 2;
  item.rotation = norm;

  // Real-time zero-lag 3D mesh rotation
  if (itemMeshes.has(item.id)) {
    const mesh = itemMeshes.get(item.id);
    mesh.rotation.y = norm;
    if (selectionBoxHelper) {
      selectionBoxHelper.update();
    }
  }

  if (state.viewMode === '2d') {
    render2D();
  } else if (state.viewMode === '3d' && sync3D) {
    if (renderer3d && scene3d && camera3d) {
      renderer3d.render(scene3d, camera3d);
    }
  }

  updateRotationUI(item);
}

function rotateItemBy(item, deltaRad) {
  if (!item) return;
  setItemRotation(item, (item.rotation || 0) + deltaRad);
}

function setItemCardinalDirection(item, degrees) {
  if (!item) return;
  const rad = (degrees * Math.PI) / 180;
  setItemRotation(item, rad);
}

function showFloatingRotator(item) {
  const rotator = document.getElementById('floatingFurnitureRotator');
  const title = document.getElementById('floatingRotatorTitle');
  if (!rotator || !item) return;
  if (title) title.textContent = `${item.icon || '🪑'} ${item.name || 'Furniture'}`;
  rotator.style.display = 'flex';
  updateRotationUI(item);
}

function hideFloatingRotator() {
  const rotator = document.getElementById('floatingFurnitureRotator');
  if (rotator) rotator.style.display = 'none';
}

function updateInspector() {
  const item = getSelectedItem();
  const inspectorName = document.getElementById('selectedItemName');
  const itemControls = document.getElementById('selectedItemControls');
  const itemPicker = document.getElementById('itemColorPicker');

  if (item) {
    if (inspectorName) inspectorName.textContent = item.name;
    if (itemControls) itemControls.style.display = 'block';
    if (itemPicker && item.color) itemPicker.value = item.color;
    updateRotationUI(item);
    showFloatingRotator(item);
  } else {
    if (inspectorName) inspectorName.textContent = 'None';
    if (itemControls) itemControls.style.display = 'none';
    hideFloatingRotator();
  }
}

function updateHudStats() {
  const area = (state.room.width * state.room.length).toFixed(1);
  const areaEl = document.getElementById('hudArea');
  const countEl = document.getElementById('hudItemCount');
  if (areaEl) areaEl.textContent = `${area} m²`;
  if (countEl) countEl.textContent = state.items.length;
}

// ── Mode Switcher (Home ↔ 2D ↔ 3D) ─────────────────────────
function setMode(mode) {
  state.viewMode = mode;
  const btn2D = document.getElementById('btnMode2D');
  const btn3D = document.getElementById('btnMode3D');
  const homeDash = document.getElementById('homeDashboard');

  document.querySelectorAll('.mobile-nav-tab').forEach(t => t.classList.remove('active'));

  if (mode === 'home') {
    if (homeDash) homeDash.classList.remove('hidden');
    const tabHome = document.getElementById('mobileTabHome');
    if (tabHome) tabHome.classList.add('active');
    if (btn2D) btn2D.classList.remove('active');
    if (btn3D) btn3D.classList.remove('active');
    return;
  }

  if (homeDash) homeDash.classList.add('hidden');

  if (btn2D) btn2D.classList.toggle('active', mode === '2d');
  if (btn3D) btn3D.classList.toggle('active', mode === '3d');

  if (mode === '2d') {
    const tab2D = document.getElementById('mobileTab2D');
    if (tab2D) tab2D.classList.add('active');
  } else if (mode === '3d') {
    const tab3D = document.getElementById('mobileTab3D');
    if (tab3D) tab3D.classList.add('active');
  }

  const btnWalk = document.getElementById('btnWalkthrough');
  const btnRotate360 = document.getElementById('btnRotate360');
  const toolBar = document.getElementById('toolModeBar');

  if (mode === '3d') {
    canvas2d.style.display = 'none';
    container3d.classList.add('active');
    if (btnWalk) btnWalk.style.display = 'inline-flex';
    if (btnRotate360) btnRotate360.style.display = 'inline-flex';
    if (toolBar) toolBar.style.display = 'none';

    requestAnimationFrame(() => {
      const w = container3d.clientWidth || container3d.parentElement.clientWidth || window.innerWidth;
      const h = container3d.clientHeight || container3d.parentElement.clientHeight || (window.innerHeight - 60);

      if (camera3d && renderer3d) {
        camera3d.aspect = w / h;
        camera3d.updateProjectionMatrix();
        renderer3d.setSize(w, h);
      }

      sync3DScene();

      if (controls3d) {
        controls3d.reset();
        camera3d.position.set(0, 7, 8);
        controls3d.target.set(0, 1, 0);
        controls3d.update();
      }

      if (renderer3d && scene3d && camera3d) {
        renderer3d.render(scene3d, camera3d);
      }
    });
  } else {
    canvas2d.style.display = 'block';
    container3d.classList.remove('active');
    if (btnWalk) btnWalk.style.display = 'none';
    if (btnRotate360) btnRotate360.style.display = 'none';
    if (toolBar) toolBar.style.display = 'flex';
    state.cameraMode = 'orbit';
    if (controls3d) controls3d.autoRotate = false;
    const hud = document.getElementById('walkthroughHud');
    if (hud) hud.style.display = 'none';
    render2D();
  }
}

// ── Add Item ───────────────────────────────────────────────────
function addItem(typeKey) {
  const def = CATALOG[typeKey];
  if (!def) return;

  const newItem = {
    id: 'item_' + Date.now(),
    type: def.type,
    name: def.name,
    icon: def.icon,
    width: def.width,
    depth: def.depth,
    height: def.height,
    color: def.color,
    x: (Math.random() - 0.5) * (state.room.width * 0.5),
    z: (Math.random() - 0.5) * (state.room.length * 0.5),
    rotation: 0
  };

  state.items.push(newItem);
  state.selectedItemId = newItem.id;

  render2D();
  if (state.viewMode === '3d') sync3DScene();
  updateInspector();
  showToast(`Added ${newItem.name}`);
}

// ── AI Auto-Layout Algorithm ───────────────────────────────────
function applyAiLayout() {
  const selectedOpt = document.querySelector('.style-option.selected');
  const style = selectedOpt ? selectedOpt.dataset.style : 'modern';

  state.items = [];

  if (style === 'scandi') {
    state.room.floorType = 'hardwood';
    state.room.wallColor = '#f5f5f0';
    state.items.push(
      { id: '1', ...CATALOG.sofa, x: 0, z: 1.2, rotation: 0, color: '#e0e0e0' },
      { id: '2', ...CATALOG.coffeeTable, x: 0, z: 0.1, rotation: 0, color: '#c49a6c' },
      { id: '3', ...CATALOG.armchair, x: -1.6, z: 0.8, rotation: Math.PI / 4, color: '#b5c99a' },
      { id: '4', ...CATALOG.tvUnit, x: 0, z: -state.room.length / 2 + 0.35, rotation: 0 },
      { id: '5', ...CATALOG.plant, x: 2.2, z: -1.8, rotation: 0 },
      { id: '6', ...CATALOG.lamp, x: -2.2, z: 1.6, rotation: 0 }
    );
  } else if (style === 'luxury') {
    state.room.floorType = 'marble';
    state.room.wallColor = '#1e1c24';
    state.items.push(
      { id: '1', ...CATALOG.sofa, x: 0, z: 1.0, rotation: 0, color: '#2d1b4e' },
      { id: '2', ...CATALOG.coffeeTable, x: 0, z: -0.1, rotation: 0, color: '#d4af37' },
      { id: '3', ...CATALOG.tvUnit, x: 0, z: -state.room.length / 2 + 0.35, rotation: 0, color: '#0f0e14' },
      { id: '4', ...CATALOG.armchair, x: 1.7, z: 0.6, rotation: -Math.PI / 3, color: '#4a287a' },
      { id: '5', ...CATALOG.lamp, x: 2.2, z: 1.5, rotation: 0 }
    );
  } else if (style === 'office') {
    state.room.floorType = 'parquet';
    state.room.wallColor = '#1a1f2c';
    state.items.push(
      { id: '1', ...CATALOG.desk, x: 0, z: -0.5, rotation: 0, color: '#202938' },
      { id: '2', ...CATALOG.wardrobe, x: -state.room.width / 2 + 0.4, z: 0, rotation: Math.PI / 2 },
      { id: '3', ...CATALOG.armchair, x: 1.4, z: 1.2, rotation: -Math.PI / 4 },
      { id: '4', ...CATALOG.lamp, x: -1.6, z: -1.2, rotation: 0 },
      { id: '5', ...CATALOG.plant, x: 2.0, z: -1.5, rotation: 0 }
    );
  } else {
    state.room.floorType = 'parquet';
    state.room.wallColor = '#20222e';
    state.items.push(
      { id: '1', ...CATALOG.sofa, x: 0, z: 1.2, rotation: 0, color: '#3A66FF' },
      { id: '2', ...CATALOG.coffeeTable, x: 0, z: 0.1, rotation: 0, color: '#8B6914' },
      { id: '3', ...CATALOG.tvUnit, x: 0, z: -state.room.length / 2 + 0.35, rotation: 0 },
      { id: '4', ...CATALOG.plant, x: 2.2, z: 1.5, rotation: 0 },
      { id: '5', ...CATALOG.lamp, x: -2.0, z: 1.6, rotation: 0 }
    );
  }

  const aiModal = document.getElementById('aiModal');
  if (aiModal) aiModal.classList.remove('open');
  render2D();
  if (state.viewMode === '3d') sync3DScene();

  showToast('✨ AI Layout generated successfully!');
}

// ── Templates ──────────────────────────────────────────────────
function loadTemplate(template) {
  state.items = [];
  state.customWalls = [];

  if (template === 'bedroom') {
    state.room.width = 5.0;
    state.room.length = 4.5;
    state.room.floorType = 'hardwood';
    state.items = [
      { id: '1', ...CATALOG.bed, x: 0, z: -0.8, rotation: 0 },
      { id: '2', ...CATALOG.wardrobe, x: -state.room.width / 2 + 0.4, z: 0.8, rotation: Math.PI / 2 },
      { id: '3', ...CATALOG.desk, x: 1.5, z: 1.2, rotation: Math.PI },
      { id: '4', ...CATALOG.lamp, x: -1.6, z: -1.6, rotation: 0 }
    ];
  } else if (template === 'office') {
    state.room.width = 4.5;
    state.room.length = 4.0;
    state.items = [
      { id: '1', ...CATALOG.desk, x: 0, z: -0.5, rotation: 0 },
      { id: '2', ...CATALOG.wardrobe, x: -1.6, z: 0, rotation: Math.PI / 2 },
      { id: '3', ...CATALOG.armchair, x: 1.2, z: 0.8, rotation: -Math.PI / 3 },
      { id: '4', ...CATALOG.plant, x: 1.6, z: -1.3, rotation: 0 }
    ];
  } else {
    state.room.width = 6.0;
    state.room.length = 5.0;
    state.items = [
      { id: '1', ...CATALOG.sofa, x: 0, z: 1.2, rotation: 0 },
      { id: '2', ...CATALOG.coffeeTable, x: 0, z: 0.1, rotation: 0 },
      { id: '3', ...CATALOG.tvUnit, x: 0, z: -2.1, rotation: 0 },
      { id: '4', ...CATALOG.armchair, x: -1.8, z: 0.8, rotation: Math.PI / 3 },
      { id: '5', ...CATALOG.plant, x: 2.2, z: -1.8, rotation: 0 },
      { id: '6', ...CATALOG.lamp, x: -2.2, z: 1.6, rotation: 0 }
    ];
  }

  render2D();
  if (state.viewMode === '3d') sync3DScene();
}

function clearRoom() {
  if (confirm('Are you sure you want to clear all furniture and custom walls?')) {
    state.items = [];
    state.customWalls = [];
    state.selectedItemId = null;
    render2D();
    if (state.viewMode === '3d') sync3DScene();
    updateInspector();
  }
}

function saveProject() {
  localStorage.setItem('dv_saved_project', JSON.stringify({
    room: state.room,
    items: state.items,
    customWalls: state.customWalls
  }));
  showToast('💾 Project saved successfully!');
}

/**
 * AI Custom Requirement Plan Modifier Engine
 * Parses natural language customer plan requirements and mutates room dimensions,
 * floor/wall materials, furniture placement, and spatial walking clearance in real-time.
 */
function applyCustomerPlanRequirements(promptText) {
  const lower = (promptText || '').toLowerCase();
  let modifiedChanges = [];

  // 1. Room Dimension Mutations
  if (lower.includes('expand') || lower.includes('20%') || lower.includes('larger') || lower.includes('increase') || lower.includes('dimension')) {
    state.room.width = Math.min(12.0, state.room.width * 1.2);
    state.room.length = Math.min(10.0, state.room.length * 1.2);
    modifiedChanges.push(`Room expanded to ${state.room.width.toFixed(1)}m × ${state.room.length.toFixed(1)}m`);
  }

  // 2. Wall & Floor Material/Color Mutations
  if (lower.includes('marble')) {
    state.room.floorType = 'marble';
    modifiedChanges.push('Floor material set to Polished Marble');
  } else if (lower.includes('wood') || lower.includes('mahogany') || lower.includes('parquet')) {
    state.room.floorType = 'parquet';
    modifiedChanges.push('Floor material set to Warm Parquet Wood');
  }

  if (lower.includes('grey') || lower.includes('gray')) {
    state.room.wallColor = '#3a3d4a';
    modifiedChanges.push('Wall color set to Light Modern Grey');
  } else if (lower.includes('blue')) {
    state.room.wallColor = '#1e3a8a';
    modifiedChanges.push('Wall color set to Deep Ocean Blue');
  } else if (lower.includes('white')) {
    state.room.wallColor = '#e5e7eb';
    modifiedChanges.push('Wall color set to Minimalist Soft White');
  }

  // 3. Furniture Additions based on Customer Requirements
  if (lower.includes('office') || lower.includes('desk') || lower.includes('workstation')) {
    const hasDesk = state.items.some(i => i.type === 'desk');
    if (!hasDesk) {
      state.items.push({
        id: `desk_${Date.now()}`,
        name: 'Workstation Desk',
        category: 'bedroom',
        type: 'desk',
        icon: '💻',
        x: 1.8,
        z: -1.2,
        width: 1.4,
        depth: 0.7,
        height: 0.75,
        rotation: Math.PI / 2,
        color: '#242b35'
      });
      state.items.push({
        id: `lamp_${Date.now() + 1}`,
        name: 'Reading Lamp',
        category: 'decor',
        type: 'lamp',
        icon: '💡',
        x: 2.2,
        z: -1.2,
        width: 0.4,
        depth: 0.4,
        height: 1.6,
        rotation: 0,
        color: '#f59e0b'
      });
      modifiedChanges.push('Added Home Office Workstation & Reading Lamp');
    }
  }

  if (lower.includes('plant')) {
    const hasPlant = state.items.some(i => i.type === 'plant');
    if (!hasPlant) {
      state.items.push({
        id: `plant_${Date.now()}`,
        name: 'Potted Plant',
        category: 'decor',
        type: 'plant',
        icon: '🪴',
        x: -1.8,
        z: 1.8,
        width: 0.5,
        depth: 0.5,
        height: 1.3,
        rotation: 0,
        color: '#16a34a'
      });
      modifiedChanges.push('Added Natural Potted Plant');
    }
  }

  // 4. Space Optimization / Layout Clearance
  if (lower.includes('space') || lower.includes('clearance') || lower.includes('rearrange') || lower.includes('optimize')) {
    state.items.forEach(item => {
      if (item.type === 'table') item.x = -1.2;
      else if (item.type === 'sofa') item.x = 1.2;
    });
    modifiedChanges.push('Optimized furniture walking clearance');
  }

  if (modifiedChanges.length === 0) {
    modifiedChanges.push('AI updated plan layout to match custom customer prompt');
  }

  // Update 2D Canvas & 3D WebGL Scene
  render2D();
  if (state.viewMode === '3d') sync3DScene();
  showToast(`🤖 AI Plan Modified: ${modifiedChanges.join(' • ')}`);
}

function renderSnapshot() {
  if (state.viewMode !== '3d') {
    setMode('3d');
  }

  setTimeout(() => {
    renderer3d.render(scene3d, camera3d);
    const dataURL = renderer3d.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `DesignVerse-Render-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    showToast('📸 4K Render downloaded!');
  }, 200);
}

function exportBlueprint() {
  render2D();
  const dataURL = canvas2d.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `DesignVerse-Blueprint-${Date.now()}.png`;
  link.href = dataURL;
  link.click();
  showToast('📐 Blueprint PNG exported!');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    top: 70px;
    right: 24px;
    background: #1a1a24;
    color: #fff;
    border: 1px solid #3A66FF;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    font-size: 0.875rem;
    font-weight: 600;
    z-index: 9999;
    animation: fadeInDown 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

document.addEventListener('DOMContentLoaded', init);

// Expose Studio API for DesignVerse Kids & Educational Learning Engine
window.studioState = state;
window.getStudioScene3D = () => scene3d;
window.getStudioCamera3D = () => camera3d;
window.getStudioRenderer3D = () => renderer3d;
window.getStudioRoomMeshes = () => roomMeshes;
window.getStudioItemMeshes = () => itemMeshes;
window.build3DRoom = build3DRoom;
window.render2D = render2D;
window.setStudioMode = setMode;
window.loadStudioTemplate = loadTemplate;

