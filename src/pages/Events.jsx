import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, getYoutubeVideos, getWorkshops, getSettings, getGuests, getNetworkImages } from '../apiClient';
import '../styles/Events.css';

// Asset imports (DON'T TOUCH)
import yt1 from '../assets/yt1.jpg';
import yt2 from '../assets/yt2.jpg';
import yt3 from '../assets/yt3.jpg';
import ws1 from '../assets/ws1.png';
import ws2 from '../assets/ws2.png';
import ws3 from '../assets/ws3.png';
import ws4 from '../assets/ws4.png';

// Summit Assets (DON'T TOUCH)
import summit4 from '../assets/IMG_0390.jpg'; 
import summit5 from '../assets/IMG_0057.jpg'; 
import summit6 from '../assets/IMG_0043.jpg'; 
import summit7 from '../assets/IMG_0032.jpg'; 
import summit8 from '../assets/dcdd558b-c2b9-45ad-82a2-5946725105d4.jpg';

// ============================================================
// PERFORMANCE FIX #1: Extract static styles OUT of the component.
// Inline <style> inside JSX re-parses CSS on every render.
// This string is created ONCE at module load, never again.
// ============================================================
const STATIC_CSS = `
  :root { 
    --accent: #FE7A00; 
    --accent-glow: rgba(254, 122, 0, 0.15);
    --text-main: #ffffff;
    --text-dim: rgba(255,255,255,0.65); 
    --glass: rgba(255, 255, 255, 0.04); 
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.18);
    --card-bg: #0c0c0c;
    --surface: #080808;
  }

  /* ── BASE ── */
  .events-section { 
    background: #000; color: #fff; padding: 60px 0; 
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  .events-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

  .main-title { 
    font-size: clamp(32px, 7vw, 60px); font-weight: 900; 
    letter-spacing: -2px; margin: 0; line-height: 1.05;
  }
  .main-divider { 
    width: 80px; height: 4px; background: var(--accent); 
    margin: 20px 0 50px 0; border-radius: 2px;
  }

  .section-block { margin-bottom: 90px; contain: layout style; }
  .block-label { 
    color: var(--accent); font-weight: 700; font-size: 11px; 
    letter-spacing: 3px; text-transform: uppercase; opacity: 0.9;
  }
  .block-title { 
    font-size: 26px; font-weight: 800; margin: 10px 0 35px 0; 
    letter-spacing: -0.5px;
  }

  /* ── UPCOMING EVENTS ── */
  .upcoming-list { display: flex; flex-direction: column; gap: 24px; }
  .upcoming-card { 
    display: flex; background: var(--card-bg); 
    border: 1px solid var(--border); border-radius: 14px; 
    overflow: hidden; contain: layout;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }
  .upcoming-card:hover { 
    border-color: var(--accent); 
    transform: translateY(-3px);
  }

  .upcoming-visual { flex: 0 0 380px; position: relative; overflow: hidden; }
  .upcoming-visual img { 
    width: 100%; height: 100%; object-fit: cover; 
    transition: transform 0.5s cubic-bezier(0.2, 1, 0.3, 1);
    will-change: transform;
  }
  .upcoming-card:hover .upcoming-visual img { transform: scale(1.04); }
  .upcoming-type-badge { 
    position: absolute; top: 14px; left: 14px; 
    background: var(--accent); color: #000;
    padding: 5px 14px; font-size: 10px; font-weight: 800; 
    border-radius: 5px; letter-spacing: 1px;
  }

  .upcoming-info { padding: 32px 35px; flex: 1; display: flex; flex-direction: column; }
  .upcoming-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .event-status { 
    display: inline-flex; align-items: center; gap: 7px; 
    font-weight: 800; font-size: 11px; letter-spacing: 0.5px;
  }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .status-green { color: #00e6b8; } 
  .status-green .status-dot { background: #00e6b8; box-shadow: 0 0 8px #00e6b8; }
  .status-red { color: #ff3366; } 
  .status-red .status-dot { background: #ff3366; }
  .event-datetime { color: var(--text-dim); font-size: 12px; margin-left: auto; letter-spacing: 0.5px; }

  .event-title { font-size: 24px; font-weight: 800; margin: 0 0 14px 0; color: #fff; line-height: 1.25; }
  .event-description { color: var(--text-dim); font-size: 14px; line-height: 1.7; }
  .event-description.clamped { 
    display: -webkit-box; -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical; overflow: hidden; 
  }

  .toggle-desc-btn {
    background: none; border: none; color: var(--accent); cursor: pointer;
    font-weight: 800; font-size: 11px; margin-top: 10px; text-align: left;
    padding: 0; letter-spacing: 0.5px;
    transition: opacity 0.2s;
  }
  .toggle-desc-btn:hover { opacity: 0.8; }

  .event-form-btn { 
    display: inline-block;
    background: var(--accent); color: #000; padding: 13px 28px; 
    font-weight: 800; font-size: 11px; text-decoration: none; 
    width: fit-content; margin-top: 22px; border-radius: 6px; 
    border: none; cursor: pointer; letter-spacing: 1px;
    transition: background 0.25s ease, transform 0.25s ease;
  }
  .event-form-btn:hover { background: #fff; transform: scale(1.03); }
  .event-form-btn.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

  /* ── MARQUEE (GPU-optimized) ── */
  .marquee-wrapper { 
    width: 100vw; margin-left: calc(-50vw + 50%); 
    overflow: hidden; padding: 40px 0; 
    background: var(--surface);
  }
  .marquee-track { 
    display: flex; width: max-content; 
    animation: marquee-scroll 40s linear infinite; 
    will-change: transform;
    transform: translate3d(0, 0, 0); 
  }
  .marquee-track:hover { animation-play-state: paused; }
  .marquee-item { 
    width: 380px; aspect-ratio: 4/3; margin: 0 12px; 
    border-radius: 10px; overflow: hidden; 
    border: 1px solid var(--border); flex-shrink: 0;
    /* CRITICAL SCROLL FIX: Forces hardware clipping so the browser doesn't recalculate borders every frame */
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    transform: translateZ(0); 
  }
  .marquee-img {
    width: 100%; height: 100%; object-fit: cover;
    transform: translateZ(0);
  }
  @keyframes marquee-scroll { 
    0% { transform: translate3d(0, 0, 0); } 
    100% { transform: translate3d(-50%, 0, 0); } 
  }

  /* ── PODCASTS ── */
  .podcasts-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 20px; 
  }
  .podcast-card { 
    background: var(--card-bg); border-radius: 12px; 
    border: 1px solid var(--border); overflow: hidden; 
    text-decoration: none; contain: layout;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }
  .podcast-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .podcast-visual { position: relative; aspect-ratio: 16/9; overflow: hidden; }
  .podcast-img { 
    width: 100%; height: 100%; object-fit: cover; 
    transition: transform 0.4s ease; will-change: transform;
  }
  .podcast-card:hover .podcast-img { transform: scale(1.04); }
  .podcast-meta { padding: 20px; }
  .meta-tag { color: var(--accent); font-weight: 800; font-size: 10px; letter-spacing: 1.5px; }
  .podcast-title { font-size: 17px; color: #fff; margin: 10px 0 0 0; font-weight: 700; line-height: 1.3; }

  /* ── EDITORIAL DUAL-PANEL CARDS ── */
  .editorial-cards-stack { display: flex; flex-direction: column; gap: 20px; }

  .editorial-card {
    display: grid; grid-template-columns: 1fr 1.25fr;
    min-height: 340px; border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border);
    transition: border-color 0.35s ease, transform 0.35s ease;
  }
  .editorial-card:hover { border-color: var(--accent); transform: translateY(-2px); }

  .ed-left {
    background: #080808; padding: 40px 38px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; z-index: 2;
  }
  .ed-left::after {
    content: ''; position: absolute; right: 0; top: 10%; bottom: 10%;
    width: 1px; background: linear-gradient(to bottom, transparent, var(--border), transparent);
  }
  .ed-eyebrow {
    font-size: 10px; font-weight: 800; letter-spacing: 3px;
    color: var(--accent); text-transform: uppercase; margin-bottom: 24px;
    display: flex; align-items: center; gap: 8px;
  }
  .ed-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--accent); flex-shrink: 0; }
  .ed-headline {
    font-size: clamp(28px, 3.5vw, 42px); font-weight: 900; line-height: 1.0;
    letter-spacing: -1.5px; color: #fff; margin: 0 0 16px 0;
  }
  .ed-body {
    font-size: 13px; color: var(--text-dim); line-height: 1.75; flex: 1; margin: 16px 0 28px;
  }
  .ed-counter {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 800; letter-spacing: 2px;
    color: var(--accent); border: 1px solid rgba(254, 122, 0, 0.25);
    padding: 8px 18px; border-radius: 20px; width: fit-content;
    background: rgba(254, 122, 0, 0.05);
  }

  /* ── ORANGE RIGHT PANEL ── */
  .ed-right {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #FE7A00 0%, #b84f00 100%);
    padding: 28px; display: flex; align-items: center; justify-content: center;
  }
  .ed-right::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1;
  }
  .ed-right-inner { position: relative; z-index: 2; width: 100%; height: 100%; display: flex; align-items: center; }

  /* ── GUEST MOSAIC ── */
  .guest-mosaic {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%;
  }
  .guest-tile {
    position: relative; border-radius: 10px; overflow: hidden;
    aspect-ratio: 3/4; background: rgba(0,0,0,0.25);
    border: 2px solid rgba(255,255,255,0.15);
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  .guest-tile:hover {
    transform: scale(1.04) translateY(-3px);
    border-color: rgba(255,255,255,0.55);
    box-shadow: 0 12px 28px rgba(0,0,0,0.45);
  }
  .guest-tile img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .guest-tile-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
    padding: 20px 10px 10px; z-index: 2;
  }
  .guest-tile-name { font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 0.3px; line-height: 1.2; }
  .guest-tile-role { font-size: 9px; color: rgba(255,255,255,0.65); margin-top: 3px; letter-spacing: 0.5px; }
  .guest-tile-desc {
    font-size: 9px; color: rgba(255,255,255,0.5); margin-top: 5px; letter-spacing: 0.2px; line-height: 1.45;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .guest-tile:hover .guest-tile-desc { opacity: 1; }

  /* ── WEBINAR MOSAIC ── */
  .webinar-mosaic {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%;
  }
  .webinar-tile {
    position: relative; border-radius: 10px; overflow: hidden;
    aspect-ratio: 16/9; background: rgba(0,0,0,0.25);
    border: 2px solid rgba(255,255,255,0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  .webinar-tile:hover { transform: scale(1.03); box-shadow: 0 10px 24px rgba(0,0,0,0.4); }
  .webinar-tile img { width: 100%; height: 100%; object-fit: cover; }
  .webinar-play {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.3); z-index: 2; transition: background 0.25s ease;
  }
  .webinar-tile:hover .webinar-play { background: rgba(0,0,0,0.1); }
  .webinar-play-circle {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
  }
  .webinar-play-circle svg { width: 14px; height: 14px; fill: #000; margin-left: 2px; }
  .webinar-tile-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    padding: 18px 10px 8px; font-size: 10px; font-weight: 700;
    color: #fff; z-index: 3; letter-spacing: 0.5px; line-height: 1.3;
  }

  /* ── NETWORK IMAGE STRIP ── */
  .network-strip-wrap {
    margin-bottom: 0;
  }
  .network-strip {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding-bottom: 12px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    cursor: grab;
    user-select: none;
  }
  .network-strip:active { cursor: grabbing; }
  .network-strip::-webkit-scrollbar { height: 3px; }
  .network-strip::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 2px; }
  .network-strip::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
  .network-img-item { flex-shrink: 0; }
  .network-img-tile {
    width: 300px;
    aspect-ratio: 3/4;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(0,0,0,0.3);
    transition: border-color 0.3s ease, transform 0.3s ease;
  }
  .network-img-tile:hover { border-color: rgba(255,255,255,0.4); transform: scale(1.03); }
  .network-img-tile img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
  .network-img-caption {
    font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
    color: rgba(255,255,255,0.5); margin-top: 8px; text-align: center;
    text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    width: 300px;
  }
  .network-sub-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 50px 0 0 0;
  }
  .network-sub-divider::before, .network-sub-divider::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07);
  }
  .network-sub-divider span {
    font-size: 10px; font-weight: 800; letter-spacing: 3px;
    color: rgba(255,255,255,0.25); text-transform: uppercase; white-space: nowrap;
  }

  /* Empty placeholder tiles */
  .mosaic-placeholder {
    border-radius: 10px; border: 1.5px dashed rgba(255,255,255,0.2);
    background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 2px; text-transform: uppercase;
    aspect-ratio: 3/4;
  }
  .mosaic-placeholder.wide { aspect-ratio: 16/9; }

  /* ── RESPONSIVE ── */
  @media (max-width: 850px) {
    .upcoming-card { flex-direction: column; }
    .upcoming-visual { flex: 0 0 220px; }
    .upcoming-info { padding: 24px 20px; }
    .event-datetime { margin-left: 0; margin-top: 5px; }
    .event-title { font-size: 20px; }
    .marquee-item { width: 300px; }
    .editorial-card { grid-template-columns: 1fr; }
    .ed-left { padding: 28px 24px; }
    .ed-left::after { display: none; }
    .ed-right { min-height: 260px; padding: 20px; }
    .guest-mosaic { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .webinar-mosaic { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  }

  @media (max-width: 480px) {
    .events-section { padding: 40px 0; }
    .section-block { margin-bottom: 60px; }
    .upcoming-visual { flex: 0 0 180px; }
    .marquee-item { width: 260px; margin: 0 8px; }
    .ed-headline { font-size: 24px; }
    .guest-mosaic { grid-template-columns: repeat(2, 1fr); }
  }

  /* ── iOS Safari fixes ── */
  @supports (-webkit-touch-callout: none) {
    .marquee-track { -webkit-transform: translate3d(0,0,0); }
    .upcoming-visual img,
    .podcast-img,
    .marquee-img { -webkit-transform: translateZ(0); }
  }
`;

