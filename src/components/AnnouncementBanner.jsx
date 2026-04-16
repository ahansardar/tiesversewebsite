import React, { useState, useEffect } from 'react';
import { getFeaturedEvent } from '../apiClient';
import './AnnouncementBanner.css';

const AnnouncementBanner = () => {
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            const data = await getFeaturedEvent();
            if (data && !data.error) setFeaturedEvent(data);
        };
        fetchFeatured();
    }, []);

    if (!featuredEvent || !visible) return null;

    return (
        <div className="announcement-banner-wrapper global-notice-bar fade-in">
            <div className="banner-content">
                <div className="banner-left">
                    <span className="banner-tag">NEW ANNOUNCEMENT</span>
                    <p className="banner-text">
                        <strong>{featuredEvent.title}</strong> — {featuredEvent.date} at {featuredEvent.time}
                    </p>
                </div>
                <div className="banner-right">
                    <a href={featuredEvent.form_link} target="_blank" rel="noopener noreferrer" className="banner-cta">
                        REGISTER NOW ↗
                    </a>
                    <button className="banner-close" onClick={() => setVisible(false)}>✕</button>
                </div>
            </div>
            <div className="banner-progress"></div>
        </div>
    );
};

export default AnnouncementBanner;
