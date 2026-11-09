function Pagination({ page, pageCount, onChange }) {
  return (
    <nav className="search-pagination" aria-label="หน้าผลการค้นหา">
      <button type="button" onClick={() => onChange(1)} disabled={page === 1}>«</button>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      <span>{page} / {pageCount}</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount}>›</button>
      <button type="button" onClick={() => onChange(pageCount)} disabled={page === pageCount}>»</button>
    </nav>
  )
}

export default Pagination
