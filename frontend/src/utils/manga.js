import { API_BASE_URL } from '../api'

export function getMangaTitle(manga) {
  const titles = manga?.attributes?.title || {}
  return titles.en || titles.th || Object.values(titles)[0] || 'Manga Title'
}

export function getMangaAltTitle(manga) {
  const altTitle = (manga?.attributes?.altTitles || [])
    .flatMap((title) => Object.values(title))
    .find((title) => typeof title === 'string' && title.trim())

  if (!altTitle) return ''

  const titleWords = getTitleWords(getMangaTitle(manga))
  const altTitleWords = getTitleWords(altTitle)
  const sharedWords = [...altTitleWords].filter((word) => titleWords.has(word)).length
  const similarity = sharedWords / Math.min(titleWords.size, altTitleWords.size)

  return sharedWords >= 3 && similarity >= 0.4 ? '' : altTitle
}

function getTitleWords(title) {
  return new Set(
    title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 1),
  )
}

export function getMangaCoverUrl(manga) {
  const cover = (manga?.relationships || []).find((relation) => relation.type === 'cover_art')
  const fileName = cover?.attributes?.fileName
  return fileName && manga?.id
    ? `${API_BASE_URL}/api/cover/${encodeURIComponent(manga.id)}/${encodeURIComponent(fileName)}`
    : '/logo.png'
}

export function getMangaId(manga) {
  return String(manga?.id || getMangaTitle(manga).toLowerCase().replace(/[^a-z0-9]/g, ''))
}

export function getMangaDescription(manga, fallback) {
  const description = manga?.attributes?.description || {}
  return description.en || description.th || Object.values(description)[0] || fallback
}

export function createLibraryRecord(manga, coverUrl) {
  const attributes = manga?.attributes || {}
  const description = attributes.description || {}
  return {
    id: getMangaId(manga),
    coverUrl: coverUrl || getMangaCoverUrl(manga),
    attributes: {
      title: attributes.title || { en: getMangaTitle(manga) },
      altTitles: attributes.altTitles || [],
      description,
      status: attributes.status || '',
      year: attributes.year || '',
      tags: attributes.tags || [],
    },
  }
}
