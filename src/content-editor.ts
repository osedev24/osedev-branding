import { adminSession, setAdminSession, supabase, supabaseConfigured } from './lib/supabase'

type PortfolioProject = {
  slug: string
  name: string
  kind: string
  services: string
  image: string
  descriptor: string
  challenge: string
  approach: string
  solution: string
  result: string
  tags: string[]
  liveUrl: string
  demoUrl: string
  published: boolean
  featured: boolean
}

type ServiceContent = { title: string; short: string; description: string; tags: string[] }
type ProcessStep = { label: string; title: string; description: string }

type WebsiteContent = {
  navWork: string
  navServices: string
  navStudio: string
  navProcess: string
  navContact: string
  heroKicker: string
  heroLocation: string
  heroTitle: string
  heroHighlight: string
  heroDescription: string
  heroPrimaryAction: string
  heroSecondaryAction: string
  heroProof: string[]
  heroBottom: string
  heroScroll: string
  introLabel: string
  introLead: string
  introHighlight: string
  introDescription: string
  workLabel: string
  workLinkLabel: string
  workTitle: string
  workHighlight: string
  workDescription: string
  workNote: string
  servicesLabel: string
  servicesTitle: string
  servicesHighlight: string
  servicesDescription: string
  services: ServiceContent[]
  servicesAction: string
  studioLabel: string
  studioTitle: string
  studioHighlight: string
  studioParagraph1: string
  studioParagraph2: string
  studioImage: string
  studioImageAlt: string
  studioCaption: string
  studioLinkLabel: string
  studioValues: string[]
  processLabel: string
  processTitle: string
  processHighlight: string
  processDescription: string
  processSteps: ProcessStep[]
  contactEyebrow: string
  contactTitle: string
  contactHighlight: string
  contactDescription: string
  formHeading: string
  formDuration: string
  formNote: string
  formNameLabel: string
  formNamePlaceholder: string
  formEmailLabel: string
  formEmailPlaceholder: string
  formMessageLabel: string
  formMessagePlaceholder: string
  formSubmitLabel: string
  contactEmail: string
  footerIntro: string
  footerNote1: string
  footerNote2: string
  footerRegion: string
  footerExploreLabel: string
  footerContactLabel: string
  footerBottom: string
  caseBriefTitle: string
  caseBriefHighlight: string
  caseTypeLabel: string
  caseCoverLabel: string
  caseLiveLabel: string
  caseDemoLabel: string
  caseBackLabel: string
  caseBriefLabel: string
  caseApproachLabel: string
  caseSolutionLabel: string
  caseApproachTitle: string
  caseApproachHighlight: string
  caseSolutionTitle: string
  caseSolutionHighlight: string
  caseOutcomeLabel: string
  caseMeta: string
  caseCtaEyebrow: string
  caseCtaTitle: string
  caseCtaHighlight: string
  caseCtaButton: string
}

type SavedContent = { projects: PortfolioProject[]; website: WebsiteContent }

const STORAGE_KEY = 'osedev-content-v1'
const app = document.querySelector<HTMLDivElement>('#app')

const defaultProjects: PortfolioProject[] = [
  {
    slug: 'northstar',
    name: 'Northstar Health',
    kind: 'Digital health platform',
    services: 'Product strategy · UX/UI · Engineering',
    image: 'photo-1576091160399-112ba8d25d1d',
    descriptor: 'Making better care feel closer.',
    challenge: 'People were navigating a fragmented care journey: separate providers, disconnected information and too many decisions made alone.',
    approach: 'We brought patients and care teams into the same conversation, mapping the moments that mattered and designing around real needs instead of organisational boundaries.',
    solution: 'A connected digital health experience that makes the next step clear, keeps personal care information in one considered place and gives people more confidence between appointments.',
    result: 'A calmer, more coherent path through care. Designed to give people the clarity to take the next step, and teams the context to make it count.',
    tags: ['Product strategy', 'UX research', 'Product design', 'Web application'],
    liveUrl: '',
    demoUrl: '',
    published: true,
    featured: true,
  },
  {
    slug: 'form-and-field',
    name: 'Form & Field',
    kind: 'Commerce, considered',
    services: 'Brand direction · E-commerce · Content',
    image: 'photo-1490481651871-ab68de25d43d',
    descriptor: 'A more considered way to shop.',
    challenge: 'A thoughtful independent label had a product story that got lost in a crowded, conversion-first shopping experience.',
    approach: 'We started with the materials, makers and rituals behind each collection, then shaped a digital storefront that gave those details their space.',
    solution: 'A content-led commerce experience balancing quiet editorial layouts with useful product discovery and a straightforward path to purchase.',
    result: 'A distinctive digital home for a distinctive point of view, ready to grow alongside the next collection.',
    tags: ['Digital direction', 'E-commerce', 'Content design', 'Front-end'],
    liveUrl: '',
    demoUrl: '',
    published: true,
    featured: false,
  },
  {
    slug: 'monograph',
    name: 'Monograph',
    kind: 'A better way to see data',
    services: 'Product design · Design systems',
    image: 'photo-1460925895917-afdab827c52f',
    descriptor: 'A clearer view of what matters.',
    challenge: 'Growing teams had data in abundance but struggled to find a shared, useful picture of progress.',
    approach: 'We worked through the reporting workflows with the people relying on them, reducing noise before deciding what deserved the visual emphasis.',
    solution: 'A focused analytics workspace that brings key signals forward while keeping the detail one intentional step away.',
    result: 'A more legible, adaptable foundation for teams to make decisions with context, not just more charts.',
    tags: ['Product discovery', 'UX/UI design', 'Design system', 'Data visualisation'],
    liveUrl: '',
    demoUrl: '',
    published: true,
    featured: false,
  },
]

