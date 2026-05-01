const WA_NUMBER = "919354170598";
const LEAD_ENDPOINT = "";
const textMemory = new Map();
const translations = {
  "Home": "होम",
  "Services": "सर्विसेज",
  "Pricing": "प्राइसिंग",
  "Portfolio": "पोर्टफोलियो",
  "About": "अबाउट",
  "Blog": "ब्लॉग",
  "Contact": "कॉन्टैक्ट",
  "WhatsApp": "व्हाट्सऐप",
  "Get Free Quote": "फ्री कोट लें",
  "See Our Work": "हमारा काम देखें",
  "We Build Websites That Grow Your Business": "हम ऐसी वेबसाइट बनाते हैं जो आपका बिजनेस बढ़ाती हैं",
  "Professional Web Design & Development — India": "प्रोफेशनल वेब डिजाइन और डेवलपमेंट - भारत",
  "Premium mobile-first websites for small businesses, startups and local shops. Fast delivery, clear pricing, SEO-ready structure and direct WhatsApp support.": "छोटे बिजनेस, स्टार्टअप और लोकल दुकानों के लिए प्रीमियम मोबाइल-फर्स्ट वेबसाइट। तेज डिलीवरी, साफ प्राइसिंग, SEO-ready स्ट्रक्चर और डायरेक्ट WhatsApp सपोर्ट।",
  "3 active projects - only 2 slots left this month": "3 एक्टिव प्रोजेक्ट - इस महीने सिर्फ 2 स्लॉट बाकी",
  "Trusted by 50+ Clients": "50+ क्लाइंट्स का भरोसा",
  "4.9/5 based on 40+ reviews": "40+ रिव्यू के आधार पर 4.9/5",
  "Get FREE Website Audit Worth Rs 2,000": "Rs 2,000 की FREE वेबसाइट ऑडिट पाएं",
  "Claim Audit": "ऑडिट क्लेम करें",
  "No More Endless Scrolling": "अब लंबी स्क्रॉलिंग नहीं",
  "Why Choose Us": "हमें क्यों चुनें",
  "Made For Indian Businesses": "भारतीय बिजनेस के लिए बनाया गया",
  "5-7 Day Delivery": "5-7 दिन में डिलीवरी",
  "Mobile First": "मोबाइल फर्स्ट",
  "SEO Ready": "SEO Ready",
  "7-Day Guarantee": "7 दिन गारंटी",
  "Work Samples & Case Studies": "वर्क सैंपल और केस स्टडी",
  "Filter sample projects and see how smart websites help local businesses get more enquiries, bookings and sales.": "सैंपल प्रोजेक्ट फिल्टर करें और देखें कि स्मार्ट वेबसाइट कैसे ज्यादा enquiry, booking और sales लाती है।",
  "Project Details": "प्रोजेक्ट डिटेल्स",
  "Problem": "समस्या",
  "Solution": "समाधान",
  "Result": "रिजल्ट",
  "I Want Similar Website": "मुझे ऐसी वेबसाइट चाहिए",
  "Tell Us About Your Project": "अपने प्रोजेक्ट के बारे में बताएं",
  "Send on WhatsApp": "WhatsApp पर भेजें",
  "Direct Contact": "डायरेक्ट कॉन्टैक्ट",
  "Quick Answers": "जल्दी जवाब",
  "Clear Pricing, No Confusion": "साफ प्राइसिंग, कोई कन्फ्यूजन नहीं",
  "Estimate Your Website Cost": "अपनी वेबसाइट की कीमत जानें",
  "Get Exact Quote": "Exact Quote लें"
};

function waUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  let toast = document.querySelector(".lead-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "lead-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3800);
}

function saveLead(lead) {
  const leads = JSON.parse(localStorage.getItem("ktrLeads") || "[]");
  leads.push(lead);
  localStorage.setItem("ktrLeads", JSON.stringify(leads.slice(-100)));

  if (!LEAD_ENDPOINT) return Promise.resolve(false);
  return fetch(LEAD_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(lead)
  }).then(() => true).catch(() => false);
}

function translatePage(lang) {
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  document.querySelectorAll("body *").forEach((node) => {
    if (["SCRIPT", "STYLE", "CANVAS", "INPUT", "TEXTAREA", "SELECT"].includes(node.tagName)) return;
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.TEXT_NODE) return;
      const original = textMemory.get(child) || child.nodeValue;
      textMemory.set(child, original);
      const trimmed = original.trim();
      if (!trimmed) return;
      const translated = translations[trimmed];
      if (lang === "hi" && translated) {
        child.nodeValue = original.replace(trimmed, translated);
      } else {
        child.nodeValue = original;
      }
    });
  });
}

