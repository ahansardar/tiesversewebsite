<<<<<<< HEAD
import React from 'react';

const About = () => {
=======
import React, { useMemo } from 'react';
import ytIcon from '../assets/youtube.svg';
import igIcon from '../assets/instagram.svg';
import liIcon from '../assets/linkedin.svg';
import reachIcon from '../assets/reach-100m.svg';
import researchIcon from '../assets/research.svg';
import techIcon from '../assets/tech.svg';
import mediaIcon from '../assets/media.svg';
import podcastsIcon from '../assets/podcasts.svg';
import likeIcon from '../assets/engagement-like.svg';
import commentIcon from '../assets/engagement-comment.svg';
import shareIcon from '../assets/engagement-share.svg';
import saveIcon from '../assets/engagement-save.svg';

const About = () => {
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=400&auto=format&fit=crop";
  const avgAgeCardImages = useMemo(() => {
    const modules = import.meta.glob('../assets/team_heads/*.{jpg,jpeg,png,webp}', {
      eager: true,
      import: 'default'
    });
    const images = Object.values(modules);
    if (images.length === 0) {
      return [DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE];
    }
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    const pick = shuffled.slice(0, 4);
    while (pick.length < 4) {
      pick.push(DEFAULT_IMAGE);
    }
    return pick;
  }, []);

>>>>>>> node-krisjscott
  // Extracting pillar data to duplicate it easily for the mobile marquee effect
  const pillarsData = [
    {
      title: "Research",
      icon: "◈",
      desc: "Rigorous analysis of geopolitical shifts and strategic forecasting for a multi-polar world."
    },
    {
      title: "Media",
      icon: "▣",
      desc: "Translating high-level intelligence into high-fidelity visual storytelling for millions."
    },
    {
      title: "Tech",
      icon: "◬",
      desc: "Developing proprietary tools to democratize information access and enhance community participation."
    }
  ];
<<<<<<< HEAD
=======
  const statsCards = [
    {
      value: "100M+",
      label: "TOTAL REACH",
      images: [
        ytIcon,
        igIcon,
        liIcon,
        reachIcon
      ]
    },
    {
      value: "85+",
      label: "SPECIALISTS",
      images: [
        researchIcon,
        techIcon,
        mediaIcon,
        podcastsIcon
      ]
    },
    {
      value: "21",
      label: "AVG AGE",
      images: avgAgeCardImages
    },
    {
      value: "7M+",
      label: "ENGAGEMENTS",
      images: [
        likeIcon,
        commentIcon,
        shareIcon,
        saveIcon
      ]
    }
  ];
>>>>>>> node-krisjscott

  return (
    <section className="about-v4-mobile-optimized" id="about-section">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-orange: #e85a24;
          --bg-black: #050505;
          --text-gray: #a0a0a0;
          --border-subtle: rgba(255, 255, 255, 0.1);
        }

        .about-v4-mobile-optimized {
          background: var(--bg-black);
          color: #fff;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 60px 0 100px;
        }

        /* --- GRADIENT BLEND LAYERS --- */
        .blend-top, .blend-bottom {
          position: absolute;
          left: 0;
          width: 100%;
          height: 180px;
          z-index: 1;
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

        /* --- BACKGROUND VIDEO --- */
        .video-bg-layer {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }
        .video-bg-layer video { width: 100%; height: 100%; object-fit: cover; }

        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 6%;
          position: relative;
          z-index: 2;
        }

        /* --- HERO SECTION --- */
        .mini-hero {
          display: flex;
          flex-wrap: wrap; 
          gap: 40px;
          align-items: flex-start;
          margin-bottom: 60px;
        }

        .editorial-box { flex: 1 1 400px; }
        .editorial-box .label {
          color: var(--brand-orange);
          font-size: 10px;
          letter-spacing: 4px;
          font-weight: 800;
          margin-bottom: 12px;
          display: block;
        }

        .editorial-box h1 {
          font-size: clamp(42px, 7vw, 90px);
          line-height: 0.9;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: -2px;
        }

        .hero-description {
          flex: 1 1 450px;
          border-left: 2px solid var(--brand-orange);
          padding-left: 25px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .hero-description p {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #efefef;
          margin: 0;
        }

        /* --- PILLARS (DESKTOP) --- */
        .pillar-wrapper {
          margin-bottom: 80px;
        }

        .pillar-track {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .pillar-item {
          background: #111111; /* Solid Color */
          border: 1px solid #222222; /* Solid Border */
          padding: 35px 25px;
          transition: transform 0.4s ease, border-color 0.4s ease;
          border-radius: 4px;
        }

        .pillar-item:hover {
          border-color: var(--brand-orange);
          transform: translateY(-5px);
        }

        .pillar-item.duplicate { display: none; }

        .p-icon { color: var(--brand-orange); font-size: 1.4rem; margin-bottom: 15px; }
        .p-title { font-size: 1rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        .p-desc { font-size: 0.85rem; color: var(--text-gray); line-height: 1.5; }

<<<<<<< HEAD
=======
        /* --- STATS CARDS --- */
        .stats-section {
          margin: 35px 0 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 32px;
          align-items: center;
          justify-items: center;
        }

        .stats-section .stats-card {
          width: 100%;
          max-width: 260px;
          height: auto;
          position: relative;
          perspective: 1200px;
          --card-scale: 1;
          transform: scale(var(--card-scale));
          transform-origin: center top;
        }

        .stats-section .stats-card-wrap {
          flex-flow: row;
          place-content: center flex-start;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: min-content;
          padding: 0;
          display: flex;
          position: relative;
          overflow: visible;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.18, 0.7, 0.2, 1);
          will-change: transform;
        }

        .stats-section .stats-pop {
          z-index: 0;
          flex: none;
          width: 100%;
          height: 120px;
          position: absolute;
          top: -46px;
          overflow: visible;
          opacity: 0;
          transform: translate(calc(-60% + 0px), 10px) translateZ(-20px) scale(0.85);
          transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.18, 0.7, 0.2, 1);
          left: 50%;
          transform-origin: 50% 50%;
        }

        .stats-section .stats-pop-1,
        .stats-section .stats-pop-2,
        .stats-section .stats-pop-3,
        .stats-section .stats-pop-4 {
          will-change: transform;
          flex: none;
          gap: 0;
          width: 46px;
          height: 46px;
          position: absolute;
          overflow: hidden;
          left: 50%;
          top: 28px;
          transform: translate(var(--pop-x), var(--pop-y)) rotate(var(--pop-rot)) translateZ(var(--pop-z, 0px));
          transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.18, 0.7, 0.2, 1);
          border-radius: 10px;
          background: #ff7a00;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.35);
        }

        .stats-section .stats-pop-1 { z-index: 4; --pop-x: -72px; --pop-y: 0px; --pop-rot: -10deg; --pop-z: 8px; }
        .stats-section .stats-pop-2 { z-index: 3; --pop-x: -24px; --pop-y: -2px; --pop-rot: -3deg; --pop-z: 6px; }
        .stats-section .stats-pop-3 { z-index: 2; --pop-x: 24px; --pop-y: -2px; --pop-rot: 3deg; --pop-z: 4px; }
        .stats-section .stats-pop-4 { z-index: 1; --pop-x: 72px; --pop-y: 0px; --pop-rot: 10deg; --pop-z: 2px; }

        .stats-section .stats-pop img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: brightness(0) saturate(100%);
        }

        .stats-section .stats-card--photos .stats-pop img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: grayscale(1) brightness(0.9) contrast(0.95);
          border-radius: 8px;
        }

        .stats-section .stats-card--photos .stats-pop-1,
        .stats-section .stats-card--photos .stats-pop-2,
        .stats-section .stats-card--photos .stats-pop-3,
        .stats-section .stats-card--photos .stats-pop-4 {
          background: #ff7a00;
        }

        .stats-section .stats-card-surface {
          z-index: 2;
          flex-flow: row;
          flex: 1 0 0;
          place-content: center;
          align-self: stretch;
          align-items: center;
          gap: 10px;
          width: 1px;
          height: auto;
          padding: 0;
          display: flex;
          position: relative;
          overflow: visible;
          background: linear-gradient(180deg, #121212 0%, #0b0b0b 100%);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35), inset 0 0 0 1px #2c2c2c;
          transform: perspective(1200px);
          transform-origin: 50% 100% 0;
          transform-style: preserve-3d;
          border-radius: 8px;
          transition: transform 0.5s cubic-bezier(0.18, 0.7, 0.2, 1), box-shadow 0.4s ease;
          will-change: transform;
          min-height: 150px;
        }

        .stats-section .stats-card-surface::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 122, 0, 0.14) 0 1px, transparent 1px 12px),
            radial-gradient(circle at 80% 30%, rgba(255, 122, 0, 0.12) 0 1px, transparent 1px 14px),
            radial-gradient(circle at 40% 70%, rgba(255, 122, 0, 0.10) 0 1px, transparent 1px 16px),
            repeating-linear-gradient(135deg, rgba(255, 122, 0, 0.06) 0 1px, transparent 1px 6px);
          mix-blend-mode: screen;
        }

        .stats-section .stats-card-content {
          z-index: 1;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: min-content;
          padding: 24px 46px;
          display: flex;
          position: relative;
          overflow: visible;
          text-align: center;
        }

        .stats-section .stat-value {
          font-family: "Clash Display Bold", "Clash Display", "Gilroy-Bold", "Inter", sans-serif;
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #ff7a00;
        }

        .stats-section .stat-label {
          font-family: "Gilroy-Medium", "Neue Montreal Medium", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3;
          color: #9a9a9a;
          text-transform: uppercase;
          letter-spacing: 0.26em;
        }

        .stats-section .stats-card-border {
          display: none;
        }

        .stats-section .stats-card:hover .stats-card-surface {
          transform: perspective(1200px) rotateX(-30deg);
          box-shadow:
            0 18px 30px rgba(0, 0, 0, 0.25),
            inset 0 0 0 1px rgba(255, 122, 0, 0.25);
        }

        .stats-section .stats-card:hover .stats-card-surface::before {
          opacity: 0.5;
        }

        .stats-section .stats-card:hover .stats-pop {
          opacity: 1;
          transform: translate(calc(-60% + 0px), -6px) translateZ(-20px) scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .stats-section .stats-card-wrap,
          .stats-section .stats-pop,
          .stats-section .stats-pop-1,
          .stats-section .stats-pop-2,
          .stats-section .stats-pop-3,
          .stats-section .stats-pop-4,
          .stats-section .stats-card-surface,
          .stats-section .stats-card-surface::before {
            transition: none !important;
          }
        }


        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .stats-section .stats-card { max-width: 240px; }
          .stats-section .stat-value { font-size: 56px; }
          .stats-section .stat-label { font-size: 12px; }
        }

        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
          .stats-section .stats-card { max-width: 200px; --card-scale: 0.82; }
          .stats-section .stat-value { font-size: 34px; }
          .stats-section .stat-label { font-size: 10px; letter-spacing: 0.2em; }
          .stats-section .stats-card-content { padding: 8px 10px; gap: 8px; }
          .stats-section .stats-card-surface { min-height: 108px; }
          .stats-section .stats-pop { display: none; }
        }