const defaultWebsite: WebsiteContent = {
  navWork: 'Work',
  navServices: 'Services',
  navStudio: 'Studio',
  navProcess: 'Process',
  navContact: 'Let’s talk',
  heroKicker: 'Independent digital studio',
  heroLocation: 'Working everywhere',
  heroTitle: 'Make your next',
  heroHighlight: 'move matter.',
  heroDescription: 'We help ambitious teams turn complex ideas into clear, compelling digital products and experiences.',
  heroPrimaryAction: 'Start a project',
  heroSecondaryAction: 'Explore our work',
  heroProof: ['Strategy', 'Design', 'Technology'],
  heroBottom: 'Digital built around people.',
  heroScroll: 'Scroll to explore',
  introLabel: 'THE OSEDEV APPROACH',
  introLead: 'Good work is never just',
  introHighlight: 'good-looking.',
  introDescription: 'It makes the complicated feel simple, the useful feel intuitive, and the right idea feel inevitable.',
  workLabel: 'Selected work',
  workLinkLabel: 'All selected work',
  workTitle: 'Built with intent.',
  workHighlight: 'Made to move.',
  workDescription: 'Thoughtful digital experiences for people building what comes next.',
  workNote: 'Independent thinking. Collaborative making.',
  servicesLabel: 'What we do',
  servicesTitle: 'From first question to',
  servicesHighlight: 'final detail.',
  servicesDescription: 'One small, senior team. The right mix of strategic thinking, design craft and technical depth for the problem at hand.',
  services: [
    { title: 'Digital products', short: 'Make useful things easier.', description: 'We turn complex workflows and promising ideas into products people understand, trust and return to.', tags: ['Product strategy', 'UX research', 'Interface design', 'Prototyping'] },
    { title: 'Web experiences', short: 'Give your next chapter a home.', description: 'Distinctive, accessible websites that bring your proposition into focus and make the next step feel natural.', tags: ['Digital direction', 'Web design', 'Development', 'Content systems'] },
    { title: 'Creative technology', short: 'Make technology feel human.', description: 'We connect design and engineering to create useful tools, new capabilities and better ways of working.', tags: ['Technical discovery', 'Design systems', 'Integrations', 'AI experiences'] },
    { title: 'Ongoing partnership', short: 'Keep making it better.', description: 'A steady creative and technical partner for the work that starts after launch.', tags: ['Product support', 'Iteration', 'Team extension'] },
  ],
  servicesAction: 'Find your fit',
  studioLabel: 'Small on purpose',
  studioTitle: 'Senior minds.',
  studioHighlight: 'Close collaboration.',
  studioParagraph1: 'Osedev is an independent digital studio for people with something worth building. You work directly with the people shaping and making it, from the first conversation through to launch.',
  studioParagraph2: 'No layers. No theatre. Just a clear point of view, considered craft and a team that cares what happens next.',
  studioImage: 'photo-1497366754035-f200968a6e72',
  studioImageAlt: 'Light-filled collaborative studio workspace',
  studioCaption: 'A little room to think.',
  studioLinkLabel: 'A little about our process',
  studioValues: ['Curiosity before convention', 'Clarity in every detail', 'Better, together'],
  processLabel: 'A considered process',
  processTitle: 'Clear steps.',
  processHighlight: 'Room to explore.',
  processDescription: 'Structure gives good ideas somewhere to go. We keep the work open, the decisions clear and the momentum real.',
  processSteps: [
    { label: '01 / LISTEN', title: 'Get to the heart of it.', description: 'We align on the opportunity, the people it serves and what progress should look like.' },
    { label: '02 / SHAPE', title: 'Find the right direction.', description: 'We make the hard decisions visible, test the important assumptions and define a way forward.' },
    { label: '03 / MAKE', title: 'Bring the idea to life.', description: 'Design and engineering work together, with useful feedback built into the making.' },
    { label: '04 / GROW', title: 'Make launch a beginning.', description: 'We help your team feel ready, then stay close as the product meets the real world.' },
  ],
  contactEyebrow: 'Have a good one?',
  contactTitle: 'Let’s make',
  contactHighlight: 'it real.',
  contactDescription: 'Tell us what you’re thinking, what’s changing, or where you’re stuck. We’ll start there.',
  formHeading: '01 — A few details',
  formDuration: 'Usually a 2 min read',
  formNote: 'No pitch deck needed. Just a first conversation.',
  formNameLabel: 'Your name',
  formNamePlaceholder: 'How should we address you?',
  formEmailLabel: 'Work email',
  formEmailPlaceholder: 'you@company.com',
  formMessageLabel: 'What are you working on?',
  formMessagePlaceholder: 'A little context goes a long way…',
  formSubmitLabel: 'Send a note',
  contactEmail: 'hello@osedev.studio',
  footerIntro: 'Independent digital studio.\nGood things, thoughtfully made.',
  footerNote1: 'Thoughtful by design.',
  footerNote2: 'Built for what’s next.',
  footerRegion: 'Working everywhere',
  footerExploreLabel: 'Explore',
  footerContactLabel: 'Get in touch',
  footerBottom: 'Independent by nature. Intentional by design.',
  caseBriefTitle: 'A better experience',
  caseBriefHighlight: 'starts with a better question.',
  caseTypeLabel: 'CASE STUDY',
  caseCoverLabel: 'OSEDEV / SELECTED WORK',
  caseLiveLabel: 'Live site',
  caseDemoLabel: 'View demo',
  caseBackLabel: 'Back to selected work',
  caseBriefLabel: 'The brief',
  caseApproachLabel: '01 / Approach',
  caseSolutionLabel: '02 / Solution',
  caseApproachTitle: 'Understand before',
  caseApproachHighlight: 'we make.',
  caseSolutionTitle: 'Useful, considered,',
  caseSolutionHighlight: 'ready to grow.',
  caseOutcomeLabel: '03 / Outcome',
  caseMeta: 'Strategy · Design · Technology',
  caseCtaEyebrow: 'The next good thing',
  caseCtaTitle: 'What are you',
  caseCtaHighlight: 'working on?',
  caseCtaButton: 'Start a conversation',
}

let savedContent = loadContent()

function hydrateContent(value: unknown): SavedContent {
  if (!value || typeof value !== 'object') return { projects: defaultProjects, website: defaultWebsite }
  const parsed = value as Partial<SavedContent>
  const savedWebsite = parsed.website && typeof parsed.website === 'object' ? parsed.website as Partial<WebsiteContent> : {}
  return {
    projects: Array.isArray(parsed.projects) ? parsed.projects as PortfolioProject[] : defaultProjects,
    website: {
      ...defaultWebsite,
      ...savedWebsite,
      services: Array.isArray(savedWebsite.services) ? savedWebsite.services : defaultWebsite.services,
      studioValues: Array.isArray(savedWebsite.studioValues) ? savedWebsite.studioValues : defaultWebsite.studioValues,
      processSteps: Array.isArray(savedWebsite.processSteps) ? savedWebsite.processSteps : defaultWebsite.processSteps,
    },
  }
}

function loadContent(): SavedContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return hydrateContent(raw ? JSON.parse(raw) : null)
  } catch {
    return { projects: defaultProjects, website: defaultWebsite }
  }
}

function saveContent() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContent))
    void saveRemoteContent()
    return true
  } catch {
    return false
  }
}

async function saveRemoteContent() {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { error } = await supabase.from('site_content').upsert({
    id: 'default',
    payload: savedContent,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  })
  if (error) toast('Could not sync this change to Supabase.')
}

async function loadRemoteContent() {
  if (!supabase) return
  const response = adminSession
    ? await supabase.from('site_content').select('payload').eq('id', 'default').maybeSingle()
    : await supabase.rpc('get_public_content')
  const payload = adminSession ? response.data?.payload : response.data
  if (response.error || !payload || typeof payload !== 'object') return
  savedContent = hydrateContent(payload)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContent))
  } catch {
    // The remote copy remains authoritative when browser storage is unavailable.
  }
  renderForCurrentRoute()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character)
}

function safeExternalUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

