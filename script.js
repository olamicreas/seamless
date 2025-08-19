

/***************
 * CAROUSEL DATA (3 slides)
 ***************/
const data = [
  {
    tag: "Advisory",
    place: "Supply Chain & Logistics",
    title: "Optimize",
    title2: "End-to-End Flow",
    description:
      "Advisory that drives measurable value across transport, warehousing, inventory and OTC. Integrate ERP/TMS/WMS, expose real-time visibility, and improve OTIF, cost-to-serve, and asset utilization.",
    
    image:'https://assets.codepen.io/3685267/timed-cards-3.jpg',
    ctaText: "Explore Supply Chain",
    ctaHref: "#supply-chain"
  },
  {
    tag: "Architecture",
    place: "Enterprise Architecture (TOGAF)",
    title: "Align",
    title2: "Business & IT",
    description:
      "Target operating models, capability maps, and reference architectures that align processes, data, applications, and technology—backed by change management for sustainable outcomes.",
    image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
    ctaText: "How We Architect",
    ctaHref: "#about"
  },
  {
    tag: "Transformation",
    place: "Logistics & Information Systems",
    title: "Modernize",
    title2: "Legacy Systems",
    description:
      "Transform legacy logistics platforms into agile, integrated ecosystems—APIs, data platforms, predictive analytics, and automation for resilient, compliant operations.",
    image: "https://assets.codepen.io/3685267/timed-cards-6.jpg",
    ctaText: "See Our Approach",
    ctaHref: "#services"
  }
];

/***************
 * HELPERS
 ***************/
const $ = (id) => document.getElementById(id);
const set = gsap.set;

const cards = data
  .map((i, index) => `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`)
  .join("");

const cardContents = data
  .map(
    (i, index) => `<div class="card-content" id="card-content-${index}">
  <div class="content-start"></div>
  <div class="content-place">${i.place}</div>
  <div class="content-title-1">${i.title}</div>
  <div class="content-title-2">${i.title2}</div>
</div>`
  )
  .join("");

const slideNumbers = data.map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`).join("");

$("demo").innerHTML = cards + cardContents;
$("slide-numbers").innerHTML = slideNumbers;

/***************
 * STATE
 ***************/
let order = Array.from({ length: data.length }, (_, i) => i);
let detailsEven = true;
let offsetTop = 200;
let offsetLeft = 700;
let cardWidth = 200;
let cardHeight = 300;
let gap = 40;
let numberSize = 50;
const ease = "sine.inOut";

/***************
 * UTILS
 ***************/
function getCard(index) {
  return `#card${index}`;
}
function getCardContent(index) {
  return `#card-content-${index}`;
}
function getSliderItem(index) {
  return `#slide-item-${index}`;
}
function animate(target, duration, properties) {
  return new Promise((resolve) => {
    gsap.to(target, { ...properties, duration, onComplete: resolve });
  });
}
function wireCTA(containerSel, slideIdx) {
  const btn = document.querySelector(`${containerSel} .discover`);
  if (!btn) return;
  const d = data[slideIdx] || {};
  btn.textContent = d.ctaText || "Learn More";
  btn.onclick = () => {
    const href = d.ctaHref || "#services";
    if (href.startsWith("#")) location.hash = href;
    else location.href = href;
  };
}

/***************
 * INIT
 ***************/
