import { useState } from 'react'
import CoverImage from './CoverImage'
import { getMangaTitle } from '../utils/manga'

function LibraryItem({ record, tab, onOpen, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const confirmationText = tab === 'history' ? 'ลบแล้ว ✓' : 'เลิกติดตามแล้ว ✓'

  const handleRemove = () => {
    if (isRemoving) return
    setIsRemoving(true)
    window.setTimeout(() => onRemove(record, tab), 400)
  }

  return (
    <article className={`library-card ${isRemoving ? 'is-removing' : ''}`}>
      <button className="library-card-open" type="button" onClick={() => onOpen(record, record.coverUrl)}>
        <CoverImage src={record.coverUrl} alt={`ปก ${getMangaTitle(record)}`} loading="lazy" />
        <span className="library-card-title">{getMangaTitle(record)}</span>
      </button>
      <button
        className="library-card-action"
        type="button"
        aria-label={isRemoving ? confirmationText : `${tab === 'history' ? 'ลบประวัติ' : 'เลิกติดตาม'} ${getMangaTitle(record)}`}
        disabled={isRemoving}
        onClick={handleRemove}
      >
        {isRemoving ? confirmationText : tab === 'history' ? 'ลบประวัติ' : 'เลิกติดตาม'}
      </button>
    </article>
  )
}

export default LibraryItem
