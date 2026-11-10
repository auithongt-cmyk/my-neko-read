import { useState } from 'react'
import { fetchApiJson } from '../api'

export default function useRandomManga(openManga) {
  const [randomLoading, setRandomLoading] = useState(false)
  const [randomError, setRandomError] = useState('')

  const loadRandomManga = async () => {
    if (randomLoading) return
    setRandomLoading(true)
    setRandomError('')
    try {
      // หน่วงอย่างน้อย 1.8 วินาทีให้แอนิเมชันแมวเล่นจนจบ
      const [result] = await Promise.all([
        fetchApiJson('/api/random'),
        new Promise((resolve) => window.setTimeout(resolve, 1800)),
      ])
      if (!result.data) throw new Error('เซิร์ฟเวอร์ไม่พบมังงะที่สุ่มได้')
      openManga(result.data)
    } catch (error) {
      setRandomError(error.message)
    } finally {
      setRandomLoading(false)
    }
  }

  return { randomLoading, randomError, loadRandomManga }
}
