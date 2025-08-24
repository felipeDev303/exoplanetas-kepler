// scripts/visualizeThree.js
// Visualizador Three.js mínimo que usa window.EXO_PLANETS

// Usar builds ESM desde CDN para que funcione directo en el navegador sin bundler
import * as THREE from "https://unpkg.com/three@0.152.2/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js";

export function visualize(containerId = "threeContainer") {
  const planets = window.EXO_PLANETS || [];
  if (!planets.length) {
    alert("No hay datos cargados en window.EXO_PLANETS");
    return null;
  }

  // Crear contenedor
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.zIndex = 998;
    document.body.appendChild(container);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 20, 80);
  controls.update();

  // luz
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(30, 50, 40);
  scene.add(dir);

  // Estrella central
  const starGeo = new THREE.SphereGeometry(3, 32, 32);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xffee88 });
  const star = new THREE.Mesh(starGeo, starMat);
  scene.add(star);

  // Mapear radios a escala visual
  const radii = planets.map((p) => p.radius).filter(Number.isFinite);
  const minR = Math.min(...radii);
  const maxR = Math.max(...radii);
  const scale = (r) => {
    if (!Number.isFinite(r)) return 0.5;
    const t = (r - minR) / (maxR - minR || 1);
    return 0.2 + t * 1.8; // rango 0.2 - 2.0
  };

  // Crear planetas
  const objects = [];
  planets.forEach((p, i) => {
    const s = scale(p.radius || 1);
    const geo = new THREE.SphereGeometry(s, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
    });
    const mesh = new THREE.Mesh(geo, mat);
    // Colocar en radio orbital ficticio basado en índice y período
    const orbitRadius =
      8 + i * 3 + (p.period ? Math.log10(p.period + 1) * 2 : 0);
    mesh.position.set(orbitRadius, 0, 0);
    scene.add(mesh);
    objects.push({
      mesh,
      orbitRadius,
      period: p.period || 100,
      angle: Math.random() * Math.PI * 2,
      data: p,
    });
  });

  // Fondo estrellado simple
  const starsGeo = new THREE.BufferGeometry();
  const starCount = 1000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 1000;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
  }
  starsGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const starField = new THREE.Points(starsGeo, starsMat);
  scene.add(starField);

  // Animación
  const clock = new THREE.Clock();
  function animate() {
    const dt = clock.getDelta();
    objects.forEach((o) => {
      const speed = 1 / (o.period / 100); // inverso del periodo
      o.angle += dt * speed;
      o.mesh.position.x = Math.cos(o.angle) * o.orbitRadius;
      o.mesh.position.z = Math.sin(o.angle) * o.orbitRadius;
      o.mesh.rotation.y += 0.2 * dt;
    });
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Responsive
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, objects };
}
