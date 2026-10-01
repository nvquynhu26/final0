// --- Global States ---
let scene, camera, renderer, controls;
let nodesData = [], metadata = {};
let pointsMesh, scanPlaneMesh, backgroundMesh;
let detailsCache = {};
let lang = 'ko'; // 'ko' or 'en'
let filterYear = 2026;
let isSingleYearMode = false;
let currentSearchType = 'keyword';
let activeSearchResults = [];
let matchedIndices = new Set();
let blinkingTime = 0;

const CLUSTER_COLORS = {
  1: 0xF43F5E, 2: 0x06B6D4, 3: 0x8B5CF6,
  4: 0xF59E0B, 5: 0x10B981, 6: 0xE2E8F0
};

// 1. Initialize Three.js Scene
function initScene() {
  const container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0B0C16, 0.0012);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.set(0, 120, 500);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 1500;
  controls.minDistance = 20;

  createAuroraBackground();
  createScanPlane();
  loadGalaxyData();

  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('pointerdown', onDocumentPointerDown);
}

// 2. Cosmic Background: Aurora Glow
function createAuroraBackground() {
  const geom = new THREE.PlaneGeometry(1600, 1200);
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
  grad.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
  grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)');
  grad.addColorStop(1, 'rgba(11, 12, 22, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  backgroundMesh = new THREE.Mesh(geom, mat);
  backgroundMesh.position.set(0, 100, -400);
  scene.add(backgroundMesh);
}

// 3. Scan Plane along Y Axis
function createScanPlane() {
  const geom = new THREE.RingGeometry(10, 320, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x00D2FF,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  scanPlaneMesh = new THREE.Mesh(geom, mat);
  scanPlaneMesh.rotation.x = Math.PI / 2;
  scanPlaneMesh.position.y = 0;
  scene.add(scanPlaneMesh);
}

// 4. Load Data & Create Point Particle Cloud
async function loadGalaxyData() {
  try {
    const res = await fetch('data/galaxy_nodes.json');
    const json = await res.json();
    metadata = json.metadata || {};
    nodesData = json.nodes || [];

    buildParticleSystem();
    runIgnitionSequence(); // 5-second lighting up sequence
  } catch (err) {
    console.error('Failed to load galaxy_nodes.json:', err);
  }
}

function buildParticleSystem() {
  const count = nodesData.length;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const d = nodesData[i];
    positions[i * 3] = d.x;
    positions[i * 3 + 1] = d.y;
    positions[i * 3 + 2] = d.z;

    const c = new THREE.Color(d.color || '#FFFFFF');
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = d.size || 2.0;
    opacities[i] = 0.05; // Start dark
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('customOpacity', new THREE.BufferAttribute(opacities, 1));

  // Shader Material for smooth neon points
  const shaderMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      attribute float customOpacity;
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        vColor = customColor;
        vOpacity = customOpacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (280.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  pointsMesh = new THREE.Points(geometry, shaderMat);
  scene.add(pointsMesh);
}

// 5. 5-Second Ignition Animation
function runIgnitionSequence() {
  const startTime = Date.now();
  const duration = 5000;

  function step() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1.0, elapsed / duration);
    const targetY = -40.0 + progress * 520.0; // from 2001 to 2026 height

    const opacities = pointsMesh.geometry.attributes.customOpacity.array;
    for (let i = 0; i < nodesData.length; i++) {
      const node = nodesData[i];
      if (node.y <= targetY) {
        opacities[i] = THREE.MathUtils.lerp(opacities[i], 1.0, 0.08);
      }
    }
    pointsMesh.geometry.attributes.customOpacity.needsUpdate = true;
    scanPlaneMesh.position.y = targetY;

    if (progress < 1.0) {
      requestAnimationFrame(step);
    } else {
      updateTemporalFilter();
    }
  }
  step();
}

// 6. Raycasting Interaction (Click)
const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 4.0;
const mouse = new THREE.Vector2();

function onDocumentPointerDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if (!pointsMesh) return;
  const intersects = raycaster.intersectObject(pointsMesh);
  if (intersects.length > 0) {
    const idx = intersects[0].index;
    const node = nodesData[idx];
    focusOnNode(node, idx);
  }
}

