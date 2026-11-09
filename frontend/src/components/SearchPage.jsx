import MangaCard from './MangaCard'
import Pagination from './Pagination'
import { SEARCH_MAX_RESULTS, SEARCH_PAGE_SIZE } from '../utils/constants'
import { getMangaId, getMangaTitle } from '../utils/manga'

function getStatusText({ loading, error, results, page, total }) {
  if (loading) return 'กำลังโหลด...'
  if (error) return error
  if (!results.length) return 'ไม่พบมังงะที่ตรงกับการค้นหา'
  const start = (page - 1) * SEARCH_PAGE_SIZE + 1
  const end = (page - 1) * SEARCH_PAGE_SIZE + results.length
  const totalText = total > SEARCH_MAX_RESULTS ? '1,000+ เรื่อง' : `${total} เรื่อง`
  return `แสดง ${start}-${end} จาก ${totalText}`
}

function SearchPage({ search, genres, followedIds, onOpenManga, onRandom, randomLoading, randomError }) {
  return (
    <div id="searchPage" className="page-section">
      <h2 className="page-title">ค้นหา</h2>
      <div className="search-bar-container">
        <input
          type="search"
          className="search-input"
          placeholder="หาเรื่องน่าอ่านได้ที่นี่"
          value={search.searchText}
          onChange={(event) => search.updateSearchText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') search.submitSearch()
          }}
        />
        <select
          className="genre-dropdown"
          value={search.genre}
          onChange={(event) => search.updateGenre(event.target.value)}
        >
          <option value="">ประเภท</option>
          {genres.map((tag) => (
            <option value={tag.id} key={tag.id}>
              {tag.attributes?.name?.en || Object.values(tag.attributes?.name || {})[0] || 'ประเภทอื่น'}
            </option>
          ))}
        </select>
        <button className="cat-random-btn" type="button" onClick={onRandom} disabled={randomLoading}>
          <img src="/cat-random-btn.png" alt="สุ่มมังงะ" className="cat-random-img-icon" />
        </button>
      </div>
      {randomError && <p className="app-load-error" role="alert">{randomError}</p>}

      <section className="manga-section">
        <div className="section-heading">
          <h2 className="section-title">{search.searchQuery || search.genre ? 'ผลการค้นหา' : 'มังงะยอดนิยม'}</h2>
        </div>
        <p className="search-status" role="status" aria-live="polite">
          {getStatusText(search)}
        </p>
        <div className="manga-search-grid" id="trendingSearchScroll">
          {search.results.map((manga) => (
            <MangaCard
              key={getMangaId(manga)}
              manga={manga}
              className="search-result-card"
              isFollowed={followedIds.has(getMangaId(manga))}
              onOpen={() => onOpenManga(manga)}
            >
              <span className="search-result-title">{getMangaTitle(manga)}</span>
            </MangaCard>
          ))}
        </div>
        {!search.loading && search.pageCount > 1 && (
          <Pagination page={search.page} pageCount={search.pageCount} onChange={search.changePage} />
        )}
      </section>
    </div>
  )
}

export default SearchPage
