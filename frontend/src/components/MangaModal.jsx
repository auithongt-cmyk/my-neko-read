import { useEffect, useState } from 'react'
import CoverImage from './CoverImage'
import { fetchApiJson } from '../api'
import { getMangaAltTitle, getMangaDescription, getMangaTitle } from '../utils/manga'

function MangaModal({ manga, cover, isFollowed, onToggleFollow, onClose }) {
  const [followerCount, setFollowerCount] = useState('')

  useEffect(() => {
    if (!manga?.id || String(manga.id).startsWith('banner-')) {
      setFollowerCount('ไม่มีข้อมูล')
      return undefined
    }

    const controller = new AbortController()
    setFollowerCount('กำลังโหลด...')
    fetchApiJson(`/api/rating/${encodeURIComponent(manga.id)}`, controller.signal)
      .then((data) => {
        const follows = data.statistics?.[manga.id]?.follows
        setFollowerCount(Number.isFinite(follows) ? new Intl.NumberFormat('th-TH').format(follows) : 'ไม่มีข้อมูล')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('โหลดจำนวนผู้ติดตามไม่สำเร็จ:', error)
          setFollowerCount('โหลดไม่สำเร็จ')
        }
      })
    return () => controller.abort()
  }, [manga])

  const attributes = manga.attributes || {}
  const followLabel = isFollowed ? 'เลิกติดตาม' : 'เพิ่มรายการโปรด'
  const altTitle = getMangaAltTitle(manga)

  return (
    <div
      className="manga-modal"
      id="mangaModal"
      role="dialog"
      aria-modal="true"
      aria-label="รายละเอียดมังงะ"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="cat-folder-container">
        <button className="cat-close-trigger" type="button" aria-label="ปิดหน้าต่าง" onClick={onClose}>&times;</button>
        <div className="cat-main-layout">
          <div className="cat-left-content">
            <h2 className="cat-modal-title">{getMangaTitle(manga)}</h2>
            <p className="cat-modal-status">
              {[attributes.status, attributes.year].filter(Boolean).join(' · ')}
            </p>
            <div className="cat-description-box">
              <strong>เรื่องย่อ :</strong>
              <p>{getMangaDescription(manga, 'ยังไม่มีเรื่องย่อ')}</p>
            </div>
            {altTitle && <p className="cat-modal-alt-title">{altTitle}</p>}
            <div className="cat-followers-box" aria-live="polite">
              <span className="cat-followers-label">ผู้ติดตาม</span>
              <span>{followerCount}</span>
            </div>
          </div>
          <div className="cat-right-content">
            <div className="cat-cover-frame">
              <CoverImage src={cover} alt={`ปก ${getMangaTitle(manga)}`} />
            </div>
            <button
              className={`cat-follow-btn ${isFollowed ? 'is-followed' : ''}`}
              type="button"
              aria-label={followLabel}
              aria-pressed={isFollowed}
              onClick={onToggleFollow}
            >
              {followLabel}
            </button>
          </div>
        </div>
        <div className="cat-bottom-capsules">
          <div className="cat-tags-group">
            {(attributes.tags || [])
              .filter((tag) => tag.attributes?.group === 'genre')
              .slice(0, 3)
              .map((tag) => (
                <span className="manga-modal-tag" key={tag.id || getMangaTitle(tag)}>
                  {tag.attributes?.name?.en || Object.values(tag.attributes?.name || {})[0]}
                </span>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MangaModal
