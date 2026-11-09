function Header() {
  return (
    <header className="header">
      <img src="/logo.png" alt="NEKOread" className="logo-img" />
      <div className="user-container">
        <span className="user-text">บัญชี</span>
        <img src="/icon-user.png" alt="บัญชีผู้ใช้" className="user-icon" />
      </div>
    </header>
  )
}

export default Header
