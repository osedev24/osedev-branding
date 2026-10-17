import './app.css'
import './content-editor.ts'
import { adminSession, supabaseConfigured } from './lib/supabase'
import { getAdminProfile, loadAdminProfileFromDatabase, saveAdminProfileToDatabase, type AdminProfile } from './lib/admin-profile'

const app = document.querySelector<HTMLDivElement>('#app')!

const iconPaths: Record<string, string> = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  down: '<path d="m7 10 5 5 5-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  inbox: '<path d="M4 4h16v16H4z"/><path d="M4 13h4l2 3h4l2-3h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
}

const icon = (name: string, className = '') =>
  `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] ?? iconPaths.arrow}</svg>`

const brand = `<a class="brand" href="/" data-route aria-label="Osedev home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>ose<span class="brand-light">dev</span></span></a>`
const arrowLink = (label: string, href: string, className = '') => `<a class="text-link ${className}" href="${href}">${label}${icon('arrow')}</a>`

const projects = [
  { slug: 'northstar', name: 'Northstar Health', kind: 'Digital health platform', services: 'Product strategy · UX/UI · Engineering', image: 'photo-1576091160399-112ba8d25d1d', tone: 'northstar', number: '01' },
  { slug: 'form-and-field', name: 'Form & Field', kind: 'Commerce, considered', services: 'Brand direction · E-commerce · Content', image: 'photo-1490481651871-ab68de25d43d', tone: 'formfield', number: '02' },
  { slug: 'monograph', name: 'Monograph', kind: 'A better way to see data', services: 'Product design · Design systems', image: 'photo-1460925895917-afdab827c52f', tone: 'monograph', number: '03' },
]

function publicHeader(light = false) {
  return `<header class="site-header ${light ? 'site-header-light' : ''}"><div class="site-header-inner">${brand}<button class="icon-button menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav">${icon('menu')}</button><nav class="primary-nav" id="primary-nav" aria-label="Main navigation"><a href="/" data-route>Home</a><a href="/work" data-route>Work</a><a href="/services" data-route>Services</a><a href="/studio" data-route>Studio</a><a href="/process" data-route>Process</a><a class="nav-contact" href="/contact" data-route>Let’s talk ${icon('arrow')}</a></nav></div></header>`
}

function projectCard(project: typeof projects[number], featured = false) {
  return `<a class="project-card ${project.tone} ${featured ? 'project-featured' : ''} reveal" href="/work/${project.slug}" data-route><div class="project-image"><img src="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1500&q=82" alt="${project.kind} visual" loading="lazy"><span class="project-image-shade"></span><span class="project-open">${icon('arrow')}</span><span class="project-image-label">OSEDEV <span>— SELECTED WORK</span></span></div><div class="project-meta"><div><span class="eyebrow">${project.number} / ${project.kind}</span><h3>${project.name}</h3><p>${project.services}</p></div><span class="project-index">${icon('arrow')}</span></div></a>`
}

