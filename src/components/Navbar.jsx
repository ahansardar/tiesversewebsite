import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.png'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasNotice, setHasNotice] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const JOIN_US_URL = 'https://career.tiesverse.com/'

  // Configuration for Nav Items
  // FIX: Changed '/Contact' to lowercase '/contact' for standard route matching
  const navItems = [
    { label: 'Home', path: '/', sectionId: 'top' },
    { label: 'About', path: '/', sectionId: 'about-section' },
    { label: 'Research', path: '/research' },
    { label: 'Team', path: '/team' },
    { label: 'Events', path: '/events' }, 
    { label: 'Contact', path: '/contact' } 
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    const checkNotice = () => {
      const notice = document.querySelector('.global-notice-bar')
      setHasNotice(!!notice)
    }

    handleScroll()
    checkNotice()
    window.addEventListener('scroll', handleScroll)
    const interval = setInterval(checkNotice, 500)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  // Reset mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const handleNavigation = (item) => {
    setIsMobileMenuOpen(false)

    // 1. If it's a separate page route (Research, Team, Events, Contact)
    if (item.path !== '/' && !item.sectionId) {
      navigate(item.path)
      return
    }

    // 2. If it's a section on the Home page
    if (location.pathname !== '/') {
      // Navigate home first, then scroll
      navigate('/')
      setTimeout(() => scrollToSection(item.sectionId), 100)
    } else {
      // Already on home, just scroll
      scrollToSection(item.sectionId)
    }
  }

  const scrollToSection = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const el = document.getElementById(id)
    if (el) {
      const noticeHeight = hasNotice && !isScrolled ? 40 : 0
      const navHeight = isScrolled ? 70 : 90
      const totalOffset = noticeHeight + navHeight

      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - totalOffset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <style>{`
        .navbar {
  position: sticky;
  top: 0px; /* It will naturally stop at 0px when scrolled */
  left: 0; right: 0;
  z-index: 10001;
  margin-bottom: -100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

        .navbar--transparent { background-color: transparent; padding: 24px 60px; }

        .navbar--glass {
          background-color: rgba(5, 5, 5, 0.8);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 12px 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .navbar__logo-image { height: 52px; transition: height 0.3s ease; cursor: pointer; }
        .navbar--glass .navbar__logo-image { height: 40px; }

        .navbar__nav { display: flex; align-items: center; gap: 40px; }
        .navbar__nav-list { display: flex; gap: 40px; list-style: none; margin: 0; padding: 0; }
        
        .navbar__nav-link {
          font-size: 14px; font-weight: 600; color: white;
          background: transparent; border: none; cursor: pointer;
          transition: all 0.3s ease; text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .navbar__nav-link:hover { color: #FE7A00; }

        .navbar__cta {
          padding: 10px 22px; font-size: 12px; font-weight: 700;
          color: #FE7A00; border: 1px solid #FE7A00; border-radius: 4px;
          text-decoration: none; transition: 0.3s;
          letter-spacing: 1px;
        }
        .navbar__cta:hover { background: #FE7A00; color: white; box-shadow: 0 0 15px rgba(232, 90, 36, 0.4); }

        .navbar__mobile-wrapper { display: none; align-items: center; gap: 15px; }

        .navbar__hamburger {
          width: 30px; height: 18px;
          position: relative; cursor: pointer;
          display: flex; flex-direction: column; justify-content: space-between;
          z-index: 1100; background: none; border: none; padding: 0;
        }

        .hamburger-line {
          width: 100%; height: 2px; background-color: white;
          transition: all 0.3s ease; border-radius: 2px;
        }

        .navbar__hamburger--open .hamburger-line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .navbar__hamburger--open .hamburger-line:nth-child(2) { opacity: 0; }
        .navbar__hamburger--open .hamburger-line:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .navbar__mobile-nav {
          position: fixed; top: 0; right: -100%;
          width: 280px; height: 100vh;
          background-color: rgba(5, 5, 5, 0.95);
          backdrop-filter: blur(20px);
          padding: 100px 30px;
          transition: right 0.5s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 1050;
        }

        .navbar__mobile-nav--open { right: 0; }

        .mobile-nav-list { list-style: none; padding: 0; }
        .mobile-nav-item { margin-bottom: 30px; }
        
        .mobile-nav-link {
          font-size: 16px; color: white; font-weight: 700;
          background: none; border: none; cursor: pointer;
          text-transform: uppercase; letter-spacing: 2px;
        }

        @media (max-width: 1024px) {
          .navbar--transparent, .navbar--glass { padding: 15px 30px; }
          .navbar__nav { display: none; }
          .navbar__mobile-wrapper { display: flex; }
        }
      `}</style>

      <header className={`navbar ${isScrolled ? 'navbar--glass' : 'navbar--transparent'}`}>
        <div className="navbar__logo" onClick={() => handleNavigation({ path: '/', sectionId: 'top' })}>
          <img src={logo} alt="Tiesverse" className="navbar__logo-image" />
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar__nav">
          <ul className="navbar__nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <button className="navbar__nav-link" onClick={() => handleNavigation(item)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <a href={JOIN_US_URL} target="_blank" rel="noreferrer" className="navbar__cta">JOIN US</a>
        </nav>

        {/* Mobile Controls */}
        <div className="navbar__mobile-wrapper">
          <a href={JOIN_US_URL} target="_blank" rel="noreferrer" className="navbar__cta" style={{ padding: '6px 14px', fontSize: '10px' }}>JOIN US</a>

          <button
            className={`navbar__hamburger ${isMobileMenuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav className={`navbar__mobile-nav ${isMobileMenuOpen ? 'navbar__mobile-nav--open' : ''}`}>
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.label} className="mobile-nav-item">
                <button className="mobile-nav-link" onClick={() => handleNavigation(item)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Navbar