import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
<<<<<<< HEAD
import { supabase } from '../supabaseClient';
=======
import { getEvents, getYoutubeVideos, getWorkshops, getSettings } from '../apiClient';
>>>>>>> node-krisjscott
import '../styles/Events.css';

// Asset imports
import yt1 from '../assets/yt1.jpg';
import yt2 from '../assets/yt2.jpg';
import yt3 from '../assets/yt3.jpg';
import ws1 from '../assets/ws1.png';
import ws2 from '../assets/ws2.png';
import ws3 from '../assets/ws3.png';
import ws4 from '../assets/ws4.png';

// Summit Assets
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
    transition: transform 0.4s ease;
    transform: translateZ(0); 
  }
  .marquee-item:hover .marquee-img { transform: scale(1.06) translateZ(0); }
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

  /* ── PATHWAY BRICKS (Updated Design) ── */
  .minimal-pathway-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pathway-brick { 
    background: var(--card-bg); 
    padding: 48px 38px; border-radius: 14px; 
    border: 1px solid var(--border); 
    cursor: pointer; position: relative; overflow: hidden;
    transition: border-color 0.35s ease, transform 0.35s ease, background 0.35s ease;
  }
  .pathway-brick::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; 
    height: 3px; background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .pathway-brick:hover { 
    border-color: var(--border-hover); 
    background: #111; 
    transform: translateY(-3px); 
  }
  .pathway-brick:hover::before { transform: scaleX(1); }

  .brick-number { 
    position: absolute; top: 18px; right: 28px; 
    font-size: 48px; font-weight: 900; 
    color: var(--accent); opacity: 0.06;
    line-height: 1; pointer-events: none;
  }
  .brick-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--accent-glow); 
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px; font-size: 18px;
    border: 1px solid rgba(254, 122, 0, 0.2);
  }
  .brick-title { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .brick-desc { color: var(--text-dim); margin: 12px 0 24px 0; font-size: 13px; line-height: 1.6; }
  .brick-cta { 
    color: var(--accent); font-weight: 800; font-size: 11px; letter-spacing: 1.5px;
    display: inline-flex; align-items: center; gap: 6px;
    transition: gap 0.25s ease;
  }
  .pathway-brick:hover .brick-cta { gap: 10px; }

  .back-btn {
    background: var(--accent); color: #000; border: none;
    padding: 11px 22px; border-radius: 6px; font-weight: 800;
    cursor: pointer; margin-bottom: 30px; font-size: 12px;
    letter-spacing: 0.5px;
    transition: background 0.25s ease, transform 0.25s ease;
  }
  .back-btn:hover { background: #fff; transform: scale(1.03); }

  /* ── RESPONSIVE ── */
  @media (max-width: 850px) {
    .upcoming-card { flex-direction: column; }
    .upcoming-visual { flex: 0 0 220px; }
    .upcoming-info { padding: 24px 20px; }
    .minimal-pathway-grid { grid-template-columns: 1fr; }
    .event-datetime { margin-left: 0; margin-top: 5px; }
    .event-title { font-size: 20px; }
    .marquee-item { width: 300px; }
  }

  @media (max-width: 480px) {
    .events-section { padding: 40px 0; }
    .section-block { margin-bottom: 60px; }
    .upcoming-visual { flex: 0 0 180px; }
    .pathway-brick { padding: 35px 28px; }
    .brick-title { font-size: 19px; }
    .marquee-item { width: 260px; margin: 0 8px; }
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
    const [workshopCategory, setWorkshopCategory] = useState(null);
    const [activeWorkshop, setActiveWorkshop] = useState(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [data, setData] = useState({
        events: [],
        podcasts: [],
        virtual: [],
        inPerson: []
    });
    const [displayLimits, setDisplayLimits] = useState({ 
        pc: 2, mobile: 1, pcYT: 3, mobileYT: 2 
    });
    
    const workshopRef = useRef(null);

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
                const [settingsRes, eventsRes, youtubeRes, workshopsRes] = await Promise.all([
<<<<<<< HEAD
                    supabase.from('site_settings').select('key, value'),
                    supabase.from('events').select('*').order('created_at', { ascending: false }),
                    supabase.from('youtube_videos').select('*').order('created_at', { ascending: false }),
                    supabase.from('workshops').select('*').order('created_at', { ascending: false })
                ]);

                if (settingsRes.data) {
                    const getS = (key, fallback) => settingsRes.data.find(s => s.key === key)?.value || fallback;
=======
                    getSettings(),
                    getEvents(),
                    getYoutubeVideos(),
                    getWorkshops()
                ]);

                if (settingsRes && !settingsRes.error) {
                    const getS = (key, fallback) => settingsRes.find(s => s.key === key)?.value || fallback;
>>>>>>> node-krisjscott
                    setDisplayLimits({
                        pc: parseInt(getS('event_display_limit_pc', 2)),
                        mobile: parseInt(getS('event_display_limit_mobile', 1)),
                        pcYT: parseInt(getS('youtube_display_limit_pc', 3)),
                        mobileYT: parseInt(getS('youtube_display_limit_mobile', 2))
                    });
                }

                setData({
<<<<<<< HEAD
                    events: eventsRes.data?.map(e => ({ ...e, img: getFallback(e, 'event') })) || [],
                    podcasts: youtubeRes.data?.map(p => ({ ...p, img: getFallback(p, 'podcast'), tag: p.category || 'STRATEGY' })) || [],
                    virtual: workshopsRes.data?.filter(w => w.category === 'VIRTUAL').map(w => ({ ...w, img: getFallback(w, 'workshop'), tag: w.tag || 'VIRTUAL' })) || [],
                    inPerson: workshopsRes.data?.filter(w => w.category === 'IN_PERSON').map(w => ({ ...w, img: getFallback(w, 'workshop'), tag: w.tag || 'FIELD' })) || []
=======
                    events: (eventsRes || []).map(e => ({ ...e, img: getFallback(e, 'event') })),
                    podcasts: (youtubeRes || []).map(p => ({ ...p, img: getFallback(p, 'podcast'), tag: p.category || 'STRATEGY' })),
                    virtual: (workshopsRes || []).filter(w => w.category === 'VIRTUAL').map(w => ({ ...w, img: getFallback(w, 'workshop'), tag: w.tag || 'VIRTUAL' })),
                    inPerson: (workshopsRes || []).filter(w => w.category === 'IN_PERSON').map(w => ({ ...w, img: getFallback(w, 'workshop'), tag: w.tag || 'FIELD' }))
>>>>>>> node-krisjscott
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

    const handleCategorySelect = useCallback((category) => {
        setWorkshopCategory(category);
        setActiveWorkshop(null);
        setTimeout(() => workshopRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
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

    const activeWorkshops = useMemo(() => 
        workshopCategory === 'VIRTUAL' ? data.virtual : data.inPerson,
        [workshopCategory, data.virtual, data.inPerson]
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

                {/* 01. PODCASTS */}
                <div className="section-block">
                    <header className="block-header">
                        <span className="block-label">01 // AUDIO ARCHIVE</span>
                        <h2 className="block-title">PODCAST SERIES</h2>
                    </header>
                    <div className="podcasts-grid">
                        {visiblePodcasts.map((item) => (
                            <PodcastCard key={item.id || item.video_url} item={item} />
                        ))}
                    </div>
                </div>

                {/* 02. SUMMIT SHOWCASE */}
                <div className="section-block">
                    <header className="block-header">
                        <span className="block-label">02 // FEATURED SHOWCASE</span>
                        <h2 className="block-title">INDIA AI IMPACT SUMMIT</h2>
                    </header>
                    <div className="marquee-wrapper">
                        <div className="marquee-track">
                            {marqueeContent.map((item) => (
                                <div key={item.id} className="marquee-item">
                                    {/* CRITICAL SCROLL FIX: Added decoding="async" so large images don't block the main thread */}
                                    <img 
                                        src={item.src} 
                                        alt="Summit Showcase" 
                                        className="marquee-img" 
                                        loading="lazy"
                                        decoding="async" 
                                        width="380"
                                        height="285"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 03. PATHWAY SELECTION */}
                <div ref={workshopRef} className="section-block">
                    {!workshopCategory ? (
                        <>
                            <header className="block-header">
                                <span className="block-label">03 // ENGAGEMENT FORMAT</span>
                                <h2 className="block-title">SELECT PATHWAY</h2>
                            </header>
                            <div className="minimal-pathway-grid">
                                <div className="pathway-brick" onClick={() => handleCategorySelect('VIRTUAL')}>
                                    <div className="brick-number">01</div>
                                    <div className="brick-icon">&#9672;</div>
                                    <h3 className="brick-title">VIRTUAL WORKSHOP</h3>
                                    <p className="brick-desc">Global digital summits and interactive strategy sessions.</p>
                                    <span className="brick-cta">ENTER PORTAL <span>&rarr;</span></span>
                                </div>
                                <div className="pathway-brick" onClick={() => handleCategorySelect('IN_PERSON')}>
                                    <div className="brick-number">02</div>
                                    <div className="brick-icon">&#9670;</div>
                                    <h3 className="brick-title">IN-PERSON FIELD</h3>
                                    <p className="brick-desc">On-ground training and diplomatic simulations.</p>
                                    <span className="brick-cta">COORDINATE FIELD <span>&rarr;</span></span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="list-interface">
                            <button className="back-btn" onClick={() => setWorkshopCategory(null)}>
                                &larr; BACK TO SELECTION
                            </button>
                            <div className="podcasts-grid">
                                {activeWorkshops.map((item) => (
                                    <WorkshopCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Events;