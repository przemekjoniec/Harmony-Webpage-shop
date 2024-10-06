const hamburger = document.querySelector('.hamburger')
const navMenu = document.querySelector('.nav-menu')
const navLink = document.querySelectorAll('.nav-link')

hamburger.addEventListener('click', mobileMenu)
navLink.forEach(n => n.addEventListener('click', closeMenu))

function mobileMenu() {
	hamburger.classList.toggle('active')
	navMenu.classList.toggle('active')
}

function closeMenu() {
	hamburger.classList.remove('active')
	navMenu.classList.remove('active')
}

// CAROUSEL //
const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

let carouselVp = document.querySelector('#carousel-vp')

let cCarouselInner = document.querySelector('#cCarousel-inner')
let carouselInnerWidth = cCarouselInner.getBoundingClientRect().width

let leftValue = 0

// Variable used to set the carousel movement value (card's width + gap)
const totalMovementSize =
	parseFloat(document.querySelector('.cCarousel-item').getBoundingClientRect().width, 10) +
	parseFloat(window.getComputedStyle(cCarouselInner).getPropertyValue('gap'), 10)

prev.addEventListener('click', () => {
	if (!leftValue == 0) {
		leftValue -= -totalMovementSize
		cCarouselInner.style.left = leftValue + 'px'
	}
})

next.addEventListener('click', () => {
	const carouselVpWidth = carouselVp.getBoundingClientRect().width
	if (carouselInnerWidth - Math.abs(leftValue) > carouselVpWidth) {
		leftValue -= totalMovementSize
		cCarouselInner.style.left = leftValue + 'px'
	}
})

const mediaQuery510 = window.matchMedia('(max-width: 510px)')
const mediaQuery770 = window.matchMedia('(max-width: 770px)')

mediaQuery510.addEventListener('change', mediaManagement)
mediaQuery770.addEventListener('change', mediaManagement)

let oldViewportWidth = window.innerWidth

function mediaManagement() {
	const newViewportWidth = window.innerWidth

	if (leftValue <= -totalMovementSize && oldViewportWidth < newViewportWidth) {
		leftValue += totalMovementSize
		cCarouselInner.style.left = leftValue + 'px'
		oldViewportWidth = newViewportWidth
	} else if (leftValue <= -totalMovementSize && oldViewportWidth > newViewportWidth) {
		leftValue -= totalMovementSize
		cCarouselInner.style.left = leftValue + 'px'
		oldViewportWidth = newViewportWidth
	}
}

// FAQ //
class Accordion {
	constructor(el) {
		this.el = el
		this.summary = el.querySelector('summary')
		this.content = el.querySelector('.accordion-content')
		this.expandIcon = this.summary.querySelector('.accordion-icon')
		this.animation = null
		this.isClosing = false
		this.isExpanding = false
		this.summary.addEventListener('click', e => this.onClick(e))
	}

	onClick(e) {
		e.preventDefault()
		this.el.style.overflow = 'hidden'

		if (this.isClosing || !this.el.open) {
			this.open()
		} else if (this.isExpanding || this.el.open) {
			this.shrink()
		}
	}

	shrink() {
		this.isClosing = true

		const startHeight = `${this.el.offsetHeight}px`
		const endHeight = `${this.summary.offsetHeight}px`

		if (this.animation) {
			this.animation.cancel()
		}

		this.animation = this.el.animate(
			{
				height: [startHeight, endHeight],
			},
			{
				duration: 400,
				easing: 'ease-out',
			}
		)
		this.animation.onfinish = () => {
			this.expandIcon.setAttribute(
				'src',
				"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
			)
			return this.onAnimationFinish(false)
		}

		this.animation.oncancel = () => {
			this.expandIcon.setAttribute(
				'src',
				"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
			)
			return (this.isClosing = false)
		}
	}

	open() {
		this.el.style.height = `${this.el.offsetHeight}px`
		this.el.open = true
		window.requestAnimationFrame(() => this.expand())
	}

	expand() {
		this.isExpanding = true

		const startHeight = `${this.el.offsetHeight}px`
		const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`

		if (this.animation) {
			this.animation.cancel()
		}

		this.animation = this.el.animate(
			{
				height: [startHeight, endHeight],
			},
			{
				duration: 350,
				easing: 'ease-out',
			}
		)

		this.animation.onfinish = () => {
			this.expandIcon.setAttribute(
				'src',
				"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
			)
			return this.onAnimationFinish(true)
		}
		this.animation.oncancel = () => {
			this.expandIcon.setAttribute(
				'src',
				"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>"
			)
			return (this.isExpanding = false)
		}
	}

	onAnimationFinish(open) {
		this.el.open = open
		this.animation = null
		this.isClosing = false
		this.isExpanding = false
		this.el.style.height = this.el.style.overflow = ''
	}
}

document.querySelectorAll('details').forEach(el => {
	new Accordion(el)
})
