/**
 * SEOULTECH RESEARCH COSMOS
 * Senior Front-end & Creative WebGL/Three.js Architecture
 */

// ==========================================
// 1. DỮ LIỆU ĐA NGÔN NGỮ (I18N)
// ==========================================
const i18n = {
  ko: {
    subtitle: "8,000편의 학위논문 및 지식 네트워크 시각화 (2010–2026)",
    timeline_label: "타임라인 (2010 – 2026)",
    mode_cumul: "누적 성장",
    mode_single: "단일 연도",
    clusters_label: "단과대 클러스터",
    camera_label: "카메라 뷰",
    cam_all: "전체 조망",
    cam_c1: "조형대학",
    cam_c2: "정보통신·공대",
    cam_c3: "융합·미래기술",
    search_placeholder: "논문 제목, 저자, 지도교수, 키워드 검색...",
    results_title: "검색 결과",
    back_list: "목록으로 돌아가기",
    meta_author: "저자",
    meta_advisor: "지도교수",
    meta_metrics: "중심성 지표",
    meta_keywords: "주제어 / 키워드",
    meta_abstract: "국문 초록",
    btn_riss: "RISS에서 검색 / View on RISS"
  },
  en: {
    subtitle: "Visualizing 8,000 Academic Theses & Knowledge Networks (2010–2026)",
    timeline_label: "TIMELINE (2010 – 2026)",
    mode_cumul: "Cumulative Growth",
    mode_single: "Single Year Focus",
    clusters_label: "COLLEGE CLUSTERS",
    camera_label: "CAMERA PRESETS",
    cam_all: "Overview",
    cam_c1: "Art & Design",
    cam_c2: "Eng & IT",
    cam_c3: "Convergence",
    search_placeholder: "Search title, author, advisor, keywords...",
    results_title: "Search Results",
    back_list: "Back to results",
    meta_author: "Author",
    meta_advisor: "Advisor",
    meta_metrics: "Centrality",
    meta_keywords: "Keywords",
    meta_abstract: "Abstract",
    btn_riss: "Search on RISS"
  }
};
let currentLang = 'ko';

// ==========================================
// 2. 6 CỤM THIÊN HÀ & CẤU HÌNH MÀU SẮC
// ==========================================
const CLUSTERS = [
  {
    id: "art_design",
    nameKo: "조형대학 (Art & Design)",
    nameEn: "Art & Design",
    color: 0xf43f5e,
    hex: "#F43F5E",
    angle: 0,
    radius: 90
  },
  {
    id: "eng_it",
    nameKo: "공과·정보통신대학 (Eng & IT)",
    nameEn: "Engineering & IT",
    color: 0x06b6d4,
    hex: "#06B6D4",
    angle: (Math.PI * 2) / 6,
    radius: 100
  },
  {
    id: "convergence",
    nameKo: "융합기술·미래 (Advanced Tech)",
    nameEn: "Advanced Convergence",
    color: 0x8b5cf6,
    hex: "#8B5CF6",
    angle: ((Math.PI * 2) / 6) * 2,
    radius: 95
  },
  {
    id: "business",
    nameKo: "기술경영융합 (Business & Tech)",
    nameEn: "Business & Technology",
    color: 0xf59e0b,
    hex: "#F59E0B",
    angle: ((Math.PI * 2) / 6) * 3,
    radius: 85
  },
  {
    id: "humanities",
    nameKo: "인문사회대학 (Humanities)",
    nameEn: "Humanities & Social",
    color: 0x10b981,
    hex: "#10B981",
    angle: ((Math.PI * 2) / 6) * 4,
    radius: 80
  },
  {
    id: "lifelong",
    nameKo: "미래평생융합 (Lifelong & Open)",
    nameEn: "Lifelong Education",
    color: 0x94a3b8,
    hex: "#94A3B8",
    angle: ((Math.PI * 2) / 6) * 5,
    radius: 80
  }
];

