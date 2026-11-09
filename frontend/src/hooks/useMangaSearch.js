import { useEffect, useRef, useState } from 'react'
import { fetchApiJson } from '../api'
import { SEARCH_MAX_RESULTS, SEARCH_PAGE_SIZE } from '../utils/constants'

export default function useMangaSearch() {
  const [searchText, setSearchText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef(0)
  const scrollAfterLoadRef = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchText.trim()), 350)
    return () => window.clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    const requestId = ++requestRef.current
    const controller = new AbortController()
    const popular = !searchQuery && !genre
    const offset = (page - 1) * SEARCH_PAGE_SIZE
    const params = new URLSearchParams({
      q: searchQuery,
      genre,
      offset: String(offset),
      limit: String(Math.min(SEARCH_PAGE_SIZE, SEARCH_MAX_RESULTS - offset)),
    })
    const endpoint = popular ? '/api/popular' : `/api/search?${params}`

    setLoading(true)
    setError('')
    fetchApiJson(endpoint, controller.signal)
      .then((data) => {
        if (!Array.isArray(data.data)) throw new Error(data.error || 'ค้นหามังงะไม่สำเร็จ')
        if (requestId !== requestRef.current) return
        setResults(data.data)
        setTotal(popular
          ? data.data.length
          : Number.isFinite(data.total) ? data.total : data.data.length)
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && requestId === requestRef.current) {
          setError(err.message)
          setResults([])
          setTotal(0)
        }
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false)
      })

    return () => controller.abort()
  }, [searchQuery, genre, page])

  useEffect(() => {
    if (!loading && scrollAfterLoadRef.current) {
      scrollAfterLoadRef.current = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [loading])

  const pageCount = Math.ceil(Math.min(total, SEARCH_MAX_RESULTS) / SEARCH_PAGE_SIZE)

  const updateSearchText = (value) => {
    setSearchText(value)
    setPage(1)
  }

  const updateGenre = (value) => {
    setGenre(value)
    setPage(1)
  }

  const submitSearch = () => setSearchQuery(searchText.trim())

  const changePage = (nextPage) => {
    const count = Math.max(1, pageCount)
    if (nextPage < 1 || nextPage > count) return
    scrollAfterLoadRef.current = true 
    setPage(nextPage)
  }

  return {
    searchText, searchQuery, genre, results, total, page, pageCount,
    loading, error,
    updateSearchText, updateGenre, submitSearch, changePage,
  }
}
