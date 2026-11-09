import { useEffect, useState } from 'react'

function CoverImage({ src, alt, className, loading }) {
  const [imageSrc, setImageSrc] = useState(src || '/logo.png')

  useEffect(() => {
    setImageSrc(src || '/logo.png')
  }, [src])

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (imageSrc !== '/logo.png') setImageSrc('/logo.png')
        else setImageSrc('')
      }}
      hidden={!imageSrc}
    />
  )
}

export default CoverImage
