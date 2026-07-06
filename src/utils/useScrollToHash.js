let lenisInstance = null

export function setLenisInstance(lenis) {
  lenisInstance = lenis
}

export function scrollToHash(id) {
  const el = document.getElementById(id)
  if (!el) return

  if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
    lenisInstance.scrollTo(el, { offset: 0 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function createContactHandler(pathname, transitionTo) {
  return (e) => {
    e.preventDefault()
    if (pathname === '/') {
      scrollToHash('contact')
    } else {
      transitionTo('/#contact')
    }
  }
}