async function focusOnNode(node, index) {
  // Cinematic camera flyTo
  new TWEEN.Tween(camera.position)
    .to({ x: node.x + 25, y: node.y + 15, z: node.z + 40 }, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  new TWEEN.Tween(controls.target)
    .to({ x: node.x, y: node.y, z: node.z }, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  highlightPlanetStrobe(index);
  await loadAndDisplayDetail(node.id);
}

// Strobe Highlight on Selected Planet
function highlightPlanetStrobe(targetIndex) {
  const sizes = pointsMesh.geometry.attributes.size.array;
  const origSize = sizes[targetIndex];
  let flashes = 0;

  const interval = setInterval(() => {
    sizes[targetIndex] = (flashes % 2 === 0) ? origSize * 2.8 : origSize;
    pointsMesh.geometry.attributes.size.needsUpdate = true;
    flashes++;
    if (flashes > 6) {
      clearInterval(interval);
      sizes[targetIndex] = origSize;
      pointsMesh.geometry.attributes.size.needsUpdate = true;
    }
  }, 140);
}

// 7. Dynamic Chunk Loading for Detail Panel
async function loadAndDisplayDetail(id) {
  const chunkSize = metadata.chunk_size || 500;
  const chunkIndex = Math.floor(id / chunkSize);

  if (!detailsCache[chunkIndex]) {
    try {
      const res = await fetch(`data/details_${chunkIndex}.json`);
      detailsCache[chunkIndex] = await res.json();
    } catch (e) {
      console.error('Cannot load chunk:', chunkIndex, e);
      return;
    }
  }

  const item = detailsCache[chunkIndex][id];
  if (!item) return;

  // Switch to Detail View
  document.getElementById('panel-list-view').classList.add('hidden');
  document.getElementById('panel-detail-view').classList.remove('hidden');
  document.getElementById('detail-empty-msg').classList.add('hidden');
  document.getElementById('detail-content').classList.remove('hidden');

  document.getElementById('detail-degree').textContent = item.degree || '석사';
  document.getElementById('detail-year').textContent = item.year || '';
  document.getElementById('detail-dept').textContent = item.dept || '';
  document.getElementById('detail-title').textContent = (lang === 'ko' ? item.title_ko : item.title_en) || item.title_ko;
  document.getElementById('detail-author').textContent = item.author || '미상';
  document.getElementById('detail-advisor').textContent = item.advisor || '미상';
  document.getElementById('detail-abstract').textContent = (lang === 'ko' ? item.abstract_ko : item.abstract_en) || item.abstract_ko;

  // Keywords Tags
  const kwBox = document.getElementById('detail-keywords');
  kwBox.innerHTML = '';
  (item.keywords || []).forEach(kw => {
    if (kw && kw !== 'nan') {
      const sp = document.createElement('span');
      sp.className = 'kw-tag';
      sp.textContent = kw;
      kwBox.appendChild(sp);
    }
  });

  // RISS URL (UCI or search title)
  const rissBtn = document.getElementById('detail-riss-link');
  if (item.uci) {
    rissBtn.href = `https://www.uci.or.kr/${item.uci}`;
  } else {
    const cleanTitle = (item.title_ko || '').split('=')[0].trim();
    rissBtn.href = `https://www.riss.kr/search/Search.do?queryText=${encodeURIComponent(cleanTitle)}&colName=bib_t`;
  }
}

// 8. Temporal Filtering (Timeline Slider & Mode)
function updateTemporalFilter() {
  if (!pointsMesh) return;
  const opacities = pointsMesh.geometry.attributes.customOpacity.array;

  for (let i = 0; i < nodesData.length; i++) {
    const n = nodesData[i];
    const nYear = n.year || 2026;

    if (isSingleYearMode) {
      opacities[i] = (nYear === filterYear) ? 1.0 : 0.05;
    } else {
      if (nYear < filterYear) opacities[i] = 0.55;
      else if (nYear === filterYear) opacities[i] = 1.0;
      else opacities[i] = 0.05;
    }
  }
  pointsMesh.geometry.attributes.customOpacity.needsUpdate = true;

  // Move scan plane
  const minYear = metadata.min_year || 2001;
  const stepY = metadata.year_step_y || 18.0;
  scanPlaneMesh.position.y = (filterYear - minYear) * stepY;
}

// 9. Search System & UI Binding
function setupEventListeners() {
  const slider = document.getElementById('year-slider');
  slider.addEventListener('input', (e) => {
    filterYear = parseInt(e.target.value);
    document.getElementById('current-year-val').textContent = filterYear;
    updateTemporalFilter();
  });

  const modeCheck = document.getElementById('mode-checkbox');
  modeCheck.addEventListener('change', (e) => {
    isSingleYearMode = e.target.checked;
    document.getElementById('mode-label').textContent = isSingleYearMode
      ? (lang === 'ko' ? '단일 연도 (Single Year)' : 'Single Year Focus')
      : (lang === 'ko' ? '누적 모드 (Cumulative)' : 'Cumulative Growth');
    updateTemporalFilter();
  });

  // Search Tabs
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSearchType = tab.dataset.type;
    });
  });

  // Search Input Enter
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeSearch(searchInput.value.trim());
    }
  });

  document.getElementById('search-clear-btn').addEventListener('click', () => {
    searchInput.value = '';
    matchedIndices.clear();
    updateTemporalFilter();
    document.getElementById('panel-list-view').classList.add('hidden');
    document.getElementById('panel-detail-view').classList.remove('hidden');
  });

  // Panel Buttons
  document.getElementById('panel-close-btn').addEventListener('click', () => {
    document.getElementById('side-panel').style.transform = 'translateX(450px)';
  });

  document.getElementById('panel-back-btn').addEventListener('click', () => {
    document.getElementById('panel-detail-view').classList.add('hidden');
    document.getElementById('panel-list-view').classList.remove('hidden');
    document.getElementById('panel-back-btn').classList.add('hidden');
  });

  // Language Toggle
  document.getElementById('lang-toggle-btn').addEventListener('click', () => {
    lang = (lang === 'ko') ? 'en' : 'ko';
    document.getElementById('lang-toggle-btn').textContent = (lang === 'ko') ? 'KO / EN' : 'EN / KO';
    // Update texts
    document.getElementById('timeline-title').textContent = (lang === 'ko') ? '타임라인' : 'Timeline';
  });
}