// ==========================================
// 3. MOCK DATA (40 LUẬN VĂN TIÊU BIỂU)
// ==========================================
const MOCK_THESES = [
  {
    id: 1,
    title_ko: "인공지능 기반 인터랙티브 시각 디자인 생성 시스템에 관한 연구",
    title_en: "A Study on Generative Interactive Visual Design Using AI",
    author: "김지민",
    advisor: "박현우",
    year: 2024,
    degree: "박사",
    dept: "디자인학과",
    clusterId: "art_design",
    pageCount: 145,
    keywords: ["AI Design", "Generative Art", "Interactive", "HCI"],
    abstract_ko: "본 연구는 생성형 인공지능을 활용하여 현대 시각 디자인 프로세스에서 디자이너와 인공지능 시스템 간의 협업 프레임워크를 제안한다. 멀티모달 프롬프트와 실시간 렌더링 피드백 메커니즘을 중심으로...",
    abstract_en: "This research proposes a collaborative framework between designers and generative AI in contemporary visual design processes...",
    betweenness: 0.95,
    degreeCentrality: 8,
    pageRank: 0.89,
    uci: ""
  },
  {
    id: 2,
    title_ko: "차세대 자율주행 차량을 위한 라이다-비전 센서 융합 딥러닝 객체 검출 모델",
    title_en: "Deep Learning Object Detection with LiDAR-Vision Sensor Fusion for Autonomous Vehicles",
    author: "이동현",
    advisor: "최승원",
    year: 2023,
    degree: "석사",
    dept: "미래에너지융합학과",
    clusterId: "convergence",
    pageCount: 112,
    keywords: ["Autonomous Vehicle", "LiDAR", "Sensor Fusion", "Deep Learning"],
    abstract_ko: "악천후 환경에서의 자율주행 신뢰도를 극대화하기 위하여 3D 라이다 포인트 클라우드와 고해상도 RGB 카메라 데이터를 퓨전하는 심층 신경망을 제안한다.",
    abstract_en: "To maximize the reliability of autonomous driving in severe weather...",
    betweenness: 0.88,
    degreeCentrality: 7,
    pageRank: 0.85,
    uci: ""
  },
  {
    id: 3,
    title_ko: "도심 항공 모빌리티(UAM) 최적 항로 설계를 위한 강화학습 알고리즘",
    title_en: "Reinforcement Learning Algorithm for Urban Air Mobility Trajectory Planning",
    author: "강서준",
    advisor: "정민규",
    year: 2025,
    degree: "박사",
    dept: "컴퓨터공학과",
    clusterId: "eng_it",
    pageCount: 160,
    keywords: ["UAM", "Reinforcement Learning", "Path Planning", "AI"],
    abstract_ko: "도심 상공의 급격한 난류와 장애물 회피를 동적으로 연산하는 멀티에이전트 강화학습 경로 최적화 기법을 정립하였다.",
    abstract_en: "Establishes a multi-agent reinforcement learning path optimization method...",
    betweenness: 0.91,
    degreeCentrality: 9,
    pageRank: 0.92,
    uci: ""
  },
  {
    id: 4,
    title_ko: "전통 세라믹 유약의 친환경 대체 소재 적용 및 발색 거동 연구",
    title_en: "Eco-friendly Alternative Materials and Coloration of Traditional Ceramic Glazes",
    author: "송유진",
    advisor: "김태호",
    year: 2021,
    degree: "석사",
    dept: "도예학과",
    clusterId: "art_design",
    pageCount: 88,
    keywords: ["Ceramics", "Eco-friendly", "Glaze", "Materials"],
    abstract_ko: "중금속 유해 성분을 배제한 친환경 광물 바이오 폐기물을 혼합하여 전통적인 청자와 백자의 색조를 재현하는 실험 연구.",
    abstract_en: "An experimental study on reproducing traditional celadon and white porcelain tones using eco-friendly materials...",
    betweenness: 0.35,
    degreeCentrality: 3,
    pageRank: 0.4,
    uci: ""
  },
  {
    id: 5,
    title_ko: "제조 중소기업의 디지털 전환(DX) 수용 결정요인 및 성과 분석",
    title_en: "Determinants and Performance Analysis of DX in Manufacturing SMEs",
    author: "윤재혁",
    advisor: "오성진",
    year: 2022,
    degree: "박사",
    dept: "기술경영융합대학원",
    clusterId: "business",
    pageCount: 130,
    keywords: ["Digital Transformation", "SME", "Technology Adoption", "Business Strategy"],
    abstract_ko: "스마트 팩토리 도입 과정에서 최고경영자의 IT 리더십과 조직 문화가 제조 생산성에 미치는 구조적 영향을 실증 분석함.",
    abstract_en: "Empirical analysis of top management IT leadership and organizational culture on manufacturing productivity...",
    betweenness: 0.65,
    degreeCentrality: 5,
    pageRank: 0.62,
    uci: ""
  },
  {
    id: 6,
    title_ko: "ESG 경영 활동이 기업 브랜드 충성도와 구매 의도에 미치는 영향",
    title_en: "The Impact of Corporate ESG Activities on Brand Loyalty and Purchase Intent",
    author: "한수민",
    advisor: "배진영",
    year: 2023,
    degree: "석사",
    dept: "경영학과",
    clusterId: "business",
    pageCount: 95,
    keywords: ["ESG", "Brand Loyalty", "Corporate Social Responsibility"],
    abstract_ko: "MZ세대 소비자를 중심으로 친환경 패키징과 투명한 지배구조가 브랜드 진정성 인식에 기여하는 경로를 구조방정식 모형으로 검증.",
    abstract_en: "Validates the path of eco-friendly packaging and transparent governance on brand authenticity...",
    betweenness: 0.42,
    degreeCentrality: 4,
    pageRank: 0.48,
    uci: ""
  },
  {
    id: 7,
    title_ko: "메타버스 환경에서의 가상 아바타 감정 표현과 사용자 몰입감 연구",
    title_en: "Emotion Expression of Virtual Avatars and User Immersion in Metaverse",
    author: "조은별",
    advisor: "박현우",
    year: 2023,
    degree: "석사",
    dept: "디자인학과",
    clusterId: "art_design",
    pageCount: 104,
    keywords: ["Metaverse", "Avatar", "Interactive", "Virtual Reality", "HCI"],
    abstract_ko: "VR 인터랙션 시 표정 추적 알고리즘을 통한 아바타 립싱크 및 시선 동기화가 사용자 커뮤니케이션 만족도에 미치는 상관성을 분석하였다.",
    abstract_en: "Analyzes the correlation between facial tracking lip-sync and communication satisfaction...",
    betweenness: 0.82,
    degreeCentrality: 6,
    pageRank: 0.78,
    uci: ""
  },
  {
    id: 8,
    title_ko: "초거대 언어모델(LLM)을 이용한 다국어 법률 문서 정보 추출 자동화",
    title_en: "Automated Information Extraction from Multilingual Legal Documents Using LLMs",
    author: "임채원",
    advisor: "서동주",
    year: 2024,
    degree: "박사",
    dept: "컴퓨터공학과",
    clusterId: "eng_it",
    pageCount: 155,
    keywords: ["LLM", "NLP", "Information Extraction", "AI"],
    abstract_ko: "복잡한 법률 판례 조항의 종속 관계를 신속하게 구조화하기 위한 파인튜닝 기법과 검색 증강 생성(RAG) 파이프라인 구현.",
    abstract_en: "Fine-tuning techniques and Retrieval-Augmented Generation (RAG) pipelines for legal precedents...",
    betweenness: 0.89,
    degreeCentrality: 8,
    pageRank: 0.87,
    uci: ""
  },
  {
    id: 9,
    title_ko: "고령화 사회 평생교육 프로그램 참여가 노년기 심리적 안녕감에 미치는 매개효과",
    title_en: "Mediating Effects of Lifelong Education Participation on Psychological Well-Being in Older Adults",
    author: "문선영",
    advisor: "김영희",
    year: 2020,
    degree: "박사",
    dept: "평생교육학과",
    clusterId: "lifelong",
    pageCount: 122,
    keywords: ["Lifelong Education", "Elderly", "Well-Being", "Social Support"],
    abstract_ko: "지역사회 복지관 중심의 디지털 리터러시 프로그램이 노년기 자아 효능감과 사회적 유대감 회복에 미치는 영향을 종단 연구로 증명.",
    abstract_en: "Longitudinal study demonstrating digital literacy programs on self-efficacy among seniors...",
    betweenness: 0.28,
    degreeCentrality: 2,
    pageRank: 0.35,
    uci: ""
  },
  {
    id: 10,
    title_ko: "현대 한국 SF 소설에 나타난 포스트휴머니즘 담론과 기술 윤리",
    title_en: "Posthumanist Discourse and Technological Ethics in Contemporary Korean SF Novels",
    author: "서민기",
    advisor: "안희철",
    year: 2022,
    degree: "석사",
    dept: "문예창작학과",
    clusterId: "humanities",
    pageCount: 92,
    keywords: ["Posthumanism", "SF Novels", "Ethics", "Literature"],
    abstract_ko: "인공지능과 사이보그 신체를 다룬 2010년대 이후 주요 SF 문학 작품 속 타자성 인식과 휴머니즘의 경계 해체를 비판적으로 고찰한다.",
    abstract_en: "Critical examination of alterity and dissolution of human boundaries in post-2010 Korean SF literature...",
    betweenness: 0.44,
    degreeCentrality: 3,
    pageRank: 0.42,
    uci: ""
  }
];

