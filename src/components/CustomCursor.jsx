import React, { useEffect, useState } from 'react';

const NormalOrangeCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const noHover = window.matchMedia('(hover: none)').matches;
    const enableCursor = !(isCoarse && noHover);
    if (!enableCursor) {
      setIsEnabled(false);
      return;
    }
    setIsEnabled(true);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if the real mouse is over a clickable element
      const target = e.target;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer';
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Standard Cursor SVG (Orange Fill)
  const normalCursor = `data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.21V20.8L10.11 15.35H18.25L5.5 3.21Z" fill="%23FF8C00" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

  if (!isEnabled) return null;

  return (
    <>
      <style>{`
        /* Hide the real cursor everywhere */
        body, a, button, * {
          cursor: none !important;
        }

        .cursor-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 999999;
        }

        .custom-pointer {
          position: absolute;
          width: 26px;
          height: 26px;
          background-image: url('${normalCursor}');
          background-size: contain;
          background-repeat: no-repeat;
          filter: drop-shadow(0px 0px 3px rgba(255, 140, 0, 0.45));
          will-change: transform;
          transform: translate(-2px, -2px);
          /* No transition here to make it feel "Normal" and responsive */
        }

        /* If hovering over a link, we can add a slight tilt or glow */
        .is-hovering {
          filter: drop-shadow(0px 0px 4px rgba(255, 140, 0, 0.6));
          transform: scale(1.1);
        }
      `}</style>

      <div className="cursor-wrapper">
        <div 
          className={`custom-pointer ${isPointer ? 'is-hovering' : ''}`}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px` 
          }}
        />
      </div>
    </>
  );
};

export default NormalOrangeCursor;
