import { useRef } from 'react'
import { bannerManga } from '../utils/constants'

function BannerSlider({ onOpenBanner }) {
  const sliderRef = useRef(null)

  const scrollBanner = (direction) => {
    const slider = sliderRef.current
    slider?.scrollBy({ left: direction * slider.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="banner-section">
      <div className="banner-slider" id="bannerSlider" ref={sliderRef}>
        {bannerManga.map((entry) => (
          <div
            className="banner-slide"
            key={entry.title}
            role="button"
            tabIndex={0}
            onClick={() => onOpenBanner(entry)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onOpenBanner(entry)
            }}
          >
            <img src={entry.image} alt={entry.title} />
          </div>
        ))}
      </div>
      <button className="banner-arrow banner-arrow-left" type="button" aria-label="แบนเนอร์ก่อนหน้า" onClick={() => scrollBanner(-1)}>
        <img src="/left.png" alt="" />
      </button>
      <button className="banner-arrow banner-arrow-right" type="button" aria-label="แบนเนอร์ถัดไป" onClick={() => scrollBanner(1)}>
        <img src="/right.png" alt="" />
      </button>
    </section>
  )
}

export default BannerSlider
