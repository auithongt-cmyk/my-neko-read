import CoverImage from './CoverImage'
import { getMangaCoverUrl, getMangaTitle } from '../utils/manga'

const COVER_CLASS = {
  'manga-card': 'manga-card-cover',
  'rank-loop-card': 'rank-loop-cover',
  'new-release-card': 'new-release-cover',
  'trend-horizontal-card': 'trend-cover',
  'coming-soon-card': 'coming-soon-cover',
}

function MangaCard({ manga, className, onOpen, isFollowed = false, children }) {
  const title = getMangaTitle(manga)

  return (
    <article
      className={className}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <CoverImage
        src={getMangaCoverUrl(manga)}
        alt={`ปก ${title}`}
        className={COVER_CLASS[className]}
        loading="lazy"
      />
      {children}
      {isFollowed && (
        <img className="manga-bookmark-badge" src="/cat-bookmark.png" alt="" aria-hidden="true" />
      )}
    </article>
  )
}

export default MangaCard