function imageUrl(value: string, width: number) {
  const input = value.trim()
  if (/^https?:\/\//i.test(input)) return safeExternalUrl(input)
  if (/^[\w-]+$/.test(input)) return `https://images.unsplash.com/${input}?auto=format&fit=crop&w=${width}&q=82`
  return ''
}

function slugify(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toast(message: string) {
  const element = document.querySelector<HTMLDivElement>('.toast')
  if (!element) return
  element.textContent = message
  element.classList.add('visible')
  window.setTimeout(() => element.classList.remove('visible'), 3200)
}

function projectCard(project: PortfolioProject, index: number, featured: boolean) {
  const card = document.createElement('a')
  card.className = `project-card ${featured ? 'project-featured' : ''} reveal revealed`
  card.href = `/work/${encodeURIComponent(project.slug)}`
  card.dataset.route = ''
  const image = imageUrl(project.image, 1500)
  const number = String(index + 1).padStart(2, '0')
  card.innerHTML = `<div class="project-image">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(project.name)} project preview" loading="lazy">` : '<div class="project-placeholder">Add a cover image in Studio access</div>'}<span class="project-image-shade"></span><span class="project-open" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 17 17 7M7 7h10v10"/></svg></span><span class="project-image-label">OSEDEV <span>— SELECTED WORK</span></span></div><div class="project-meta"><div><span class="eyebrow">${number} / ${escapeHtml(project.kind)}</span><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.services)}</p></div><span class="project-index" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 17 17 7M7 7h10v10"/></svg></span></div>`
  return card
}

function headingMarkup(first: string, second: string) {
  return `${escapeHtml(first).replace(/\n/g, '<br>')}<br><span>${escapeHtml(second).replace(/\n/g, '<br>')}</span>`
}

function setSectionLabel(selector: string, value: string) {
  const label = document.querySelector<HTMLElement>(selector)
  if (!label) return
  const number = label.querySelector('.section-number')
  label.replaceChildren()
  if (number) label.append(number)
  label.append(` ${value}`)
}

function renderPublicHome() {
  const website = savedContent.website
  renderPublicNavigation()

  const heroEyebrow = document.querySelector<HTMLElement>('.hero-eyebrow')
  if (heroEyebrow) heroEyebrow.innerHTML = `<span class="status-dot"></span> ${escapeHtml(website.heroKicker)} <span class="eyebrow-divider">·</span> ${escapeHtml(website.heroLocation)}`
  const heroActions = document.querySelectorAll<HTMLElement>('.hero-actions .button')
  if (heroActions[0]) heroActions[0].innerHTML = `${escapeHtml(website.heroPrimaryAction)} ${arrowIcon()}`
  if (heroActions[1]) heroActions[1].innerHTML = `${escapeHtml(website.heroSecondaryAction)} ${arrowIcon()}`
  const heroProof = document.querySelector<HTMLElement>('.hero-footnote')
  if (heroProof) heroProof.innerHTML = website.heroProof.map((label, index) => `${index ? '<i></i>' : ''}<span>${escapeHtml(label)}</span>`).join('')
  const heroBottom = document.querySelector<HTMLElement>('.hero-bottom > span:first-child')
  const heroScroll = document.querySelector<HTMLElement>('.hero-scroll')
  if (heroBottom) heroBottom.textContent = website.heroBottom
  if (heroScroll) heroScroll.innerHTML = `${escapeHtml(website.heroScroll)} <span class="scroll-line"></span>`

  const headline = document.querySelector<HTMLElement>('#hero-title')
  if (headline) headline.innerHTML = `${escapeHtml(website.heroTitle).replace(/\n/g, '<br>')}<br><span class="hero-italic">${escapeHtml(website.heroHighlight).replace(/\n/g, '<br>')}</span>`
  const description = document.querySelector<HTMLElement>('.hero-description')
  if (description) description.textContent = website.heroDescription
  const introLead = document.querySelector<HTMLElement>('.intro-strip-inner > p')
  if (introLead) introLead.innerHTML = `${escapeHtml(website.introLead).replace(/\n/g, '<br>')}<br><span>${escapeHtml(website.introHighlight).replace(/\n/g, '<br>')}</span>`
  const introDescription = document.querySelector<HTMLElement>('.intro-strip-copy > p')
  if (introDescription) introDescription.textContent = website.introDescription
  const introLabel = document.querySelector<HTMLElement>('.intro-strip-copy .eyebrow')
  if (introLabel) introLabel.textContent = website.introLabel

  const workHeading = document.querySelector<HTMLElement>('.work-section .section-heading h2')
  if (workHeading) workHeading.innerHTML = headingMarkup(website.workTitle, website.workHighlight)
  const workDescription = document.querySelector<HTMLElement>('.work-section .section-aside > p')
  if (workDescription) workDescription.textContent = website.workDescription
  const workNote = document.querySelector<HTMLElement>('.work-footnote > span:first-child')
  if (workNote) workNote.textContent = website.workNote
  setSectionLabel('.work-section .eyebrow', website.workLabel)
  const workLink = document.querySelector<HTMLElement>('.work-section .section-aside .text-link')
  if (workLink) workLink.innerHTML = `${escapeHtml(website.workLinkLabel)} ${arrowIcon()}`

  const servicesHeading = document.querySelector<HTMLElement>('.services-intro h2')
  if (servicesHeading) servicesHeading.innerHTML = headingMarkup(website.servicesTitle, website.servicesHighlight)
  const servicesDescription = document.querySelector<HTMLElement>('.services-description')
  if (servicesDescription) servicesDescription.textContent = website.servicesDescription
  setSectionLabel('.services-intro .eyebrow', website.servicesLabel)
  const servicesAction = document.querySelector<HTMLElement>('.services-intro .button')
  if (servicesAction) servicesAction.innerHTML = `${escapeHtml(website.servicesAction)} ${arrowIcon()}`
  document.querySelectorAll<HTMLElement>('.service-item').forEach((item, index) => {
    const service = website.services[index]
    if (!service) return
    const title = item.querySelector<HTMLElement>('.service-title')
    const short = item.querySelector<HTMLElement>('.service-short')
    const description = item.querySelector<HTMLElement>('.service-detail > p')
    const tags = item.querySelector<HTMLElement>('.tag-row')
    if (title) title.textContent = service.title
    if (short) short.textContent = service.short
    if (description) description.textContent = service.description
    if (tags) tags.innerHTML = service.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')
  })

  const studioHeading = document.querySelector<HTMLElement>('.studio-copy h2')
  if (studioHeading) studioHeading.innerHTML = headingMarkup(website.studioTitle, website.studioHighlight)
  const studioParagraphs = document.querySelectorAll<HTMLElement>('.studio-copy > p:not(.eyebrow)')
  if (studioParagraphs[0]) studioParagraphs[0].textContent = website.studioParagraph1
  if (studioParagraphs[1]) studioParagraphs[1].textContent = website.studioParagraph2
  const studioPhoto = document.querySelector<HTMLImageElement>('.studio-photo img')
  const studioImage = imageUrl(website.studioImage, 1200)
  if (studioPhoto && studioImage) {
    studioPhoto.src = studioImage
    studioPhoto.alt = website.studioImageAlt
  }
  const studioCaption = document.querySelector<HTMLElement>('.photo-caption')
  if (studioCaption) studioCaption.textContent = website.studioCaption
  const studioLink = document.querySelector<HTMLElement>('.studio-copy .text-link')
  if (studioLink) studioLink.innerHTML = `${escapeHtml(website.studioLinkLabel)} ${arrowIcon()}`
  document.querySelectorAll<HTMLElement>('.studio-values > div > span').forEach((value, index) => {
    if (website.studioValues[index]) value.textContent = website.studioValues[index]
  })
  setSectionLabel('.studio-copy .eyebrow', website.studioLabel)

  const processHeading = document.querySelector<HTMLElement>('.process-heading h2')
  if (processHeading) processHeading.innerHTML = headingMarkup(website.processTitle, website.processHighlight)
  const processDescription = document.querySelector<HTMLElement>('.process-heading > p')
  if (processDescription) processDescription.textContent = website.processDescription
  setSectionLabel('.process-heading .eyebrow', website.processLabel)
  document.querySelectorAll<HTMLElement>('.process-step').forEach((item, index) => {
    const step = website.processSteps[index]
    if (!step) return
    const label = item.querySelector<HTMLElement>('.process-index')
    const title = item.querySelector<HTMLElement>('h3')
    const description = item.querySelector<HTMLElement>('p')
    if (label) label.textContent = step.label
    if (title) title.textContent = step.title
    if (description) description.textContent = step.description
  })

  const contactHeading = document.querySelector<HTMLElement>('.contact-copy h2')
  if (contactHeading) contactHeading.innerHTML = headingMarkup(website.contactTitle, website.contactHighlight)
  const contactDescription = document.querySelector<HTMLElement>('.contact-copy > p:not(.eyebrow)')
  if (contactDescription) contactDescription.textContent = website.contactDescription
  const formHeading = document.querySelector<HTMLElement>('.form-heading span:first-child')
  const formDuration = document.querySelector<HTMLElement>('.form-heading span:last-child')
  const formNote = document.querySelector<HTMLElement>('.form-note')
  if (formHeading) formHeading.textContent = website.formHeading
  if (formDuration) formDuration.textContent = website.formDuration
  if (formNote) formNote.textContent = website.formNote
  const formFields = [
    ['#contact-form label[for="contact-name"]', '#contact-name', website.formNameLabel, website.formNamePlaceholder],
    ['#contact-form label[for="contact-email"]', '#contact-email', website.formEmailLabel, website.formEmailPlaceholder],
    ['#contact-form label[for="contact-message"]', '#contact-message', website.formMessageLabel, website.formMessagePlaceholder],
  ]
  formFields.forEach(([labelSelector, inputSelector, labelText, placeholder]) => {
    const label = document.querySelector<HTMLElement>(labelSelector)
    const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(inputSelector)
    if (label) label.textContent = labelText
    if (input) input.placeholder = placeholder
  })
  const submitButton = document.querySelector<HTMLElement>('#contact-form .form-submit')
  if (submitButton) submitButton.innerHTML = `${escapeHtml(website.formSubmitLabel)} ${arrowIcon()}`
  setSectionLabel('.contact-copy .eyebrow', website.contactEyebrow)

  const contact = website.contactEmail.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach((link) => {
      const subject = link.href.includes('?') ? link.href.slice(link.href.indexOf('?')) : ''
      link.href = `mailto:${contact}${subject}`
      if (link.classList.contains('contact-email') || link.textContent?.includes('@')) link.textContent = contact
    })
  }

  const layout = document.querySelector<HTMLDivElement>('.project-layout')
  const projects = savedContent.projects.filter((project) => project.published).sort((a, b) => Number(b.featured) - Number(a.featured))
  const featuredProject = projects[0]
  if (featuredProject) {
    const art = document.querySelector<HTMLElement>('.hero-art')
    const artBrand = document.querySelector<HTMLElement>('.art-brand')
    const artImage = document.querySelector<HTMLImageElement>('.art-card-image img')
    const artImageUrl = imageUrl(featuredProject.image, 680)
    const artChip = document.querySelector<HTMLElement>('.art-image-chip')
    const artLabel = document.querySelector<HTMLElement>('.art-label')
    const artTitle = document.querySelector<HTMLElement>('.art-card-bottom strong')
    if (art) art.setAttribute('aria-label', `A preview of the ${featuredProject.name} digital experience`)
    if (artBrand?.lastChild) artBrand.lastChild.textContent = ` ${featuredProject.name.toLowerCase()}`
    if (artImage && artImageUrl) {
      artImage.src = artImageUrl
      artImage.alt = `${featuredProject.name} product preview`
    }
    if (artChip) artChip.textContent = featuredProject.descriptor
    if (artLabel) artLabel.textContent = featuredProject.kind.toUpperCase()
    if (artTitle) artTitle.textContent = featuredProject.name
  }
  if (layout) {
    layout.replaceChildren()
    if (projects.length === 0) {
      layout.innerHTML = '<p class="portfolio-empty">New work is taking shape. Check back soon.</p>'
    } else {
      const stack = document.createElement('div')
      stack.className = 'project-stack'
      projects.slice(1).forEach((project, index) => stack.append(projectCard(project, index + 1, false)))
      layout.append(projectCard(projects[0], 0, true))
      if (projects.length > 1) layout.append(stack)
    }
  }
  const footnote = document.querySelector('.work-footnote > span:last-child')
  if (footnote) footnote.textContent = `${projects.length} published ${projects.length === 1 ? 'project' : 'projects'}`
  renderFooter()
}

function renderPublicNavigation() {
  const website = savedContent.website
  const navLabels = ['Home', website.navWork, website.navServices, website.navStudio, website.navProcess]
  document.querySelectorAll<HTMLElement>('.primary-nav > a:not(.nav-contact)').forEach((link, index) => {
    if (navLabels[index]) link.textContent = navLabels[index]
  })
  const navContact = document.querySelector<HTMLElement>('.primary-nav .nav-contact')
  if (navContact) navContact.innerHTML = `${escapeHtml(website.navContact)} ${arrowIcon()}`
}

function renderFooter() {
  const website = savedContent.website
  const footerIntro = document.querySelector<HTMLElement>('.footer-brand > p')
  if (footerIntro) footerIntro.innerHTML = escapeHtml(website.footerIntro).replace(/\n/g, '<br>')
  const footerNotes = document.querySelectorAll<HTMLElement>('.footer-note > span:not(.footer-orbit)')
  if (footerNotes[0]) footerNotes[0].textContent = website.footerNote1
  if (footerNotes[1]) footerNotes[1].textContent = website.footerNote2
  const footerColumns = document.querySelectorAll<HTMLElement>('.footer-col')
  if (footerColumns[0]?.querySelector('.eyebrow')) footerColumns[0].querySelector('.eyebrow')!.textContent = website.footerExploreLabel
  if (footerColumns[1]?.querySelector('.eyebrow')) footerColumns[1].querySelector('.eyebrow')!.textContent = website.footerContactLabel
  if (footerColumns[1]?.querySelector('span:not(.eyebrow)')) footerColumns[1].querySelector('span:not(.eyebrow)')!.textContent = website.footerRegion
  const footerBottom = document.querySelector<HTMLElement>('.footer-bottom > span:nth-child(2)')
  if (footerBottom) footerBottom.textContent = website.footerBottom
  const footerNav = footerColumns[0]?.querySelectorAll<HTMLElement>('a') ?? []
  ;[website.navWork, website.navServices, website.navStudio, website.navProcess].forEach((label, index) => {
    if (footerNav[index]) footerNav[index].textContent = label
  })
  const contact = website.contactEmail.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach((link) => {
      link.href = `mailto:${contact}`
      if (link.textContent?.includes('@')) link.textContent = contact
    })
  }
}

function renderCaseStudy() {
  renderPublicNavigation()
  const slug = decodeURIComponent(location.pathname.split('/')[2] ?? '')
  const project = savedContent.projects.find((item) => item.slug === slug)
  if (!project) return

  const backLink = document.querySelector<HTMLAnchorElement>('.case-hero .back-link')
  if (backLink) {
    const arrow = backLink.querySelector('svg')?.outerHTML ?? ''
    backLink.innerHTML = `${arrow} ${escapeHtml(savedContent.website.caseBackLabel)}`
  }
  const heading = document.querySelector<HTMLElement>('.case-hero h1')
  if (heading) heading.innerHTML = `${escapeHtml(project.name)}<br><span>${escapeHtml(project.descriptor)}</span>`
  const briefHeading = document.querySelector<HTMLElement>('.case-overview h2')
  if (briefHeading) briefHeading.innerHTML = headingMarkup(savedContent.website.caseBriefTitle, savedContent.website.caseBriefHighlight)
  const storyHeadings = document.querySelectorAll<HTMLElement>('.case-story-grid article h2')
  if (storyHeadings[0]) storyHeadings[0].innerHTML = headingMarkup(savedContent.website.caseApproachTitle, savedContent.website.caseApproachHighlight)
  if (storyHeadings[1]) storyHeadings[1].innerHTML = headingMarkup(savedContent.website.caseSolutionTitle, savedContent.website.caseSolutionHighlight)
  const caseLabels = document.querySelectorAll<HTMLElement>('.case-overview .eyebrow, .case-story-grid article .eyebrow')
  if (caseLabels[0]) caseLabels[0].textContent = savedContent.website.caseBriefLabel
  if (caseLabels[1]) caseLabels[1].textContent = savedContent.website.caseApproachLabel
  if (caseLabels[2]) caseLabels[2].textContent = savedContent.website.caseSolutionLabel
  const image = imageUrl(project.image, 1900)
  const cover = document.querySelector<HTMLImageElement>('.case-cover img')
  if (cover && image) {
    cover.src = image
    cover.alt = `${project.name} project visual`
  }
  const tags = document.querySelector<HTMLDivElement>('.case-tags')
  if (tags) {
    tags.innerHTML = project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')
    const links = [
      [savedContent.website.caseLiveLabel, project.liveUrl],
      [savedContent.website.caseDemoLabel, project.demoUrl],
    ].filter(([, value]) => safeExternalUrl(value))
    if (links.length) {
      const linkRow = document.createElement('div')
      linkRow.className = 'case-project-links'
      linkRow.innerHTML = links.map(([label, value]) => `<a class="button ${label === 'View demo' ? 'button-cyan' : 'button-outline'}" href="${escapeHtml(safeExternalUrl(value))}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`).join('')
      tags.after(linkRow)
    }
  }
  const brief = document.querySelector<HTMLElement>('.case-overview > p')
  if (brief) brief.textContent = project.challenge
  const story = document.querySelectorAll<HTMLElement>('.case-story-grid article > p')
  if (story[0]) story[0].textContent = project.approach
  if (story[1]) story[1].textContent = project.solution
  const result = document.querySelector<HTMLElement>('.case-outcome > h2')
  if (result) result.textContent = project.result
  const outcomeLabel = document.querySelector<HTMLElement>('.case-outcome > .eyebrow')
  if (outcomeLabel) outcomeLabel.textContent = savedContent.website.caseOutcomeLabel
  const caseMeta = document.querySelector<HTMLElement>('.case-outcome-meta > span')
  if (caseMeta) caseMeta.textContent = savedContent.website.caseMeta
  const ctaEyebrow = document.querySelector<HTMLElement>('.case-next .eyebrow')
  const ctaHeading = document.querySelector<HTMLElement>('.case-next h2')
  const ctaButton = document.querySelector<HTMLElement>('.case-next .button')
  if (ctaEyebrow) ctaEyebrow.textContent = savedContent.website.caseCtaEyebrow
  if (ctaHeading) ctaHeading.innerHTML = headingMarkup(savedContent.website.caseCtaTitle, savedContent.website.caseCtaHighlight)
  if (ctaButton) ctaButton.innerHTML = `${escapeHtml(savedContent.website.caseCtaButton)} ${arrowIcon()}`
  const caseType = document.querySelector<HTMLElement>('.case-hero .eyebrow')
  if (caseType) {
    const label = caseType.querySelector('.section-number')
    if (label) label.textContent = savedContent.website.caseTypeLabel
    caseType.lastChild!.textContent = ` ${project.kind} / Osedev`
  }
  const caseCoverLabel = document.querySelector<HTMLElement>('.case-cover-label')
  if (caseCoverLabel) caseCoverLabel.textContent = savedContent.website.caseCoverLabel
  renderFooter()
}

