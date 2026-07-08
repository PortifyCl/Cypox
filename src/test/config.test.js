import { describe, it, expect } from 'vitest'
import { SITE_URL, EMAIL, PHONE, PHONE_RAW, WHATSAPP_URL, TIKTOK_URL } from '../config'

describe('config', () => {
  it('has SITE_URL', () => {
    expect(SITE_URL).toBeTruthy()
    expect(typeof SITE_URL).toBe('string')
  })

  it('has EMAIL', () => {
    expect(EMAIL).toBeTruthy()
    expect(EMAIL).toContain('@')
  })

  it('has PHONE in international format', () => {
    expect(PHONE).toBeTruthy()
    expect(PHONE_RAW).toBeTruthy()
    expect(PHONE_RAW).toMatch(/^\d+$/)
  })

  it('has WHATSAPP_URL', () => {
    expect(WHATSAPP_URL).toMatch(/^https:\/\/wa\.me\//)
  })

  it('has TIKTOK_URL', () => {
    expect(TIKTOK_URL).toMatch(/^https:\/\/tiktok\.com\//)
  })
})