// Sinh thêm dữ liệu bổ sung để đủ độ dày vũ trụ (40 bài tiêu biểu)
(function generateMoreTheses() {
  const titles = [
    ["웨어러블 헬스케어 디바이스를 위한 연성 생체 센서 개발", "Flexible Bio-Sensors for Wearable Healthcare", "eng_it", ["Sensors", "Healthcare", "Materials"], 110],
    ["스마트 시티 공공 공간 브랜딩과 인터랙티브 미디어 파사드", "Smart City Public Branding & Media Facade", "art_design", ["Smart City", "Interactive", "HCI"], 98],
    ["양자 컴퓨팅 환경에서의 암호 알고리즘 취약점 분석", "Vulnerability Analysis of Cryptography in Quantum Computing", "eng_it", ["Quantum", "Security", "AI"], 140],
    ["친환경 고분자 나노 복합재료의 열전도 특성 연구", "Thermal Conductivity of Eco-Friendly Polymer Nanocomposites", "eng_it", ["Materials", "Eco-friendly", "Nanotech"], 105],
    ["비대면 원격 교육 플랫폼의 사용자 인터페이스 사용성 평가", "UI Usability Evaluation of Remote Learning Platforms", "art_design", ["HCI", "UI/UX", "Lifelong Education"], 90],
    ["스마트 물류 로봇의 다중 경로 협동 제어 아키텍처", "Multi-Path Cooperative Control for Smart Logistics Robots", "convergence", ["Robotics", "Reinforcement Learning", "Autonomous Vehicle"], 135],
    ["공공 빅데이터를 활용한 감염병 확산 예측 공간 모델", "Spatial Diffusion Model of Infectious Diseases Using Big Data", "convergence", ["Big Data", "Spatial Model", "Deep Learning"], 125],
    ["공유 경제 플랫폼 노동자의 직무 스트레스와 회복탄력성", "Job Stress and Resilience of Platform Gig Workers", "humanities", ["Gig Economy", "Labor", "Well-Being"], 85],
    ["소셜 벤처 기업의 사회적 가치 측정 지표와 투자 유치", "Social Value Metric and Investment Attraction for Social Ventures", "business", ["Social Venture", "Investment", "ESG"], 115],
    ["지속 가능한 미래 건축을 위한 BIPV 시스템 적용 방안", "Application of BIPV Systems for Sustainable Architecture", "eng_it", ["Architecture", "Energy", "Eco-friendly"], 120]
  ];

  let idCounter = 11;
  for (let cycle = 0; cycle < 3; cycle++) {
    for (let t of titles) {
      const year = 2011 + ((idCounter * 3) % 16);
      MOCK_THESES.push({
        id: idCounter,
        title_ko: `${t[0]} (${year})`,
        title_en: `${t[1]} (${year})`,
        author: `연구자_${idCounter}`,
        advisor: `지도교수_${(idCounter % 5) + 1}`,
        year: year,
        degree: idCounter % 2 === 0 ? "박사" : "석사",
        dept: t[2] === "art_design" ? "디자인학과" : t[2] === "eng_it" ? "전자IT미디어공학과" : "융합기술대학원",
        clusterId: t[2],
        pageCount: t[4] + (idCounter % 30),
        keywords: t[3],
        abstract_ko: `${t[0]}에 대해 학술적, 실무적 관점에서 심도 있게 탐구한 연구로, 최신 학술 동향과 융합 연구의 가능성을 시사한다.`,
        abstract_en: `This dissertation presents a comprehensive study on ${t[1]}, offering profound theoretical and practical insights.`,
        betweenness: (idCounter % 10) / 10,
        degreeCentrality: 2 + (idCounter % 8),
        pageRank: 0.3 + ((idCounter % 7) * 0.08),
        uci: ""
      });
      idCounter++;
    }
  }
})();