function homePage() {
  return `${publicHeader()}<main>
    <section class="hero" aria-labelledby="hero-title"><div class="hero-grain"></div><div class="hero-inner page-wrap"><div class="hero-copy"><p class="eyebrow hero-eyebrow"><span class="status-dot"></span> Independent digital studio <span class="eyebrow-divider">·</span> Working everywhere</p><h1 id="hero-title">Make your next<br>move <span class="hero-italic">matter.</span></h1><p class="hero-description">We help ambitious teams turn complex ideas into clear, compelling digital products and experiences.</p><div class="hero-actions"><a class="button button-cyan" href="/#contact">Start a project ${icon('arrow')}</a><a class="button button-outline" href="/#work">Explore our work ${icon('right')}</a></div><div class="hero-footnote"><span>Strategy</span><i></i><span>Design</span><i></i><span>Technology</span></div></div><div class="hero-art" aria-label="A preview of the Northstar Health digital product"><div class="art-grid" aria-hidden="true"></div><div class="orbit orbit-one" aria-hidden="true"></div><div class="orbit orbit-two" aria-hidden="true"></div><div class="orbit-core"><span>O</span></div><div class="art-card art-card-main"><div class="art-card-top"><span class="art-brand"><span class="art-brand-dot"></span> northstar</span><span class="art-menu">•••</span></div><div class="art-card-image"><img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=680&q=80" alt="Care professional in a bright clinical space" fetchpriority="high"><span class="art-image-chip">Care, connected.</span></div><div class="art-card-bottom"><div><span class="art-label">YOUR HEALTH, IN FOCUS</span><strong>A clearer path<br>to feeling better.</strong></div><span class="art-next">${icon('right')}</span></div></div><div class="floating-note note-top"><span class="note-icon">${icon('check')}</span><span><small>Product experience</small><strong>Thoughtfully connected</strong></span></div><div class="floating-note note-bottom"><span class="note-spark">✳</span><span><small>From first thought</small><strong>to launch day</strong></span></div><span class="art-coordinate">51°30'26.4"N &nbsp; 00°07'39.0"W</span><span class="art-index">01 — 03</span></div></div><div class="hero-bottom page-wrap"><span>Digital built around people.</span><span class="hero-scroll">Scroll to explore <span class="scroll-line"></span></span></div></section>
    <section class="intro-strip"><div class="page-wrap intro-strip-inner"><p>Good work is never just<br><span>good-looking.</span></p><div class="intro-strip-copy"><span class="eyebrow">THE OSEDEV APPROACH</span><p>It makes the complicated feel simple, the useful feel intuitive, and the right idea feel inevitable.</p></div><span class="intro-mark" aria-hidden="true">O<span>.</span></span></div></section>
    <section class="work-section section-pad" id="work"><div class="page-wrap"><div class="section-heading reveal"><div><p class="eyebrow"><span class="section-number">01</span> Selected work</p><h2>Built with intent.<br><span>Made to move.</span></h2></div><div class="section-aside"><p>Thoughtful digital experiences for people building what comes next.</p>${arrowLink('All selected work', '/#work')}</div></div><div class="project-layout">${projectCard(projects[0], true)}<div class="project-stack">${projectCard(projects[1])}${projectCard(projects[2])}</div></div><div class="work-footnote"><span>Independent thinking. Collaborative making.</span><span>Projects shown are concept explorations.</span></div></div></section>
    <section class="services-section section-pad" id="services"><div class="page-wrap services-layout"><div class="services-intro reveal"><p class="eyebrow"><span class="section-number">02</span> What we do</p><h2>From first<br>question to<br><span>final detail.</span></h2><p class="services-description">One small, senior team. The right mix of strategic thinking, design craft and technical depth for the problem at hand.</p><a class="button button-dark" href="/#contact">Find your fit ${icon('arrow')}</a></div><div class="service-list"><details class="service-item" open><summary><span class="service-number">01</span><span class="service-title">Digital products</span><span class="service-short">Make useful things easier.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>We turn complex workflows and promising ideas into products people understand, trust and return to.</p><div class="tag-row"><span>Product strategy</span><span>UX research</span><span>Interface design</span><span>Prototyping</span></div></div></details><details class="service-item"><summary><span class="service-number">02</span><span class="service-title">Web experiences</span><span class="service-short">Give your next chapter a home.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>Distinctive, accessible websites that bring your proposition into focus and make the next step feel natural.</p><div class="tag-row"><span>Digital direction</span><span>Web design</span><span>Development</span><span>Content systems</span></div></div></details><details class="service-item"><summary><span class="service-number">03</span><span class="service-title">Creative technology</span><span class="service-short">Make technology feel human.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>We connect design and engineering to create useful tools, new capabilities and better ways of working.</p><div class="tag-row"><span>Technical discovery</span><span>Design systems</span><span>Integrations</span><span>AI experiences</span></div></div></details><details class="service-item"><summary><span class="service-number">04</span><span class="service-title">Ongoing partnership</span><span class="service-short">Keep making it better.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>A steady creative and technical partner for the work that starts after launch.</p><div class="tag-row"><span>Product support</span><span>Iteration</span><span>Team extension</span></div></div></details></div></div></section>
    <section class="studio-section section-pad" id="studio"><div class="page-wrap studio-layout"><div class="studio-photo reveal"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82" alt="Light-filled collaborative studio workspace" loading="lazy"><span class="photo-caption">A little room to think.</span><span class="photo-corner">O / 2026</span></div><div class="studio-copy reveal"><p class="eyebrow"><span class="section-number">03</span> Small on purpose</p><h2>Senior minds.<br><span>Close collaboration.</span></h2><p>Osedev is an independent digital studio for people with something worth building. You work directly with the people shaping and making it, from the first conversation through to launch.</p><p>No layers. No theatre. Just a clear point of view, considered craft and a team that cares what happens next.</p><div class="studio-values"><div><strong>01</strong><span>Curiosity before convention</span></div><div><strong>02</strong><span>Clarity in every detail</span></div><div><strong>03</strong><span>Better, together</span></div></div>${arrowLink('A little about our process', '/#process')}</div></div></section>
    <section class="process-section section-pad" id="process"><div class="page-wrap"><div class="process-heading reveal"><div><p class="eyebrow"><span class="section-number">04</span> A considered process</p><h2>Clear steps.<br><span>Room to explore.</span></h2></div><p>Structure gives good ideas somewhere to go. We keep the work open, the decisions clear and the momentum real.</p></div><div class="process-grid"><article class="process-step reveal"><span class="process-index">01 / LISTEN</span><span class="process-symbol">${icon('message')}</span><h3>Get to the heart of it.</h3><p>We align on the opportunity, the people it serves and what progress should look like.</p></article><article class="process-step reveal"><span class="process-index">02 / SHAPE</span><span class="process-symbol">${icon('layers')}</span><h3>Find the right direction.</h3><p>We make the hard decisions visible, test the important assumptions and define a way forward.</p></article><article class="process-step reveal"><span class="process-index">03 / MAKE</span><span class="process-symbol">${icon('grid')}</span><h3>Bring the idea to life.</h3><p>Design and engineering work together, with useful feedback built into the making.</p></article><article class="process-step reveal"><span class="process-index">04 / GROW</span><span class="process-symbol">${icon('right')}</span><h3>Make launch a beginning.</h3><p>We help your team feel ready, then stay close as the product meets the real world.</p></article></div></div></section>
    <section class="contact-section" id="contact"><div class="page-wrap contact-layout"><div class="contact-copy reveal"><p class="eyebrow"><span class="section-number">05</span> Have a good one?</p><h2>Let's make<br><span>it real.</span></h2><p>Tell us what you’re thinking, what’s changing, or where you’re stuck. We’ll start there.</p><a class="contact-email" href="mailto:hello@osedev.studio">hello@osedev.studio ${icon('arrow')}</a></div><form class="contact-form reveal" id="contact-form"><div class="form-heading"><span>01 — A few details</span><span>Usually a 2 min read</span></div><label for="contact-name">Your name</label><input id="contact-name" name="name" autocomplete="name" placeholder="How should we address you?" required><label for="contact-email">Work email</label><input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required><label for="contact-message">What are you working on?</label><textarea id="contact-message" name="message" rows="3" placeholder="A little context goes a long way…" required></textarea><button class="button button-cyan form-submit" type="submit">Send a note ${icon('arrow')}</button><p class="form-note">No pitch deck needed. Just a first conversation.</p></form></div></section>
  </main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

function innerPageHero(number: string, label: string, title: string, highlight: string, description: string) {
  return `<section class="inner-page-hero"><div class="page-wrap"><p class="eyebrow"><span class="section-number">${number}</span> ${label}</p><h1>${title}<br><span>${highlight}</span></h1><p>${description}</p></div>`
}

function workPage() {
  return `${publicHeader(true)}<main class="inner-page"><div class="inner-page-hero-rule"></div>${innerPageHero('01', 'Selected work', 'Ideas made', 'useful.', 'A closer look at the products, platforms and digital experiences we have shaped with ambitious teams.')}</section><section class="work-section section-pad inner-page-section"><div class="page-wrap"><div class="project-layout">${projectCard(projects[0], true)}<div class="project-stack">${projectCard(projects[1])}${projectCard(projects[2])}</div></div><div class="work-footnote"><span>Independent thinking. Collaborative making.</span><span>Projects shown are concept explorations.</span></div></div></section><section class="inner-page-cta"><div class="page-wrap"><span class="eyebrow">Have a good one?</span><h2>Make something<br><span>matter.</span></h2><a class="button button-cyan" href="/contact" data-route>Start a project ${icon('arrow')}</a></div></section></main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

function servicesPage() {
  return `${publicHeader(true)}<main class="inner-page"><div class="inner-page-hero-rule"></div>${innerPageHero('02', 'What we do', 'The right mix', 'for the moment.', 'Strategy, design and technology brought together around the problem you actually need to solve.')}</section><section class="services-section section-pad inner-page-section"><div class="page-wrap services-layout"><div class="services-intro"><p class="eyebrow"><span class="section-number">01</span> Capabilities</p><h2>From first<br>question to<br><span>final detail.</span></h2><p class="services-description">One small, senior team. The right mix of strategic thinking, design craft and technical depth for the work at hand.</p><a class="button button-dark" href="/contact" data-route>Find your fit ${icon('arrow')}</a></div><div class="service-list"><details class="service-item" open><summary><span class="service-number">01</span><span class="service-title">Digital products</span><span class="service-short">Make useful things easier.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>We turn complex workflows and promising ideas into products people understand, trust and return to.</p><div class="tag-row"><span>Product strategy</span><span>UX research</span><span>Interface design</span><span>Prototyping</span></div></div></details><details class="service-item"><summary><span class="service-number">02</span><span class="service-title">Web experiences</span><span class="service-short">Give your next chapter a home.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>Distinctive, accessible websites that bring your proposition into focus and make the next step feel natural.</p><div class="tag-row"><span>Digital direction</span><span>Web design</span><span>Development</span><span>Content systems</span></div></div></details><details class="service-item"><summary><span class="service-number">03</span><span class="service-title">Creative technology</span><span class="service-short">Make technology feel human.</span>${icon('plus', 'service-icon')}</summary><div class="service-detail"><p>We connect design and engineering to create useful tools, new capabilities and better ways of working.</p><div class="tag-row"><span>Technical discovery</span><span>Prototyping</span><span>Front-end</span><span>Systems thinking</span></div></div></details></div></div></section><section class="inner-page-cta"><div class="page-wrap"><span class="eyebrow">A considered beginning</span><h2>Bring us the<br><span>hard part.</span></h2><a class="button button-cyan" href="/contact" data-route>Tell us more ${icon('arrow')}</a></div></section></main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

function studioPage() {
  return `${publicHeader(true)}<main class="inner-page"><div class="inner-page-hero-rule"></div>${innerPageHero('03', 'Small on purpose', 'Senior minds.', 'close collaboration.', 'Osedev is an independent digital studio for people with something worth building.')}</section><section class="studio-section section-pad inner-page-section"><div class="page-wrap studio-layout"><div class="studio-photo"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=82" alt="Light-filled collaborative studio workspace"><span class="photo-caption">A little room to think.</span><span class="photo-corner">O / 2026</span></div><div class="studio-copy"><p class="eyebrow"><span class="section-number">01</span> How we work</p><h2>Close to the work.<br><span>Closer to you.</span></h2><p>You work directly with the people shaping and making your project, from the first conversation through to launch. No layers. No theatre. Just a clear point of view and a team that cares what happens next.</p><div class="studio-values"><div><strong>01</strong><span>Curiosity before convention</span></div><div><strong>02</strong><span>Clarity in every detail</span></div><div><strong>03</strong><span>Better, together</span></div></div><a class="text-link" href="/process" data-route>See how we work ${icon('arrow')}</a></div></div></section><section class="studio-statement"><div class="page-wrap"><p>Good work feels<br><span>inevitable in hindsight.</span></p><span class="eyebrow">Independent by nature / Intentional by design</span></div></section></main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

function processPage() {
  return `${publicHeader(true)}<main class="inner-page"><div class="inner-page-hero-rule"></div>${innerPageHero('04', 'A considered process', 'Clear steps.', 'room to explore.', 'Structure gives good ideas somewhere to go. We keep the work open, the decisions clear and the momentum real.')}</section><section class="process-section section-pad inner-page-section"><div class="page-wrap"><div class="process-grid"><article class="process-step"><span class="process-index">01 / LISTEN</span><span class="process-symbol">${icon('message')}</span><h3>Get to the heart of it.</h3><p>We align on the opportunity, the people it serves and what progress should look like.</p></article><article class="process-step"><span class="process-index">02 / SHAPE</span><span class="process-symbol">${icon('layers')}</span><h3>Find the right direction.</h3><p>We make the hard decisions visible, test assumptions and define a way forward.</p></article><article class="process-step"><span class="process-index">03 / MAKE</span><span class="process-symbol">${icon('grid')}</span><h3>Bring the idea to life.</h3><p>Design and engineering work together, with useful feedback built into the making.</p></article><article class="process-step"><span class="process-index">04 / GROW</span><span class="process-symbol">${icon('right')}</span><h3>Make launch a beginning.</h3><p>We help your team feel ready, then stay close as the product meets the real world.</p></article></div></div></section><section class="inner-page-cta"><div class="page-wrap"><span class="eyebrow">Ready when you are</span><h2>Let's make<br><span>it real.</span></h2><a class="button button-cyan" href="/contact" data-route>Start a conversation ${icon('arrow')}</a></div></section></main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

function contactPage() {
  return `${publicHeader(true)}<main class="inner-page contact-page"><div class="inner-page-hero-rule"></div>${innerPageHero('05', 'Have a good one?', "Let's make", 'it real.', 'Tell us what you are thinking, what is changing, or where you are stuck. We will start there.')}</section><section class="contact-section contact-page-section"><div class="page-wrap contact-layout"><div class="contact-copy"><p class="eyebrow"><span class="section-number">START HERE</span> A good first conversation</p><h2>Bring the<br><span>context.</span></h2><p>No pitch deck needed. A little context goes a long way.</p><a class="contact-email" href="mailto:hello@osedev.studio">hello@osedev.studio ${icon('arrow')}</a></div><form class="contact-form" id="contact-form"><div class="form-heading"><span>01 — A few details</span><span>Usually a 2 min read</span></div><label for="contact-name">Your name</label><input id="contact-name" name="name" autocomplete="name" placeholder="How should we address you?" required><label for="contact-email">Work email</label><input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required><label for="contact-message">What are you working on?</label><textarea id="contact-message" name="message" rows="4" placeholder="A little context goes a long way..." required></textarea><button class="button button-cyan form-submit" type="submit">Send a note ${icon('arrow')}</button><p class="form-note">We will get back to you within a couple of working days.</p></form></div></section></main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

function footer() {
  return `<footer class="site-footer"><div class="page-wrap footer-main"><div class="footer-brand">${brand}<p>Independent digital studio.<br>Good things, thoughtfully made.</p></div><div class="footer-col"><span class="eyebrow">Explore</span><a href="/work" data-route>Work</a><a href="/services" data-route>Services</a><a href="/studio" data-route>Studio</a><a href="/process" data-route>Process</a></div><div class="footer-col"><span class="eyebrow">Get in touch</span><a href="mailto:hello@osedev.studio">hello@osedev.studio</a><span>Working everywhere</span><a href="/contact" data-route>Start a project ${icon('arrow')}</a><a href="/portal" data-route>Client portal ${icon('arrow')}</a></div><div class="footer-note"><span>Thoughtful by design.</span><span>Built for what’s next.</span><span class="footer-orbit">O<span>.</span></span></div></div><div class="page-wrap footer-bottom"><span>© 2026 Osedev Studio</span><span>Independent by nature. Intentional by design.</span><a href="/admin" data-route>Studio access ${icon('arrow')}</a></div></footer>`
}

const caseStudies: Record<string, { title: string; descriptor: string; image: string; challenge: string; approach: string; solution: string; result: string; tags: string[] }> = {
  northstar: { title: 'Northstar Health', descriptor: 'Making better care feel closer.', image: 'photo-1576091160399-112ba8d25d1d', challenge: 'People were navigating a fragmented care journey: separate providers, disconnected information and too many decisions made alone.', approach: 'We brought patients and care teams into the same conversation, mapping the moments that mattered and designing around real needs instead of organisational boundaries.', solution: 'A connected digital health experience that makes the next step clear, keeps personal care information in one considered place and gives people more confidence between appointments.', result: 'A calmer, more coherent path through care. Designed to give people the clarity to take the next step, and teams the context to make it count.', tags: ['Product strategy', 'UX research', 'Product design', 'Web application'] },
  'form-and-field': { title: 'Form & Field', descriptor: 'A more considered way to shop.', image: 'photo-1490481651871-ab68de25d43d', challenge: 'A thoughtful independent label had a product story that got lost in a crowded, conversion-first shopping experience.', approach: 'We started with the materials, makers and rituals behind each collection, then shaped a digital storefront that gave those details their space.', solution: 'A content-led commerce experience balancing quiet editorial layouts with useful product discovery and a straightforward path to purchase.', result: 'A distinctive digital home for a distinctive point of view, ready to grow alongside the next collection.', tags: ['Digital direction', 'E-commerce', 'Content design', 'Front-end'] },
  monograph: { title: 'Monograph', descriptor: 'A clearer view of what matters.', image: 'photo-1460925895917-afdab827c52f', challenge: 'Growing teams had data in abundance but struggled to find a shared, useful picture of progress.', approach: 'We worked through the reporting workflows with the people relying on them, reducing noise before deciding what deserved the visual emphasis.', solution: 'A focused analytics workspace that brings key signals forward while keeping the detail one intentional step away.', result: 'A more legible, adaptable foundation for teams to make decisions with context, not just more charts.', tags: ['Product discovery', 'UX/UI design', 'Design system', 'Data visualisation'] },
}

function caseStudyPage(slug: string) {
  const project = caseStudies[slug] ?? caseStudies.northstar
  return `${publicHeader()}<main class="case-page"><section class="case-hero"><div class="page-wrap"><a href="/#work" class="back-link">${icon('right')} Back to selected work</a><p class="eyebrow"><span class="section-number">CASE STUDY</span> Digital product / 2026</p><h1>${project.title}<br><span>${project.descriptor}</span></h1><div class="case-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div><div class="case-cover"><img src="https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1900&q=85" alt="${project.title} project visual" fetchpriority="high"><span class="case-cover-label">OSEDEV / SELECTED WORK</span></div></div></section><section class="case-overview page-wrap"><div><span class="eyebrow">The brief</span><h2>A better experience<br>starts with a better question.</h2></div><p>${project.challenge}</p></section><section class="case-story"><div class="page-wrap case-story-grid"><article><span class="eyebrow">01 / Approach</span><h2>Understand before<br>we make.</h2><p>${project.approach}</p></article><article><span class="eyebrow">02 / Solution</span><h2>Useful, considered,<br>ready to grow.</h2><p>${project.solution}</p></article></div></section><section class="case-outcome page-wrap"><span class="eyebrow">03 / Outcome</span><h2>${project.result}</h2><div class="case-outcome-meta"><span>Strategy &nbsp;·&nbsp; Design &nbsp;·&nbsp; Technology</span><a class="button button-dark" href="/#contact">Have a similar challenge? ${icon('arrow')}</a></div></section><section class="case-next"><div class="page-wrap"><span class="eyebrow">The next good thing</span><h2>What are you<br><span>working on?</span></h2><a class="button button-cyan" href="/#contact">Start a conversation ${icon('arrow')}</a></div></section></main>${footer()}<div class="toast" role="status" aria-live="polite"></div>`
}

const demoProjects = [
  { name: 'Northstar Health', type: 'Digital product', status: 'In progress', tone: 'progress', date: 'Oct 24, 2026', initials: 'NH', color: 'mint' },
  { name: 'Form & Field', type: 'E-commerce', status: 'In review', tone: 'review', date: 'Oct 22, 2026', initials: 'FF', color: 'peach' },
  { name: 'Monograph', type: 'Product design', status: 'Planning', tone: 'planning', date: 'Oct 21, 2026', initials: 'M', color: 'lavender' },
  { name: 'Common Ground', type: 'Brand & web', status: 'Complete', tone: 'complete', date: 'Oct 18, 2026', initials: 'CG', color: 'blue' },
]

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

let adminProfilePhotoUrl: string | undefined

async function createProfilePhoto(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 10 MB.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('This image could not be processed.')
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.82)
}

function initialsFromName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AC'
}

function adminProfileDialog() {
  const profile = getAdminProfile()
  const photoPreview = adminProfilePhotoUrl
    ? `<img src="${escapeHtml(adminProfilePhotoUrl)}" alt="">`
    : escapeHtml(initialsFromName(profile.name))
  return `<dialog class="profile-dialog" id="admin-profile-dialog"><form method="dialog" id="admin-profile-form"><div class="dialog-top"><div><span class="eyebrow">STUDIO / PROFILE</span><h2>Your profile</h2></div><button class="icon-button" type="button" data-close-profile-dialog aria-label="Close profile dialog">${icon('close')}</button></div><div class="profile-dialog-grid"><label class="profile-photo-field">Profile picture<span class="profile-photo-picker"><span class="profile-photo-preview" id="profile-photo-preview">${photoPreview}</span><span class="profile-photo-input-wrap"><input id="profile-photo-input" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG, or WebP. Images are resized before saving.</small><button class="profile-photo-remove" id="remove-profile-photo" type="button" ${adminProfilePhotoUrl ? '' : 'hidden'}>Remove photo</button></span></span></label><label>Full name<input name="name" value="${escapeHtml(profile.name)}" maxlength="80" required></label><label>Role<input name="role" value="${escapeHtml(profile.role)}" maxlength="60" required></label><label class="profile-field-span">Email<input name="email" type="email" value="${escapeHtml(profile.email)}" required></label></div><div class="profile-dialog-actions"><button class="button button-outline" type="button" data-close-profile-dialog>Cancel</button><button class="button button-admin" type="submit">Save profile</button></div></form></dialog>`
}

function adminPage(view = 'Overview') {
  const nav = [['Overview', 'grid'], ['Projects', 'layers'], ['Enquiries', 'inbox'], ['Clients', 'users']]
  const tableRows = demoProjects.map((project) => `<tr data-project-row data-status="${project.status}"><td><span class="table-project"><span class="avatar ${project.color}">${project.initials}</span><span><strong>${project.name}</strong><small>${project.type}</small></span></span></td><td><span class="status-pill ${project.tone}"><i></i>${project.status}</span></td><td>${project.date}</td><td><button class="table-more" aria-label="More options for ${project.name}">···</button></td></tr>`).join('')
  const content = view === 'Projects' ? `<div class="admin-page-title"><div><span class="eyebrow">WORKSPACE / PROJECTS</span><h1>Projects</h1><p>Keep the work moving, one clear next step at a time.</p></div><button class="button button-admin" data-open-dialog>${icon('plus')} New project</button></div><section class="admin-panel projects-panel"><div class="panel-toolbar"><div class="search-field">${icon('search')}<input id="project-search" type="search" placeholder="Search projects" aria-label="Search projects"></div><select id="status-filter" aria-label="Filter by status"><option value="all">All statuses</option><option>In progress</option><option>In review</option><option>Planning</option><option>Complete</option></select><button class="filter-button">${icon('down')} Filter</button></div><div class="table-scroll"><table><thead><tr><th>Project</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>${tableRows}</tbody></table></div></section>` : view === 'Enquiries' ? `<div class="admin-page-title"><div><span class="eyebrow">WORKSPACE / ENQUIRIES</span><h1>Enquiries</h1><p>A few promising first conversations.</p></div></div><section class="admin-panel enquiry-list"><article><span class="avatar mint">AM</span><div><strong>Alex Morgan <span class="status-pill review"><i></i>New</span></strong><p>Product design for a patient-first care platform</p><small>hello@northstar.health · 2 hours ago</small></div><button class="table-more" aria-label="Open enquiry">${icon('arrow')}</button></article><article><span class="avatar peach">SK</span><div><strong>Sam Kim <span class="status-pill planning"><i></i>Replied</span></strong><p>A new digital home for an independent label</p><small>sam@formandfield.co · Yesterday</small></div><button class="table-more" aria-label="Open enquiry">${icon('arrow')}</button></article><article><span class="avatar blue">JR</span><div><strong>Jamie Reed <span class="status-pill complete"><i></i>Meeting booked</span></strong><p>Exploring a clearer analytics experience</p><small>jamie@monograph.app · Oct 20</small></div><button class="table-more" aria-label="Open enquiry">${icon('arrow')}</button></article></section>` : view === 'Clients' ? `<div class="admin-page-title"><div><span class="eyebrow">WORKSPACE / CLIENTS</span><h1>Clients</h1><p>Good work starts with good relationships.</p></div></div><section class="admin-panel client-list"><article><span class="avatar mint">NH</span><div><strong>Northstar Health</strong><small>2 active projects · Joined Sep 2026</small></div><span class="status-pill progress"><i></i>Active</span></article><article><span class="avatar peach">FF</span><div><strong>Form & Field</strong><small>1 active project · Joined Aug 2026</small></div><span class="status-pill progress"><i></i>Active</span></article><article><span class="avatar lavender">M</span><div><strong>Monograph</strong><small>1 active project · Joined Aug 2026</small></div><span class="status-pill planning"><i></i>Onboarding</span></article></section>` : `<div class="admin-page-title"><div><span class="eyebrow">WEDNESDAY, OCTOBER 28, 2026</span><h1>Good morning, Alex <span class="wave">✳</span></h1><p>Here’s what’s moving across the studio.</p></div><button class="button button-admin" data-open-dialog>${icon('plus')} New project</button></div><section class="metrics-grid"><article class="metric-card"><span>Active projects</span><strong>04</strong><small><i class="metric-dot"></i> 2 in progress this week</small></article><article class="metric-card"><span>Open enquiries</span><strong>03</strong><small><i class="metric-dot cyan"></i> 1 needs a first reply</small></article><article class="metric-card"><span>Hours this month</span><strong>128<span>h</span></strong><small>Across 6 active engagements</small></article><article class="metric-card metric-note"><span>Studio pulse</span><strong>Good work<br>is happening.</strong><small>Last updated just now</small></article></section><div class="dashboard-grid"><section class="admin-panel projects-panel"><div class="panel-heading"><div><span class="eyebrow">STUDIO / OVERVIEW</span><h2>Recent projects</h2></div><button class="quiet-button" data-admin-view="Projects">View all ${icon('right')}</button></div><div class="panel-toolbar compact-toolbar"><div class="search-field">${icon('search')}<input id="project-search" type="search" placeholder="Search projects" aria-label="Search projects"></div><select id="status-filter" aria-label="Filter by status"><option value="all">All statuses</option><option>In progress</option><option>In review</option><option>Planning</option><option>Complete</option></select></div><div class="table-scroll"><table><thead><tr><th>Project</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>${tableRows}</tbody></table></div><div class="table-foot">Showing 4 of 4 projects <span>Updated moments ago</span></div></section><aside class="admin-side-stack"><section class="admin-panel activity-panel"><div class="panel-heading"><div><span class="eyebrow">HAPPENING NOW</span><h2>Studio activity</h2></div>${icon('clock', 'heading-icon')}</div><div class="activity-list"><article><span class="activity-marker activity-cyan"></span><div><p><strong>Design review</strong> shared with Northstar</p><small>12 minutes ago</small></div></article><article><span class="activity-marker activity-coral"></span><div><p><strong>New enquiry</strong> from Jamie Reed</p><small>2 hours ago</small></div></article><article><span class="activity-marker activity-blue"></span><div><p><strong>Project files</strong> added to Form & Field</p><small>Yesterday, 4:32 pm</small></div></article><article><span class="activity-marker activity-green"></span><div><p><strong>Milestone complete</strong> — Monograph discovery</p><small>Yesterday, 11:08 am</small></div></article></div><button class="quiet-button activity-link">All activity ${icon('right')}</button></section><section class="admin-panel week-panel"><div class="panel-heading"><div><span class="eyebrow">THIS WEEK</span><h2>Studio rhythm</h2></div>${icon('calendar', 'heading-icon')}</div><div class="week-bars"><div style="--bar:48%"><span></span><small>M</small></div><div style="--bar:76%"><span></span><small>T</small></div><div style="--bar:62%"><span></span><small>W</small></div><div style="--bar:88%"><span></span><small>T</small></div><div style="--bar:34%"><span></span><small>F</small></div></div><p>Steady progress across the board.</p></section></aside></div>`
  const profile = getAdminProfile()
  const initials = initialsFromName(profile.name)
  return `<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-brand-row">${brand}<span class="studio-label">STUDIO</span></div><div class="workspace-switch"><span class="workspace-mark">O</span><span><strong>Osedev Studio</strong><small>Independent workspace</small></span>${icon('down')}</div><nav class="admin-nav" aria-label="Studio navigation"><span class="nav-caption">WORKSPACE</span>${nav.map(([label, iconName]) => `<button class="admin-nav-item ${view === label ? 'active' : ''}" data-admin-view="${label}">${icon(iconName)}<span>${label}</span>${label === 'Enquiries' ? '<i class="nav-count">3</i>' : ''}</button>`).join('')}</nav><div class="sidebar-spacer"></div><a class="portal-shortcut" href="/portal" data-route>${icon('users')} Client portal ${icon('arrow')}</a><div class="admin-profile"><span class="profile-avatar">${escapeHtml(initials)}</span><span><strong>${escapeHtml(profile.name)}</strong><small>${escapeHtml(profile.role)}</small></span><button type="button" aria-label="Edit profile" data-edit-profile>···</button></div></aside><main class="admin-main"><header class="admin-topbar"><div class="admin-breadcrumb"><span>Osedev Studio</span>${icon('right')}<strong>${view}</strong></div><div class="admin-top-actions"><span class="admin-date">Wednesday, Oct 28</span><button class="icon-button admin-notification" aria-label="Notifications">${icon('inbox')}<i></i></button><span class="profile-avatar small-profile">${escapeHtml(initials)}</span></div></header><div class="admin-content">${content}<footer class="admin-footer"><span>OSEDEV STUDIO / INTERNAL</span><a href="/" data-route>Back to website ${icon('arrow')}</a></footer></div></main>${adminProfileDialog()}<dialog class="new-project-dialog" id="new-project-dialog"><form method="dialog" id="new-project-form"><div class="dialog-top"><div><span class="eyebrow">WORKSPACE / NEW</span><h2>Create a project</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">${icon('close')}</button></div><label for="new-project-name">Project name</label><input id="new-project-name" name="name" placeholder="e.g. Aster Studio" required><label for="new-project-type">Project type</label><select id="new-project-type" name="type"><option>Digital product</option><option>Web experience</option><option>Creative technology</option></select><div class="dialog-actions"><button class="quiet-button" value="cancel">Cancel</button><button class="button button-admin" id="create-project-submit" value="default">Create project ${icon('arrow')}</button></div></form></dialog><div class="toast" role="status" aria-live="polite"></div></div>`
}

function portalPage() {
  return `<div class="portal-shell"><header class="portal-header"><div>${brand}<span class="portal-divider"></span><span class="portal-project-label">Client space</span></div><div class="portal-header-actions"><span class="portal-help">Questions? <a href="mailto:hello@osedev.studio">Talk to your team</a></span><button class="profile-avatar portal-avatar" aria-label="Account menu">JM</button></div></header><main class="portal-main"><div class="portal-welcome"><div><span class="eyebrow"><span class="status-dot"></span> YOUR PROJECT SPACE</span><h1>A clearer path<br><span>to better care.</span></h1><p>Northstar Health &nbsp;·&nbsp; Digital product &nbsp;·&nbsp; Project lead: Alex Carter</p></div><span class="portal-updated">Last updated today, 9:42 am</span></div><section class="portal-status-card"><div class="portal-status-top"><div><span class="eyebrow">PROJECT STATUS</span><h2>Design and direction</h2><p>We’re shaping the product experience and getting ready to share the first complete set of screens.</p></div><span class="status-pill progress"><i></i> In progress</span></div><div class="progress-track" role="progressbar" aria-label="Project progress" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100"><span></span></div><div class="progress-meta"><span>58% complete</span><span>Target: Nov 20, 2026</span></div><div class="milestone-row"><div class="milestone done"><span>${icon('check')}</span><div><small>COMPLETE</small><strong>Discovery</strong><time>Oct 02</time></div></div><div class="milestone done"><span>${icon('check')}</span><div><small>COMPLETE</small><strong>Product direction</strong><time>Oct 16</time></div></div><div class="milestone current"><span>03</span><div><small>IN PROGRESS</small><strong>Design & prototype</strong><time>Due Nov 06</time></div></div><div class="milestone upcoming"><span>04</span><div><small>UP NEXT</small><strong>Build & launch</strong><time>From Nov 09</time></div></div></div></section><div class="portal-columns"><section class="portal-card attention-card"><div class="portal-card-heading"><div><span class="eyebrow">YOUR NEXT STEP</span><h2>One thing needs you.</h2></div><span class="attention-icon">${icon('message')}</span></div><div class="attention-item"><span class="attention-mark"></span><div><strong>Review the care journey</strong><p>Share your thoughts on the first round of patient flows by Friday, Oct 30.</p><a href="#messages" data-portal-tab="Messages">Open conversation ${icon('right')}</a></div><span class="status-pill review"><i></i> Your input</span></div></section><section class="portal-card recent-card"><div class="portal-card-heading"><div><span class="eyebrow">RECENT ACTIVITY</span><h2>Moving things forward.</h2></div>${icon('clock', 'heading-icon')}</div><div class="portal-timeline"><article><i class="timeline-dot cyan"></i><div><strong>Care journey shared for review</strong><small>Today, 9:42 am · Alex Carter</small></div></article><article><i class="timeline-dot blue"></i><div><strong>Discovery summary approved</strong><small>Yesterday, 2:15 pm · You</small></div></article><article><i class="timeline-dot green"></i><div><strong>Project kickoff complete</strong><small>Oct 02 · Osedev Studio</small></div></article></div></section></div><section class="portal-card files-card"><div class="portal-card-heading"><div><span class="eyebrow">SHARED FILES</span><h2>Everything in its place.</h2></div><button class="quiet-button" data-portal-tab="Files">View all ${icon('right')}</button></div><div class="portal-files"><article><span class="file-icon pdf">PDF</span><div><strong>Northstar — Discovery summary</strong><small>PDF · 2.4 MB · Oct 16</small></div><button class="icon-button file-download" aria-label="Download discovery summary">${icon('download')}</button></article><article><span class="file-icon figma">FIG</span><div><strong>Care journey — Review 01</strong><small>Design file · Updated today</small></div><button class="icon-button file-download" aria-label="Open care journey">${icon('arrow')}</button></article></div></section><nav class="portal-tabs" aria-label="Project sections"><button class="active" data-portal-tab="Overview">Overview</button><button data-portal-tab="Messages">Messages <span class="tab-count">1</span></button><button data-portal-tab="Files">Files</button><button data-portal-tab="Support">Support</button></nav><section class="portal-tab-content" id="portal-tab-content" aria-live="polite"></section></main><footer class="portal-footer"><span>${brand}<small>A good thing, made together.</small></span><span>Private project space <i class="secure-dot"></i></span><a href="/" data-route>Osedev Studio ${icon('arrow')}</a></footer><div class="toast" role="status" aria-live="polite"></div></div>`
}

function showToast(message: string) {
  const toast = document.querySelector<HTMLDivElement>('.toast')
  if (!toast) return
  toast.textContent = message
  toast.classList.add('visible')
  window.setTimeout(() => toast.classList.remove('visible'), 3200)
}

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Osedev | Independent Digital Studio',
    description: 'Osedev is an independent digital studio helping ambitious teams turn complex ideas into clear, compelling digital products and experiences.',
  },
  '/work': {
    title: 'Selected Digital Work | Osedev',
    description: 'Explore Osedev case studies in digital product design, e-commerce, UX research, and web development.',
  },
  '/services': {
    title: 'Digital Product, Web and Technology Services | Osedev',
    description: 'Strategy, product design, web experiences, and creative technology for ambitious teams.',
  },
  '/studio': {
    title: 'About the Studio | Osedev',
    description: 'Meet Osedev, an independent digital studio built around senior minds, close collaboration, and thoughtful digital work.',
  },
  '/process': {
    title: 'Our Process | Osedev Digital Studio',
    description: 'A considered process for taking digital ideas from first conversation through strategy, design, development, and launch.',
  },
  '/contact': {
    title: 'Start a Digital Project | Contact Osedev',
    description: 'Tell Osedev about your digital product, website, or creative technology project and start a conversation.',
  },
  '/admin': {
    title: 'Studio Access | Osedev',
    description: 'Secure access to the Osedev Studio workspace.',
  },
  '/portal': {
    title: 'Client Space | Osedev',
    description: 'Secure access to your Osedev project workspace.',
  },
}