function addAdminNavigation() {
  const nav = document.querySelector<HTMLElement>('.admin-nav')
  const projectsButton = nav?.querySelector<HTMLButtonElement>('[data-admin-view="Projects"]')
  if (!nav || !projectsButton || nav.querySelector('[data-admin-view="Portfolio"]')) return
  const portfolio = document.createElement('button')
  portfolio.className = 'admin-nav-item editor-nav-item'
  portfolio.dataset.adminView = 'Portfolio'
  portfolio.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/></svg><span>Portfolio</span>'
  const website = document.createElement('button')
  website.className = 'admin-nav-item editor-nav-item'
  website.dataset.adminView = 'Website'
  website.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16v14H4z"/><path d="M4 9h16M8 5v4"/></svg><span>Website</span>'
  projectsButton.before(portfolio, website)
  const profile = document.querySelector<HTMLElement>('.admin-profile')
  if (profile && supabaseConfigured && !profile.querySelector('[data-admin-logout]')) {
    const logout = document.createElement('button')
    logout.className = 'admin-logout'
    logout.dataset.adminLogout = ''
    logout.type = 'button'
    logout.textContent = 'Sign out'
    profile.append(logout)
  }
}

function projectEditorDialog() {
  return `<dialog class="content-editor-dialog" id="portfolio-dialog"><form id="portfolio-form"><div class="dialog-top"><div><span class="eyebrow">PORTFOLIO / PROJECT</span><h2 id="portfolio-dialog-title">Add work</h2></div><button class="icon-button" type="button" data-close-editor aria-label="Close dialog"><span aria-hidden="true">×</span></button></div><input type="hidden" name="originalSlug"><div class="editor-form-grid"><label>Project name<input name="name" required maxlength="80" placeholder="e.g. Aster Studio"></label><label>Page slug<input name="slug" required pattern="[a-z0-9\\-]+" placeholder="aster-studio"></label><label>Project category<input name="kind" required placeholder="Digital product"></label><label>Services / technologies<input name="services" placeholder="Product design · Web development"></label><label class="editor-span">Cover image URL or Unsplash photo ID<input name="image" placeholder="photo-... or https://..."></label><label class="editor-span">Short project introduction<input name="descriptor" required placeholder="A clearer way to..."></label><label class="editor-span">Tags <small>Separate with commas</small><input name="tags" placeholder="Strategy, UX/UI, Development"></label><label>Live website URL<input name="liveUrl" type="url" placeholder="https://example.com"></label><label>Demo / prototype URL<input name="demoUrl" type="url" placeholder="https://..."></label><label class="editor-span">Challenge<textarea name="challenge" rows="3" placeholder="What needed to change?"></textarea></label><label class="editor-span">Approach<textarea name="approach" rows="3" placeholder="How did you tackle it?"></textarea></label><label class="editor-span">Solution<textarea name="solution" rows="3" placeholder="What did you make?"></textarea></label><label class="editor-span">Outcome<textarea name="result" rows="3" placeholder="What changed as a result?"></textarea></label></div><label class="editor-checkbox"><input type="checkbox" name="published" checked> Publish this project on the website</label><div class="dialog-actions"><button class="quiet-button" type="button" data-close-editor>Cancel</button><button class="button button-admin" type="submit">Save project</button></div></form></dialog>`
}