function initLanguageSwitch() {
  const switcher = document.createElement("div");
  switcher.className = "lang-switch";
  switcher.innerHTML = '<button type="button" data-lang="en">EN</button><button type="button" data-lang="hi">HI</button>';
  document.body.appendChild(switcher);
  const setLang = (lang) => {
    localStorage.setItem("ktrLang", lang);
    switcher.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.lang === lang));
    translatePage(lang);
  };
  switcher.addEventListener("click", (event) => {
    if (event.target.matches("button")) setLang(event.target.dataset.lang);
  });
  setLang(localStorage.getItem("ktrLang") || "en");
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lead = {
      createdAt: new Date().toISOString(),
      page: location.pathname.split("/").pop() || "index.html",
      form: form.dataset.waForm,
      source: document.title,
      fields: {}
    };
    const lines = [`Hi KTR WebSolution, ${form.dataset.waForm}`];
    data.forEach((value, key) => {
      if (String(value).trim()) {
        lead.fields[key] = value;
        lines.push(`${key}: ${value}`);
      }
    });
    const synced = await saveLead(lead);
    showToast(synced ? "Lead saved to Google Sheet. WhatsApp is opening now." : "Lead saved in browser. Connect Google Sheet endpoint when ready.");
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
    let recommendation = calc.querySelector(".recommendation");
    if (!recommendation) {
      recommendation = document.createElement("div");
      recommendation.className = "recommendation";
      calc.querySelector(".estimate").insertBefore(recommendation, calcCta);
    }
    const plan = total >= 12000 ? "Premium E-Commerce Plan" : total >= 7000 ? "Standard Dynamic Plan" : "Basic Starter Plan";
    recommendation.innerHTML = `AI Recommendation: ${plan}<small>Based on your selected pages, features and support needs.</small>`;
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

const projectModal = document.querySelector("#projectModal");
if (projectModal) {
  const title = projectModal.querySelector("#modalTitle");
  const problem = projectModal.querySelector("#modalProblem");
  const solution = projectModal.querySelector("#modalSolution");
  const result = projectModal.querySelector("#modalResult");
  const close = projectModal.querySelector("#modalClose");

  document.querySelectorAll(".project-open").forEach((button) => {
    button.addEventListener("click", () => {
      title.textContent = button.dataset.title;
      problem.textContent = button.dataset.problem;
      solution.textContent = button.dataset.solution;
      result.textContent = button.dataset.result;
      projectModal.classList.add("show");
      projectModal.setAttribute("aria-hidden", "false");
    });
  });

  function closeProjectModal() {
    projectModal.classList.remove("show");
    projectModal.setAttribute("aria-hidden", "true");
  }

  close.addEventListener("click", closeProjectModal);
  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) closeProjectModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });
}

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
  const mouse = { x: 0, y: 0 };

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

  const laptop = new THREE.Group();
  const screen = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.55, 0.08), new THREE.MeshBasicMaterial({ color: 0x0d1a33, transparent: true, opacity: 0.78 }));
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.12, 1.1), white);
  screen.position.set(0, 0.2, 0);
  base.position.set(0, -0.72, 0.52);
  laptop.add(screen, base);
  laptop.position.set(0, -0.4, -0.35);
  laptop.rotation.x = -0.16;
  group.add(laptop);

  const nodeGeo = new THREE.SphereGeometry(0.055, 14, 14);
  for (let i = 0; i < 16; i += 1) {
    const node = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x37e6a5 : 0x00b4ff }));
    const angle = (i / 16) * Math.PI * 2;
    node.position.set(Math.cos(angle) * 3.2, Math.sin(angle * 1.7) * 1.4, Math.sin(angle) * 2.2);
    group.add(node);
  }

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
  addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / innerWidth - 0.5) * 2;
    mouse.y = (event.clientY / innerHeight - 0.5) * 2;
  });

  let tick = 0;
  function animate() {
    tick += 0.01;
    group.rotation.y += 0.004;
    group.rotation.x = Math.sin(tick) * 0.08 + mouse.y * 0.05;
    group.position.x += (mouse.x * 0.35 - group.position.x) * 0.035;
    cube.rotation.x += 0.008;
    cube.rotation.y += 0.012;
    laptop.rotation.y = Math.sin(tick * 0.8) * 0.08;
    particles.rotation.y -= 0.0015;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

initLanguageSwitch();
initThreeHero();