function executeSearch(query) {
  if (!query) return;
  matchedIndices.clear();
  activeSearchResults = [];
  const q = query.toLowerCase();

  for (let i = 0; i < nodesData.length; i++) {
    const n = nodesData[i];
    let matched = false;

    if (currentSearchType === 'title' && (n.title || '').toLowerCase().includes(q)) matched = true;
    if (currentSearchType === 'advisor' && (n.advisor || '').toLowerCase().includes(q)) matched = true;
    if (currentSearchType === 'dept' && (n.dept || '').toLowerCase().includes(q)) matched = true;
    if (currentSearchType === 'keyword' && ((n.title || '') + ' ' + (n.dept || '')).toLowerCase().includes(q)) matched = true;

    if (matched) {
      matchedIndices.add(i);
      activeSearchResults.push({ node: n, index: i });
    }
  }

  // Dim other planets, blink matched ones
  const opacities = pointsMesh.geometry.attributes.customOpacity.array;
  for (let i = 0; i < nodesData.length; i++) {
    opacities[i] = matchedIndices.has(i) ? 1.0 : 0.05;
  }
  pointsMesh.geometry.attributes.customOpacity.needsUpdate = true;

  renderSearchResultsList();
}

function renderSearchResultsList() {
  document.getElementById('side-panel').style.transform = 'translateX(0)';
  document.getElementById('panel-detail-view').classList.add('hidden');
  const listView = document.getElementById('panel-list-view');
  listView.classList.remove('hidden');

  document.getElementById('search-results-count').textContent = `${activeSearchResults.length}건 검색됨`;
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  activeSearchResults.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
      <div class="result-item-title">${item.node.title}</div>
      <div class="result-item-meta">${item.node.dept || ''} · ${item.node.advisor || ''} · ${item.node.year || ''}년</div>
    `;
    div.addEventListener('click', () => {
      focusOnNode(item.node, item.index);
      document.getElementById('panel-back-btn').classList.remove('hidden');
    });
    container.appendChild(div);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 10. Animation Loop
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();

  // Slow galaxy rotation along Y-axis
  if (pointsMesh) {
    pointsMesh.rotation.y += 0.0003;
  }

  // Blinking effect for search results
  if (matchedIndices.size > 0 && pointsMesh) {
    blinkingTime += 0.08;
    const strobe = (Math.sin(blinkingTime * 4) + 1.0) / 2.0;
    const opacities = pointsMesh.geometry.attributes.customOpacity.array;
    matchedIndices.forEach(idx => {
      opacities[idx] = 0.3 + strobe * 0.7;
    });
    pointsMesh.geometry.attributes.customOpacity.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

// Start
window.addEventListener('DOMContentLoaded', () => {
  initScene();
  setupEventListeners();
  animate();
});