>>>>>>> node-krisjscott
        /* --- VISION & AIM SECTION (DESKTOP) --- */
        .vision-aim-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 100px;
          position: relative;
        }

        .va-card {
          background: #111111; /* Solid Background */
          border: 1px solid #222222; /* Solid Border */
          padding: 40px;
          border-radius: 4px;
          position: relative;
        }

        .va-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 900;
          text-transform: uppercase;
          margin: 0 0 20px 0;
          letter-spacing: -1px;
        }
        
        .va-title span { color: var(--brand-orange); }
        
        .quote-icon {
          color: var(--brand-orange);
          font-size: 4rem;
          font-family: Georgia, serif;
          line-height: 0;
          position: absolute;
          top: 50px;
          left: 10px;
          opacity: 0.3;
        }

        .va-card h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 15px;
          color: #fff;
        }

        .va-card p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-gray);
          margin-bottom: 20px;
        }

        .va-quote {
          font-size: 1.2rem;
          font-weight: 700;
          font-style: italic;
          color: var(--brand-orange);
          border-left: 3px solid var(--brand-orange);
          padding-left: 15px;
          margin-top: 25px;
        }
        
        .va-quote span {
          display: block;
          color: #fff;
          font-style: normal;
          margin-top: 5px;
        }

        /* --- WORK AREAS BUBBLE CLUSTER (SOLID COLORS) --- */
        .work-areas-section {
          text-align: center;
          margin-bottom: 80px;
          width: 100%;
        }

        .bubble-cluster {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          max-width: 900px;
          margin: 40px auto 0;
          position: relative;
          padding: 20px;
        }

        .bubble {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-radius: 50%;
          color: #fff;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: -15px; 
          padding: 20px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: default;
          /* No glassmorphism, no borders */
        }

        .bubble:hover {
          transform: scale(1.1);
          z-index: 10 !important;
        }

        /* 100% Solid Colors */
        .b1 { width: 160px; height: 160px; background: #e85a24; font-size: 0.85rem; z-index: 2; }
        .b2 { width: 220px; height: 220px; background: #cc451b; font-size: 1.2rem; z-index: 3; }
        .b3 { width: 180px; height: 180px; background: #b33612; font-size: 0.9rem; z-index: 1; }
        .b4 { width: 190px; height: 190px; background: #f08c28; font-size: 0.9rem; z-index: 4; }
        .b5 { width: 150px; height: 150px; background: #962814; font-size: 0.8rem; z-index: 2; }
        .b6 { width: 200px; height: 200px; background: #dc6e1e; font-size: 1rem; z-index: 3; }
        .b7 { width: 140px; height: 140px; background: #aa461e; font-size: 0.75rem; z-index: 1; }
        .b8 { width: 160px; height: 160px; background: #781e0a; font-size: 0.85rem; z-index: 2; }

<<<<<<< HEAD
        /* --- REDESIGNED IMPACT METRICS (SOLID + POP-OUT TABS) --- */
=======
        /* --- REDESIGNED IMPACT METRICS (SOLID + FOLD-OUT CARDS) --- */
>>>>>>> node-krisjscott
        .impact-section {
          background: transparent; 
          padding: 60px 0 20px;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        /* Base Card Wrapper */
        .metric-card { 
          position: relative;
          text-align: center;
          cursor: default;
          margin-top: 20px; /* Space for the pop-out elements */
<<<<<<< HEAD
        }

        /* The Hidden Elements that pop out */
        .pop-out-track {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          padding-top: 5px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Mini solid shapes mimicking extra cards/tags */
        .pop-item {
          width: 32px;
          height: 40px;
          border-radius: 4px;
          background: #333;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        
        .pop-item.c1 { background: var(--brand-orange); transform: rotate(-8deg); }
        .pop-item.c2 { background: #ffffff; width: 45px; height: 48px; z-index: 2; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 900; font-size: 14px;}
        .pop-item.c3 { background: #555555; transform: rotate(8deg); }
=======
          overflow: visible;
          perspective: 900px;
          --fan-rise-3: 34px;
          --fan-spread-3: 110px;
          --fan-rise-4: 40px;
          --fan-spread-4-inner: 75px;
          --fan-spread-4-outer: 160px;
        }

        /* The Hidden Elements that fold out */
        .pop-out-track {
          position: absolute;
          top: -8px;
          left: 50%;
          width: 260px;
          height: 90px;
          z-index: 1;
          transform: translateX(-50%);
          pointer-events: none;
        }

        /* Mini cards that fold out */
        .pop-card {
          position: absolute;
          top: 26px;
          left: 50%;
          width: 86px;
          height: 46px;
          border-radius: 6px;
          background: #1a1a1a;
          border: 1px solid #2b2b2b;
          box-shadow: 0 10px 18px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f2f2f2;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          opacity: 0;
          transform: translate(-50%, 12px) scale(0.94);
          transform-origin: bottom center;
          transition: transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                      box-shadow 0.3s ease,
                      opacity 0.25s ease;
        }

        .pop-card.accent { background: var(--brand-orange); color: #111; }
        .pop-card.light { background: #ffffff; color: #111; font-weight: 900; }
        .pop-card.dark { background: #3a3a3a; }

        .pop-card.linkedin { background: #0a66c2; color: #fff; }
        .pop-card.instagram { background: linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 100%); color: #fff; }
        .pop-card.youtube { background: #ff0000; color: #fff; }
        .pop-card.reach { background: #ffffff; color: #111; font-weight: 900; }

        .pop-out-track.three .pop-card:nth-child(1) { transform: translate(-50%, 0) rotate(-6deg); }
        .pop-out-track.three .pop-card:nth-child(2) { transform: translate(-50%, 0) rotate(0deg); }
        .pop-out-track.three .pop-card:nth-child(3) { transform: translate(-50%, 0) rotate(6deg); }

        .pop-out-track.four .pop-card:nth-child(1) { transform: translate(-50%, 0) rotate(-8deg); }
        .pop-out-track.four .pop-card:nth-child(2) { transform: translate(-50%, 0) rotate(-3deg); }
        .pop-out-track.four .pop-card:nth-child(3) { transform: translate(-50%, 0) rotate(3deg); }
        .pop-out-track.four .pop-card:nth-child(4) { transform: translate(-50%, 0) rotate(8deg); }
>>>>>>> node-krisjscott

        /* The Main Solid Card Body */
        .metric-inner {
          position: relative;
          z-index: 2;
          background: #111111; /* Solid Dark Grey */
          border: 2px solid #222222; /* Solid Border */
          padding: 40px 20px;
          border-radius: 6px;
<<<<<<< HEAD
          transition: transform 0.3s ease, border-color 0.3s ease;
=======
          transform-style: preserve-3d;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
>>>>>>> node-krisjscott
        }

        .metric-card h4 { 
          font-size: clamp(40px, 5vw, 64px); 
          font-weight: 900; 
          margin: 0; 
          line-height: 1;
          color: var(--brand-orange);
          /* No text shadow (no neon) */
        }
        
        .metric-card span {
          display: block;
          font-size: 11px;
          color: #a0a0a0;
          letter-spacing: 3px;
          font-weight: 800;
          margin-top: 15px;
          text-transform: uppercase;
        }

        /* THE HOVER TRIGGER */
        .metric-card:hover .metric-inner {
          border-color: var(--brand-orange);
<<<<<<< HEAD
          transform: translateY(-2px);
        }

        .metric-card:hover .pop-out-track {
          transform: translateY(-38px); /* Elements aggressively pop up from behind */
=======
          transform: translateY(-4px) rotateX(-35deg);
          box-shadow: 0 16px 28px rgba(0,0,0,0.45);
        }

        .metric-card:hover .pop-card {
          opacity: 1;
        }

        .metric-card:hover .pop-out-track.three .pop-card:nth-child(1) {
          transform: translate(calc(-50% - var(--fan-spread-3)), calc(-1 * var(--fan-rise-3))) rotate(-14deg);
        }
        .metric-card:hover .pop-out-track.three .pop-card:nth-child(2) {
          transform: translate(-50%, calc(-1 * var(--fan-rise-3) - 8px)) rotate(0deg);
        }
        .metric-card:hover .pop-out-track.three .pop-card:nth-child(3) {
          transform: translate(calc(-50% + var(--fan-spread-3)), calc(-1 * var(--fan-rise-3))) rotate(14deg);
        }

        .metric-card:hover .pop-out-track.four .pop-card:nth-child(1) {
          transform: translate(calc(-50% - var(--fan-spread-4-outer)), calc(-1 * var(--fan-rise-4))) rotate(-16deg);
        }
        .metric-card:hover .pop-out-track.four .pop-card:nth-child(2) {
          transform: translate(calc(-50% - var(--fan-spread-4-inner)), calc(-1 * var(--fan-rise-4) - 6px)) rotate(-8deg);
        }
        .metric-card:hover .pop-out-track.four .pop-card:nth-child(3) {
          transform: translate(calc(-50% + var(--fan-spread-4-inner)), calc(-1 * var(--fan-rise-4) - 6px)) rotate(8deg);
        }
        .metric-card:hover .pop-out-track.four .pop-card:nth-child(4) {
          transform: translate(calc(-50% + var(--fan-spread-4-outer)), calc(-1 * var(--fan-rise-4))) rotate(16deg);
        }

        .metric-card:hover .pop-card {
          box-shadow: 0 16px 24px rgba(0,0,0,0.55);
>>>>>>> node-krisjscott
        }

        /* =========================================
           MOBILE OPTIMIZATIONS
           ========================================= */
        
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); }
        }

        @media (max-width: 850px) {
          .about-v4-mobile-optimized { padding: 30px 0 50px; }
          .mini-hero { gap: 25px; }
          .hero-description { border-left: none; border-top: 2px solid var(--brand-orange); padding-left: 0; padding-top: 20px; }
          .editorial-box h1 { font-size: 48px; }
          
          /* --- TIGHTEN GAP ON MOBILE --- */
          .work-areas-section { margin-bottom: 20px; }
          .impact-section { padding-top: 10px; }

          /* --- MOBILE PILLARS: MARQUEE --- */
          .pillar-wrapper {
            overflow: hidden;
            width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
            margin-bottom: 60px;
          }

          .pillar-track {
            display: flex;
            width: max-content;
            animation: marqueeScroll 18s linear infinite;
            gap: 20px;
            padding: 10px 0;
          }

          .pillar-item {
            width: 280px; 
            flex-shrink: 0;
            padding: 25px 20px;
            background: #111111; /* Solid */
            border: 1px solid #222222; /* Solid */
            border-radius: 4px;
            transform: none !important;
          }
          
          .pillar-item.duplicate { display: block; }

          /* --- MOBILE WORK AREAS: VIBRANT SOLID PILLS --- */
          .bubble-cluster {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            width: 100%;
            padding: 10px 0;
            margin-top: 30px;
          }

          .bubble {
            margin: 0;
            width: auto !important;
            height: auto !important;
            border-radius: 50px; /* Perfect pill shape */
            font-size: 0.85rem !important;
            font-weight: 700;
            box-shadow: none;
            padding: 14px 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            line-height: 1.2;
            transform: none; /* Reset rotations */
            border: none;
            /* Notice: I removed the override here so they keep their vibrant desktop colors! */
          }

          /* --- MOBILE VISION & AIM: TIMELINE --- */
          .vision-aim-grid { 
            grid-template-columns: 1fr; 
            gap: 60px; 
            margin-bottom: 70px;
            padding-left: 25px; 
          }

          .vision-aim-grid::before {
            content: '';
            position: absolute;
            left: 0;
            top: 15px;
            bottom: 15px;
            width: 2px;
            background: linear-gradient(to bottom, var(--brand-orange) 0%, rgba(232, 90, 36, 0.2) 50%, var(--brand-orange) 100%);
          }

          .va-card { background: transparent; border: none; padding: 0; border-radius: 0; }
          .va-card::before {
            content: ''; position: absolute; left: -31px; top: 15px; width: 14px; height: 14px;
            background: var(--bg-black); border: 2px solid var(--brand-orange); border-radius: 50%;
          }
          .quote-icon { display: none; }
          .va-title { font-size: 2.2rem; }

          /* Impact Grid - 2x2 for Tablets & Phones */
          .impact-grid { 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-top: 10px; /* Kept tight */
          }
          
<<<<<<< HEAD
          /* Allow pop out on touch devices when tapped */
          .metric-card:active .metric-inner { border-color: var(--brand-orange); }
          .metric-card:active .pop-out-track { transform: translateY(-38px); }
=======
          .metric-card {
            --fan-rise-3: 26px;
            --fan-spread-3: 70px;
            --fan-rise-4: 28px;
            --fan-spread-4-inner: 48px;
            --fan-spread-4-outer: 100px;
          }

          /* Allow pop out on touch devices when tapped */
          .metric-card:active .metric-inner { border-color: var(--brand-orange); }
          .metric-card:active .metric-inner { transform: translateY(-3px) rotateX(-6deg); box-shadow: 0 14px 24px rgba(0,0,0,0.45); }
          .metric-card:active .pop-card { opacity: 1; }
          .metric-card:active .pop-out-track.three .pop-card:nth-child(1) { transform: translate(calc(-50% - var(--fan-spread-3)), calc(-1 * var(--fan-rise-3))) rotate(-14deg); }
          .metric-card:active .pop-out-track.three .pop-card:nth-child(2) { transform: translate(-50%, calc(-1 * var(--fan-rise-3) - 8px)) rotate(0deg); }
          .metric-card:active .pop-out-track.three .pop-card:nth-child(3) { transform: translate(calc(-50% + var(--fan-spread-3)), calc(-1 * var(--fan-rise-3))) rotate(14deg); }
          .metric-card:active .pop-out-track.four .pop-card:nth-child(1) { transform: translate(calc(-50% - var(--fan-spread-4-outer)), calc(-1 * var(--fan-rise-4))) rotate(-16deg); }
          .metric-card:active .pop-out-track.four .pop-card:nth-child(2) { transform: translate(calc(-50% - var(--fan-spread-4-inner)), calc(-1 * var(--fan-rise-4) - 6px)) rotate(-8deg); }
          .metric-card:active .pop-out-track.four .pop-card:nth-child(3) { transform: translate(calc(-50% + var(--fan-spread-4-inner)), calc(-1 * var(--fan-rise-4) - 6px)) rotate(8deg); }
          .metric-card:active .pop-out-track.four .pop-card:nth-child(4) { transform: translate(calc(-50% + var(--fan-spread-4-outer)), calc(-1 * var(--fan-rise-4))) rotate(16deg); }
>>>>>>> node-krisjscott
          
          .metric-inner {
            padding: 30px 15px;
          }
        }

        @media (max-width: 480px) {
           .editorial-box h1 { font-size: 38px; }
           .impact-grid { gap: 15px; }
           .metric-card h4 { font-size: 32px; }
           .metric-card span { font-size: 9px; }
        }
      `}} />

      {/* BACKGROUND VIDEO */}
      <div className="video-bg-layer">
        <video autoPlay muted loop playsInline>
          <source src={new URL('../assets/images/Aadi.mp4', import.meta.url).href} type="video/mp4" />
        </video>
      </div>

      {/* GRADIENT BLEND LAYERS */}
      <div className="blend-top"></div>
      <div className="blend-bottom"></div>

      <div className="about-inner">
        
        {/* 1. HERO */}
        <div className="mini-hero">
          <div className="editorial-box">
            <span className="label">ESTABLISHED 2025</span>
            <h1>Who<br />Are We?</h1>
          </div>
          <div className="hero-description">
            <p>
              Tiesverse Foundation is <strong>India's largest youth-led ORGANISATION</strong>. 
              We operate at the volatile intersection of Research, Media, and Technology.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              Operated by 85+ specialists with an average age of 21, we bring 
              unbiased perspective to complex global systems.
            </p>
          </div>
        </div>

        {/* 2. PILLARS (Desktop Grid -> Mobile Marquee) */}
        <div className="pillar-wrapper">
          <div className="pillar-track">
            {/* Original Set */}
            {pillarsData.map((item, i) => (
              <div className="pillar-item" key={`original-${i}`}>
                <div className="p-icon">{item.icon}</div>
                <div className="p-title">{item.title}</div>
                <div className="p-desc">{item.desc}</div>
              </div>
            ))}
            {/* Duplicated Set for Infinite Marquee Illusion */}
            {pillarsData.map((item, i) => (
              <div className="pillar-item duplicate" key={`duplicate-${i}`}>
                <div className="p-icon">{item.icon}</div>
                <div className="p-title">{item.title}</div>
                <div className="p-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* 3. VISION & AIM */}
=======
        {/* 4. VISION & AIM */}
>>>>>>> node-krisjscott
        <div className="vision-aim-grid">
          <div className="va-card">
            <div className="quote-icon">“</div>
            <h2 className="va-title">OUR <span>VISION</span></h2>
            <h3>We started TIES with one belief.</h3>
            <p>
              That young Indians deserve a space to decode the world on their own terms. The complex intersections of geopolitics, technology, and media often feel distant. Through research-driven content, we bridge that gap and make global affairs accessible.
            </p>
            <div className="va-quote">
              By the Youth, For the Youth.
            </div>
          </div>

          <div className="va-card">
            <h2 className="va-title">OUR <span>AIM</span></h2>
            <p>
              TIES is not just a platform. It is a movement. Our team of 100 plus members from across India powers everything you see, from research to reels to reporting. We cover it all. Geopolitics, defense, diplomacy, economics, climate, and tech.
            </p>
            <p>
              And we do it in a way that is bold, clear, and accessible. Through our website, Instagram, YouTube, LinkedIn, and X, we simplify what is often seen as boring and bring the next generation into conversations that shape our future.
            </p>
            <div className="va-quote">
              We do not just inform.
              <span>We educate, engage, and mobilize.</span>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* 4. CREATIVE WORK AREAS (Solid Desktop Bubbles, Vibrant Mobile Pills) */}
=======
        {/* 5. CREATIVE WORK AREAS (Solid Desktop Bubbles, Vibrant Mobile Pills) */}
>>>>>>> node-krisjscott
        <div className="work-areas-section">
          <h2 className="va-title" style={{ textAlign: 'center', marginBottom: '10px' }}>OUR <span>WORK AREAS</span></h2>
          <div className="bubble-cluster">
            <div className="bubble b1">Research</div>
            <div className="bubble b2">Opinion & Think Pieces</div>
            <div className="bubble b3">Geopolitical Analysis</div>
            <div className="bubble b4">Tech Products & Dev</div>
            <div className="bubble b5">Podcasts</div>
            <div className="bubble b6">Breaking News</div>
            <div className="bubble b7">Deep Dives & Briefs</div>
            <div className="bubble b8">Community Discussions</div>
          </div>
        </div>

<<<<<<< HEAD
        {/* 5. IMPACT METRICS (Solid Colors + Pop-out Tabs on Hover) */}
        <div className="impact-section">
          <div className="impact-grid">
            
            <div className="metric-card">
              <div className="pop-out-track">
                <div className="pop-item c1"></div>
                <div className="pop-item c2">▶</div>
                <div className="pop-item c3"></div>
              </div>
              <div className="metric-inner">
                <h4>100M+</h4>
                <span>Total Reach</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="pop-out-track">
                <div className="pop-item c1"></div>
                <div className="pop-item c2">✓</div>
                <div className="pop-item c3"></div>
              </div>
              <div className="metric-inner">
                <h4>85+</h4>
                <span>Specialists</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="pop-out-track">
                <div className="pop-item c1"></div>
                <div className="pop-item c2">★</div>
                <div className="pop-item c3"></div>
              </div>
              <div className="metric-inner">
                <h4>21</h4>
                <span>Avg Age</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="pop-out-track">
                <div className="pop-item c1"></div>
                <div className="pop-item c2">❤</div>
                <div className="pop-item c3"></div>
              </div>
              <div className="metric-inner">
                <h4>7M+</h4>
                <span>Engagements</span>
              </div>
            </div>

=======
        {/* 6. STATS CARDS */}
        <div className="stats-section">
          <div className="stats-grid">
            {statsCards.map((card, idx) => (
              <div className={`stats-card ${card.label === "AVG AGE" ? "stats-card--photos" : ""}`} key={`stat-${idx}`}>
                <div className="stats-card-wrap">
                  <div className="stats-pop">
                    {card.images.map((src, imageIndex) => (
                      <div className={`stats-pop-${imageIndex + 1}`} key={`stat-${idx}-img-${imageIndex}`}>
                        <img decoding="async" loading="lazy" src={src} alt="" />
                      </div>
                    ))}
                  </div>

                  <div className="stats-card-surface">
                    <div className="stats-card-content">
                      <div className="stat-value">{card.value}</div>
                      <div className="stat-label">{card.label}</div>
                    </div>
                    <div className="stats-card-border"></div>
                  </div>
                </div>
              </div>
            ))}
>>>>>>> node-krisjscott
          </div>
        </div>

      </div>
    </section>
  );
};

<<<<<<< HEAD
export default About;
=======
export default About;
>>>>>>> node-krisjscott