// ==========================================
// 4. KHỞI TẠO THREE.JS ENGINE & BIẾN TOÀN CỤC
// ==========================================
let scene, camera, renderer, controls;
let planetMeshGroup, edgesMeshGroup, textLabelsGroup;
let raycaster, mouse;
let planetObjects = []; // Lưu trữ node Mesh & dữ liệu liên kết
let currentFilteredList = [...MOCK_THESES];
let activeClusterFilter = new Set(CLUSTERS.map(c => c.id));
let isCumulative = true;
let currentYear = 2026;
let hoveredPlanet = null;
let selectedPlanet = null;
let introStartTime = null;

// Khởi chạy khi tải trang
window.addEventListener("DOMContentLoaded", () => {
  initThreeEngine();
  buildClusterUI();
  populateCosmos();
  buildNetworkEdges();
  setupUIEventListeners();
  updateCosmosFilter();
  animate(0);
});

// Khởi tạo Canvas, Camera, OrbitControls
function initThreeEngine() {
  const container = document.getElementById("webgl-container");
  
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0c16, 0.002);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 160, 260);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 600;
  controls.minDistance = 20;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2; // Quay siêu chậm quanh trục Y

  // Ánh sáng vũ trụ
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const coreLight = new THREE.PointLight(0xec4899, 2.5, 300);
  coreLight.position.set(0, 20, 0);
  scene.add(coreLight);

  const blueLight = new THREE.PointLight(0x38bdf8, 2, 400);
  blueLight.position.set(100, -30, -50);
  scene.add(blueLight);

  planetMeshGroup = new THREE.Group();
  edgesMeshGroup = new THREE.Group();
  textLabelsGroup = new THREE.Group();
  scene.add(planetMeshGroup);
  scene.add(edgesMeshGroup);
  scene.add(textLabelsGroup);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener("resize", onWindowResize);
  introStartTime = performance.now();
}

