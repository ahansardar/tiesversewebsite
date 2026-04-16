import React, { useState, useEffect } from 'react';
import { getArticle, getSettings } from '../apiClient';

// Asset imports for fallback/legacy mapping
import act1 from '../assets/act1.jpeg';
import act6 from '../assets/act6.jpeg';
import act7 from '../assets/act7.jpeg';
import act9 from '../assets/act9.jpeg';
import act10 from '../assets/act10.jpeg';
import act11 from '../assets/act11.jpeg';

const Article = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [insights, setInsights] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayLimits, setDisplayLimits] = useState({ pc: 3, mobile: 3 });

  // Helper for image fallbacks & RESOLUTION FIX
  const getArticleImage = (item) => {
    if (item.image_url) {
      let optimizedUrl = item.image_url;
      // FIX: If Cloudinary link, strip auto-compression and force 100% quality
      if (optimizedUrl.includes('cloudinary.com')) {
        optimizedUrl = optimizedUrl.replace('q_auto', 'q_100');
        // Optional: Force a high-resolution width just to be safe
        if (!optimizedUrl.includes('w_')) {
            optimizedUrl = optimizedUrl.replace('/upload/', '/upload/w_1200,c_limit/');
        }
      }
      return optimizedUrl;
    }
    
    // Legacy fallback based on display_id or title
    if (item.display_id === '01') return act1;
    if (item.display_id === '02') return act6;
    if (item.display_id === '03') return act7;
    if (item.display_id === '04') return act9;
    if (item.display_id === '05') return act10;
    if (item.display_id === '06') return act11;
    return act1; // default
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Display Limits
        const sData = await getSettings();
        if (sData && !sData.error) {
          const pc = sData.find(s => s.key === 'article_display_limit_pc')?.value || 3;
          const mob = sData.find(s => s.key === 'article_display_limit_mobile')?.value || 3;
          setDisplayLimits({ pc: parseInt(pc), mobile: parseInt(mob) });
        }

        // 2. Fetch articles - NEWEST FIRST
        const artData = await getArticle();

        if (artData && !artData.error && artData.length > 0) {
          const formatted = artData.map(a => ({
            ...a,
            img: getArticleImage(a),
            cat: a.category
          }));
          setInsights(formatted);
          setActive(formatted[0]);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle screen resize to detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter list: Show restricted count on mobile or by displayLimit
  const currentLimit = isMobile ? displayLimits.mobile : displayLimits.pc;
  const displayList = insights.slice(0, currentLimit);

  if (loading || !active) {
    return (
      <section className="media-section" style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', fontSize: '12px', fontWeight: '800' }}>LOADING ANALYSIS...</p>
      </section>
    );
  }

  return (
    <section className="media-section">
      <style>{`
        :root {
          --article-accent: #FE7A00;
          --article-bg: #000000;
          --article-surface: #0f0f0f;
          --article-surface-hover: #1a1a1a;
          --article-border: rgba(255, 255, 255, 0.08);
          --article-text: #ffffff;
          --article-text-dim: rgba(255, 255, 255, 0.6);
        }

        .media-section {
          background-color: var(--article-bg);
          color: var(--article-text);
          padding: 80px 5%;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .media-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* --- HEADER --- */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--article-border);
          padding-bottom: 25px;
          margin-bottom: 50px;
        }

        .header-brand {
          font-weight: 900;
          letter-spacing: 4px;
          font-size: 1rem;
          color: var(--article-text);
          text-transform: uppercase;
        }

        .live-status {
          font-family: 'JetBrains Mono', monospace, sans-serif;
          font-size: 0.75rem;
          color: #00ffcc;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .live-status span {
          width: 8px;
          height: 8px;
          background-color: #00ffcc;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 255, 204, 0.6);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* --- LAYOUT --- */
        .hero-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: start;
        }

        /* --- LEFT: HERO CONTENT --- */
        .hero-content {
          animation: fadeSlideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .image-box {
          width: 100%;
          /* FIX: Cap the max width to stop 4:5 ratio from making height massive */
          max-width: 450px; 
          aspect-ratio: 4 / 5; 
          border-radius: 16px;
          overflow: hidden;
          background-color: var(--article-surface);
          margin-bottom: 30px;
          border: 1px solid var(--article-border);
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* FIX: Hint browser to prioritize image quality rendering */
          image-rendering: high-quality; 
          transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .clickable-asset:hover .main-img {
          transform: scale(1.04);
        }

        .asset-overlay-hint {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);
          display: flex;
          align-items: flex-end;
          padding: 25px;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .clickable-asset:hover .asset-overlay-hint {
          opacity: 1;
        }

        .hint-text {
          background: var(--article-accent);
          color: #000;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
          transform: translateY(10px);
          transition: transform 0.4s ease;
        }

        .clickable-asset:hover .hint-text {
          transform: translateY(0);
        }

        .cat-tag {
          background: rgba(254, 122, 0, 0.1);
          color: var(--article-accent);
          border: 1px solid rgba(254, 122, 0, 0.3);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 20px;
          display: inline-block;
          text-transform: uppercase;
        }

        .headline {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .excerpt {
          color: var(--article-text-dim);
          line-height: 1.7;
          font-size: 1.05rem;
          margin-bottom: 30px;
          max-width: 90%;
        }

        .view-more-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
          padding-bottom: 5px;
        }

        .view-more-link:hover {
          color: var(--article-accent);
          border-bottom-color: var(--article-accent);
        }
        
        .arrow-icon {
          transition: transform 0.3s ease;
        }
        
        .view-more-link:hover .arrow-icon {
          transform: translateX(6px) rotate(-45deg);
        }

        /* --- RIGHT: SIDEBAR FEED --- */
        .sidebar-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 40px;
        }

        .feed-item {
          display: flex;
          gap: 20px;
          padding: 16px;
          background: transparent;
          border-radius: 12px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);
          opacity: 0.6;
        }

        .feed-item:hover {
          opacity: 1;
          background: var(--article-surface);
          border-color: var(--article-border);
        }

        .feed-item.active {
          opacity: 1;
          background: var(--article-surface);
          border-color: rgba(254, 122, 0, 0.4);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .mini-thumb {
          width: 80px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background: #222;
          position: relative;
        }

        .mini-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: high-quality;
          transition: transform 0.4s ease;
        }

        .feed-item:hover .mini-thumb img {
          transform: scale(1.1);
        }

        .feed-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .feed-title {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 8px;
          color: #fff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .feed-info {
          font-size: 0.7rem;
          font-family: 'JetBrains Mono', monospace, sans-serif;
          color: var(--article-accent);
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        @media (max-width: 968px) {
          .hero-layout { gap: 40px; }
          .headline { font-size: 2.5rem; }
        }

        @media (max-width: 768px) {
          .media-section { padding: 40px 5%; }
          .hero-layout { grid-template-columns: 1fr; gap: 50px; }
          .headline { font-size: 2rem; }
          .excerpt { max-width: 100%; }
          /* Allow it to fill screen width on mobile, since screen is narrow */
          .image-box { max-width: 100%; border-radius: 12px; }
          .sidebar-feed { position: static; }
        }
      `}</style>

      <div className="media-container">
        <header className="section-header">
          <div className="header-brand">TIESVERSE // ANALYSIS</div>
          <div className="live-status"><span></span> FEED_ACTIVE</div>
        </header>

        <div className="hero-layout">
          {/* LEFT: MAIN STORY */}
          <article className="hero-content" key={active.id}>
            <div
              className={`image-box ${active.redirect_url ? 'clickable-asset' : ''}`}
              onClick={() => active.redirect_url && window.open(active.redirect_url, '_blank')}
              style={{ cursor: active.redirect_url ? 'pointer' : 'default' }}
            >
              <img src={active.img} alt={active.title} className="main-img" />
              {active.redirect_url && (
                <div className="asset-overlay-hint">
                  <span className="hint-text">CLICK TO VIEW FULL ARTICLE ↗</span>
                </div>
              )}
            </div>
            
            <span className="cat-tag">{active.cat || 'INSIGHT'}</span>
            <h1 className="headline">{active.title}</h1>
            <p className="excerpt">{active.excerpt}</p>
            
            {active.redirect_url && (
              <a
                href={active.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="view-more-link"
              >
                VIEW FULL ANALYSIS <span className="arrow-icon">→</span>
              </a>
            )}
          </article>

          {/* RIGHT: LIST (Dynamic Count) */}
          <aside className="sidebar-feed">
            {displayList.map((item) => (
              <div
                key={item.id}
                className={`feed-item ${active.id === item.id ? 'active' : ''}`}
                onClick={() => setActive(item)}
              >
                <div className="mini-thumb">
                  <img src={item.img} alt="thumb" />
                </div>
                <div className="feed-content">
                  <h3 className="feed-title">{item.title}</h3>
                  <div className="feed-info">{item.type || 'ARTICLE'} // {item.display_id || '00'}</div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Article;