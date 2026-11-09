export const API_BASE_URL = window.location.port === '3000'
  ? ''
  : `${window.location.protocol}//${window.location.hostname || 'localhost'}:3000`

export async function fetchApiJson(path, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal })
  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const body = await response.text()
    if (body.trimStart().startsWith('<')) {
      throw new Error('เซิร์ฟเวอร์ API ไม่พร้อมใช้งาน กรุณาเริ่มเซิร์ฟเวอร์ด้วยคำสั่ง node server.js')
    }
    throw new Error('เซิร์ฟเวอร์ส่งข้อมูลกลับมาไม่ใช่ JSON')
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || `API ตอบกลับด้วยสถานะ ${response.status}`)
  }
  return data
}
