import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomePage from './components/HomePage'
import SearchPage from './components/SearchPage'
import FavoritesPage from './components/FavoritesPage'
import MangaModal from './components/MangaModal'
import RandomLoadingOverlay from './components/RandomLoadingOverlay'
import useLibrary from './hooks/useLibrary'
import useHomeManga from './hooks/useHomeManga'
import useGenres from './hooks/useGenres'
import useMangaSearch from './hooks/useMangaSearch'
import useMangaModal from './hooks/useMangaModal'
import useRandomManga from './hooks/useRandomManga'
import { getMangaId } from './utils/manga'

function App() {
  const [activePage, setActivePage] = useState('home')

  const { library, setLibrary, followedIds, toggleFollow, removeLibraryItem } = useLibrary()
  const { modalManga, modalCover, openManga, openBanner, closeMangaModal } = useMangaModal(setLibrary)
  const { homeManga, homeError } = useHomeManga()
  const genres = useGenres()
  const search = useMangaSearch()
  const { randomLoading, randomError, loadRandomManga } = useRandomManga(openManga)

  const changePage = (page) => {
    setActivePage(page)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Header />

      <main className="main-content">
        {activePage === 'home' && (
          <HomePage
            homeManga={homeManga}
            homeError={homeError}
            followedIds={followedIds}
            onOpenManga={openManga}
            onOpenBanner={openBanner}
          />
        )}
        {activePage === 'search' && (
          <SearchPage
            search={search}
            genres={genres}
            followedIds={followedIds}
            onOpenManga={openManga}
            onRandom={loadRandomManga}
            randomLoading={randomLoading}
            randomError={randomError}
          />
        )}
        {activePage === 'favorites' && (
          <FavoritesPage
            library={library}
            onOpenManga={openManga}
            onRemove={removeLibraryItem}
          />
        )}
      </main>

      <BottomNav activePage={activePage} onChange={changePage} />

      {modalManga && (
        <MangaModal
          manga={modalManga}
          cover={modalCover}
          isFollowed={followedIds.has(getMangaId(modalManga))}
          onToggleFollow={() => toggleFollow(modalManga, modalCover)}
          onClose={closeMangaModal}
        />
      )}

      {randomLoading && <RandomLoadingOverlay />}
    </>
  )
}

export default App