function renderPortfolioAdmin() {
  const host = document.querySelector<HTMLDivElement>('.admin-content')
  if (!host) return
  const rows = savedContent.projects.map((project) => {
    const preview = imageUrl(project.image, 240)
    const externalLinks = [
      project.liveUrl ? `<a href="${escapeHtml(safeExternalUrl(project.liveUrl))}" target="_blank" rel="noopener noreferrer">Live ${arrowIcon()}</a>` : '',
      project.demoUrl ? `<a href="${escapeHtml(safeExternalUrl(project.demoUrl))}" target="_blank" rel="noopener noreferrer">Demo ${arrowIcon()}</a>` : '',
    ].filter(Boolean).join('')
    return `<article class="portfolio-admin-item"><div class="portfolio-admin-thumb">${preview ? `<img src="${escapeHtml(preview)}" alt="">` : '<span>OSEDEV</span>'}</div><div class="portfolio-admin-info"><div class="portfolio-admin-title"><div><span class="eyebrow">${escapeHtml(project.kind)}</span><h2>${escapeHtml(project.name)}</h2></div><span class="status-pill ${project.published ? 'progress' : 'planning'}"><i></i>${project.published ? 'Published' : 'Draft'}</span></div><p>${escapeHtml(project.services || 'No services added')}</p><div class="portfolio-admin-links"><a href="/work/${encodeURIComponent(project.slug)}" data-preview-project="${escapeHtml(project.slug)}">Preview case study ${arrowIcon()}</a>${externalLinks}</div></div><div class="portfolio-admin-actions"><button class="quiet-button" data-edit-project="${escapeHtml(project.slug)}">Edit</button><button class="quiet-button" data-toggle-project="${escapeHtml(project.slug)}">${project.published ? 'Unpublish' : 'Publish'}</button><button class="quiet-button danger-button" data-delete-project="${escapeHtml(project.slug)}">Delete</button></div></article>`
  }).join('')
  host.innerHTML = `<div class="admin-page-title"><div><span class="eyebrow">WEBSITE / PORTFOLIO</span><h1>Your work</h1><p>Add projects, case studies, and links to work you’ve done.</p></div><button class="button button-admin" data-editor-action="new-project"><span aria-hidden="true">＋</span> Add work</button></div><div class="editor-storage-note"><span class="secure-dot"></span> Changes save in this browser. They are not published to a live website yet.</div><section class="portfolio-admin-list">${rows || '<div class="editor-empty"><h2>No projects yet.</h2><p>Add your first project to start building the portfolio.</p></div>'}</section><footer class="admin-footer"><span>PORTFOLIO / ${savedContent.projects.length} PROJECTS</span><a href="/" data-editor-home>Preview website ${arrowIcon()}</a></footer>${projectEditorDialog()}`
}

function editorInput(name: string, label: string, value: string, type = 'text', wide = false) {
  return `<label class="${wide ? 'editor-span' : ''}">${label}<input name="${name}" type="${type}" value="${escapeHtml(value)}"></label>`
}

function editorTextarea(name: string, label: string, value: string, wide = false, rows = 3) {
  return `<label class="${wide ? 'editor-span' : ''}">${label}<textarea name="${name}" rows="${rows}">${escapeHtml(value)}</textarea></label>`
}

function editorGroup(number: string, title: string, fields: string, open = false) {
  return `<details class="website-editor-group" ${open ? 'open' : ''}><summary><span>${number}</span><strong>${title}</strong><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary><div class="website-editor-group-body">${fields}</div></details>`
}

