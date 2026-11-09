import BannerSlider from './BannerSlider'
import HorizontalSection from './HorizontalSection'
import MangaCard from './MangaCard'
import { getMangaDescription, getMangaId, getMangaTitle } from '../utils/manga'

function HomePage({ homeManga, homeError, followedIds, onOpenManga, onOpenBanner }) {
  const card = (manga, className, children = null) => (
    <MangaCard
      key={getMangaId(manga)}
      manga={manga}
      className={className}
      isFollowed={followedIds.has(getMangaId(manga))}
      onOpen={() => onOpenManga(manga)}
    >
      {children}
    </MangaCard>
  )

  return (
    <div id="homePage" className="page-section">
      <BannerSlider onOpenBanner={onOpenBanner} />

      <section className="manga-section">
        <h2 className="section-title">พิเศษสำหรับคุณ</h2>
        {homeError && <p className="app-load-error" role="alert">{homeError}</p>}
        {!homeError && !homeManga.length && <p className="loading">กำลังโหลด...</p>}
        <div className="manga-grid" id="specialGrid">
          {homeManga.slice(5, 17).map((manga) => card(manga, 'manga-card'))}
        </div>
      </section>

      <HorizontalSection
        title="ฮอตประจำสัปดาห์"
        id="weeklyFeaturedScroll"
        items={homeManga.slice(17, 27)}
        renderItem={(manga, index) => card(manga, 'rank-loop-card', <div className="rank-loop-number">{index + 1}</div>)}
      />
      <HorizontalSection
        title="เรื่องใหม่สัปดาห์นี้"
        id="newReleasesScroll"
        items={homeManga.slice(27, 37)}
        renderItem={(manga) => card(manga, 'new-release-card')}
      />
      <HorizontalSection
        title="มาแรงฮิตติดเทรนด์"
        id="trendingScroll"
        items={homeManga.slice(37, 47)}
        renderItem={(manga) => card(manga, 'trend-horizontal-card', (
          <div className="trend-info">
            <strong>{getMangaTitle(manga)}</strong>
            <span className="trend-status">Genre: {manga.type || 'manga'} | {manga.attributes?.status || 'ไม่ทราบสถานะ'}</span>
            <span className="trend-description">
              {getMangaDescription(manga, 'ไม่มีข้อมูลเรื่องย่อของมังงะเรื่องนี้...')}
            </span>
          </div>
        ))}
      />
      <HorizontalSection
        title="เร็ว ๆ นี้พบกัน"
        id="comingSoonScroll"
        items={homeManga.slice(47, 57)}
        renderItem={(manga) => card(manga, 'coming-soon-card')}
      />
    </div>
  )
}

export default HomePage
