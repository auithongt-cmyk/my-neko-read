import { useState } from 'react'
import LibraryItem from './LibraryItem'

function FavoritesPage({ library, onOpenManga, onRemove }) {
  const [tab, setTab] = useState('history')
  const items = library[tab]

  return (
    <div id="favoritesPage" className="page-section">
      <h2 className="page-title">เว็บตูนของฉัน</h2>
      <div className="fav-tabs">
        <button className={`fav-tab-btn ${tab === 'history' ? 'active' : ''}`} type="button" aria-pressed={tab === 'history'} onClick={() => setTab('history')}>เมื่อเร็วๆ นี้</button>
        <button className={`fav-tab-btn ${tab === 'following' ? 'active' : ''}`} type="button" aria-pressed={tab === 'following'} onClick={() => setTab('following')}>รายการที่ติดตาม</button>
      </div>
      <div className="fav-list" id="favListContainer">
        {!items.length && (
          <p className="library-empty-state">
            {tab === 'following' ? 'ยังไม่มีมังงะที่ติดตาม' : 'ยังไม่มีประวัติการเปิดดูมังงะ'}
          </p>
        )}
        {items.map((record) => (
          <LibraryItem
            key={record.id}
            record={record}
            tab={tab}
            onOpen={onOpenManga}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
