import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIdle } from './useIdle'

describe('useIdle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('menjadi idle setelah delay tanpa aktivitas', () => {
    const { result } = renderHook(() => useIdle(1000))
    expect(result.current.isIdle).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.isIdle).toBe(true)
  })

  it('aktivitas mereset hitungan idle', () => {
    const { result } = renderHook(() => useIdle(1000))

    act(() => {
      vi.advanceTimersByTime(600)
      window.dispatchEvent(new Event('keydown'))
      vi.advanceTimersByTime(600)
    })
    // Total 1200ms tapi ada aktivitas di 600ms → belum idle.
    expect(result.current.isIdle).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.isIdle).toBe(true)
  })

  it('tidak pernah idle ketika dinonaktifkan', () => {
    const { result } = renderHook(() => useIdle(1000, false))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.isIdle).toBe(false)
  })
})
