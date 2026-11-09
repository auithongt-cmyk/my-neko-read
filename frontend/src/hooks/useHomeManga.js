import { useEffect, useState } from 'react'
import { fetchApiJson } from '../api'

export default function useHomeManga() {
  const [homeManga, setHomeManga] = useState([])
  const [homeError, setHomeError] = useState('')

  useEffect(() => {
    let active = true
    fetchApiJson('/api/recommend')
      .then((data) => {
        if (!Array.isArray(data.data)) throw new Error(data.error || 'รูปแบบข้อมูลจาก API ไม่ถูกต้อง')
        if (data.data.length === 0) throw new Error('ยังไม่มีรายการแนะนำให้แสดง')
        if (active) setHomeManga(data.data)
      })
      .catch((error) => {
        if (!active) return
        console.error('โหลดรายการแนะนำไม่สำเร็จ:', error)
        fetchApiJson('/api/search?limit=100')
          .then((data) => {
            if (!Array.isArray(data.data)) throw new Error(data.error || 'รูปแบบข้อมูลจาก API ไม่ถูกต้อง')
            if (active) {
              setHomeManga(data.data)
              setHomeError('โหลดรายการแนะนำไม่สำเร็จ กำลังแสดงมังงะยอดนิยมแทน')
            }
          })
          .catch((fallbackError) => {
            if (active) setHomeError(fallbackError.message)
          })
      })
    return () => { active = false }
  }, [])

  return { homeManga, homeError }
}
