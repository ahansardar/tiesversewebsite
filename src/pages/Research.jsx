import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/PlaceholderPage.css'

const Research = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__content">
        <h1 className="placeholder-page__title animate-title">Research</h1>
        <div className="placeholder-page__divider animate-divider"></div>
        <p className="placeholder-page__subtitle animate-subtitle">This page is coming soon.</p>
        <Link to="/" className="placeholder-page__back-link animate-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Research