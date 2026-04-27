import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkshops, getEvents } from '../apiClient';

const CSS = `
  .wb-section {
    background: #000;
    color: #fff;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    padding-bottom: 100px;
  }

  .wb-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 140px 24px 0;
  }

  .wb-back-btn {
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
  .wb-back-btn:hover { border-color: #FE7A00; color: #FE7A00; }

  .wb-eyebrow {
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
  .wb-eyebrow::before { content: ''; width: 20px; height: 2px; background: #FE7A00; flex-shrink: 0; }

  .wb-title {
    font-size: clamp(32px, 5.5vw, 60px);
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1.0;
    color: #fff;
    margin: 0 0 18px 0;
  }

  .wb-header-divider {
    width: 60px;
    height: 3px;
    background: #FE7A00;
    border-radius: 2px;
    margin-bottom: 20px;
  }

  .wb-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.75;
    max-width: 520px;
    margin-bottom: 60px;
  }

  /* Webinar list */
  .wb-list { display: flex; flex-direction: column; gap: 20px; }

  .wb-item {
    display: grid;
    grid-template-columns: 340px 1fr;
    background: #0c0c0c;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }
  .wb-item:hover { border-color: #FE7A00; transform: translateY(-2px); }

  .wb-item-img {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/2;
  }
  .wb-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  }
  .wb-item:hover .wb-item-img img { transform: scale(1.04); }

  .wb-item-info {
    padding: 36px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
  }

  .wb-item-meta {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .wb-item-category {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3px;
    color: #FE7A00;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .wb-item-title {
    font-size: clamp(18px, 2.2vw, 26px);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1.25;
    margin: 0 0 10px 0;
  }

  .wb-item-date {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 1px;
  }

  /* Register button */
  .wb-register-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #FE7A00;
    color: #000;
    padding: 13px 28px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 6px;
    border: none;
    font-family: inherit;
    text-decoration: none;
    width: fit-content;
    text-transform: uppercase;
    transition: background 0.25s ease, transform 0.25s ease;
  }
  .wb-register-btn:hover { background: #fff; transform: scale(1.03); }

  .wb-register-btn.closed {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.35);
    cursor: not-allowed;
    pointer-events: none;
  }

  .wb-empty {
    text-align: center;
    color: rgba(255,255,255,0.25);
    padding: 100px 0;
    letter-spacing: 3px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* Loading */
  .wb-loader {
    background: #000;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wb-loader-bar {
    width: 48px;
    height: 2px;
    background: #FE7A00;
    border-radius: 2px;
    animation: wbPulse 1.2s ease-in-out infinite;
  }
  @keyframes wbPulse { 0%, 100% { opacity: 0.3; transform: scaleX(0.6); } 50% { opacity: 1; transform: scaleX(1); } }

  /* Responsive */
  @media (max-width: 768px) {
    .wb-item { grid-template-columns: 1fr; }
    .wb-item-img { aspect-ratio: 16/9; }
    .wb-item-info { padding: 24px 20px; }
  }
`;

const WebinarsPage = () => {
    const [webinars, setWebinars] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getWorkshops(), getEvents()])
            .then(([workshops, evs]) => {
                setWebinars((workshops || []).filter(w => w.category === 'WEBINAR'));
                setEvents(Array.isArray(evs) ? evs : []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const getRegisterLink = (webinar) => {
        if (webinar.register_link) return webinar.register_link;
        if (!webinar.event_id) return null;
        const event = events.find(e => e.id === webinar.event_id);
        return event?.form_link || null;
    };

    if (loading) {
        return (
            <div className="wb-loader">
                <style dangerouslySetInnerHTML={{ __html: CSS }} />
                <div className="wb-loader-bar" />
            </div>
        );
    }

    return (
        <section className="wb-section">
            <style dangerouslySetInnerHTML={{ __html: CSS }} />

            <div className="wb-container">
                <button className="wb-back-btn" onClick={() => window.history.back()}>
                    ← BACK
                </button>

                <header>
                    <div className="wb-eyebrow">DIGITAL SESSIONS</div>
                    <h1 className="wb-title">WEBINARS &amp;<br />ONLINE PROGRAMMES</h1>
                    <div className="wb-header-divider" />
                    <p className="wb-subtitle">
                        Structured online learning sessions hosted by Tiesverse — covering
                        strategic communication, research methods, and policy frameworks
                        for the next generation.
                    </p>
                </header>

                {webinars.length === 0 ? (
                    <div className="wb-empty">No webinars available yet</div>
                ) : (
                    <div className="wb-list">
                        {webinars.map((webinar) => {
                            const registerLink = getRegisterLink(webinar);
                            const imgSrc = webinar.image_url;
                            return (
                                <div key={webinar.id} className="wb-item">
                                    <div className="wb-item-img">
                                        {imgSrc && <img src={imgSrc} alt={webinar.title} loading="lazy" />}
                                    </div>
                                    <div className="wb-item-info">
                                        <div className="wb-item-meta">
                                            <div className="wb-item-category">WEBINAR // ONLINE SESSION</div>
                                            <h2 className="wb-item-title">{webinar.title}</h2>
                                            {webinar.date && (
                                                <div className="wb-item-date">{webinar.date}</div>
                                            )}
                                        </div>
                                        {registerLink ? (
                                            <a
                                                href={registerLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="wb-register-btn"
                                            >
                                                REGISTER NOW ↗
                                            </a>
                                        ) : (
                                            <button className="wb-register-btn closed" disabled>
                                                REGISTRATION CLOSED
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default WebinarsPage;
