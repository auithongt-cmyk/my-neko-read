import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchApiJson } from '../api'
import { createLibraryRecord, getMangaCoverUrl } from '../utils/manga'

export default function useMangaModal(setLibrary) {
  const [modalManga, setModalManga] = useState(null)
  const [modalCover, setModalCover] = useState('')
  const bannerRequestRef = useRef(0)

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(modalManga))
    if (!modalManga) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        bannerRequestRef.current += 1
        setModalManga(null)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [modalManga])

  const openManga = useCallback((manga, coverUrl = getMangaCoverUrl(manga), replaceId = '', isBannerTransition = false) => {
    if (!manga) return
    if (!isBannerTransition) bannerRequestRef.current += 1
    const record = createLibraryRecord(manga, coverUrl)
    setLibrary((current) => ({
      ...current,
      history: [
        record,
        ...current.history.filter((item) => item.id !== record.id && item.id !== replaceId),
      ].slice(0, 50),
      following: replaceId
        ? current.following.map((item) => (item.id === replaceId ? record : item))
        : current.following,
    }))
    setModalCover(coverUrl)
    setModalManga(manga)
  }, [setLibrary])

  const closeMangaModal = () => {
    bannerRequestRef.current += 1
    setModalManga(null)
  }

  const openBanner = async (entry) => {
    const requestId = ++bannerRequestRef.current
    const fallbackManga = {
      id: `banner-${entry.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      attributes: { title: { en: entry.title }, description: { en: 'กำลังโหลดรายละเอียด...' } },
    }
    openManga(fallbackManga, entry.image, '', true)

    try {
      const data = await fetchApiJson(`/api/search?${new URLSearchParams({ q: entry.search })}`)
      const expectedTitles = entry.aliases.map((title) => title.toLowerCase().replace(/[^a-z0-9]/g, ''))
      const manga = (data.data || []).find((item) => {
        const titles = [
          ...Object.values(item.attributes?.title || {}),
          ...(item.attributes?.altTitles || []).flatMap((title) => Object.values(title)),
        ]
        return titles.some((title) => expectedTitles.includes(title.toLowerCase().replace(/[^a-z0-9]/g, '')))
      })
      if (requestId !== bannerRequestRef.current) return
      if (!manga) {
        setModalManga((current) => current?.id === fallbackManga.id
          ? { ...current, attributes: { ...current.attributes, description: { en: 'ยังไม่พบรายละเอียดเรื่องนี้ใน MangaDex' } } }
          : current)
        return
      }
      openManga({
        ...manga,
        attributes: { ...manga.attributes, title: { en: entry.title } },
      }, getMangaCoverUrl(manga), fallbackManga.id, true)
    } catch (error) {
      if (requestId === bannerRequestRef.current) {
        console.error('โหลดข้อมูลแบนเนอร์ไม่สำเร็จ:', error)
        setModalManga((current) => current?.id === fallbackManga.id
          ? { ...current, attributes: { ...current.attributes, description: { en: 'โหลดรายละเอียดเพิ่มเติมไม่สำเร็จ' } } }
          : current)
      }
    }
  }

  return { modalManga, modalCover, openManga, openBanner, closeMangaModal }
}
