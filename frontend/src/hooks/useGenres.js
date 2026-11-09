import { useEffect, useState } from 'react'
import { fetchApiJson } from '../api'

export default function useGenres() {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    let active = true
    fetchApiJson('/api/genres')
      .then((data) => {
        if (!Array.isArray(data.data)) throw new Error(data.error || 'โหลดประเภทมังงะไม่สำเร็จ')
        const values = data.data
          .filter((tag) => tag.attributes?.group === 'genre')
          .sort((first, second) => (
            (first.attributes?.name?.en || '').localeCompare(second.attributes?.name?.en || '')
          ))
        if (active) setGenres(values)
      })
      .catch((error) => console.error('โหลดประเภทมังงะไม่สำเร็จ:', error))
    return () => { active = false }
  }, [])

  return genres
}