// ==========================================
// 5. THUẬT TOÁN BỐ TRÍ KHÔNG GIAN (STATIC CLUSTER & REPULSION)
// ==========================================
function populateCosmos() {
  const sphereGeo = new THREE.SphereGeometry(1, 24, 24);

  MOCK_THESES.forEach((thesis, idx) => {
    const cluster = CLUSTERS.find(c => c.id === thesis.clusterId) || CLUSTERS[0];
    
    // Thuật toán chuẩn hóa kích thước logarit: size = base + factor * log(pages)
    const baseSize = 1.2;
    const size = baseSize + 0.55 * Math.log(thesis.pageCount || 80);

    // Siêu tân tinh (Supernova): Betweenness cao -> phình to và sáng rực
    const isSupernova = thesis.betweenness >= 0.85;
    const finalSize = isSupernova ? size * 1.5 : size;

    // Phân bổ tọa độ quanh tâm nhánh cụm (static cluster layout)
    const clusterAngle = cluster.angle;
    const spreadRadius = 38;
    const subAngle = (idx * 1.618033) % (Math.PI * 2);
    const distFromClusterCenter = (Math.sin(idx * 7) * 0.5 + 0.5) * spreadRadius;

    let posX = Math.cos(clusterAngle) * cluster.radius + Math.cos(subAngle) * distFromClusterCenter;
    let posZ = Math.sin(clusterAngle) * cluster.radius + Math.sin(subAngle) * distFromClusterCenter;
    let posY = (Math.sin(idx * 3.3) * 22) + ((thesis.year - 2018) * 2.5); // Phân tầng nhẹ theo năm

    // Shader Material / MeshStandard cho hiệu ứng Breathing Glow
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cluster.color),
      emissive: new THREE.Color(cluster.color),
      emissiveIntensity: isSupernova ? 0.8 : 0.25,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: 0 // Ban đầu mờ để chuẩn bị Intro Sequence
    });

    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.scale.setScalar(finalSize);
    mesh.position.set(posX, posY, posZ);

    // Dữ liệu nội tại của hành tinh
    const planetData = {
      mesh: mesh,
      data: thesis,
      cluster: cluster,
      baseSize: finalSize,
      isSupernova: isSupernova,
      rotSpeed: (1 / finalSize) * 0.015, // Tỉ lệ nghịch với kích thước
      originalPos: new THREE.Vector3(posX, posY, posZ),
      targetOpacity: 1,
      isBlinking: false
    };

    mesh.userData = planetData;
    planetMeshGroup.add(mesh);
    planetObjects.push(planetData);
  });

  // Thuật toán đẩy hạt nhẹ để chống chồng lấn (Repulsion Step)
  for (let step = 0; step < 5; step++) {
    for (let i = 0; i < planetObjects.length; i++) {
      for (let j = i + 1; j < planetObjects.length; j++) {
        const p1 = planetObjects[i];
        const p2 = planetObjects[j];
        const dist = p1.mesh.position.distanceTo(p2.mesh.position);
        const minDist = (p1.baseSize + p2.baseSize) * 1.2;
        if (dist < minDist && dist > 0.001) {
          const push = new THREE.Vector3().subVectors(p1.mesh.position, p2.mesh.position).normalize().multiplyScalar((minDist - dist) * 0.5);
          p1.mesh.position.add(push);
          p2.mesh.position.sub(push);
        }
      }
    }
  }
}

// ==========================================
// 6. MẠNG LƯỚI ĐỒ THỊ LIÊN KẾT (GRAPH EDGES & GRADIENT)
// ==========================================
let edgeLines = [];

function buildNetworkEdges() {
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });

  const connectedPairs = new Set();

  for (let i = 0; i < planetObjects.length; i++) {
    for (let j = i + 1; j < planetObjects.length; j++) {
      const p1 = planetObjects[i];
      const p2 = planetObjects[j];

      // Tìm từ khóa chung
      const sharedKw = p1.data.keywords.filter(k => p2.data.keywords.includes(k));
      const isCrossDiscipline = p1.data.clusterId !== p2.data.clusterId;

      if (sharedKw.length > 0) {
        const key = `${Math.min(p1.data.id, p2.data.id)}-${Math.max(p1.data.id, p2.data.id)}`;
        if (!connectedPairs.has(key)) {
          connectedPairs.add(key);

          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array([
            p1.mesh.position.x, p1.mesh.position.y, p1.mesh.position.z,
            p2.mesh.position.x, p2.mesh.position.y, p2.mesh.position.z
          ]);
          
          // Gradient màu nối 2 khoa
          const color1 = new THREE.Color(p1.cluster.color);
          const color2 = new THREE.Color(p2.cluster.color);
          const colors = new Float32Array([
            color1.r, color1.g, color1.b,
            color2.r, color2.g, color2.b
          ]);

          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

          const line = new THREE.Line(geometry, lineMat.clone());
          line.userData = {
            p1: p1,
            p2: p2,
            isSupernovaEdge: p1.isSupernova || p2.isSupernova,
            defaultOpacity: (p1.isSupernova || p2.isSupernova) ? 0.3 : 0.05
          };
          line.material.opacity = line.userData.defaultOpacity;

          edgesMeshGroup.add(line);
          edgeLines.push(line);
        }
      }
    }
  }
}

