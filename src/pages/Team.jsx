import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getTeam } from '../apiClient';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=400&auto=format&fit=crop";

// ------------------------------------------------------------------
// 1. STYLED MEMBER CARD
// ------------------------------------------------------------------
const MemberCard = React.memo(({ member }) => {
  const imageSrc = member.image_url || DEFAULT_IMAGE;
  const cardRef = useRef(null);

  return (
    <div className="team-card-refined" ref={cardRef}>
      <div className="card-border-container">
        <div className="image-frame">
          <img 
            src={imageSrc} 
            alt={member.name} 
            loading="lazy"
            decoding="async"
            className="un-draggable"
          />
          <div className="corner-accents">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="text-metadata">
          <h3 className="member-name">{member.name}</h3>
          <div className="role-tag-container">
            <span className="role-tag">{member.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ------------------------------------------------------------------
// 2. MAIN COMPONENT
// ------------------------------------------------------------------
const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [status, setStatus] = useState('loading');
  
  const trackRef = useRef(null);
  const requestRef = useRef(null);

  const physics = useRef({
    currentX: 0,
    velocity: -0.8, 
    isDragging: false,
    lastX: 0,
    contentWidth: 0,
    isHovered: false
  });

  // Fetch Logic
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeam();
        if (data && !data.error) {
          setTeamMembers(data);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setStatus('error');
      }
    };
    fetchTeam();
  }, []);

  const measureContent = useCallback(() => {
    if (trackRef.current) {
      physics.current.contentWidth = trackRef.current.scrollWidth / 2;
    }
  }, []);

  useEffect(() => {
    if (status !== 'success' || !trackRef.current) return;
    measureContent();
    const ro = new ResizeObserver(measureContent);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [status, measureContent]);

  // Animation Engine with Spotlight Check
  const animate = useCallback(() => {
    const p = physics.current;

    if (!p.isDragging) {
      if (p.isHovered) {
        p.velocity *= 0.85; 
      } else {
        p.velocity += (-0.8 - p.velocity) * 0.05;
      }
      p.currentX += p.velocity;
    }

    if (p.contentWidth > 0) {
      if (p.currentX <= -p.contentWidth) p.currentX += p.contentWidth;
      if (p.currentX > 0) p.currentX -= p.contentWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${p.currentX}px, 0, 0)`;
      
      // Phone Spotlight Logic: Check card positions relative to viewport center
      if (window.innerWidth <= 768) {
        const cards = trackRef.current.querySelectorAll('.team-card-refined');
        const centerX = window.innerWidth / 2;
        
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distanceFromCenter = Math.abs(centerX - cardCenter);
          
          // If card is within 150px of center, wake it up
          if (distanceFromCenter < 150) {
            card.classList.add('in-spotlight');
          } else {
            card.classList.remove('in-spotlight');
          }
        });
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [status, animate]);

  // Pointer Handlers (Completely enabled for dragging anywhere)
  const onPointerDown = (e) => {
    physics.current.isDragging = true;
    physics.current.lastX = e.clientX;
    try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
  };

  const onPointerMove = (e) => {
    if (!physics.current.isDragging) return;
    const delta = e.clientX - physics.current.lastX;
    physics.current.lastX = e.clientX;
    physics.current.currentX += delta;
    physics.current.velocity = delta;
  };

  const onPointerUp = (e) => {
    if (!physics.current.isDragging) return;
    physics.current.isDragging = false;
    try { e.target.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const duplicatedMembers = useMemo(() => 
    teamMembers.length > 0 ? [...teamMembers, ...teamMembers] : [], 
  [teamMembers]);

  return (
    <section className="team-luxury-suite">
      <style>{`
        .team-luxury-suite {
          background: #050505; 
          color: #fff;
          /* Adjusted padding to make it much closer to the next section */
          padding: 60px 0 40px 0; 
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          position: relative;
          
          /* Strictly prevent text selection to ensure flawless dragging */
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }

        /* Prevent image ghost dragging */
        .un-draggable {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          pointer-events: none; /* Helps drag pass through to the container */
        }

        /* --- GRADIENT BLEND LAYERS --- */
        .blend-top, .blend-bottom {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100px; /* Reduced height to lessen the gap */
          z-index: 10;
          pointer-events: none; 
        }
        .blend-top {
          top: 0;
          background: linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 100%);
        }
        .blend-bottom {
          bottom: 0;
          background: linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%);
        }

        .header-wrap {
          padding: 0 8%;
          margin-bottom: 40px; /* Reduced from 60px */
          position: relative;
          z-index: 2;
        }
        .header-wrap h2 {
          font-size: clamp(45px, 8vw, 100px);
          font-weight: 900;
          line-height: 0.9;
          text-transform: uppercase;
          letter-spacing: -3px;
          margin: 0;
        }
        .header-wrap h2 span { color: #E85A24; display: block; }

        .marquee-container {
          cursor: grab;
          touch-action: pan-y;
          padding: 20px 0 40px 0; /* Reduced top padding */
        }
        .marquee-container:active {
          cursor: grabbing;
        }
        
        .marquee-track {
          display: flex;
          gap: 30px;
          will-change: transform;
        }

        /* The Card Design */
        .team-card-refined {
          width: 300px;
          flex-shrink: 0;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .card-border-container {
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          transition: border-color 0.4s ease;
          border-radius: 16px; 
        }

        .image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1.25;
          overflow: hidden;
          background: #000;
          border-radius: 10px; 
        }

        .image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          transition: all 0.7s ease;
          opacity: 0.6;
        }

        .team-card-refined:hover .card-border-container,
        .team-card-refined.in-spotlight .card-border-container {
          border-color: #E85A24;
        }

        .team-card-refined:hover img,
        .team-card-refined.in-spotlight img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.05);
        }

        .corner-accents span {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #E85A24;
          border-style: solid;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .team-card-refined:hover .corner-accents span,
        .team-card-refined.in-spotlight .corner-accents span { opacity: 1; }

        .corner-accents span:nth-child(1) { top: 8px; left: 8px; border-width: 2px 0 0 2px; border-top-left-radius: 8px; }
        .corner-accents span:nth-child(2) { top: 8px; right: 8px; border-width: 2px 2px 0 0; border-top-right-radius: 8px; }
        .corner-accents span:nth-child(3) { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; border-bottom-left-radius: 8px; }
        .corner-accents span:nth-child(4) { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; border-bottom-right-radius: 8px; }

        .text-metadata { 
          padding-top: 18px; 
          pointer-events: none; /* Prevents text from stealing the drag click */
        }
        
        .member-name {
          font-size: 1.25rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 5px;
          letter-spacing: -0.5px;
        }
        .role-tag {
          font-size: 0.7rem;
          color: #E85A24;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .header-wrap h2 {
            font-size: clamp(32px, 10vw, 45px);
            letter-spacing: -1.5px;
          }
          .team-card-refined { 
            width: 240px; 
            transform: scale(0.9);
          }
          .team-card-refined.in-spotlight {
            transform: scale(1.02);
          }
          .team-luxury-suite {
            padding: 40px 0 20px 0; /* Even tighter on mobile */
          }
        }
      `}</style>

      {/* GRADIENT BLEND LAYERS */}
      <div className="blend-top"></div>
      <div className="blend-bottom"></div>

      <div className="header-wrap">
        <h2>Leadership<span>Collective</span></h2>
      </div>

      <div 
        className="marquee-container"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseEnter={() => physics.current.isHovered = true}
        onMouseLeave={() => physics.current.isHovered = false}
      >
        <div className="marquee-track" ref={trackRef}>
          {status === 'loading' ? (
             [...Array(4)].map((_, i) => <div key={i} className="team-card-refined skeleton" />)
          ) : (
            duplicatedMembers.map((member, idx) => (
              <MemberCard key={`${member.id}-${idx}`} member={member} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Team;