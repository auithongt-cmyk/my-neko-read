const NAV_ITEMS = [
  { id: 'home', image: '/icon-home.png', alt: 'หน้าแรก', label: 'หน้าแรก' },
  { id: 'search', image: '/icon-search.png', alt: 'ค้นหา', label: 'ค้นหา' },
  { id: 'favorites', image: '/icon-fav.png', alt: 'รายการโปรด', label: 'รายการโปรด' },
]

function BottomNav({ activePage, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {NAV_ITEMS.map((item) => (
        <button
          className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
        >
          <img src={item.image} alt={item.alt} className="nav-icon" />
          <span className="nav-text">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