function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;

  offsetTop = height - 430;
  offsetLeft = width - 830;

  gsap.set("#pagination", { top: offsetTop + 330, left: offsetLeft, y: 200, opacity: 0, zIndex: 60 });
  gsap.set("nav", { y: -200, opacity: 0 });

  // Active card full-screen
  gsap.set(getCard(active), { x: 0, y: 0, width: width, height: height });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });

  // Prime details panes
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-1`, { y: 100 });
  gsap.set(`${detailsInactive} .title-2`, { y: 100 });
  gsap.set(`${detailsInactive} .desc`, { y: 50 });
  gsap.set(`${detailsInactive} .cta`, { y: 60 });

  // Initial progress
  gsap.set(".progress-sub-foreground", { width: 500 * (1 / order.length) * (active + 1) });

  // Stack the rest
  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      zIndex: 40,
      y: offsetTop + cardHeight - 100
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });

  // Preload cover anim
  gsap.set(".indicator", { x: -width });

  // Ensure details text matches current slide BEFORE loop starts
  const d0 = data[order[0]];
  document.querySelector(`${detailsActive} .place-box .text`).textContent = d0.place;
  document.querySelector(`${detailsActive} .title-1`).textContent = d0.title;
  document.querySelector(`${detailsActive} .title-2`).textContent = d0.title2;
  document.querySelector(`${detailsActive} .desc`).textContent = d0.description;
  wireCTA(detailsActive, order[0]);

  const startDelay = 0.6;

  gsap.to(".cover", {
    x: width + 400,
    delay: 0.5,
    ease,
    onComplete: () => setTimeout(loop, 500)
  });

  rest.forEach((i, index) => {
    gsap.to(getCard(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 30, delay: 0.05 * index + startDelay, ease });
    gsap.to(getCardContent(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 40, delay: 0.05 * index + startDelay, ease });
  });

  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to("nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

/***************
 * STEP/NAV
 ***************/
let clicks = 0;

function step() {
  return new Promise((resolve) => {
    order.push(order.shift());
    detailsEven = !detailsEven;

    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    // Update details from new active slide
    const d = data[order[0]];
    document.querySelector(`${detailsActive} .place-box .text`).textContent = d.place;
    document.querySelector(`${detailsActive} .title-1`).textContent = d.title;
    document.querySelector(`${detailsActive} .title-2`).textContent = d.title2;
    document.querySelector(`${detailsActive} .desc`).textContent = d.description;
    wireCTA(detailsActive, order[0]);

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
    gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.1, duration: 0.7, ease });
    gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease });
    gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease });
    gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease });
    gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.35, duration: 0.4, onComplete: resolve, ease });
    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];

    gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(prv), { scale: 1.5, ease });

    gsap.to(getCardContent(active), { y: offsetTop + cardHeight - 10, opacity: 0, duration: 0.3, ease });
    gsap.to(getSliderItem(active), { x: 0, ease });
    gsap.to(getSliderItem(prv), { x: -numberSize, ease });
    gsap.to(".progress-sub-foreground", { width: 500 * (1 / order.length) * (active + 1), ease });

    gsap.to(getCard(active), {
      x: 0,
      y: 0,
      ease,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
        gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 10, scale: 1 });
        gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40 });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
        gsap.set(`${detailsInactive} .desc`, { y: 50 });
        gsap.set(`${detailsInactive} .cta`, { y: 60 });

        clicks -= 1;
        if (clicks > 0) step();
      }
    });

    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, ease, delay: 0.1 * (index + 1) });
        gsap.to(getCardContent(i), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40, ease, delay: 0.1 * (index + 1) });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
  });
}

async function loop() {
  await animate(".indicator", 2, { x: 0 });
  await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
  set(".indicator", { x: -window.innerWidth });
  await step();
  loop();
}

/***************
 * IMAGE PRELOAD + START
 ***************/
async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function loadImages() {
  const promises = data.map(({ image }) => loadImage(image));
  return Promise.all(promises);
}
async function start() {
  try {
    await loadImages();
    init();
  } catch (err) {
    console.error("One or more images failed to load", err);
  }
}

/***************
 * MANUAL NAV
 ***************/
async function prev() {
  order.unshift(order.pop());
  detailsEven = !detailsEven;

  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const d = data[order[0]];

  document.querySelector(`${detailsActive} .place-box .text`).textContent = d.place;
  document.querySelector(`${detailsActive} .title-1`).textContent = d.title;
  document.querySelector(`${detailsActive} .title-2`).textContent = d.title2;
  document.querySelector(`${detailsActive} .desc`).textContent = d.description;
  wireCTA(detailsActive, order[0]);

  const [active, ...rest] = order;
  const prv = rest[0];

  gsap.set(getCard(prv), { zIndex: 10 });
  gsap.set(getCard(active), { zIndex: 20 });
  gsap.to(getCard(prv), { scale: 1.5, ease });

  gsap.to(getCardContent(active), { y: offsetTop + cardHeight - 10, opacity: 0, duration: 0.3, ease });
  gsap.to(getSliderItem(active), { x: 0, ease });

  gsap.to(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    ease,
    onComplete: () => {
      const xNew = offsetLeft;
      gsap.set(getCard(prv), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, borderRadius: 10, scale: 1 });
      gsap.set(getCardContent(prv), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40 });
      gsap.set(getSliderItem(prv), { x: numberSize });
    }
  });

  rest.slice(1).forEach((i, index) => {
    const xNew = offsetLeft + (index + 1) * (cardWidth + gap);
    gsap.to(getCard(i), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, ease, delay: 0.1 * (index + 1) });
    gsap.to(getCardContent(i), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40, ease, delay: 0.1 * (index + 1) });
    gsap.to(getSliderItem(i), { x: (index + 2) * numberSize, ease });
  });

  gsap.to(".progress-sub-foreground", { width: 500 * (1 / order.length) * (order.indexOf(active) + 1), ease });
}
function next() { step(); }

/***************
 * EVENTS
 ***************/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".arrow-left").addEventListener("click", prev);
  document.querySelector(".arrow-right").addEventListener("click", next);
  start();
});
