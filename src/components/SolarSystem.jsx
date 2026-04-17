import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
<<<<<<< HEAD
=======
import '../styles/SolarSystem.css';
>>>>>>> node-krisjscott

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
<<<<<<< HEAD
  
=======

>>>>>>> node-krisjscott
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
<<<<<<< HEAD
    
=======

>>>>>>> node-krisjscott
    const starCount = isMobile ? 35 : 90;
    const stars = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
<<<<<<< HEAD
    
=======

>>>>>>> node-krisjscott
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < starCount; i++) {
<<<<<<< HEAD
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 1.2 : 1.8),
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.08 + 0.03
=======
      const sizeRandomizer = Math.random();
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: sizeRandomizer < 0.9 ? Math.random() * 1.2 : Math.random() * 2.2,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.05 + 0.02
>>>>>>> node-krisjscott
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
<<<<<<< HEAD
        star.y -= star.speed; 
=======
        star.y -= star.speed;
>>>>>>> node-krisjscott
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
<<<<<<< HEAD
const Planet = React.memo(({ item, isActive, progress, index, total, isMobile }) => {
  const offset = index / (total - 1);
  const localProgress = (progress - offset) * 3.5;
  
=======
const Planet = React.memo(({ item, isActive, progress, index, total, viewport, globeContainerSize }) => {
  const { width, height } = viewport;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const offset = index / (total - 1);
  const localProgress = (progress - offset) * 3.5;

  if (isMobile && Math.abs(localProgress) > 1.05) return null;

>>>>>>> node-krisjscott
  let opacity = 0, scale = 0, x = 0, y = 0, rotation = 0, glowIntensity = 0;

  if (localProgress > -1.5 && localProgress < 1.5) {
    opacity = Math.max(0, Math.min(1, 1 - Math.abs(localProgress) * 0.7));
<<<<<<< HEAD
    scale = isActive ? (isMobile ? 1.05 : 1.3) : (isMobile ? 0.65 : 0.8);
    scale = scale * (1 - Math.abs(localProgress) * 0.15);
    glowIntensity = Math.max(0, 1 - Math.abs(localProgress));
    
    // Orbit radius logic perfectly tuned for both views
    const orbitRadius = isMobile ? 180 : 350;
    const angleDeg = 180 + (localProgress * 55); 
=======

    // SCALE: HERO FOCUS (Smoothly blend between idle and focus to avoid abrupt pop)
    const inactiveScale = isMobile ? 0.62 : (isTablet ? 0.78 : 0.82);
    const activeScale = isMobile ? 1.45 : 1.6;
    const focus = Math.pow(Math.max(0, 1 - Math.abs(localProgress) * 0.95), 1.7);
    const baseScale = inactiveScale + (activeScale - inactiveScale) * focus;
    // Fluidly scale planets with their container
    const relativeSizeFactor = globeContainerSize / 650;
    scale = baseScale * (0.8 + relativeSizeFactor * 0.2) * (1 - Math.abs(localProgress) * 0.12);

    // SCALE ADJUSTMENT: Upties asset has significantly less internal padding than others.
    // We reduce its scale further (from 0.72 to 0.65) per user request to ensure perfect sizing.
    if (item.id === 'upties') {
      scale *= 0.65;
    }

    // Dynamic glow peaks sharply when in direct focus
    glowIntensity = Math.pow(Math.max(0, 1 - Math.abs(localProgress)), 1.8);

    // ORBIT: Tightened on mobile to ensure planets stay within viewport
    const orbitRadius = globeContainerSize * (isMobile ? 0.42 : (isTablet ? 0.48 : 0.58));
    const angleDeg = 180 + (localProgress * 55);
>>>>>>> node-krisjscott
    const angleRad = (angleDeg * Math.PI) / 180;

    x = Math.cos(angleRad) * orbitRadius;
    y = Math.sin(angleRad) * orbitRadius;
<<<<<<< HEAD
    rotation = localProgress * 40;
=======
    rotation = localProgress * (isMobile ? 30 : 24);
>>>>>>> node-krisjscott
  }

  if (opacity < 0.01) return null;

<<<<<<< HEAD
=======
  // Fluid planet base size (Scaled for visibility and viewport safety)
  const planetSize = `${globeContainerSize * (isMobile ? 0.31 : (isTablet ? 0.33 : 0.35))}px`;

  const isUpties = item.id === 'upties';

>>>>>>> node-krisjscott
  return (
    <div
      style={{
        position: 'absolute', top: '50%', left: '50%',
<<<<<<< HEAD
        width: isMobile ? '80px' : '170px', height: isMobile ? '80px' : '170px',
=======
        width: planetSize, height: planetSize,
>>>>>>> node-krisjscott
        transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${rotation}deg) scale(${scale})`,
        opacity, zIndex: isActive ? 20 : 5, willChange: 'transform, opacity', pointerEvents: 'none', backfaceVisibility: 'hidden',
      }}
    >
<<<<<<< HEAD
        <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'relative' }} />
        <div style={{
            position: 'absolute', inset: isMobile ? -10 : -40,
            background: `radial-gradient(circle, ${item.color}${Math.floor(glowIntensity * 50)} 0%, transparent 75%)`,
            borderRadius: '50%', zIndex: 1, filter: `blur(${isMobile ? '12px' : '25px'})`,
            opacity: glowIntensity, transform: 'translateZ(0)', transition: 'opacity 0.2s ease-out'
        }} />
=======
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

        {/* ELITE 3D SHADER RIG (Upties-specific Multi-Point Lighting) */}
        {isUpties && (
          <>
            {/* 1. MATTE BASE: Physical core fill */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(circle at 30% 30%, #1a2a3a 0%, #000 100%)', pointerEvents: 'none' }} />

            {/* 2. DIFFUSE SHADOW: Cinema-grade volumetric depth */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(circle at 80% 80%, rgba(0,0,0,0.95) 0%, transparent 75%)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />

            {/* 3. BROAD SPECULAR: Subsurface scatter glow */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 4, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 65%)', mixBlendMode: 'screen', pointerEvents: 'none' }} />

            {/* 4. SHARP HOTSPOT: Mirror-like highlight */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 12%, transparent 40%)', mixBlendMode: 'plus-lighter', pointerEvents: 'none' }} />

            {/* 5. ELITE RIM LIGHTING (Matching TBA Style) */}
            <div style={{
              position: 'absolute', inset: '-1px', zIndex: 6, borderRadius: '50%',
              boxShadow: `
                inset 10px 10px 25px rgba(255,255,255,0.28), 
                inset -8px -8px 20px rgba(0,0,0,0.9),
                inset 0 0 15px rgba(255,255,255,0.15)
              `,
              border: '2px solid rgba(255,255,255,0.18)',
              pointerEvents: 'none'
            }} />

            {/* 6. ATMOSPHERIC SHEEN: Soft white glow on the left-side curve */}
            <div style={{
              position: 'absolute', inset: '-1px', zIndex: 7, borderRadius: '50%',
              background: 'radial-gradient(circle at 15% 40%, rgba(255,255,255,0.18) 0%, transparent 55%)',
              mixBlendMode: 'plus-lighter', pointerEvents: 'none'
            }} />
          </>
        )}
      </div>

      {/* EXTERNAL ATMOSPHERIC GLOW */}
      <div style={{
        position: 'absolute', inset: '-30%',
        background: `radial-gradient(circle, ${item.color}${Math.floor(glowIntensity * 60)} 0%, transparent 75%)`,
        borderRadius: '50%', zIndex: 1, filter: `blur(${globeContainerSize * 0.05}px)`,
        opacity: glowIntensity, transform: 'translateZ(0)', transition: 'opacity 0.2s ease-out'
      }} />
>>>>>>> node-krisjscott
    </div>
  );
});

// ============================================================
// MAIN SECTION
// ============================================================
const InitiativesSection = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
<<<<<<< HEAD
  const [isMobile, setIsMobile] = useState(false);
=======
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const launchTimeoutRef = useRef(null);
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
>>>>>>> node-krisjscott

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
<<<<<<< HEAD
    setProgress(parseFloat(clampedProgress.toFixed(4)));
  });

  useEffect(() => {
    // 1024px Breakpoint ensures tablets map to the mobile/stacked layout before elements cramp
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

=======
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

  // HERO GLOBE SIZING: Significantly larger to make them highly visible
  const globeContainerSize = isMobile
    ? Math.min(viewport.width * 0.68, viewport.height * 0.54, 380)
    : (isTablet ? Math.min(viewport.width * 0.52, viewport.height * 0.82, 640) : Math.min(viewport.width * 0.5, viewport.height * 0.85, 750));

>>>>>>> node-krisjscott
  const activeIndex = Math.min(Math.round(progress * (initiatives.length - 1)), initiatives.length - 1);
  const activeItem = initiatives[activeIndex] || initiatives[0];

  const jumpToNext = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.bottom, behavior: 'smooth' });
  };

  return (
<<<<<<< HEAD
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

        {/* DYNAMIC GLOW */}
        <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: `radial-gradient(circle at 75% 50%, ${activeItem.color}18 0%, transparent 65%)`,
            transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none'
        }} />

        {/* FILM GRAIN */}
        <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
            pointerEvents: 'none', opacity: 0.8
        }} />

        <StarFieldCanvas isMobile={isMobile} />
        
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: isMobile ? 'column' : 'row', zIndex: 5 }}>
            {/* TEXT CONTAINER */}
            <div style={{ 
                flex: isMobile ? '0 0 45%' : '0 0 50%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                padding: isMobile ? '80px 8% 0' : '0 0 0 10%', 
                position: 'relative', 
                zIndex: 30 
            }}>
                 <div style={{ maxWidth: '500px', margin: isMobile ? '0 auto' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ height: '2px', width: '35px', background: activeItem.color, transition: 'background 0.5s' }} />
                        <span style={{ color: activeItem.color, fontWeight: '900', letterSpacing: '5px', fontSize: '0.75rem', transition: 'color 0.5s', fontFamily: "'Space Mono', monospace" }}>
                            PROJECT 0{activeIndex + 1}
                        </span>
                    </div>
                    
                    <h2 style={{ color: 'white', fontSize: isMobile ? 'clamp(2.4rem, 8vw, 3.5rem)' : '4.8rem', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 15px 0', lineHeight: 0.95, textTransform: 'uppercase', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'color 0.4s ease' }}>
                        {activeItem.name}
                    </h2>
                    
                    <p style={{ color: '#aaaaaa', fontSize: isMobile ? '0.95rem' : '1.15rem', lineHeight: 1.6, marginBottom: '40px', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                        {activeItem.desc}
                    </p>

                    <a href={activeItem.web} target="_blank" rel="noreferrer" style={{
                        pointerEvents: 'auto', background: activeItem.color, color: activeItem.color === '#FFFFFF' ? 'black' : 'white',
                        padding: '16px 36px', borderRadius: '2px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem',
                        display: 'inline-block', letterSpacing: '2px', boxShadow: `0 10px 30px ${activeItem.color}30`, cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        LAUNCH EXPLORER
                    </a>
                 </div>
            </div>

            {/* GLOBE CONTAINER */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                <div style={{ 
                    position: 'absolute', 
                    // THE EXACT FIX: 
                    // mathematically shifting exactly 100px right from the absolute center on mobile
                    right: isMobile ? 'calc(50% - 300px)' : '8%', 
                    width: isMobile ? '400px' : '650px', 
                    height: isMobile ? '400px' : '650px', 
                    pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                    <img src={tiesverseLogo} alt="Hub" style={{ width: isMobile ? '55%' : '65%', height: 'auto', filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.08))', zIndex: 10, userSelect: 'none', transform: 'translateZ(0)' }} />
                    {initiatives.map((item, index) => (
                        <Planet key={item.id} item={item} index={index} total={initiatives.length} isActive={index === activeIndex} progress={progress} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        </div>

        {/* UI CONTROLS */}
        <div style={{ position: 'absolute', bottom: isMobile ? '35px' : '50px', left: '5%', right: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, pointerEvents: 'none' }}>
            <button onClick={jumpToNext} style={{
                    pointerEvents: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: isMobile ? '10px 20px' : '14px 28px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', letterSpacing: '1.5px', fontFamily: "'Space Mono', monospace"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'white'; }}
            >
                SKIP SECTION ↓
            </button>

            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '3px', textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>
                SCROLL TO <br/> NAVIGATE
            </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: 'rgba(255,255,255,0.05)', width: '100%', zIndex: 101, pointerEvents: 'none' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: activeItem.color, boxShadow: `0 0 20px ${activeItem.color}`, transition: 'width 0.15s linear, background 0.6s ease' }} />
=======
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
          top: isMobile ? '0.5vh' : '7.5vh',
          left: '0', width: '100%',
          textAlign: 'center',
          zIndex: 12,
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          opacity: isMobile ? 1 : 1,
          transform: isMobile ? `scale(${1 + progress * 0.5}) translateY(${progress * -40}px)` : 'none',
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

              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2.8rem, 8vw, 7.5rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: 'clamp(10px, 2.5vw, 36px)',
                margin: 0,
                position: 'absolute',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                opacity: isMobile ? 0 : 0.38,
                WebkitTextStroke: '1px white',
                color: 'transparent',
                textShadow: '0 0 18px rgba(255,255,255,0.25)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}>
                OUR INITIATIVES
              </h2>


              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? 'clamp(1.9rem, 6.2vw, 2.6rem)' : 'clamp(1.4rem, 4.2vw, 3.6rem)',
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

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 5, padding: isMobile ? 'calc(8vh + 56px) 6% 18vh' : '5vh 7% 4vh', gap: isMobile ? '2vh' : '2vh' }}>
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
              justifyContent: isMobile ? 'flex-end' : 'flex-end',
              minHeight: isMobile ? '42vh' : (isTablet ? '60vh' : 'auto'),
              maxHeight: isMobile ? '52vh' : 'none',
              width: isMobile ? '100%' : '100%',
              overflow: 'visible',
              paddingLeft: '0',
              zIndex: 5
            }}>
              <div style={{
                position: isMobile ? 'relative' : 'absolute',
                right: isMobile ? 'auto' : (isTablet ? '-45%' : '-26%'),
                width: `${globeContainerSize}px`,
                height: `${globeContainerSize}px`,
                marginLeft: isMobile ? 'auto' : undefined,
                transform: isMobile ? 'translateX(14%)' : undefined,
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
              justifyContent: isMobile ? 'flex-start' : 'flex-start',
              width: isMobile ? '100%' : '100%',
              zIndex: 10
            }}>
              <div key={activeItem.id} style={{
                maxWidth: isMobile ? '520px' : (isTablet ? '620px' : '560px'),
                width: '100%',
                padding: isMobile ? '12px 12px 14px' : '24px 26px',
                background: 'linear-gradient(140deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.12) 100%)',
                border: '1px solid rgba(255,255,255,0.035)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
                backdropFilter: 'blur(6px)',
                borderRadius: '16px'
              }}>
                <div className="fade-in-up stagger-1" style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-start', gap: '12px', marginBottom: 'clamp(8px, 1.6vh, 16px)' }}>
                  <div style={{ height: '2px', width: '35px', background: activeItem.color, transition: 'background 0.5s' }} />
                  <span style={{ color: activeItem.color, fontWeight: '900', letterSpacing: 'clamp(2px, 0.4vw, 5px)', fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)', transition: 'color 0.5s', fontFamily: "'Space Mono', monospace" }}>
                    PROJECT 0{activeIndex + 1}
                  </span>
                </div>

                <h2 className="fade-in-up stagger-2" style={{ color: 'white', fontSize: isMobile ? 'clamp(1.15rem, 4.4vw + 0.9vh, 1.75rem)' : (isTablet ? 'clamp(3.1rem, 6.2vw, 4.8rem)' : 'clamp(3.1rem, 4.6vw + 2vh, 5rem)'), fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 6px 0', lineHeight: 0.92, textTransform: 'uppercase', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'color 0.4s ease', textAlign: isMobile ? 'left' : 'left' }}>
                  {activeItem.name}
                </h2>

                <p className="fade-in-up stagger-3" style={{ color: '#b9b9b9', fontSize: isMobile ? 'clamp(0.7rem, 2.1vw, 0.92rem)' : (isTablet ? 'clamp(1.1rem, 1.8vw, 1.35rem)' : 'clamp(0.95rem, 0.6vw + 0.6vh, 1.2rem)'), lineHeight: 1.5, marginBottom: isMobile ? '12px' : '36px', fontFamily: "'Inter', sans-serif", fontWeight: 300, maxWidth: isMobile ? '100%' : 'none', margin: isMobile ? '0 0 12px' : '0 0 36px', textAlign: isMobile ? 'left' : 'left' }}>
                  {activeItem.desc}
                </p>

                <div className="fade-in-up stagger-4" style={{ textAlign: isMobile ? 'left' : 'left' }}>
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

        {/* UI CONTROLS: Simplified and spaced to not crowd larger planets */}
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

        {/* HORIZONTAL PROGRESS BAR (Restored) */}
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
>>>>>>> node-krisjscott
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default InitiativesSection;
=======
export default InitiativesSection;
>>>>>>> node-krisjscott