function websiteEditorForm() {
  const website = savedContent.website
  const services = website.services.map((service, index) => `<section class="content-repeat-block"><h3>Service ${String(index + 1).padStart(2, '0')}</h3><div class="editor-form-grid">${editorInput(`serviceTitle${index}`, 'Service title', service.title)}${editorInput(`serviceShort${index}`, 'Short description', service.short)}${editorTextarea(`serviceDescription${index}`, 'Full description', service.description, true)}${editorInput(`serviceTags${index}`, 'Tags, separated by commas', service.tags.join(', '), 'text', true)}</div></section>`).join('')
  const processSteps = website.processSteps.map((step, index) => `<section class="content-repeat-block"><h3>Step ${String(index + 1).padStart(2, '0')}</h3><div class="editor-form-grid">${editorInput(`stepLabel${index}`, 'Eyebrow', step.label)}${editorInput(`stepTitle${index}`, 'Step title', step.title)}${editorTextarea(`stepDescription${index}`, 'Description', step.description, true)}</div></section>`).join('')
  const groups = [
    editorGroup('01', 'Navigation', `<div class="editor-form-grid">${editorInput('navWork', 'Work link', website.navWork)}${editorInput('navServices', 'Services link', website.navServices)}${editorInput('navStudio', 'Studio link', website.navStudio)}${editorInput('navProcess', 'Process link', website.navProcess)}${editorInput('navContact', 'Contact link', website.navContact)}${editorInput('heroKicker', 'Hero eyebrow', website.heroKicker)}${editorInput('heroLocation', 'Hero location note', website.heroLocation)}</div>`, true),
    editorGroup('02', 'Hero and introduction', `<div class="editor-form-grid">${editorTextarea('heroTitle', 'Headline first line', website.heroTitle)}${editorTextarea('heroHighlight', 'Headline highlighted line', website.heroHighlight)}${editorTextarea('heroDescription', 'Supporting statement', website.heroDescription, true)}${editorInput('heroPrimaryAction', 'Primary button', website.heroPrimaryAction)}${editorInput('heroSecondaryAction', 'Secondary button', website.heroSecondaryAction)}${editorInput('heroProof', 'Proof points, separated by commas', website.heroProof.join(', '), 'text', true)}${editorInput('heroBottom', 'Hero bottom statement', website.heroBottom)}${editorInput('heroScroll', 'Scroll prompt', website.heroScroll)}${editorInput('introLabel', 'Intro eyebrow', website.introLabel)}${editorTextarea('introLead', 'Intro statement first line', website.introLead)}${editorTextarea('introHighlight', 'Intro highlighted line', website.introHighlight)}${editorTextarea('introDescription', 'Intro supporting statement', website.introDescription, true)}</div>`),
    editorGroup('03', 'Selected work', `<div class="editor-form-grid">${editorInput('workLabel', 'Section eyebrow', website.workLabel)}${editorInput('workLinkLabel', 'Work link label', website.workLinkLabel)}${editorTextarea('workTitle', 'Heading first line', website.workTitle)}${editorTextarea('workHighlight', 'Heading highlighted line', website.workHighlight)}${editorTextarea('workDescription', 'Section description', website.workDescription, true)}${editorInput('workNote', 'Section footnote', website.workNote, 'text', true)}</div><p class="editor-help">Manage project cards, images, case studies, and live/demo links in Portfolio.</p>`),
    editorGroup('04', 'Services', `<div class="editor-form-grid">${editorInput('servicesLabel', 'Section eyebrow', website.servicesLabel)}${editorInput('servicesAction', 'Call-to-action button', website.servicesAction)}${editorTextarea('servicesTitle', 'Heading first line', website.servicesTitle)}${editorTextarea('servicesHighlight', 'Heading highlighted line', website.servicesHighlight)}${editorTextarea('servicesDescription', 'Section introduction', website.servicesDescription, true)}</div>${services}`),
    editorGroup('05', 'Studio', `<div class="editor-form-grid">${editorInput('studioLabel', 'Section eyebrow', website.studioLabel)}${editorInput('studioCaption', 'Photo caption', website.studioCaption)}${editorInput('studioLinkLabel', 'Process link label', website.studioLinkLabel)}${editorTextarea('studioTitle', 'Heading first line', website.studioTitle)}${editorTextarea('studioHighlight', 'Heading highlighted line', website.studioHighlight)}${editorTextarea('studioParagraph1', 'First paragraph', website.studioParagraph1, true)}${editorTextarea('studioParagraph2', 'Second paragraph', website.studioParagraph2, true)}${editorInput('studioImage', 'Photo URL or Unsplash photo ID', website.studioImage, 'text', true)}${editorInput('studioImageAlt', 'Photo description for accessibility', website.studioImageAlt, 'text', true)}${website.studioValues.map((value, index) => editorInput(`studioValue${index}`, `Studio value ${index + 1}`, value)).join('')}</div>`),
    editorGroup('06', 'Process', `<div class="editor-form-grid">${editorInput('processLabel', 'Section eyebrow', website.processLabel)}${editorTextarea('processTitle', 'Heading first line', website.processTitle)}${editorTextarea('processHighlight', 'Heading highlighted line', website.processHighlight)}${editorTextarea('processDescription', 'Section introduction', website.processDescription, true)}</div>${processSteps}`),
    editorGroup('07', 'Contact', `<div class="editor-form-grid">${editorInput('contactEyebrow', 'Section eyebrow', website.contactEyebrow)}${editorInput('contactEmail', 'Enquiry email', website.contactEmail, 'email')}${editorTextarea('contactTitle', 'Heading first line', website.contactTitle)}${editorTextarea('contactHighlight', 'Heading highlighted line', website.contactHighlight)}${editorTextarea('contactDescription', 'Section introduction', website.contactDescription, true)}${editorInput('formHeading', 'Form heading', website.formHeading)}${editorInput('formDuration', 'Form time note', website.formDuration)}${editorInput('formNameLabel', 'Name field label', website.formNameLabel)}${editorInput('formNamePlaceholder', 'Name field placeholder', website.formNamePlaceholder)}${editorInput('formEmailLabel', 'Email field label', website.formEmailLabel)}${editorInput('formEmailPlaceholder', 'Email field placeholder', website.formEmailPlaceholder)}${editorInput('formMessageLabel', 'Message field label', website.formMessageLabel)}${editorInput('formMessagePlaceholder', 'Message field placeholder', website.formMessagePlaceholder)}${editorInput('formSubmitLabel', 'Submit button', website.formSubmitLabel)}${editorTextarea('formNote', 'Form note', website.formNote, true)}</div>`),
    editorGroup('08', 'Footer', `<div class="editor-form-grid">${editorInput('footerExploreLabel', 'Navigation column label', website.footerExploreLabel)}${editorInput('footerContactLabel', 'Contact column label', website.footerContactLabel)}${editorTextarea('footerIntro', 'Studio description (use a new line for a line break)', website.footerIntro, true)}${editorInput('footerRegion', 'Location note', website.footerRegion)}${editorInput('footerNote1', 'Closing thought, first line', website.footerNote1)}${editorInput('footerNote2', 'Closing thought, second line', website.footerNote2)}${editorTextarea('footerBottom', 'Footer bottom line', website.footerBottom, true)}</div>`),
    editorGroup('09', 'Case-study pages', `<div class="editor-form-grid">${editorInput('caseTypeLabel', 'Case-study eyebrow', website.caseTypeLabel)}${editorInput('caseCoverLabel', 'Cover image caption', website.caseCoverLabel)}${editorInput('caseBackLabel', 'Back link label', website.caseBackLabel)}${editorInput('caseLiveLabel', 'Live link label', website.caseLiveLabel)}${editorInput('caseDemoLabel', 'Demo link label', website.caseDemoLabel)}${editorInput('caseBriefLabel', 'Brief section label', website.caseBriefLabel)}${editorTextarea('caseBriefTitle', 'Brief heading first line', website.caseBriefTitle)}${editorTextarea('caseBriefHighlight', 'Brief heading second line', website.caseBriefHighlight)}${editorInput('caseApproachLabel', 'Approach label', website.caseApproachLabel)}${editorTextarea('caseApproachTitle', 'Approach heading first line', website.caseApproachTitle)}${editorTextarea('caseApproachHighlight', 'Approach heading second line', website.caseApproachHighlight)}${editorInput('caseSolutionLabel', 'Solution label', website.caseSolutionLabel)}${editorTextarea('caseSolutionTitle', 'Solution heading first line', website.caseSolutionTitle)}${editorTextarea('caseSolutionHighlight', 'Solution heading second line', website.caseSolutionHighlight)}${editorInput('caseOutcomeLabel', 'Outcome label', website.caseOutcomeLabel)}${editorInput('caseMeta', 'Project metadata line', website.caseMeta, 'text', true)}${editorInput('caseCtaEyebrow', 'Closing section eyebrow', website.caseCtaEyebrow)}${editorTextarea('caseCtaTitle', 'Closing heading first line', website.caseCtaTitle)}${editorTextarea('caseCtaHighlight', 'Closing heading highlighted line', website.caseCtaHighlight)}${editorInput('caseCtaButton', 'Closing button', website.caseCtaButton)}</div>`),
  ].join('')

  return `<div class="admin-page-title"><div><span class="eyebrow">WEBSITE / CONTENT</span><h1>Edit every section</h1><p>Update the public homepage and shared case-study content.</p></div><a class="button button-admin" href="/" data-editor-home>Preview website ${arrowIcon()}</a></div><div class="editor-storage-note"><span class="secure-dot"></span> Changes save in this browser. They are not published to a live website yet.</div><form class="website-editor-form" id="website-content-form">${groups}<div class="editor-save-row"><span>Save changes, then preview any public page.</span><button class="button button-admin" type="submit">Save all website content</button></div></form><footer class="admin-footer"><span>WEBSITE / CONTENT</span><a href="/" data-editor-home>Preview website ${arrowIcon()}</a></footer>`
}

function arrowIcon() {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>'
}

function showAdminEditor(view: 'Portfolio' | 'Website') {
  const content = document.querySelector<HTMLDivElement>('.admin-content')
  if (!content) return
  document.querySelectorAll('.admin-nav-item').forEach((button) => button.classList.toggle('active', button.getAttribute('data-admin-view') === view))
  const breadcrumb = document.querySelector<HTMLElement>('.admin-breadcrumb strong')
  if (breadcrumb) breadcrumb.textContent = view
  content.innerHTML = view === 'Portfolio' ? '' : ''
  if (view === 'Portfolio') renderPortfolioAdmin()
  else content.innerHTML = `${websiteEditorForm()}`
}

