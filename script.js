const data = [
  {
    place: "Seamless",
    title: "We solve",
    title2: "toughest challenges",
    description:
      "We’re centered on what’s best for you and your business, providing the professional prowess you need to chart your path forward.\n\nWe do not have limitations - we got you covered, whether you’re a technologist, researcher, a financial adviser or another industry leading organization, we deliver the industry expertise you are looking for.",
    image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    place: "Technology",
    title: "Innovating",
    title2: "Tomorrow",
    description:
      "From cloud platforms to AI-driven analytics, our Technology practice empowers your organization to stay ahead of the curve. We architect scalable solutions that adapt as fast as the market moves.",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    place: "Services",
    title: "Tailored",
    title2: "Solutions",
    description:
      "Whether you need end-to-end project management, digital transformation roadmaps, or ongoing support and maintenance, our Services team delivers custom-fit solutions that drive real business outcomes.",
    image: "https://assets.codepen.io/3685267/timed-cards-3.jpg"
  },
  {
    place: "About Us",
    title: "Our",
    title2: "Story",
    description:
      "Built on years of industry expertise and a passion for innovation, our firm combines deep technical know-how with a client-first mindset. Learn how we’ve helped organizations like yours succeed.",
    image: "https://assets.codepen.io/3685267/timed-cards-4.jpg"
  },
  {
    place: "Training",
    title: "Empower",
    title2: "Your Team",
    description:
      "Upskill your workforce with our hands-on training programs, covering everything from cybersecurity fundamentals to advanced DevOps practices. We turn learners into practitioners.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRlY2h8ZW58MHx8MHx8fDA%3D"
  },
  {
    place: "Contact Us",
    title: "Let’s",
    title2: "Connect",
    description:
      "Ready to start your next project or just have a question? Reach out today and one of our experts will be in touch to discuss how we can help you achieve your goals.",
    image: "https://assets.codepen.io/3685267/timed-cards-6.jpg"
  }
];

// Utility function to get element by ID
const _ = (id) => document.getElementById(id);

// Generate HTML for cards
const cards = data.map((i, index) => `<div class="card" id="card${index}" style="background-image:url(${i.image})"></div>`).join('');

// Generate HTML for card contents
const cardContents = data.map((i, index) => `<div class="card-content" id="card-content-${index}">
  <div class="content-start"></div>
  <div class="content-place">${i.place}</div>
  <div class="content-title-1">${i.title}</div>
  <div class="content-title-2">${i.title2}</div>
</div>`).join('');

// Generate HTML for slide numbers
const slideNumbers = data.map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`).join('');

// Inject HTML into the DOM
_('demo').innerHTML = cards + cardContents;
_('slide-numbers').innerHTML = slideNumbers;

// Utility functions
const range = (n) => Array(n).fill(0).map((i, j) => i + j);
const set = gsap.set;

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
    gsap.to(target, {
      ...properties,
      duration: duration,
      onComplete: resolve,
    });
  });
}

// State variables
let order = [0, 1, 2, 3, 4, 5];
let detailsEven = true;
let offsetTop = 200;
let offsetLeft = 700;
let cardWidth = 200;
let cardHeight = 300;
let gap = 40;
let numberSize = 50;
const ease = "sine.inOut";

// Initialize the carousel
function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;
  offsetTop = height - 430;
  offsetLeft = width - 830;

  gsap.set("#pagination", { top: offsetTop + 330, left: offsetLeft, y: 200, opacity: 0, zIndex: 60 });
  gsap.set("nav", { y: -200, opacity: 0 });

  gsap.set(getCard(active), { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-1`, { y: 100 });
  gsap.set(`${detailsInactive} .title-2`, { y: 100 });
  gsap.set(`${detailsInactive} .desc`, { y: 50 });
  gsap.set(`${detailsInactive} .cta`, { y: 60 });

  gsap.set(".progress-sub-foreground", { width: 500 * (1 / order.length) * (active + 1) });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10,
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      zIndex: 40,
      y: offsetTop + cardHeight - 100,
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });

  gsap.set(".indicator", { x: -window.innerWidth });

  const startDelay = 0.6;

  gsap.to(".cover", {
    x: width + 400,
    delay: 0.5,
    ease,
    onComplete: () => {
      setTimeout(() => {
        loop();
      }, 500);
    },
  });

  rest.forEach((i, index) => {
    gsap.to(getCard(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 30, delay: 0.05 * index + startDelay, ease });
    gsap.to(getCardContent(i), { x: offsetLeft + index * (cardWidth + gap), zIndex: 40, delay: 0.05 * index + startDelay, ease });
  });

  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to("nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

let clicks = 0;

// Move to the next slide
function step() {
  return new Promise((resolve) => {
    order.push(order.shift());
    detailsEven = !detailsEven;

    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    document.querySelector(`${detailsActive} .place-box .text`).textContent = data[order[0]].place;
    document.querySelector(`${detailsActive} .title-1`).textContent = data[order[0]].title;
    document.querySelector(`${detailsActive} .title-2`).textContent = data[order[0]].title2;
    document.querySelector(`${detailsActive} .desc`).textContent = data[order[0]].description;

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
      },
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

// Auto-loop the carousel
async function loop() {
  await animate(".indicator", 2, { x: 0 });
  await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
  set(".indicator", { x: -window.innerWidth });
  await step();
  loop();
}

// Load images asynchronously
async function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadImages() {
  const promises = data.map(({ image }) => loadImage(image));
  return Promise.all(promises);
}

// Start the carousel
async function start() {
  try {
    await loadImages();
    init();
  } catch (error) {
    console.error("One or more images failed to load", error);
  }
}

// Move to the previous slide
async function prev() {
  order.unshift(order.pop());
  detailsEven = !detailsEven;

  const detA = detailsEven ? "#details-even" : "#details-odd";
  const d = data[order[0]];
  document.querySelector(`${detA} .place-box .text`).textContent = d.place;
  document.querySelector(`${detA} .title-1`).textContent = d.title;
  document.querySelector(`${detA} .title-2`).textContent = d.title2;
  document.querySelector(`${detA} .desc`).textContent = d.description;

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
    },
  });

  rest.slice(1).forEach((i, index) => {
    const xNew = offsetLeft + (index + 1) * (cardWidth + gap);
    gsap.to(getCard(i), { x: xNew, y: offsetTop, width: cardWidth, height: cardHeight, zIndex: 30, ease, delay: 0.1 * (index + 1) });
    gsap.to(getCardContent(i), { x: xNew, y: offsetTop + cardHeight - 100, opacity: 1, zIndex: 40, ease, delay: 0.1 * (index + 1) });
    gsap.to(getSliderItem(i), { x: (index + 2) * numberSize, ease });
  });

  gsap.to(".progress-sub-foreground", { width: 500 * (1 / order.length) * (order.indexOf(active) + 1), ease });
}

// Move to the next slide (simple wrapper)
function next() {
  step();
}

// Event listeners for navigation arrows
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".arrow-left").addEventListener("click", prev);
  document.querySelector(".arrow-right").addEventListener("click", next);
});

// Start the carousel
start();
