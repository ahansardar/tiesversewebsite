
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGuests } from '../apiClient';

const CSS = `
  .pg-section {
    background: #000;
    color: #fff;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    padding-bottom: 100px;
  }

  .pg-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 140px 24px 0;
  }

  .pg-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
    padding: 9px 20px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    cursor: pointer;
    border-radius: 5px;
    font-family: inherit;
    text-transform: uppercase;
    transition: border-color 0.25s ease, color 0.25s ease;
    margin-bottom: 52px;
  }
  .pg-back-btn:hover { border-color: #FE7A00; color: #FE7A00; }

  .pg-eyebrow {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3.5px;
    color: #FE7A00;
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pg-eyebrow::before { content: ''; width: 20px; height: 2px; background: #FE7A00; flex-shrink: 0; }

  .pg-title {
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1.0;
    color: #fff;
    margin: 0 0 18px 0;
  }

  .pg-header-divider {
    width: 60px;
    height: 3px;
    background: #FE7A00;
    border-radius: 2px;
    margin-bottom: 20px;
  }

  .pg-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.75;
    max-width: 520px;
    margin-bottom: 70px;
  }

  /* Guest entries */
  .pg-guest-entry {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    padding: 64px 0;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .pg-guest-entry:last-child { border-bottom: 1px solid rgba(255,255,255,0.07); }

  .pg-guest-entry.reversed .pg-guest-img-wrap { order: 2; }
  .pg-guest-entry.reversed .pg-guest-info { order: 1; }

  .pg-guest-img-wrap {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    aspect-ratio: 3/4;
    background: #111;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .pg-guest-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    transition: transform 0.6s cubic-bezier(0.2, 1, 0.3, 1);
  }
  .pg-guest-entry:hover .pg-guest-img-wrap img { transform: scale(1.04); }

  .pg-guest-info { display: flex; flex-direction: column; justify-content: center; }

  .pg-guest-index {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3px;
    color: rgba(254, 122, 0, 0.45);
    margin-bottom: 18px;
    text-transform: uppercase;
  }

  .pg-guest-name {
    font-size: clamp(26px, 3vw, 40px);
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1.1;
    color: #fff;
    margin: 0 0 10px 0;
  }

  .pg-guest-role {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #FE7A00;
    text-transform: uppercase;
    margin-bottom: 26px;
  }

  .pg-guest-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    line-height: 1.85;
  }

  .pg-empty {
    text-align: center;
    color: rgba(255,255,255,0.25);
    padding: 100px 0;
    letter-spacing: 3px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* Loading */
  .pg-loader {
    background: #000;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pg-loader-bar {
    width: 48px;
    height: 2px;
    background: #FE7A00;
    border-radius: 2px;
    animation: pgPulse 1.2s ease-in-out infinite;
  }
  @keyframes pgPulse { 0%, 100% { opacity: 0.3; transform: scaleX(0.6); } 50% { opacity: 1; transform: scaleX(1); } }

  /* Responsive */
  @media (max-width: 768px) {
    .pg-guest-entry { grid-template-columns: 1fr; gap: 32px; padding: 44px 0; }
    .pg-guest-entry.reversed .pg-guest-img-wrap { order: unset; }
    .pg-guest-entry.reversed .pg-guest-info { order: unset; }
    .pg-guest-img-wrap { max-width: 260px; margin: 0 auto; }
    .pg-guest-info { text-align: center; align-items: center; }
    .pg-guest-index { text-align: center; }
  }
`;

const PastGuests = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getGuests()
            .then(data => setGuests(Array.isArray(data) ? data : []))
            .catch(() => setGuests([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading || !location.hash) return;
        const id = location.hash.slice(1);
        const el = document.getElementById(id);
        if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }, [loading, location.hash]);

    if (loading) {
        return (
            <div className="pg-loader">
                <style dangerouslySetInnerHTML={{ __html: CSS }} />
                <div className="pg-loader-bar" />
            </div>
        );
    }

    return (
        <section className="pg-section">
            <style dangerouslySetInnerHTML={{ __html: CSS }} />

            <div className="pg-container">
                <button className="pg-back-btn" onClick={() => window.history.back()}>
                    ← BACK
                </button>

                <header>
                    <div className="pg-eyebrow">GUEST SPEAKERS</div>
                    <h1 className="pg-title">OUR PREVIOUS<br />GUESTS</h1>
                    <div className="pg-header-divider" />
                    <p className="pg-subtitle">
                        Leaders, scholars, and voices who have joined us across summits,
                        panels, and editorial sessions — shaping discourse at the intersection
                        of geopolitics, media, and technology.
                    </p>
                </header>

                {guests.length === 0 ? (
                    <div className="pg-empty">No guests featured yet</div>
                ) : (
                    guests.map((guest, idx) => (
                        <div
                            key={guest.id}
                            id={`guest-${guest.id}`}
                            className={`pg-guest-entry${idx % 2 !== 0 ? ' reversed' : ''}`}
                        >
                            <div className="pg-guest-img-wrap">
                                <img src={guest.image_url} alt={guest.name} loading="lazy" />
                            </div>
                            <div className="pg-guest-info">
                                <div className="pg-guest-index">
                                    {String(idx + 1).padStart(2, '0')} // FEATURED GUEST
                                </div>
                                <h2 className="pg-guest-name">{guest.name}</h2>
                                {guest.role && <div className="pg-guest-role">{guest.role}</div>}
                                {guest.description && <p className="pg-guest-desc">{guest.description}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default PastGuests;
