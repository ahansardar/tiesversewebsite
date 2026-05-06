import React, { useEffect, useState } from 'react';
import { getFeaturedEvent } from '../apiClient';
import './AnnouncementBanner.css';

const DEMO_FEATURED_EVENT = {
    title: "India's BRICS Presidency 2026: Youth Policy Briefing",
    date: 'January 24, 2026',
    time: '7:00 PM IST',
    form_link: 'https://career.tiesverse.com/',
    isDemo: true,
};

const AnnouncementBanner = () => {
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchFeatured = async () => {
            try {
                const data = await getFeaturedEvent();
                if (!isMounted) return;

                if (data && !data.error && data.title) {
                    setFeaturedEvent(data);
                    return;
                }
            } catch (error) {
                console.warn('Featured event API unavailable, using demo announcement.', error);
            }

            if (isMounted) {
                setFeaturedEvent(DEMO_FEATURED_EVENT);
            }
        };

        fetchFeatured();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!featuredEvent || !visible) return null;

    return (
        <div className="announcement-banner-wrapper global-notice-bar fade-in">
            <div className="banner-content">
                <div className="banner-left">
                    <span className="banner-tag">
                        {featuredEvent.isDemo ? 'DEMO ANNOUNCEMENT' : 'NEW ANNOUNCEMENT'}
                    </span>
                    <p className="banner-text">
                        <strong>{featuredEvent.title}</strong>
                        <span className="banner-separator"> - </span>
                        <span className="banner-meta">{featuredEvent.date} at {featuredEvent.time}</span>
                    </p>
                </div>

                <div className="banner-right">
                    <a
                        href={featuredEvent.form_link || DEMO_FEATURED_EVENT.form_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="banner-cta"
                    >
                        REGISTER NOW
                    </a>
                    <button className="banner-close" onClick={() => setVisible(false)} aria-label="Close announcement">
                        X
                    </button>
                </div>
            </div>
            <div className="banner-progress"></div>
        </div>
    );
};

export default AnnouncementBanner;