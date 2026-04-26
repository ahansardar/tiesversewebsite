import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import '../styles/SolarSystem.css';

// ============================================================
// ASSETS
// ============================================================
import tiesverseLogo from '../assets/planets/tiesverse.png';
import tiesLogo from '../assets/planets/ties.png';
import tbaLogo from '../assets/planets/tba.png';
import fintiesLogo from '../assets/planets/finties.png';
import indiLogo from '../assets/planets/indi.png';
import fpiLogo from '../assets/planets/fpi.png';
import uptiesLogo from '../assets/planets/upties.png';
import nimbleLogo from '../assets/planets/nimble.png';

// ============================================================
// COMPONENT: StarField (Canvas optimization)
// ============================================================
const StarFieldCanvas = React.memo(({ isMobile }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const starCount = isMobile ? 35 : 90;
    const stars = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < starCount; i++) {
      const sizeRandomizer = Math.random();
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: sizeRandomizer < 0.9 ? Math.random() * 1.2 : Math.random() * 2.2,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.05 + 0.02
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
});

// ============================================================
// COMPONENT: Planet Visuals
// ============================================================
const Planet = React.memo(({ item, isActive, progress, index, total, viewport, globeContainerSize }) => {
  const { width, height } = viewport;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const offset = index / (total - 1);
  const localProgress = (progress - offset) * 3.5;

  if (isMobile && Math.abs(localProgress) > 1.05) return null;

  let opacity = 0, scale = 0, x = 0, y = 0, rotation = 0, glowIntensity = 0;

  if (localProgress > -1.5 && localProgress < 1.5) {
    opacity = Math.max(0, Math.min(1, 1 - Math.abs(localProgress) * 0.7));

    // SCALE: HERO FOCUS (Adjusted for better mobile visibility)
    const inactiveScale = isMobile ? 0.75 : (isTablet ? 0.78 : 0.82);
    const activeScale = isMobile ? 1.6 : 1.6;
    const focus = Math.pow(Math.max(0, 1 - Math.abs(localProgress) * 0.95), 1.7);
    const baseScale = inactiveScale + (activeScale - inactiveScale) * focus;
    
    const relativeSizeFactor = globeContainerSize / 650;
    scale = baseScale * (0.8 + relativeSizeFactor * 0.2) * (1 - Math.abs(localProgress) * 0.12);

    if (item.id === 'upties') {
      scale *= 0.65;
    }

    glowIntensity = Math.pow(Math.max(0, 1 - Math.abs(localProgress)), 1.8);

    // ORBIT: Widened slightly on mobile for better spacing
    const orbitRadius = globeContainerSize * (isMobile ? 0.45 : (isTablet ? 0.48 : 0.58));
    const angleDeg = 180 + (localProgress * 55);
    const angleRad = (angleDeg * Math.PI) / 180;

    x = Math.cos(angleRad) * orbitRadius;
    y = Math.sin(angleRad) * orbitRadius;
    rotation = localProgress * (isMobile ? 30 : 24);
  }

  if (opacity < 0.01) return null;

  // Fluid planet base size (Boosted on mobile)
  const planetSize = `${globeContainerSize * (isMobile ? 0.35 : (isTablet ? 0.33 : 0.35))}px`;

  const isUpties = item.id === 'upties';

  return (
    <div
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: planetSize, height: planetSize,
        transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) scale(${scale})`,
        opacity, zIndex: isActive ? 20 : 5, willChange: 'transform, opacity', pointerEvents: 'none', backfaceVisibility: 'hidden',
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        borderRadius: isUpties ? '50%' : undefined,
        overflow: isUpties ? 'hidden' : undefined,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUpties ? '#050a0f' : 'transparent',
        boxShadow: isUpties ? `inset -18px -18px 40px rgba(0,0,0,0.9), inset 12px 12px 30px rgba(255,255,255,0.15)` : 'none'
      }}>
        <img src={item.src} alt={item.name} style={{
          width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'relative',
          filter: isUpties ? 'brightness(1.18) contrast(1.25) saturate(1.15) drop-shadow(0 0 8px rgba(255,255,255,0.1))' : 'none',
          imageRendering: isUpties ? 'high-quality' : 'auto'
        }} />

        {isUpties && (
          <>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(circle at 30% 30%, #1a2a3a 0%, #000 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(circle at 80% 80%, rgba(0,0,0,0.95) 0%, transparent 75%)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 4, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 65%)', mixBlendMode: 'screen', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 12%, transparent 40%)', mixBlendMode: 'plus-lighter', pointerEvents: 'none' }} />
            <div style={{
              position: 'absolute', inset: '-1px', zIndex: 6, borderRadius: '50%',
              boxShadow: `inset 10px 10px 25px rgba(255,255,255,0.28), inset -8px -8px 20px rgba(0,0,0,0.9), inset 0 0 15px rgba(255,255,255,0.15)`,
              border: '2px solid rgba(255,255,255,0.18)', pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', inset: '-1px', zIndex: 7, borderRadius: '50%',
              background: 'radial-gradient(circle at 15% 40%, rgba(255,255,255,0.18) 0%, transparent 55%)',
              mixBlendMode: 'plus-lighter', pointerEvents: 'none'
            }} />
          </>
        )}
      </div>

      <div style={{
        position: 'absolute', inset: '-30%',
        background: `radial-gradient(circle, ${item.color}${Math.floor(glowIntensity * 60)} 0%, transparent 75%)`,
        borderRadius: '50%', zIndex: 1, filter: `blur(${globeContainerSize * 0.05}px)`,
        opacity: glowIntensity, transform: 'translateZ(0)', transition: 'opacity 0.2s ease-out'
      }} />
    </div>
  );
});

// ============================================================
// MAIN SECTION
// ============================================================
const InitiativesSection = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const launchTimeoutRef = useRef(null);
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const initiatives = useMemo(() => [
    { id: 'fpi', name: 'Foreign Policy India', src: fpiLogo, desc: "Tracking global shifts and India's strategic role in a multipolar world.", color: '#FE7A00', web: 'https://ties.tiesverse.com/' },
    { id: 'upties', name: 'Upties', src: uptiesLogo, desc: 'Building technology that adapts to how people think, behave, and evolve.', color: '#00D4FF', web: 'https://upties.in/' },
    { id: 'tba', name: 'The Bharat Age', src: tbaLogo, desc: 'Shaping informed minds for India’s future through UPSC-focused insights.', color: '#FFD700', web: 'https://ties.tiesverse.com/' },
    { id: 'ties', name: '.ties', src: tiesLogo, desc: 'In-depth geopolitical analysis and high-level strategic discourse.', color: '#FFFFFF', web: 'https://ties.tiesverse.com/' },
    { id: 'indi', name: 'India Elections', src: indiLogo, desc: 'Real-time data and in-depth analysis of electoral trends.', color: '#00FF41', web: '#' },
    { id: 'finties', name: 'Finties', src: fintiesLogo, desc: 'Democratizing financial literacy with deep market insights.', color: '#B026FF', web: 'https://finties.tiesverse.com/' },
    { id: 'nimble', name: 'Nimble', src: nimbleLogo, desc: 'The creative powerhouse behind the ecosystem identity.', color: '#FF007F', web: 'https://thenimble.in/' },
  ], []);

  useLenis(({ scroll }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const offsetTop = rect.top + scrollTop;
    const totalScrollableDistance = rect.height - window.innerHeight;
    const currentScroll = scrollTop - offsetTop;
    const scrollRatio = currentScroll / totalScrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, scrollRatio));
    targetProgressRef.current = parseFloat(clampedProgress.toFixed(4));
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let rafId;
    const smoothStep = () => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;
      const next = current + (target - current) * 0.04;
      currentProgressRef.current = next;
      setProgress(next);
      rafId = requestAnimationFrame(smoothStep);
    };
    rafId = requestAnimationFrame(smoothStep);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1100;

  const getReadableTextColor = (hex) => {
    if (!hex || hex[0] !== '#') return '#ffffff';
    const clean = hex.length === 4
      ? `${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex.slice(1);
    if (clean.length !== 6) return '#ffffff';
    const toLinear = (value) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    };
    const r = toLinear(parseInt(clean.slice(0, 2), 16));
    const g = toLinear(parseInt(clean.slice(2, 4), 16));
    const b = toLinear(parseInt(clean.slice(4, 6), 16));
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const contrastWhite = (1.05) / (luminance + 0.05);
    const contrastBlack = (luminance + 0.05) / 0.05;
    return contrastWhite >= contrastBlack ? '#ffffff' : '#0b0b0b';
  };

  const getTextShadow = (hex) => {
    const textColor = getReadableTextColor(hex);
    return textColor === '#ffffff'
      ? '0 2px 10px rgba(0, 0, 0, 0.32)'
      : '0 1px 6px rgba(255, 255, 255, 0.25)';
  };

  useEffect(() => {
    return () => {
      if (launchTimeoutRef.current) {
        clearTimeout(launchTimeoutRef.current);
      }
    };
  }, []);

  // HERO GLOBE SIZING: Greatly expanded on mobile to utilize free space
  const globeContainerSize = isMobile
    ? Math.min(viewport.width * 0.85, viewport.height * 0.45, 420)
    : (isTablet ? Math.min(viewport.width * 0.52, viewport.height * 0.82, 640) : Math.min(viewport.width * 0.5, viewport.height * 0.85, 750));

  const activeIndex = Math.min(Math.round(progress * (initiatives.length - 1)), initiatives.length - 1);
  const activeItem = initiatives[activeIndex] || initiatives[0];

  const jumpToNext = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.bottom, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} style={{
      height: '700vh', position: 'relative', zIndex: 10, background: '#000',
      marginTop: '-2px', display: 'flow-root', overflow: 'clip'
    }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* TOP TRANSITION BRIDGE */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '15vh',
          background: 'linear-gradient(to bottom, #000000, transparent)',
          zIndex: 10, pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: isMobile ? '6vh' : '7.5vh',
          left: '0', width: '100%',
          textAlign: 'center',
          zIndex: 12,
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          opacity: isMobile ? 1 - (progress * 0.5) : 1, // Cleaner fade out instead of scale
          transform: isMobile ? `translateY(${progress * -20}px)` : 'none', // Removed scale() for cleaner view
          transition: isMobile ? 'none' : 'opacity 0.8s ease'
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '3vw' }}>

            {!isMobile && (
              <div className="hud-pulse" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 'clamp(20px, 4vw, 60px)', height: '1px', background: 'white' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'white', transform: 'rotate(-90deg)', transformOrigin: 'center' }}>TIESVERSE</span>
              </div>
            )}

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Removed the overlapping absolute <h2> here that caused the messy "cringe" shadow look */}

              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? 'clamp(1.9rem, 6.2vw, 2.6rem)' : 'clamp(2rem, 4.2vw, 3.6rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.06em' : 'clamp(6px, 1.2vw, 20px)',
                margin: 0,
                position: 'relative',
                color: 'white',
                textShadow: isMobile ? '0 2px 12px rgba(0,0,0,0.6)' : '0 0 30px rgba(255,255,255,0.4)',
                opacity: isMobile ? 1 : 0.9,
                display: 'flex',
                alignItems: 'center',
                gap: '1vw'
              }}>
                OUR <span style={{ color: isMobile ? '#e85a24' : activeItem.color, transition: 'color 0.8s ease', opacity: isMobile ? 1 : 0.8 }}>INITIATIVES</span>
              </h1>
            </div>

            {!isMobile && (
              <div className="hud-pulse" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'white', letterSpacing: '2px' }}>[ 0{activeIndex + 1} // 07 ]</span>
                <div style={{ width: 'clamp(20px, 4vw, 60px)', height: '1px', background: activeItem.color, transition: 'background 0.8s ease' }} />
              </div>
            )}
          </div>

          <div style={{
            height: '1px',
            width: 'clamp(100px, 30vw, 400px)',
            background: `linear-gradient(to right, transparent, rgba(255,255,255,0.3), ${activeItem.color}88, rgba(255,255,255,0.3), transparent)`,
            marginTop: '1.2vh',
            position: 'relative',
            transition: 'background 0.8s ease'
          }}>
            <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px white' }} />
          </div>
        </div>

        <StarFieldCanvas isMobile={isMobile} />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `radial-gradient(circle at ${isMobile ? '50% 45%' : '75% 50%'}, ${activeItem.color}22 0%, transparent 70%)`,
          transition: 'background 0.8s ease-in-out',
          pointerEvents: 'none'
        }} />

        {/* Adjusted padding & gaps for mobile to fill space perfectly */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 5, padding: isMobile ? '16vh 5% 10vh' : '5vh 7% 4vh', gap: isMobile ? '4vh' : '2vh' }}>
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : '1.05fr 1fr',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            gap: isMobile ? '2vh' : '2vw',
            flex: 1
          }}>
            
            {/* GLOBE CONTAINER */}
            <div style={{
              order: isMobile ? 2 : 2,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'center' : 'flex-end', // Centered properly on mobile
              minHeight: isMobile ? '38vh' : (isTablet ? '60vh' : 'auto'),
              maxHeight: isMobile ? '48vh' : 'none',
              width: '100%',
              overflow: 'visible',
              zIndex: 5
            }}>
              <div style={{
                position: isMobile ? 'relative' : 'absolute',
                right: isMobile ? 'auto' : (isTablet ? '-45%' : '-26%'),
                width: `${globeContainerSize}px`,
                height: `${globeContainerSize}px`,
                margin: isMobile ? '0 auto' : undefined,
                
                // === 👇 THE FIX IS APPLIED HERE 👇 ===
                transform: isMobile ? 'translate(15vw, 5vh)' : undefined, 
                // =====================================

                pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img src={tiesverseLogo} alt="Hub" style={{ width: '55%', height: 'auto', filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.1))', zIndex: 10, userSelect: 'none', transform: 'translateZ(0)' }} />
                {initiatives.map((item, index) => (
                  <Planet key={item.id} item={item} index={index} total={initiatives.length} isActive={index === activeIndex} progress={progress} viewport={viewport} globeContainerSize={globeContainerSize} />
                ))}
              </div>
            </div>

            {/* TEXT CONTAINER */}
            <div style={{
              order: isMobile ? 1 : 1,
              display: 'flex',
              justifyContent: isMobile ? 'center' : 'flex-start',
              width: '100%',
              zIndex: 10
            }}>
              <div key={activeItem.id} style={{
                maxWidth: isMobile ? '100%' : (isTablet ? '620px' : '560px'),
                width: '100%',
                padding: isMobile ? '24px 20px' : '24px 26px', // Beefed up mobile padding
                background: 'linear-gradient(140deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.12) 100%)',
                border: '1px solid rgba(255,255,255,0.035)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
                backdropFilter: 'blur(6px)',
                borderRadius: '16px'
              }}>
                <div className="fade-in-up stagger-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', marginBottom: 'clamp(8px, 1.6vh, 16px)' }}>
                  <div style={{ height: '2px', width: '35px', background: activeItem.color, transition: 'background 0.5s' }} />
                  <span style={{ color: activeItem.color, fontWeight: '900', letterSpacing: 'clamp(2px, 0.4vw, 5px)', fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)', transition: 'color 0.5s', fontFamily: "'Space Mono', monospace" }}>
                    PROJECT 0{activeIndex + 1}
                  </span>
                </div>

                <h2 className="fade-in-up stagger-2" style={{ color: 'white', fontSize: isMobile ? 'clamp(1.8rem, 7vw, 2.4rem)' : (isTablet ? 'clamp(3.1rem, 6.2vw, 4.8rem)' : 'clamp(3.1rem, 4.6vw + 2vh, 5rem)'), fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 8px 0', lineHeight: 0.92, textTransform: 'uppercase', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'color 0.4s ease', textAlign: 'left' }}>
                  {activeItem.name}
                </h2>

                <p className="fade-in-up stagger-3" style={{ color: '#b9b9b9', fontSize: isMobile ? 'clamp(0.95rem, 3.5vw, 1.1rem)' : (isTablet ? 'clamp(1.1rem, 1.8vw, 1.35rem)' : 'clamp(0.95rem, 0.6vw + 0.6vh, 1.2rem)'), lineHeight: 1.5, fontFamily: "'Inter', sans-serif", fontWeight: 300, maxWidth: isMobile ? '100%' : 'none', margin: isMobile ? '0 0 18px' : '0 0 36px', textAlign: 'left' }}>
                  {activeItem.desc}
                </p>

                <div className="fade-in-up stagger-4" style={{ textAlign: 'left' }}>
                  <a
                    href={activeItem.web}
                    target="_blank"
                    rel="noreferrer"
                    className={`launch-explorer-btn launch-explorer-btn--${activeItem.id}${isLaunching ? ' is-launching' : ''}`}
                    style={{
                      pointerEvents: 'auto',
                      '--accent': activeItem.color,
                      '--text-color': getReadableTextColor(activeItem.color),
                      '--text-shadow': getTextShadow(activeItem.color)
                    }}
                    onClick={() => {
                      setIsLaunching(true);
                      if (launchTimeoutRef.current) clearTimeout(launchTimeoutRef.current);
                      launchTimeoutRef.current = setTimeout(() => setIsLaunching(false), 900);
                    }}
                  >
                    <span className="launch-explorer-text">LAUNCH EXPLORER</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UI CONTROLS */}
        <div style={{ position: 'absolute', bottom: isMobile ? '1.5vh' : '3.5vh', left: '5%', right: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, pointerEvents: 'none' }}>
          <button onClick={jumpToNext} style={{
            pointerEvents: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: 'clamp(10px, 1vh, 15px) clamp(20px, 1.5vw, 28px)', cursor: 'pointer', fontSize: 'clamp(0.6rem, 0.4vw, 0.65rem)', fontWeight: 'bold', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', letterSpacing: '1.5px', fontFamily: "'Space Mono', monospace"
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'white'; }}
          >
            SKIP SECTION ↓
          </button>

          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'clamp(0.5rem, 0.4vw, 0.55rem)', letterSpacing: '2px', textAlign: 'right', fontFamily: "'Space Mono', monospace", lineHeight: 1.2 }}>
            SCROLL TO <br /> NAVIGATE
          </div>
        </div>

        {/* HORIZONTAL PROGRESS BAR */}
        <div style={{
          position: 'absolute', bottom: '0', left: '0', width: '100%', height: '2.5px',
          background: 'rgba(255,255,255,0.05)', zIndex: 120, pointerEvents: 'none'
        }}>
          <div style={{
            width: `${progress * 100}%`, height: '100%',
            background: activeItem.color,
            transition: 'width 0.1s linear, background 0.8s ease',
            boxShadow: `0 0 15px ${activeItem.color}88`
          }} />
        </div>
      </div>
    </div>
  );
};

export default InitiativesSection;