function openPortfolioEditor(slug?: string) {
  const dialog = document.querySelector<HTMLDialogElement>('#portfolio-dialog')
  const form = document.querySelector<HTMLFormElement>('#portfolio-form')
  if (!dialog || !form) return
  form.reset()
  const project = slug ? savedContent.projects.find((item) => item.slug === slug) : undefined
  const fields = form.elements as typeof form.elements & Record<string, HTMLInputElement | HTMLTextAreaElement>
  document.querySelector<HTMLElement>('#portfolio-dialog-title')!.textContent = project ? 'Edit project' : 'Add work'
  fields.originalSlug.value = project?.slug ?? ''
  fields.name.value = project?.name ?? ''
  fields.slug.value = project?.slug ?? ''
  fields.kind.value = project?.kind ?? ''
  fields.services.value = project?.services ?? ''
  fields.image.value = project?.image ?? ''
  fields.descriptor.value = project?.descriptor ?? ''
  fields.tags.value = project?.tags.join(', ') ?? ''
  fields.liveUrl.value = project?.liveUrl ?? ''
  fields.demoUrl.value = project?.demoUrl ?? ''
  fields.challenge.value = project?.challenge ?? ''
  fields.approach.value = project?.approach ?? ''
  fields.solution.value = project?.solution ?? ''
  fields.result.value = project?.result ?? ''
  ;(form.elements.namedItem('published') as HTMLInputElement).checked = project?.published ?? true
  dialog.showModal()
}

async function submitAdminLogin(form: HTMLFormElement) {
  const data = new FormData(form)
  const email = String(data.get('email') ?? '').trim()
  const password = String(data.get('password') ?? '')
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  if (submit) {
    submit.disabled = true
    submit.textContent = 'Signing in...'
  }
  let authData: { session: { user: { id: string } } | null }
  let error: { message: string } | null
  try {
    const result = await supabase!.auth.signInWithPassword({ email, password })
    authData = result.data
    error = result.error
  } catch {
    showAdminLogin('Supabase could not be reached. Check that the development server and internet connection are active.')
    return
  }
  if (error) {
    const detail = error.message.toLowerCase()
    const message = detail.includes('not confirmed')
      ? 'This email has not been confirmed in Supabase Authentication > Users.'
      : detail.includes('invalid login')
        ? 'The email or password is incorrect.'
        : `Supabase sign-in failed: ${error.message}`
    showAdminLogin(message)
    return
  }
  await initializeSupabase(authData.session)
}

function showAdminLogin(message = '') {
  if (!app || location.pathname !== '/admin') return
  app.classList.remove('auth-pending')
  app.innerHTML = `<main class="admin-auth-page"><div class="admin-auth-card"><span class="eyebrow">OSEDEV / STUDIO</span><h1>Studio access</h1><p>Sign in to manage your website and portfolio.</p><form id="admin-login-form"><label for="admin-login-email">Email address</label><input id="admin-login-email" name="email" type="email" autocomplete="email" required><label for="admin-login-password">Password</label><input id="admin-login-password" name="password" type="password" autocomplete="current-password" required><button class="button button-admin" type="submit">Sign in</button><button class="auth-link" type="button" data-forgot-password>Forgot password?</button><p class="admin-auth-error" role="alert">${escapeHtml(message)}</p></form></div></main>`
  document.querySelector<HTMLFormElement>('#admin-login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    void submitAdminLogin(form)
  })
  document.querySelector<HTMLButtonElement>('[data-forgot-password]')?.addEventListener('click', () => showPasswordReset())
}

function showAdminSetupRequired() {
  if (!app || location.pathname !== '/admin') return
  app.classList.remove('auth-pending')
  app.innerHTML = `<main class="admin-auth-page"><div class="admin-auth-card"><span class="eyebrow">OSEDEV / STUDIO</span><h1>Admin setup required</h1><p>Authentication is not configured for this deployment. Add the Supabase environment variables in Vercel, then redeploy the project.</p></div></main>`
}