function updateSearchMetadata(path: string) {
  let metadata = routeMetadata[path] ?? routeMetadata['/']
  if (path.startsWith('/work/')) {
    const project = caseStudies[path.split('/')[2]]
    if (project) {
      metadata = {
        title: `${project.title} Case Study | Osedev`,
        description: project.challenge,
      }
    }
  }

  document.title = metadata.title
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (description) description.content = metadata.description

  const canonicalUrl = `https://osedev-branding.vercel.app${path === '/' ? '/' : path}`
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (canonical) canonical.href = canonicalUrl

  const socialTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
  if (socialTitle) socialTitle.content = metadata.title
  const socialDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
  if (socialDescription) socialDescription.content = metadata.description
  const socialUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
  if (socialUrl) socialUrl.content = canonicalUrl

  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (robots) robots.content = path === '/admin' || path === '/portal' ? 'noindex,nofollow' : 'index,follow'
}

function render() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  updateSearchMetadata(path)
  app.classList.toggle('auth-pending', path === '/admin' && supabaseConfigured)

  if (path === '/admin') {
    if (!adminSession) {
      app.classList.add('auth-pending')
      app.innerHTML = `<main class="admin-auth-page"><div class="admin-auth-card"><span class="eyebrow">OSEDEV / STUDIO</span><h1>Studio access</h1><p>Checking your permissions…</p></div></main>`
      return
    }
    app.innerHTML = adminPage()
  } else if (path === '/portal') app.innerHTML = portalPage()
  else if (path === '/work') app.innerHTML = workPage()
  else if (path === '/services') app.innerHTML = servicesPage()
  else if (path === '/studio') app.innerHTML = studioPage()
  else if (path === '/process') app.innerHTML = processPage()
  else if (path === '/contact') app.innerHTML = contactPage()
  else if (path.startsWith('/work/')) app.innerHTML = caseStudyPage(path.split('/')[2])
  else app.innerHTML = homePage()
  window.scrollTo({ top: 0, behavior: 'instant' })
  attachInteractions()
  observeReveals()
}

