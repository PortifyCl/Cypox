import { useState } from 'react'
import { useGsapReveal } from '../hooks/useGsap'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'

export default function Contact() {
  const [contactType, setContactType] = useState('projet')
  const sectionRef = useGsapReveal({ stagger: 0.1 })

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ContactInfo contactType={contactType} setContactType={setContactType} />
          <ContactForm contactType={contactType} />
        </div>
      </div>
    </section>
  )
}