function showPasswordReset(message = '') {
  if (!app || location.pathname !== '/admin') return
  app.classList.remove('auth-pending')
  app.innerHTML = `<main class="admin-auth-page"><div class="admin-auth-card"><span class="eyebrow">OSEDEV / STUDIO</span><h1>Reset password</h1><p>We will email a secure reset link to your account.</p><form id="admin-reset-form"><label for="admin-reset-email">Email address</label><input id="admin-reset-email" name="email" type="email" autocomplete="email" required><button class="button button-admin" type="submit">Send reset link</button><button class="auth-link" type="button" data-back-to-login>Back to sign in</button><p class="admin-auth-error" role="alert">${escapeHtml(message)}</p></form></div></main>`
  document.querySelector<HTMLFormElement>('#admin-reset-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const email = String(new FormData(form).get('email') ?? '').trim()
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (submit) submit.disabled = true
    const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin` })
    if (error) {
      const detail = error.message.toLowerCase()
      const message = detail.includes('redirect')
        ? 'Supabase rejected this local redirect. Add http://127.0.0.1:5173/admin to Authentication > URL Configuration.'
        : detail.includes('rate')
          ? 'Supabase email rate limit reached. Wait a few minutes before requesting another email.'
          : `Supabase could not send the reset email: ${error.message}`
      showPasswordReset(message)
      return
    }
    showPasswordReset('Check your email for the secure password reset link.')
  })
  document.querySelector<HTMLButtonElement>('[data-back-to-login]')?.addEventListener('click', () => showAdminLogin())
}

function showPasswordUpdate(message = '') {
  if (!app || location.pathname !== '/admin') return
  app.classList.remove('auth-pending')
  app.innerHTML = `<main class="admin-auth-page"><div class="admin-auth-card"><span class="eyebrow">OSEDEV / STUDIO</span><h1>Choose a password</h1><p>Set a new password for your studio account.</p><form id="admin-update-password-form"><label for="admin-new-password">New password</label><input id="admin-new-password" name="password" type="password" minlength="8" autocomplete="new-password" required><label for="admin-confirm-password">Confirm password</label><input id="admin-confirm-password" name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required><button class="button button-admin" type="submit">Update password</button><p class="admin-auth-error" role="alert">${escapeHtml(message)}</p></form></div></main>`
  document.querySelector<HTMLFormElement>('#admin-update-password-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)
    const password = String(data.get('password') ?? '')
    const confirmPassword = String(data.get('confirmPassword') ?? '')
    if (password !== confirmPassword) {
      showPasswordUpdate('The passwords do not match.')
      return
    }
    const { error } = await supabase!.auth.updateUser({ password })
    if (error) {
      showPasswordUpdate('The password could not be updated. Request a new reset link and try again.')
      return
    }
    history.replaceState({}, '', '/admin')
    await supabase!.auth.signOut()
    showAdminLogin('Password updated. Sign in with your new password.')
  })
}

async function initializeSupabase(sessionOverride?: { user: { id: string } } | null) {
  if (!supabaseConfigured || !supabase) {
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') showAdminSetupRequired()
    return
  }
  const session = sessionOverride === undefined ? (await supabase.auth.getSession()).data.session : sessionOverride
  if (location.pathname === '/admin') {
    if (location.hash.includes('type=recovery')) {
      if (session) showPasswordUpdate()
      else showAdminLogin('This reset link has expired. Request a new one.')
      return
    }
    if (!session) {
      showAdminLogin()
      return
    }
    const { data: membership, error: membershipError } = await supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle()
    if (membershipError) {
      showAdminLogin(`Supabase could not verify admin access: ${membershipError.message}`)
      return
    }
    if (!membership) {
      await supabase.auth.signOut()
      setAdminSession(false)
      showAdminLogin('This account is not authorized for studio access.')
      return
    }
    setAdminSession(true)
    app?.classList.remove('auth-pending')
    window.dispatchEvent(new Event('admin-authenticated'))
  }
  await loadRemoteContent()
}

function renderForCurrentRoute() {
  if (location.pathname === '/') renderPublicHome()
  else if (location.pathname.startsWith('/work/')) renderCaseStudy()
}

if (app) {
  const observer = new MutationObserver(() => {
    if (location.pathname === '/admin') addAdminNavigation()
    renderForCurrentRoute()
  })
  observer.observe(app, { childList: true })
  renderForCurrentRoute()
  void initializeSupabase()

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null
    const submit = target?.closest<HTMLButtonElement>('#admin-login-form button[type="submit"]')
    if (!submit || submit.dataset.loginStarted === 'true' || !submit.form) return
    event.preventDefault()
    submit.dataset.loginStarted = 'true'
    void submitAdminLogin(submit.form)
  }, true)

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null
    const logout = target?.closest<HTMLButtonElement>('[data-admin-logout]')
    if (logout) {
      event.preventDefault()
      void supabase?.auth.signOut().finally(() => {
        setAdminSession(false)
        location.reload()
      })
      return
    }
    const viewButton = target?.closest<HTMLButtonElement>('[data-admin-view="Portfolio"], [data-admin-view="Website"]')
    if (viewButton) {
      event.preventDefault()
      event.stopImmediatePropagation()
      showAdminEditor(viewButton.dataset.adminView as 'Portfolio' | 'Website')
      return
    }

    const action = target?.closest<HTMLElement>('[data-editor-action], [data-edit-project], [data-toggle-project], [data-delete-project], [data-close-editor]')
    if (action?.hasAttribute('data-close-editor')) {
      document.querySelector<HTMLDialogElement>('#portfolio-dialog')?.close()
    } else if (action?.dataset.editorAction === 'new-project') {
      openPortfolioEditor()
    } else if (action?.dataset.editProject) {
      openPortfolioEditor(action.dataset.editProject)
    } else if (action?.dataset.toggleProject) {
      const project = savedContent.projects.find((item) => item.slug === action.dataset.toggleProject)
      if (!project) return
      project.published = !project.published
      saveContent()
      renderPortfolioAdmin()
      toast(project.published ? `${project.name} is published in this browser.` : `${project.name} is now a draft.`)
    } else if (action?.dataset.deleteProject) {
      const project = savedContent.projects.find((item) => item.slug === action.dataset.deleteProject)
      if (!project || !window.confirm(`Delete “${project.name}” from this browser?`)) return
      savedContent.projects = savedContent.projects.filter((item) => item.slug !== project.slug)
      saveContent()
      renderPortfolioAdmin()
      toast(`${project.name} deleted.`)
    }
  }, true)

  document.addEventListener('submit', (event) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement)) return
    if (form.id === 'portfolio-form') {
      event.preventDefault()
      const data = new FormData(form)
      const name = String(data.get('name')).trim()
      const slug = slugify(String(data.get('slug') || name))
      if (!name || !slug) return
      const originalSlug = String(data.get('originalSlug'))
      const duplicate = savedContent.projects.some((project) => project.slug === slug && project.slug !== originalSlug)
      if (duplicate) {
        const slugField = form.elements.namedItem('slug') as HTMLInputElement | null
        slugField?.setCustomValidity('That project URL is already in use.')
        form.reportValidity()
        slugField?.setCustomValidity('')
        return
      }
      const image = String(data.get('image')).trim()
      const candidate: PortfolioProject = {
        slug,
        name,
        kind: String(data.get('kind')).trim(),
        services: String(data.get('services')).trim(),
        image: imageUrl(image, 1500) ? image : '',
        descriptor: String(data.get('descriptor')).trim(),
        challenge: String(data.get('challenge')).trim(),
        approach: String(data.get('approach')).trim(),
        solution: String(data.get('solution')).trim(),
        result: String(data.get('result')).trim(),
        tags: String(data.get('tags')).split(',').map((tag) => tag.trim()).filter(Boolean),
        liveUrl: safeExternalUrl(String(data.get('liveUrl'))),
        demoUrl: safeExternalUrl(String(data.get('demoUrl'))),
        published: data.get('published') === 'on',
        featured: savedContent.projects.find((project) => project.slug === originalSlug)?.featured ?? savedContent.projects.length === 0,
      }
      const index = savedContent.projects.findIndex((project) => project.slug === originalSlug)
      if (index >= 0) savedContent.projects[index] = candidate
      else savedContent.projects.push(candidate)
      if (!saveContent()) {
        toast('Browser storage is unavailable. This change could not be saved.')
        return
      }
      document.querySelector<HTMLDialogElement>('#portfolio-dialog')?.close()
      renderPortfolioAdmin()
      toast(`${name} saved in this browser.`)
      return
    }

    if (form.id === 'website-content-form') {
      event.preventDefault()
      const data = new FormData(form)
      const read = (name: string) => String(data.get(name) ?? '').trim()
      const list = (name: string) => read(name).split(',').map((value) => value.trim()).filter(Boolean)
      const current = savedContent.website
      savedContent.website = {
        ...current,
        navWork: read('navWork'),
        navServices: read('navServices'),
        navStudio: read('navStudio'),
        navProcess: read('navProcess'),
        navContact: read('navContact'),
        heroKicker: read('heroKicker'),
        heroLocation: read('heroLocation'),
        heroTitle: read('heroTitle'),
        heroHighlight: read('heroHighlight'),
        heroDescription: read('heroDescription'),
        heroPrimaryAction: read('heroPrimaryAction'),
        heroSecondaryAction: read('heroSecondaryAction'),
        heroProof: list('heroProof'),
        heroBottom: read('heroBottom'),
        heroScroll: read('heroScroll'),
        introLabel: read('introLabel'),
        introLead: read('introLead'),
        introHighlight: read('introHighlight'),
        introDescription: read('introDescription'),
        workLabel: read('workLabel'),
        workLinkLabel: read('workLinkLabel'),
        workTitle: read('workTitle'),
        workHighlight: read('workHighlight'),
        workDescription: read('workDescription'),
        workNote: read('workNote'),
        servicesLabel: read('servicesLabel'),
        servicesTitle: read('servicesTitle'),
        servicesHighlight: read('servicesHighlight'),
        servicesDescription: read('servicesDescription'),
        services: current.services.map((service, index) => ({
          ...service,
          title: read(`serviceTitle${index}`),
          short: read(`serviceShort${index}`),
          description: read(`serviceDescription${index}`),
          tags: list(`serviceTags${index}`),
        })),
        servicesAction: read('servicesAction'),
        studioLabel: read('studioLabel'),
        studioTitle: read('studioTitle'),
        studioHighlight: read('studioHighlight'),
        studioParagraph1: read('studioParagraph1'),
        studioParagraph2: read('studioParagraph2'),
        studioImage: read('studioImage'),
        studioImageAlt: read('studioImageAlt'),
        studioCaption: read('studioCaption'),
        studioLinkLabel: read('studioLinkLabel'),
        studioValues: current.studioValues.map((_, index) => read(`studioValue${index}`)),
        processLabel: read('processLabel'),
        processTitle: read('processTitle'),
        processHighlight: read('processHighlight'),
        processDescription: read('processDescription'),
        processSteps: current.processSteps.map((step, index) => ({
          ...step,
          label: read(`stepLabel${index}`),
          title: read(`stepTitle${index}`),
          description: read(`stepDescription${index}`),
        })),
        contactEyebrow: read('contactEyebrow'),
        contactTitle: read('contactTitle'),
        contactHighlight: read('contactHighlight'),
        contactDescription: read('contactDescription'),
        formHeading: read('formHeading'),
        formDuration: read('formDuration'),
        formNote: read('formNote'),
        formNameLabel: read('formNameLabel'),
        formNamePlaceholder: read('formNamePlaceholder'),
        formEmailLabel: read('formEmailLabel'),
        formEmailPlaceholder: read('formEmailPlaceholder'),
        formMessageLabel: read('formMessageLabel'),
        formMessagePlaceholder: read('formMessagePlaceholder'),
        formSubmitLabel: read('formSubmitLabel'),
        contactEmail: read('contactEmail'),
        footerIntro: read('footerIntro'),
        footerNote1: read('footerNote1'),
        footerNote2: read('footerNote2'),
        footerRegion: read('footerRegion'),
        footerExploreLabel: read('footerExploreLabel'),
        footerContactLabel: read('footerContactLabel'),
        footerBottom: read('footerBottom'),
        caseBriefTitle: read('caseBriefTitle'),
        caseBriefHighlight: read('caseBriefHighlight'),
        caseTypeLabel: read('caseTypeLabel'),
        caseCoverLabel: read('caseCoverLabel'),
        caseLiveLabel: read('caseLiveLabel'),
        caseDemoLabel: read('caseDemoLabel'),
        caseBackLabel: read('caseBackLabel'),
        caseBriefLabel: read('caseBriefLabel'),
        caseApproachLabel: read('caseApproachLabel'),
        caseSolutionLabel: read('caseSolutionLabel'),
        caseApproachTitle: read('caseApproachTitle'),
        caseApproachHighlight: read('caseApproachHighlight'),
        caseSolutionTitle: read('caseSolutionTitle'),
        caseSolutionHighlight: read('caseSolutionHighlight'),
        caseOutcomeLabel: read('caseOutcomeLabel'),
        caseMeta: read('caseMeta'),
        caseCtaEyebrow: read('caseCtaEyebrow'),
        caseCtaTitle: read('caseCtaTitle'),
        caseCtaHighlight: read('caseCtaHighlight'),
        caseCtaButton: read('caseCtaButton'),
      }
      if (saveContent()) toast('All website sections saved in this browser.')
      else toast('Browser storage is unavailable. This change could not be saved.')
    }
  }, true)

}