// ==========================================
// 7. LỌC THỜI GIAN, CLUSTER & HIỆU ỨNG TÌM KIẾM
// ==========================================
function updateCosmosFilter() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();

  planetObjects.forEach(item => {
    const thesis = item.data;

    // Lọc theo mốc thời gian
    const matchTime = isCumulative
      ? (thesis.year >= 2010 && thesis.year <= currentYear)
      : (thesis.year === currentYear);

    // Lọc theo Cụm ngành
    const matchCluster = activeClusterFilter.has(thesis.clusterId);

    // Lọc theo Search Query
    let matchSearch = true;
    if (query !== "") {
      const titleMatch = (thesis.title_ko + thesis.title_en).toLowerCase().includes(query);
      const authorMatch = thesis.author.toLowerCase().includes(query);
      const advisorMatch = thesis.advisor.toLowerCase().includes(query);
      const kwMatch = thesis.keywords.some(k => k.toLowerCase().includes(query));
      matchSearch = titleMatch || authorMatch || advisorMatch || kwMatch;
    }

    const isVisible = matchTime && matchCluster;
    const isHighlighted = isVisible && (query === "" || matchSearch);

    item.isBlinking = query !== "" && matchSearch && isVisible;

    if (!isVisible) {
      item.targetOpacity = 0.03;
      item.mesh.visible = false;
    } else if (query !== "" && !matchSearch) {
      item.targetOpacity = 0.12; // Mờ tối đi khi không khớp tìm kiếm
      item.mesh.visible = true;
    } else {
      item.targetOpacity = 1.0;
      item.mesh.visible = true;
    }
  });

  // Ẩn hiện edges tương ứng
  edgeLines.forEach(line => {
    const v1 = line.userData.p1.mesh.visible;
    const v2 = line.userData.p2.mesh.visible;
    line.visible = v1 && v2;
  });

  updateSearchResultsList(query);
}

// Cập nhật danh sách kết quả tìm kiếm ở Panel phải
function updateSearchResultsList(query) {
  const listContainer = document.getElementById("results-list");
  const countBadge = document.getElementById("results-count");
  listContainer.innerHTML = "";

  if (!query) {
    currentFilteredList = MOCK_THESES.filter(t => {
      const matchTime = isCumulative ? t.year <= currentYear : t.year === currentYear;
      return matchTime && activeClusterFilter.has(t.clusterId);
    });
  } else {
    currentFilteredList = MOCK_THESES.filter(t => {
      const matchTime = isCumulative ? t.year <= currentYear : t.year === currentYear;
      const matchCluster = activeClusterFilter.has(t.clusterId);
      const titleMatch = (t.title_ko + t.title_en).toLowerCase().includes(query);
      const authorMatch = t.author.toLowerCase().includes(query);
      const advisorMatch = t.advisor.toLowerCase().includes(query);
      const kwMatch = t.keywords.some(k => k.toLowerCase().includes(query));
      return matchTime && matchCluster && (titleMatch || authorMatch || advisorMatch || kwMatch);
    });
  }

  countBadge.textContent = currentFilteredList.length;

  currentFilteredList.forEach(t => {
    const card = document.createElement("div");
    card.className = "result-card";
    const title = currentLang === 'ko' ? t.title_ko : t.title_en;
    card.innerHTML = `
      <div class="rc-title">${title}</div>
      <div class="rc-meta">
        <span>${t.author} (${t.advisor})</span>
        <span>${t.year} · ${t.dept}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      focusCameraOnThesis(t.id);
      openDetailView(t);
    });
    listContainer.appendChild(card);
  });
}

// ==========================================
// 8. TƯƠNG TÁC CAMERA TWEEN & PANEL CHI TIẾT
// ==========================================
function focusCameraOnThesis(thesisId) {
  const target = planetObjects.find(p => p.data.id === thesisId);
  if (!target) return;

  selectedPlanet = target;
  controls.autoRotate = false;

  const meshPos = target.mesh.position;
  const targetCamPos = new THREE.Vector3()
    .copy(meshPos)
    .add(new THREE.Vector3(0, 10, 35));

  new TWEEN.Tween(camera.position)
    .to(targetCamPos, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  new TWEEN.Tween(controls.target)
    .to(meshPos, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  // Làm sáng các đường kết nối liên quan đến bài được chọn
  edgeLines.forEach(line => {
    if (line.userData.p1 === target || line.userData.p2 === target) {
      line.material.opacity = 0.9;
    } else {
      line.material.opacity = line.userData.defaultOpacity * 0.3;
    }
  });
}

function openDetailView(thesis) {
  const rightPanel = document.getElementById("right-panel");
  const resultsView = document.getElementById("results-view");
  const detailView = document.getElementById("detail-view");

  resultsView.classList.add("hidden");
  detailView.classList.remove("hidden");
  rightPanel.classList.remove("closed");

  // Điền nội dung
  document.getElementById("detail-title").textContent = currentLang === 'ko' ? thesis.title_ko : thesis.title_en;
  document.getElementById("detail-author").textContent = thesis.author;
  document.getElementById("detail-advisor").textContent = thesis.advisor;
  document.getElementById("detail-dept-badge").textContent = thesis.dept;
  document.getElementById("detail-degree-badge").textContent = thesis.degree;
  document.getElementById("detail-year-badge").textContent = thesis.year;
  document.getElementById("detail-centrality").textContent = `Degree: ${thesis.degreeCentrality} | Betw: ${thesis.betweenness}`;

  const kwContainer = document.getElementById("detail-keywords");
  kwContainer.innerHTML = "";
  thesis.keywords.forEach(kw => {
    const span = document.createElement("span");
    span.className = "tag-item";
    span.textContent = `#${kw}`;
    kwContainer.appendChild(span);
  });

  document.getElementById("detail-abstract").textContent = currentLang === 'ko' ? thesis.abstract_ko : thesis.abstract_en;

  // Xử lý link RISS: nếu có uci thì dùng uci, ngược lại search theo tiêu đề
  const rissBtn = document.getElementById("detail-riss-link");
  if (thesis.uci) {
    rissBtn.href = `https://www.riss.kr/link?id=${thesis.uci}`;
  } else {
    rissBtn.href = `https://www.riss.kr/search/Search.do?queryText=${encodeURIComponent(thesis.title_ko)}`;
  }
}