function updateAdminProfileView(profile: AdminProfile, photoUrl?: string) {
  const initials = initialsFromName(profile.name)
  const profileDetails = document.querySelector('.admin-profile')
  const detailValues = profileDetails?.querySelectorAll<HTMLElement>(':scope > span:nth-of-type(2) > *')
  if (detailValues?.[0]) detailValues[0].textContent = profile.name
  if (detailValues?.[1]) detailValues[1].textContent = profile.role

  document.querySelectorAll<HTMLElement>('.admin-shell .profile-avatar').forEach((avatar) => {
    if (!photoUrl) {
      avatar.textContent = initials
      return
    }
    const image = document.createElement('img')
    image.src = photoUrl
    image.alt = ''
    avatar.replaceChildren(image)
  })

  const greetingHeading = document.querySelector<HTMLElement>('.admin-content h1')
  if (greetingHeading?.textContent?.startsWith('Good morning,')) {
    const greetingText = [...greetingHeading.childNodes].find((node) => node.nodeType === Node.TEXT_NODE)
    if (greetingText) greetingText.textContent = `Good morning, ${profile.name} `
  }

  const form = document.querySelector<HTMLFormElement>('#admin-profile-form')
  if (!form) return
  ;(form.elements.namedItem('name') as HTMLInputElement).value = profile.name
  ;(form.elements.namedItem('role') as HTMLInputElement).value = profile.role
  ;(form.elements.namedItem('email') as HTMLInputElement).value = profile.email
  const preview = form.querySelector<HTMLElement>('#profile-photo-preview')
  if (preview) {
    if (photoUrl) {
      const image = document.createElement('img')
      image.src = photoUrl
      image.alt = ''
      preview.replaceChildren(image)
    } else {
      preview.textContent = initials
    }
  }
  const removePhotoButton = form.querySelector<HTMLButtonElement>('#remove-profile-photo')
  if (removePhotoButton) removePhotoButton.hidden = !photoUrl
}

