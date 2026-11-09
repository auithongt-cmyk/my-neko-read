import { useRef } from 'react'

function HorizontalSection({ title, id, items, renderItem }) {
  const scrollRef = useRef(null)

  const scrollNext = () => {
    const element = scrollRef.current
    if (!element) return

    const maxScrollLeft = element.scrollWidth - element.clientWidth
    if (maxScrollLeft <= 0 || element.scrollLeft >= maxScrollLeft - 1) {
      element.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    element.scrollTo({
      left: Math.min(element.scrollLeft + element.clientWidth, maxScrollLeft),
      behavior: 'smooth',
    })
  }

  return (
    <section className="manga-section">
      <div className="section-heading">
        <h2 className="section-title">{title}</h2>
        <button className="section-next-button" type="button" aria-label={`เลื่อน${title}`} onClick={scrollNext}>
          <img src="/button-right.png" alt="" />
        </button>
      </div>
      <div
        className="manga-scroll-x"
        id={id}
        ref={scrollRef}
        style={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', gap: 15, width: '100%' }}
      >
        {items.map((manga, index) => renderItem(manga, index))}
      </div>
    </section>
  )
}

export default HorizontalSection
