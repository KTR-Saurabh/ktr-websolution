const WA_NUMBER = "919354170598";

function waUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".wa-cta").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    const message = el.dataset.message || "Hi KTR WebSolution, I need a website quote.";
    window.open(waUrl(message), "_blank", "noopener");
  });
});

const menuBtn = document.querySelector("#menuBtn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => document.body.classList.toggle("menu-open"));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll("[data-wa-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [`Hi KTR WebSolution, ${form.dataset.waForm}`];
    data.forEach((value, key) => {
      if (String(value).trim()) lines.push(`${key}: ${value}`);
    });
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    form.reset();
  });
});

const calc = document.querySelector("#quoteCalc");
if (calc) {
  const output = document.querySelector("#estimateOutput");
  const calcCta = document.querySelector("#calcCta");
  const update = () => {
    let total = 1499;
    calc.querySelectorAll("select").forEach((select) => {
      total += Number(select.value || 0);
    });
    const formatted = `Rs ${total.toLocaleString("en-IN")}`;
    output.textContent = formatted;
    calcCta.dataset.message = `I used the pricing calculator. My estimated price is ${formatted}. Please give me an exact quote.`;
  };
  calc.addEventListener("change", update);
  update();
}

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-cat]").forEach((item) => {
      item.style.display = filter === "all" || item.dataset.cat === filter ? "" : "none";
    });
  });
});

document.querySelectorAll(".faq-q").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".faq-item").classList.toggle("open");
  });
});

const toTop = document.querySelector("#toTop");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 500);
  });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const cookie = document.querySelector("#cookie");
if (cookie && localStorage.getItem("ktrCookieOk") !== "yes") {
  cookie.classList.add("show");
  cookie.querySelector("button").addEventListener("click", () => {
    localStorage.setItem("ktrCookieOk", "yes");
    cookie.classList.remove("show");
  });
}

const popup = document.querySelector("#exitPopup");
if (popup && sessionStorage.getItem("ktrExitSeen") !== "yes") {
  document.addEventListener("mouseleave", (event) => {
    if (event.clientY <= 0) {
      popup.classList.add("show");
      sessionStorage.setItem("ktrExitSeen", "yes");
    }
  });
  popup.querySelector("[data-close]").addEventListener("click", () => popup.classList.remove("show"));
}

function initThreeHero() {
  const canvas = document.querySelector("#ktr3d");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  const blue = new THREE.MeshBasicMaterial({ color: 0x00b4ff, wireframe: true, transparent: true, opacity: 0.7 });
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
  const ringGeo = new THREE.TorusGeometry(2.6, 0.012, 16, 180);
  for (let i = 0; i < 4; i += 1) {
    const ring = new THREE.Mesh(ringGeo, blue);
    ring.rotation.x = Math.PI / 2 + i * 0.38;
    ring.rotation.y = i * 0.55;
    group.add(ring);
  }

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.35, 1.35), blue);
  group.add(cube);

  const points = [];
  for (let i = 0; i < 120; i += 1) {
    points.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x6fe0ff, size: 0.025, transparent: true, opacity: 0.8 }));
  scene.add(particles);

  function codeTexture(text) {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 256;
    const ctx = textureCanvas.getContext("2d");
    ctx.fillStyle = "rgba(8, 15, 36, .86)";
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = "rgba(0,180,255,.45)";
    ctx.strokeRect(10, 10, 492, 236);
    ctx.font = "24px Consolas";
    ctx.fillStyle = "#dff7ff";
    text.split("\n").forEach((line, index) => ctx.fillText(line, 30, 58 + index * 42));
    return new THREE.CanvasTexture(textureCanvas);
  }

  const panels = [
    ["<section>\n  growBusiness();\n</section>", -3.2, 1.1, -1.2],
    ["const site =\n  fast + seo + leads;", 3.2, -1.0, -1.6],
    ["KTR.launch({\n  mobileFirst: true\n});", 1.2, 2.0, -2.4],
  ];
  panels.forEach(([text, x, y, z]) => {
    const mat = new THREE.MeshBasicMaterial({ map: codeTexture(text), transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = x > 0 ? -0.42 : 0.42;
    scene.add(mesh);
  });

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", resize);

  let tick = 0;
  function animate() {
    tick += 0.01;
    group.rotation.y += 0.004;
    group.rotation.x = Math.sin(tick) * 0.08;
    cube.rotation.x += 0.008;
    cube.rotation.y += 0.012;
    particles.rotation.y -= 0.0015;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

initThreeHero();