window.addEventListener('admin-authenticated', () => {
  render()
  app.classList.remove('auth-pending')
  void loadAdminProfileFromDatabase()
    .then(({ profile, photoUrl }) => {
      adminProfilePhotoUrl = photoUrl
      if (location.pathname === '/admin' && adminSession) updateAdminProfileView(profile, photoUrl)
    })
    .catch(() => showToast('Could not sync your profile. Check your connection and try again.'))
})

function observeReveals() {
  const items = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)')
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('revealed'))
    return
  }
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        activeObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  items.forEach((item) => observer.observe(item))
}

function attachInteractions() {
  const greetingHeading = document.querySelector<HTMLElement>('.admin-content h1')
  if (greetingHeading?.textContent?.startsWith('Good morning,')) {
    const greetingText = [...greetingHeading.childNodes].find((node) => node.nodeType === Node.TEXT_NODE)
    if (greetingText) greetingText.textContent = `Good morning, ${getAdminProfile().name} `
  }

  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      history.pushState({}, '', link.href)
      render()
    })
  })

  const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
  menuToggle?.addEventListener('click', () => {
    const nav = document.querySelector<HTMLElement>('.primary-nav')
    const open = menuToggle.getAttribute('aria-expanded') !== 'true'
    menuToggle.setAttribute('aria-expanded', String(open))
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
    menuToggle.innerHTML = icon(open ? 'close' : 'menu')
    nav?.classList.toggle('nav-open', open)
  })
  document.querySelectorAll<HTMLAnchorElement>('.primary-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelector('.primary-nav')?.classList.remove('nav-open')
      menuToggle?.setAttribute('aria-expanded', 'false')
      if (menuToggle) menuToggle.innerHTML = icon('menu')
    })
  })

  document.querySelectorAll<HTMLButtonElement>('[data-admin-view]').forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.adminView ?? 'Overview'
      app.innerHTML = adminPage(view)
      attachInteractions()
    })
  })

  const profileDialog = document.querySelector<HTMLDialogElement>('#admin-profile-dialog')
  const savedProfilePhoto = adminProfilePhotoUrl
  document.querySelectorAll<HTMLElement>('.admin-shell .profile-avatar').forEach((avatar) => {
    if (!savedProfilePhoto) return
    const image = document.createElement('img')
    image.src = savedProfilePhoto
    image.alt = ''
    avatar.replaceChildren(image)
  })

  const photoInput = document.querySelector<HTMLInputElement>('#profile-photo-input')
  const photoPreview = document.querySelector<HTMLElement>('#profile-photo-preview')
  const removePhotoButton = document.querySelector<HTMLButtonElement>('#remove-profile-photo')
  let selectedPhoto: string | null | undefined
  photoInput?.addEventListener('change', async () => {
    const file = photoInput.files?.[0]
    if (!file) return
    try {
      selectedPhoto = await createProfilePhoto(file)
      const image = document.createElement('img')
      image.src = selectedPhoto
      image.alt = ''
      photoPreview?.replaceChildren(image)
      if (removePhotoButton) removePhotoButton.hidden = false
    } catch (error) {
      photoInput.value = ''
      showToast(error instanceof Error ? error.message : 'This image could not be processed.')
    }
  })
  removePhotoButton?.addEventListener('click', () => {
    selectedPhoto = null
    if (photoInput) photoInput.value = ''
    removePhotoButton.hidden = true
    const name = document.querySelector<HTMLInputElement>('#admin-profile-form [name="name"]')?.value ?? ''
    if (photoPreview) photoPreview.textContent = initialsFromName(name)
  })

  document.querySelectorAll<HTMLElement>('[data-edit-profile], .small-profile').forEach((profileTrigger) => {
    if (profileTrigger.matches('.small-profile')) {
      profileTrigger.setAttribute('role', 'button')
      profileTrigger.setAttribute('tabindex', '0')
      profileTrigger.setAttribute('aria-label', 'Edit profile')
      profileTrigger.setAttribute('title', 'Edit profile')
    }
    profileTrigger.addEventListener('click', () => profileDialog?.showModal())
    profileTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        profileDialog?.showModal()
      }
    })
  })
  document.querySelectorAll<HTMLButtonElement>('[data-close-profile-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      profileDialog?.close()
    })
  })
  document.querySelector<HTMLFormElement>('#admin-profile-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const currentProfile = getAdminProfile()
    const nextProfile: AdminProfile = {
      ...currentProfile,
      name: String(formData.get('name') ?? '').trim() || currentProfile.name,
      role: String(formData.get('role') ?? '').trim() || currentProfile.role,
      email: String(formData.get('email') ?? '').trim() || currentProfile.email,
    }
    const saveButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (saveButton) saveButton.disabled = true
    void saveAdminProfileToDatabase(nextProfile, selectedPhoto)
      .then(({ photoUrl }) => {
        adminProfilePhotoUrl = photoUrl
        profileDialog?.close()
        app.innerHTML = adminPage('Overview')
        attachInteractions()
        showToast('Profile updated.')
      })
      .catch(() => showToast('Your profile could not be saved. Check your connection and try again.'))
      .finally(() => {
        if (saveButton) saveButton.disabled = false
      })
  })

  const search = document.querySelector<HTMLInputElement>('#project-search')
  const filter = document.querySelector<HTMLSelectElement>('#status-filter')
  const filterRows = () => {
    const query = search?.value.trim().toLowerCase() ?? ''
    const status = filter?.value ?? 'all'
    const rows = [...document.querySelectorAll<HTMLTableRowElement>('[data-project-row]')]
    rows.forEach((row) => {
      const matchesText = row.textContent?.toLowerCase().includes(query) ?? false
      const matchesStatus = status === 'all' || row.dataset.status === status
      row.hidden = !matchesText || !matchesStatus
    })
    const summary = document.querySelector<HTMLDivElement>('.table-foot')
    if (summary) {
      const visibleCount = rows.filter((row) => !row.hidden).length
      summary.innerHTML = `Showing ${visibleCount} of ${rows.length} projects <span>Updated moments ago</span>`
    }
  }
  search?.addEventListener('input', filterRows)
  filter?.addEventListener('change', filterRows)

  const dialog = document.querySelector<HTMLDialogElement>('#new-project-dialog')
  document.querySelectorAll<HTMLButtonElement>('[data-open-dialog]').forEach((button) => button.addEventListener('click', () => {
    const portfolioButton = document.querySelector<HTMLButtonElement>('[data-admin-view="Portfolio"]')
    if (portfolioButton) portfolioButton.click()
    else dialog?.showModal()
  }))
  document.querySelector<HTMLFormElement>('#new-project-form')?.addEventListener('submit', (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null
    if (submitter?.value === 'cancel') return
    event.preventDefault()
    const name = document.querySelector<HTMLInputElement>('#new-project-name')?.value.trim()
    const type = document.querySelector<HTMLSelectElement>('#new-project-type')?.value
    if (!name || !type) return
    const body = document.querySelector<HTMLTableSectionElement>('tbody')
    body?.insertAdjacentHTML('afterbegin', `<tr data-project-row data-status="Planning"><td><span class="table-project"><span class="avatar blue">${name.slice(0, 2).toUpperCase()}</span><span><strong>${name}</strong><small>${type}</small></span></span></td><td><span class="status-pill planning"><i></i>Planning</span></td><td>Just now</td><td><button class="table-more" aria-label="More options for ${name}">···</button></td></tr>`)
    filterRows()
    dialog?.close()
    showToast(`${name} added to your workspace.`)
    ;(event.currentTarget as HTMLFormElement).reset()
  })

  document.querySelectorAll<HTMLButtonElement>('[data-portal-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.portalTab ?? 'Overview'
      document.querySelectorAll('.portal-tabs button').forEach((tabButton) => tabButton.classList.toggle('active', tabButton.textContent?.trim().startsWith(tab) ?? false))
      const content = document.querySelector<HTMLDivElement>('#portal-tab-content')
      if (!content) return
      const panels: Record<string, string> = {
        Overview: '',
        Messages: `<div class="portal-inline-panel"><span class="eyebrow">PROJECT MESSAGES</span><h2>A good conversation keeps things moving.</h2><div class="message-bubble"><strong>Alex Carter <small>Today, 9:42 am</small></strong><p>We’ve shared the first care journey for your review. When you have a moment, let us know what feels clear and what could use a closer look.</p></div><form class="message-form" id="message-form"><label class="visually-hidden" for="message-input">Write a project message</label><input id="message-input" placeholder="Write a message…" required><button class="button button-admin" type="submit">Send ${icon('right')}</button></form></div>`,
        Files: `<div class="portal-inline-panel"><span class="eyebrow">PROJECT FILES</span><h2>Shared, current, easy to find.</h2><div class="portal-files"><article><span class="file-icon pdf">PDF</span><div><strong>Northstar — Discovery summary</strong><small>PDF · 2.4 MB · Oct 16</small></div>${icon('download')}</article><article><span class="file-icon figma">FIG</span><div><strong>Care journey — Review 01</strong><small>Design file · Updated today</small></div>${icon('arrow')}</article></div></div>`,
        Support: `<div class="portal-inline-panel"><span class="eyebrow">A HAND WHEN YOU NEED ONE</span><h2>We’re here to help.</h2><p>For a quick question, message Alex in your project conversation. For anything more involved, send a note and we’ll get back to you within one working day.</p><a class="button button-admin" href="mailto:hello@osedev.studio?subject=Northstar%20project%20support">Contact the team ${icon('arrow')}</a></div>`,
      }
      content.innerHTML = panels[tab] ?? ''
      document.querySelector('#message-form')?.addEventListener('submit', (event) => {
        event.preventDefault()
        const field = document.querySelector<HTMLInputElement>('#message-input')
        if (!field?.value.trim()) return
        const bubble = document.createElement('div')
        bubble.className = 'message-bubble message-outgoing'
        bubble.innerHTML = `<strong>You <small>Just now</small></strong><p></p>`
        bubble.querySelector('p')!.textContent = field.value.trim()
        content.querySelector('.portal-inline-panel')?.insertBefore(bubble, content.querySelector('.message-form'))
        field.value = ''
        showToast('Message added to this demo conversation.')
      })
    })
  })

  const contactForm = document.querySelector<HTMLFormElement>('#contact-form')
  if (contactForm && !contactForm.querySelector('.contact-trap')) {
    const trap = document.createElement('div')
    trap.className = 'contact-trap'
    trap.setAttribute('aria-hidden', 'true')
    trap.innerHTML = '<label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label>'
    contactForm.insertBefore(trap, contactForm.querySelector('.form-submit'))
  }
  contactForm?.querySelector<HTMLElement>('.form-note')?.setAttribute('role', 'status')
  contactForm?.querySelector<HTMLElement>('.form-note')?.setAttribute('aria-live', 'polite')
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const status = form.querySelector<HTMLElement>('.form-note')
    const submitButton = form.querySelector<HTMLButtonElement>('.form-submit')
    if (formData.get('website')) return

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (!serviceId || !templateId || !publicKey) {
      if (status) status.textContent = 'Email delivery is not configured yet. Please try again later.'
      return
    }

    const originalButton = submitButton?.innerHTML
    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = 'Sending...'
    }
    if (status) status.textContent = 'Sending your message...'

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
          },
        }),
      })
      if (!response.ok) throw new Error('Your message could not be sent. Please try again.')
      form.reset()
      if (status) status.textContent = 'Thanks. Your message has been sent.'
    } catch (error) {
      if (status) status.textContent = error instanceof Error ? error.message : 'Your message could not be sent. Please try again.'
    } finally {
      if (submitButton) {
        submitButton.disabled = false
        if (originalButton) submitButton.innerHTML = originalButton
      }
    }
  })
}

window.addEventListener('popstate', render)
render()
