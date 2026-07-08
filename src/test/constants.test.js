import { describe, it, expect } from 'vitest'
import { categoryColors, categoryLabels } from '../utils/constants'

describe('constants', () => {
  it('has colors for all categories', () => {
    expect(categoryColors.graphisme).toBeDefined()
    expect(categoryColors['ui-ux']).toBeDefined()
    expect(categoryColors.web).toBeDefined()
  })

  it('has labels for all categories', () => {
    expect(categoryLabels.graphisme).toBe('Graphisme')
    expect(categoryLabels['ui-ux']).toBe('UI/UX')
    expect(categoryLabels.web).toBe('Web')
  })
})