// ==========================================
// 9. RAYCASTING HOVER & TOOLTIP
// ==========================================
function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const tooltip = document.getElementById("node-tooltip");

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetObjects.map(p => p.mesh));

  if (intersects.length > 0) {
    const intersectedMesh = intersects[0].object;
    const item = intersectedMesh.userData;

    document.body.style.cursor = "pointer";
    hoveredPlanet = item;

    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
    tooltip.classList.remove("hidden");

    document.getElementById("tip-cluster").textContent = currentLang === 'ko' ? item.cluster.nameKo : item.cluster.nameEn;
    document.getElementById("tip-cluster").style.color = item.cluster.hex;
    document.getElementById("tip-title").textContent = currentLang === 'ko' ? item.data.title_ko : item.data.title_en;
    document.getElementById("tip-sub").textContent = `${item.data.author} · ${item.data.advisor} (${item.data.year})`;

    // Highlight các liên kết của node hover
    edgeLines.forEach(line => {
      if (line.userData.p1 === item || line.userData.p2 === item) {
        line.material.opacity = 0.8;
      }
    });
  } else {
    document.body.style.cursor = "default";
    hoveredPlanet = null;
    tooltip.classList.add("hidden");

    if (!selectedPlanet) {
      edgeLines.forEach(line => {
        line.material.opacity = line.userData.defaultOpacity;
      });
    }
  }
}

function onPointerClick(event) {
  // Tránh click khi bấm lên các phần tử UI HTML
  if (event.target.closest(".glass-panel") || event.target.closest(".search-bar-container")) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetObjects.map(p => p.mesh));

  if (intersects.length > 0) {
    const item = intersects[0].object.userData;
    focusCameraOnThesis(item.data.id);
    openDetailView(item.data);
  }
}

// ==========================================
// 10. SETUP SỰ KIỆN GIAO DIỆN & CAMERA PRESETS
// ==========================================
function setupUIEventListeners() {
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", onPointerClick);

  // Timeline Slider
  const yearSlider = document.getElementById("year-slider");
  const yearVal = document.getElementById("current-year-val");
  yearSlider.addEventListener("input", (e) => {
    currentYear = parseInt(e.target.value);
    yearVal.textContent = currentYear;
    updateCosmosFilter();
  });

  // Switch Tích lũy / Đơn lẻ
  const modeToggle = document.getElementById("mode-toggle");
  modeToggle.addEventListener("change", (e) => {
    isCumulative = !e.target.checked;
    updateCosmosFilter();
  });

  // Search input
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search-btn");
  searchInput.addEventListener("input", () => {
    updateCosmosFilter();
    const rightPanel = document.getElementById("right-panel");
    const resultsView = document.getElementById("results-view");
    const detailView = document.getElementById("detail-view");
    if (searchInput.value.trim() !== "") {
      resultsView.classList.remove("hidden");
      detailView.classList.add("hidden");
      rightPanel.classList.remove("closed");
    }
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    updateCosmosFilter();
  });

  // Language Toggle
  const langBtn = document.getElementById("lang-toggle-btn");
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    updateLanguage();
  });

  // Panel navigation
  document.getElementById("close-panel-btn").addEventListener("click", () => {
    document.getElementById("right-panel").classList.add("closed");
    controls.autoRotate = true;
    selectedPlanet = null;
    edgeLines.forEach(l => l.material.opacity = l.userData.defaultOpacity);
  });

  document.getElementById("back-to-results").addEventListener("click", () => {
    document.getElementById("detail-view").classList.add("hidden");
    document.getElementById("results-view").classList.remove("hidden");
  });

  // Camera Presets Buttons
  document.querySelectorAll(".cam-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const camType = e.target.getAttribute("data-cam");
      controls.autoRotate = false;
      let targetPos = new THREE.Vector3(0, 160, 260);
      let lookTarget = new THREE.Vector3(0, 0, 0);

      if (camType === "c1") {
        targetPos.set(110, 40, 40);
        lookTarget.set(90, 0, 0);
      } else if (camType === "c2") {
        targetPos.set(40, 50, 120);
        lookTarget.set(50, 0, 86);
      } else if (camType === "c3") {
        targetPos.set(-80, 50, 100);
        lookTarget.set(-47, 0, 82);
      }

      new TWEEN.Tween(camera.position)
        .to(targetPos, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

      new TWEEN.Tween(controls.target)
        .to(lookTarget, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    });
  });
}

