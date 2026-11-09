function RandomLoadingOverlay() {
  return (
    <div className="cat-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="cat-loading-content">
        <img src="/cat-loading.png" alt="กำลังสุ่มมังงะ..." className="cat-loading-gif" />
        <div className="cat-progress-bar-container">
          <div className="cat-progress-bar-fill" />
        </div>
      </div>
    </div>
  )
}

export default RandomLoadingOverlay