// ============================================================
// PERFORMANCE FIX #2: Memoized sub-components.
// Prevents re-render of every card when unrelated state changes
// (e.g., toggling one description re-rendered ALL cards before).
// ============================================================

const EventCard = memo(({ event, isExpanded, onToggle, getFallback }) => {
    const isEnded = event.status === "EVENT ENDED" || event.status === "REGISTRATION CLOSED";
    return (
        <div className="upcoming-card">
            <div className="upcoming-visual">
                <img src={event.img} alt={event.title} loading="lazy" width="380" height="260" />
                <div className="upcoming-type-badge">{event.type}</div>
            </div>
            <div className="upcoming-info">
                <div className="upcoming-meta">
                    <span className={`event-status ${isEnded ? 'status-red' : 'status-green'}`}>
                        <span className="status-dot"></span> {event.status}
                    </span>
                    <span className="event-datetime">{event.date} // {event.time}</span>
                </div>
                <h3 className="event-title">{event.title}</h3>
                <div className={`event-description ${isExpanded ? 'expanded' : 'clamped'}`}>
                    {event.description}
                </div>
                {event.description?.length > 150 && (
                    <button className="toggle-desc-btn" onClick={() => onToggle(event.id)}>
                        {isExpanded ? 'SHOW LESS \u25B2' : 'READ MORE \u25BC'}
                    </button>
                )}
                <div>
                    {isEnded ? (
                        <button className="event-form-btn disabled" disabled>CLOSED</button>
                    ) : (
                        <a href={event.form_link} target="_blank" rel="noopener noreferrer" className="event-form-btn">
                            REGISTER NOW \u2197
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
});

const PodcastCard = memo(({ item }) => (
    <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="podcast-card">
        <div className="podcast-visual">
            <img src={item.img} alt="" className="podcast-img" loading="lazy" width="400" height="225" />
        </div>
        <div className="podcast-meta">
            <span className="meta-tag">{item.tag}</span>
            <h3 className="podcast-title">{item.title}</h3>
        </div>
    </a>
));

const WorkshopCard = memo(({ item }) => (
    <div className="podcast-card">
        <div className="podcast-visual">
            <img src={item.img} alt="" className="podcast-img" loading="lazy" width="400" height="225" />
        </div>
        <div className="podcast-meta">
            <span className="meta-tag">{item.tag} // {item.date}</span>
            <h3 className="podcast-title">{item.title}</h3>
        </div>
    </div>
));

// ============================================================
// PERFORMANCE FIX #3: Throttle utility.
// Without this, resize fires setState 60x/sec causing mass re-renders.
// ============================================================
function useThrottledResize(callback, delay = 200) {
    useEffect(() => {
        let rafId = null;
        let lastRun = 0;

        const handleResize = () => {
            const now = Date.now();
            if (now - lastRun >= delay) {
                lastRun = now;
                callback();
            } else {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    lastRun = Date.now();
                    callback();
                });
            }
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('resize', handleResize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [callback, delay]);
}

// ============================================================
// MAIN COMPONENT
// ============================================================
const Events = () => {
    const navigate = useNavigate();
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [data, setData] = useState({
        events: [],
        podcasts: [],
        guests: [],
        webinars: [],
        networkImages: []
    });
    const [displayLimits, setDisplayLimits] = useState({
        pc: 2, mobile: 1, pcYT: 3, mobileYT: 2
    });

    // --- PERF FIX #3 applied: throttled resize ---
    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);
    useThrottledResize(handleResize, 250);

    // --- HELPERS ---
    const getFallback = useCallback((item, type) => {
        if (item.image_url || item.thumbnail_url) return item.image_url || item.thumbnail_url;
        
        if (type === 'workshop') {
            const maps = { 'Diplomatic Frameworks': ws1, 'Media Narratives in IR': ws2, 'Policy in Practice': ws3, 'Bharat Manthan 2025': ws4 };
            return maps[item.title] || (item.category === 'VIRTUAL' ? ws1 : ws3);
        }
        if (type === 'podcast') {
            const maps = { 'EP.01': yt1, 'EP.02': yt2, 'EP.03': yt3 };
            return maps[item.episode_id] || yt1;
        }
        return ws1;
    }, []);

    // --- DATA FETCHING (Supabase - UNCHANGED) ---
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [settingsRes, eventsRes, youtubeRes, workshopsRes, guestsRes, networkRes] = await Promise.all([
                    getSettings(),
                    getEvents(),
                    getYoutubeVideos(),
                    getWorkshops(),
                    getGuests(),
                    getNetworkImages()
                ]);

                if (settingsRes && !settingsRes.error) {
                    const getS = (key, fallback) => settingsRes.find(s => s.key === key)?.value || fallback;
                    setDisplayLimits({
                        pc: parseInt(getS('event_display_limit_pc', 2)),
                        mobile: parseInt(getS('event_display_limit_mobile', 1)),
                        pcYT: parseInt(getS('youtube_display_limit_pc', 3)),
                        mobileYT: parseInt(getS('youtube_display_limit_mobile', 2))
                    });
                }

                setData({
                    events: (eventsRes || []).map(e => ({ ...e, img: getFallback(e, 'event') })),
                    podcasts: (youtubeRes || []).map(p => ({ ...p, img: getFallback(p, 'podcast'), tag: p.category || 'STRATEGY' })),
                    guests: (guestsRes && !guestsRes.error) ? guestsRes : [],
                    webinars: (workshopsRes || []).filter(w => w.category === 'WEBINAR').map(w => ({ ...w, img: getFallback(w, 'workshop') })),
                    networkImages: (networkRes && !networkRes.error) ? networkRes : []
                });

            } catch (err) {
                console.error('Performance Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [getFallback]);

    // --- UI LOGIC ---
    const toggleDescription = useCallback((id) => {
        setExpandedDescriptions(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    // --- MEMOIZED MARQUEE DATA ---
    const marqueeContent = useMemo(() => {
        const summitImages = [summit4, summit5, summit6, summit7, summit8];
        return [...summitImages, ...summitImages].map((imgSrc, index) => ({
            id: `summit-img-${index}`,
            src: imgSrc
        })); 
    }, []);

    // --- MEMOIZED SLICED DATA (prevents re-slicing on every render) ---
    const visibleEvents = useMemo(() => 
        data.events.slice(0, isMobile ? displayLimits.mobile : displayLimits.pc),
        [data.events, isMobile, displayLimits.mobile, displayLimits.pc]
    );

    const visiblePodcasts = useMemo(() => 
        data.podcasts.slice(0, isMobile ? displayLimits.mobileYT : displayLimits.pcYT),
        [data.podcasts, isMobile, displayLimits.mobileYT, displayLimits.pcYT]
    );

    if (loading) return <div className="loader-screen"><div className="loader-bar"></div></div>;

    return (
        <section className="events-section" id="events-section">
            {/* PERF FIX #1: Static CSS injected once, never re-parsed */}
            <style dangerouslySetInnerHTML={{ __html: STATIC_CSS }} />

            <div className="events-container">
                <header>
                    <h1 className="main-title">WORKS & <br/>ENGAGEMENTS</h1>
                    <div className="main-divider"></div>
                </header>

                {/* 00. UPCOMING EVENTS */}
                <div className="section-block">
                    <header className="block-header">
                        <span className="block-label">00 // LIVE ENGAGEMENTS</span>
                        <h2 className="block-title">UPCOMING EVENTS</h2>
                    </header>
                    <div className="upcoming-list">
                        {visibleEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isExpanded={!!expandedDescriptions[event.id]}
                                onToggle={toggleDescription}
                                getFallback={getFallback}
                            />
                        ))}
                    </div>
                </div>

                {/* 01. NETWORK + GUESTS + WEBINARS */}
                <div className="section-block">
                    <header className="block-header">
                        <span className="block-label">01 // FEATURED ENGAGEMENTS</span>
                        {/* <h2 className="block-title">OUR NETWORK</h2> */}
                    </header>

                    {/* Commented the Our network panel */}
                    {/* — NETWORK IMAGE STRIP — */}
                    {/* {data.networkImages.length > 0 && (
                        <div className="network-strip-wrap">
                            <div
                                className="network-strip"
                                onMouseDown={(e) => {
                                    const el = e.currentTarget;
                                    el.dataset.dragging = 'true';
                                    el.dataset.startX = e.pageX - el.offsetLeft;
                                    el.dataset.scrollLeft = el.scrollLeft;
                                }}
                                onMouseMove={(e) => {
                                    const el = e.currentTarget;
                                    if (el.dataset.dragging !== 'true') return;
                                    e.preventDefault();
                                    const x = e.pageX - el.offsetLeft;
                                    el.scrollLeft = Number(el.dataset.scrollLeft) - (x - Number(el.dataset.startX));
                                }}
                                onMouseUp={(e) => { e.currentTarget.dataset.dragging = 'false'; }}
                                onMouseLeave={(e) => { e.currentTarget.dataset.dragging = 'false'; }}
                            >
                                {data.networkImages.map((img) => (
                                    <div key={img.id} className="network-img-item">
                                        <div className="network-img-tile">
                                            <img src={img.image_url} alt={img.caption || 'Network'} loading="lazy" draggable="false" />
                                        </div>
                                        {img.caption && <div className="network-img-caption">{img.caption}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* — DIVIDER LABEL before editorial cards — */}
                    {/* {data.networkImages.length > 0 && (
                        <div className="network-sub-divider">
                            <span>GUEST SPEAKERS &amp; DIGITAL SESSIONS</span>
                        </div>
                    )} */}

                    <div className="editorial-cards-stack">

                        {/* — CARD A: PREVIOUS GUESTS — */}
                        <div className="editorial-card">
                            <div className="ed-left">
                                <div>
                                    <div className="ed-eyebrow">GUEST SPEAKERS</div>
                                    <h2 className="ed-headline">OUR<br/>PREVIOUS<br/>GUESTS</h2>
                                    <p className="ed-body">
                                        Leaders, scholars, and voices who have joined us across summits,
                                        panels, and editorial sessions — shaping discourse at the intersection
                                        of geopolitics, media, and technology.
                                    </p>
                                </div>
                                <div className="ed-counter">
                                    ◈ &nbsp;{data.guests.length} GUESTS FEATURED
                                </div>
                            </div>
                            <div className="ed-right">
                                <div className="ed-right-inner">
                                    {data.guests.length > 0 ? (
                                        <div className="guest-mosaic">
                                            {data.guests.slice(0, 6).map((g) => (
                                                <div key={g.id} className="guest-tile" onClick={() => navigate(`/past-guests#guest-${g.id}`)}>
                                                    <img src={g.image_url} alt={g.name} loading="lazy" />
                                                    <div className="guest-tile-overlay">
                                                        <div className="guest-tile-name">{g.name}</div>
                                                        {g.role && <div className="guest-tile-role">{g.role}</div>}
                                                        {g.description && <div className="guest-tile-desc">{g.description}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                            {data.guests.length < 6 && Array.from({ length: 6 - data.guests.length }).map((_, i) => (
                                                <div key={`ph-${i}`} className="mosaic-placeholder" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="guest-mosaic">
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <div key={i} className="mosaic-placeholder" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* — CARD B: WEBINARS — */}
                        <div className="editorial-card">
                            <div className="ed-left">
                                <div>
                                    <div className="ed-eyebrow">DIGITAL SESSIONS</div>
                                    <h2 className="ed-headline">WEBINARS<br/>&amp; ONLINE<br/>PROGRAMMES</h2>
                                    <p className="ed-body">
                                        Structured online learning sessions hosted by Tiesverse — covering
                                        strategic communication, research methods, and policy frameworks
                                        for the next generation.
                                    </p>
                                </div>
                                <div className="ed-counter">
                                    ▣ &nbsp;{data.webinars.length} SESSIONS ARCHIVED
                                </div>
                            </div>
                            <div className="ed-right">
                                <div className="ed-right-inner">
                                    {data.webinars.length > 0 ? (
                                        <div className="webinar-mosaic">
                                            {data.webinars.slice(0, 4).map((w) => (
                                                <div key={w.id} className="webinar-tile" onClick={() => navigate('/webinars')}>
                                                    <img src={w.img} alt={w.title} loading="lazy" />
                                                    <div className="webinar-play">
                                                        <div className="webinar-play-circle">
                                                            <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
                                                        </div>
                                                    </div>
                                                    <div className="webinar-tile-label">{w.title}</div>
                                                </div>
                                            ))}
                                            {data.webinars.length < 4 && Array.from({ length: 4 - data.webinars.length }).map((_, i) => (
                                                <div key={`wph-${i}`} className="mosaic-placeholder wide" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="webinar-mosaic">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="mosaic-placeholder wide" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 02. PODCASTS */}
                <div className="section-block">
                    <header className="block-header">
                        <span className="block-label">02 // AUDIO ARCHIVE</span>
                        <h2 className="block-title">PODCAST SERIES</h2>
                    </header>
                    <div className="podcasts-grid">
                        {visiblePodcasts.map((item) => (
                            <PodcastCard key={item.id || item.video_url} item={item} />
                        ))}
                    </div>
                </div>

                {/* 03. SUMMIT SHOWCASE */}
                <div className="section-block">
                    <header className="block-header">
                        <span className="block-label">03 // FEATURED SHOWCASE</span>
                        <h2 className="block-title">INDIA AI IMPACT SUMMIT</h2>
                    </header>
                    <div className="marquee-wrapper">
                        <div className="marquee-track">
                            {marqueeContent.map((item) => (
                                <div key={item.id} className="marquee-item">
                                    <img
                                        src={item.src}
                                        alt="Summit Showcase"
                                        className="marquee-img"
                                        loading="eager"
                                        decoding="sync"
                                        width="380"
                                        height="285"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Events;