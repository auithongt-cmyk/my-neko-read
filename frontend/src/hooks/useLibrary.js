import { useEffect, useMemo, useState } from 'react'
import { LIBRARY_STORAGE_KEY } from '../utils/constants'
import { createLibraryRecord } from '../utils/manga'

function readLibrary() {
  try {
    const saved = JSON.parse(localStorage.getItem(LIBRARY_STORAGE_KEY) || '{}')
    return {
      following: Array.isArray(saved.following) ? saved.following : [],
      history: Array.isArray(saved.history) ? saved.history : [],
    }
  } catch (error) {
    console.error('อ่านรายการมังงะที่บันทึกไว้ไม่สำเร็จ:', error)
    return { following: [], history: [] }
  }
}

export default function useLibrary() {
  const [library, setLibrary] = useState(readLibrary)

  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library))
    } catch (error) {
      console.error('บันทึกรายการมังงะไม่สำเร็จ:', error)
    }
  }, [library])

  // Set ทำให้เช็กว่าเรื่องไหนถูกติดตามได้แบบ O(1)
  const followedIds = useMemo(
    () => new Set(library.following.map((item) => item.id)),
    [library.following],
  )

  const toggleFollow = (manga, coverUrl) => {
    if (!manga) return
    const record = createLibraryRecord(manga, coverUrl)
    setLibrary((current) => ({
      ...current,
      following: current.following.some((item) => item.id === record.id)
        ? current.following.filter((item) => item.id !== record.id)
        : [record, ...current.following],
    }))
  }

  const removeLibraryItem = (item, tab) => {
    setLibrary((current) => ({
      ...current,
      [tab]: current[tab].filter((record) => record.id !== item.id),
    }))
  }

  return { library, setLibrary, followedIds, toggleFollow, removeLibraryItem }
}