function buildClusterUI() {
  const container = document.getElementById("cluster-toggles");
  container.innerHTML = "";
  CLUSTERS.forEach(cluster => {
    const chip = document.createElement("div");
    chip.className = "cluster-chip active";
    chip.innerHTML = `
      <span class="dot" style="background: ${cluster.hex}; box-shadow: 0 0 6px ${cluster.hex}"></span>
      <span class="c-name">${currentLang === 'ko' ? cluster.nameKo : cluster.nameEn}</span>
    `;
    chip.addEventListener("click", () => {
      if (activeClusterFilter.has(cluster.id)) {
        if (activeClusterFilter.size > 1) {
          activeClusterFilter.delete(cluster.id);
          chip.classList.remove("active");
        }
      } else {
        activeClusterFilter.add(cluster.id);
        chip.classList.add("active");
      }
      updateCosmosFilter();
    });
    container.appendChild(chip);
  });
}

function updateLanguage() {
  const dict = i18n[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key]) el.placeholder = dict[key];
  });

  const langPills = document.querySelectorAll("#lang-toggle-btn span");
  if (currentLang === 'ko') {
    langPills[0].classList.add("active");
    langPills[1].classList.remove("active");
  } else {
    langPills[0].classList.remove("active");
    langPills[1].classList.add("active");
  }

  buildClusterUI();
  updateCosmosFilter();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==========================================
// 11. VÒNG LẶP RENDER & HIỆU ỨNG ĐỘNG LỰC HỌC
// ==========================================
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update();

  const elapsedTime = (performance.now() - introStartTime) / 1000;

  // Intro Sequence 5 giây đầu: Sáng dần đều từ xa đến gần
  const isIntro = elapsedTime < 5.0;
  const introProgress = Math.min(elapsedTime / 5.0, 1.0);

  // Vận hành các hành tinh
  planetObjects.forEach((p, idx) => {
    // Tự xoay trục riêng
    p.mesh.rotation.y += p.rotSpeed;

    // Hiệu ứng thở / nhấp nháy (Breathing Pulse)
    const pulse = Math.sin(time * 0.003 + idx) * 0.15;
    
    // Nếu đang khớp tìm kiếm -> nhấp nháy chớp sáng liên tục
    if (p.isBlinking) {
      const fastFlash = (Math.sin(time * 0.015) + 1) * 0.5;
      p.mesh.material.emissiveIntensity = 0.5 + fastFlash * 1.5;
      p.mesh.scale.setScalar(p.baseSize * (1.2 + fastFlash * 0.3));
    } else {
      p.mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
        p.mesh.material.emissiveIntensity,
        p.isSupernova ? 0.8 + pulse : 0.25 + pulse * 0.5,
        0.05
      );
      p.mesh.scale.setScalar(p.baseSize + pulse * 0.2);
    }

    // Hiệu ứng mờ dần trong Intro
    if (isIntro) {
      const nodeStagger = (p.mesh.position.length() / 150);
      const nodeAlpha = Math.max(0, Math.min(1, (introProgress - nodeStagger * 0.3) * 2));
      p.mesh.material.opacity = nodeAlpha * p.targetOpacity;
    } else {
      p.mesh.material.opacity = THREE.MathUtils.lerp(p.mesh.material.opacity, p.targetOpacity, 0.06);
    }
  });

  // Cơ chế LOD đơn giản: Giảm tải hiển thị đường nối khi camera ở quá xa
  const camDist = camera.position.length();
  if (camDist > 450) {
    edgesMeshGroup.visible = false;
  } else {
    edgesMeshGroup.visible = true;
  }

  controls.update();
  renderer.render(scene, camera);
}
