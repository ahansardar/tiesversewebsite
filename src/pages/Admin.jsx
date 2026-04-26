import React, { useState, useEffect } from 'react';
import {
    login, logout, getSession,
    getEvents, createEvent, updateEvent, deleteEvent,
    getArticle, createArticle, updateArticle, deleteArticle,
    getYoutubeVideos, createYoutubeVideo, updateYoutubeVideo, deleteYoutubeVideo,
    getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop,
    getTeam, createMember, updateMember, deleteMember,
    getSettings, updateSetting
} from '../apiClient';

import '../styles/Admin.css';

// Legacy assets for fallbacks
import yt1 from '../assets/yt1.jpg';
import yt2 from '../assets/yt2.jpg';
import yt3 from '../assets/yt3.jpg';

import act1 from '../assets/act1.jpeg';
import act6 from '../assets/act6.jpeg';
import act7 from '../assets/act7.jpeg';
import act9 from '../assets/act9.jpeg';
import act10 from '../assets/act10.jpeg';
import act11 from '../assets/act11.jpeg';

import ws1 from '../assets/ws1.png';
import ws2 from '../assets/ws2.png';
import ws3 from '../assets/ws3.png';
import ws4 from '../assets/ws4.png';

import prithviraajImg from '../assets/pruthvi.jpg';
import ashoImg from '../assets/asho.jpg';
import hardikImg from '../assets/hardik.jpg';
import nishuImg from '../assets/nishu.jpg';
import nirjharImg from '../assets/nirjhar.jpg';
import AdityaImg from '../assets/Aditya.jpg';
import AbhishekImg from '../assets/trial.jpg';
import jalImg from '../assets/jal.jpg';
import mihirImg from '../assets/mihir.jpg';
import aditiImg from '../assets/aditi.jpg';
import ritikaImg from '../assets/ritika.jpg';
import harshaImg from '../assets/harsha.jpg';
import parthimg from '../assets/parth.jpg';
import nayoimg from '../assets/nayo.jpg';
import smitiimg from '../assets/smiti.jpg';

// --- CLOUDINARY CONFIGURATION ---
const CLOUD_NAME = "dgmxkx5x8"; // 
const UPLOAD_PRESET = "tiesverse_preset"; // 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const Admin = () => {
    // --- AUTH STATES (Added these for you!) ---
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [activeTab, setActiveTab] = useState('events');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({});
    const [siteSettings, setSiteSettings] = useState({
        event_display_limit_pc: 2,
        event_display_limit_mobile: 1,
        article_display_limit_pc: 3,
        article_display_limit_mobile: 3,
        youtube_display_limit_pc: 3, 
        youtube_display_limit_mobile: 2 
    });
    const [editingId, setEditingId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [swapModal, setSwapModal] = useState({ open: false, existingId: null, existingTitle: '', dataToSave: null });
    const [notification, setNotification] = useState(null);
    const [sizeWarning, setSizeWarning] = useState({ open: false, file: null });
    const [workshopFilter, setWorkshopFilter] = useState('ALL'); 
    const [unassignedEvents, setUnassignedEvents] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // --- AUTH EFFECT ---
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) { setUser(null); return; }
            const data = await getSession();
            setUser(data.valid ? data.user : null);
            if (!data.valid) localStorage.removeItem('token');
        };
        checkUser();
    }, []);

    // --- HELPERS ---
    const getThumbnailFallback = (item) => {
        if (item.image_url || item.thumbnail_url) return item.image_url || item.thumbnail_url;
        if (activeTab === 'youtube_videos') {
            if (item.episode_id === 'EP.01') return yt1;
            if (item.episode_id === 'EP.02') return yt2;
            if (item.episode_id === 'EP.03') return yt3;
            return yt1;
        }
        if (activeTab === 'articles') {
            if (item.display_id === '01') return act1;
            if (item.display_id === '02') return act6;
            if (item.display_id === '03') return act7;
            if (item.display_id === '04') return act9;
            if (item.display_id === '05') return act10;
            if (item.display_id === '06') return act11;
            return act1;
        }
        if (activeTab === 'workshops') {
            if (item.title === 'Diplomatic Frameworks') return ws1;
            if (item.title === 'Media Narratives in IR') return ws2;
            if (item.title === 'Policy in Practice') return ws3;
            if (item.title === 'Bharat Manthan 2025') return ws4;
            return ws1; 
        }
        if (activeTab === 'team') {
            if (item.name === "Pruthaviraj Singh") return prithviraajImg;
            if (item.name === "Hardik Pathak") return hardikImg;
            if (item.name === "Ritika Verma") return ritikaImg;
            if (item.name === "Ashutosh Patra") return ashoImg;
            if (item.name === "Nishu Yadav") return nishuImg;
            if (item.name === "Nirjhar Chakraborty") return nirjharImg;
            if (item.name === "Aditya Singh") return AdityaImg;
            if (item.name === "Abhishek") return AbhishekImg;
            if (item.name === "Jal Trivedi") return jalImg;
            if (item.name === "Aditi Malviya") return aditiImg;
            if (item.name === "Parth Naik") return parthimg;
            if (item.name === "Nayonika") return nayoimg;
            if (item.name === "Smiti") return smitiimg;
            if (item.name === "Harsha Bhadawar") return harshaImg;
            if (item.name === "Adv. Mihir") return mihirImg;
            return prithviraajImg; 
        }
        return null;
    };

    const resetForm = () => {
        setFormData({});
        setEditingId(null);
        setPreviewUrl(null);
        setSizeWarning({ open: false, file: null });
        setMobileMenuOpen(false);
    };

    const fetchFnMap = {
        events: getEvents,
        articles: getArticle,
        youtube_videos: getYoutubeVideos,
        workshops: getWorkshops,
        team: getTeam,
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const sData = await getSettings();
            if (sData && !sData.error) {
                const settingsMap = {};
                sData.forEach(s => { settingsMap[s.key] = Number(s.value); });
                setSiteSettings(prev => ({ ...prev, ...settingsMap }));
            }

            const fetchFn = fetchFnMap[activeTab];
            if (fetchFn) {
                const data = await fetchFn();
                if (data && !data.error) setItems(data);
                else console.error('Error fetching data');
            }

            if (activeTab === 'workshops') {
                const eventsData = await getEvents();
                if (eventsData && !eventsData.error) {
                    const endedEvents = eventsData.filter(e => e.status === 'EVENT ENDED');
                    const workshopsData = await getWorkshops();
                    const usedEventIds = new Set((workshopsData || []).map(w => w.event_id).filter(Boolean));
                    setUnassignedEvents(endedEvents.filter(e => !usedEventIds.has(e.id)));
                }
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
        setLoading(false);
    };

    const showNotice = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        if (user) {
            fetchData();
            resetForm();
            setMobileMenuOpen(false);
        }
    }, [activeTab, user]);

    // --- AUTH HANDLERS ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await login(email, password);
        if (data.error) {
            alert(data.error);
            setLoading(false);
        } else {
            setUser(data.user);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setUser(null);
        setLoading(false);
    };

    // --- FORM HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                let expectedRatio, ratioLabel;

                if (activeTab === 'articles' || activeTab === 'team') {
                    expectedRatio = 4 / 5; 
                    ratioLabel = '4:5';
                } else {
                    expectedRatio = 3 / 2; 
                    ratioLabel = '3:2';
                }

                const actualRatio = img.width / img.height;
                const tolerance = 0.02; 
                const ratioMatch = Math.abs(actualRatio - expectedRatio) < tolerance;

                if (!ratioMatch) {
                    setSizeWarning({
                        open: true, file, expectedRatio: ratioLabel,
                        actualRatio: `${Math.round(actualRatio * 100) / 100}:1`
                    });
                } else {
                    setFormData({ ...formData, imageFile: file });
                    setPreviewUrl(img.src);
                }
            };
        }
    };

    const proceedWithImage = () => {
        const { file } = sizeWarning;
        setFormData({ ...formData, imageFile: file });
        setPreviewUrl(URL.createObjectURL(file));
        setSizeWarning({ open: false, file: null });
    };

    // --- NEW CLOUDINARY UPLOAD FUNCTION ---
    const uploadImage = async (file) => {
        if (UPLOAD_PRESET === "TIESVERSE_UPLOAD") {
            throw new Error("Please set your Cloudinary UPLOAD_PRESET in the code first!");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'admin_assets'); // Creates a folder in Cloudinary

        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error?.message || "Cloudinary Upload Failed");

        // Returns optimized link
        return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        const { id, created_at, imageFile, ...sanitizedData } = formData;
        const dataToSave = { ...sanitizedData };

        try {
            if (activeTab === 'events' && dataToSave.is_featured) {
                const allEvents = await getEvents();
                const existingFeatured = (allEvents || []).find(e => e.is_featured && e.id !== editingId);
                if (existingFeatured) {
                    setSwapModal({ open: true, existingId: existingFeatured.id, existingTitle: existingFeatured.title, dataToSave: dataToSave });
                    setLoading(false);
                    return;
                }
            }

            if (formData.imageFile) {
                const publicUrl = await uploadImage(formData.imageFile);
                if (activeTab === 'youtube_videos') {
                    dataToSave.thumbnail_url = publicUrl;
                    delete dataToSave.image_url;
                } else {
                    dataToSave.image_url = publicUrl;
                }
            }

            if (activeTab === 'events' && !dataToSave.status) dataToSave.status = 'REGISTRATION OPEN';

            const updateFnMap = { events: updateEvent, articles: updateArticle, youtube_videos: updateYoutubeVideo, workshops: updateWorkshop, team: updateMember };
            const createFnMap = { events: createEvent, articles: createArticle, youtube_videos: createYoutubeVideo, workshops: createWorkshop, team: createMember };

            if (editingId) {
                const res = await updateFnMap[activeTab](editingId, dataToSave);
                if (res?.error) showNotice('Error updating: ' + res.error, 'error');
                else { showNotice('Successfully updated!'); resetForm(); fetchData(); }
            } else {
                const res = await createFnMap[activeTab](dataToSave);
                if (res?.error) showNotice('Error adding: ' + res.error, 'error');
                else { showNotice('Successfully published!'); resetForm(); fetchData(); }
            }
        } catch (err) {
            showNotice('Process error: ' + err.message, 'error');
        }
        setLoading(false);
    };

    const handleSwapConfirm = async () => {
        setLoading(true);
        const { existingId, dataToSave } = swapModal;
        try {
            await updateEvent(existingId, { is_featured: false });

            let finalData = { ...dataToSave };
            if (formData.imageFile) {
                const publicUrl = await uploadImage(formData.imageFile);
                finalData.image_url = publicUrl;
            }

            if (editingId) {
                await updateEvent(editingId, finalData);
                showNotice('Banners swapped successfully!');
            } else {
                await createEvent(finalData);
                showNotice('New banner is now live!');
            }

            setSwapModal({ open: false, existingId: null, existingTitle: '', dataToSave: null });
            resetForm();
            fetchData();
        } catch (err) {
            showNotice('Swap failed: ' + err.message, 'error');
        }
        setLoading(false);
    };

    const handleUpdateSetting = async (key, value) => {
        const valToParse = (value === undefined || value === null || value === '') ? (siteSettings[key] || 2) : value;
        const numValue = parseInt(valToParse);

        if (isNaN(numValue)) { showNotice('Please enter a valid number', 'error'); return; }

        setLoading(true);
        const res = await updateSetting(key, { value: String(numValue) });

        if (res?.error) { showNotice('Update failed: ' + res.error, 'error'); }
        else { showNotice('Settings updated successfully!'); fetchData(); }
        setLoading(false);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        const { imageFile, ...itemData } = item;
        setFormData(itemData);
        setPreviewUrl(getThumbnailFallback(item));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async () => {
        const { id } = deleteModal;
        setLoading(true);
        const deleteFnMap = { events: deleteEvent, articles: deleteArticle, youtube_videos: deleteYoutubeVideo, workshops: deleteWorkshop, team: deleteMember };
        const res = await deleteFnMap[activeTab](id);
        if (res?.error) showNotice('Error deleting: ' + res.error, 'error');
        else {
            showNotice('Entry removed.');
            if (id === editingId) resetForm();
            fetchData();
        }
        setLoading(false);
        setDeleteModal({ open: false, id: null });
    };

    // Migrates all 5 tables
    const migrateAllTables = async () => {
        if (!window.confirm("Ready to migrate all images across Events, Articles, YouTube, Workshops, and Team tables to Cloudinary?")) return;
        setLoading(true);

        const tablesToMigrate = [
            { name: 'events',         column: 'image_url',     fetchFn: getEvents,        updateFn: updateEvent },
            { name: 'articles',       column: 'image_url',     fetchFn: getArticle,       updateFn: updateArticle },
            { name: 'youtube_videos', column: 'thumbnail_url', fetchFn: getYoutubeVideos, updateFn: updateYoutubeVideo },
            { name: 'workshops',      column: 'image_url',     fetchFn: getWorkshops,     updateFn: updateWorkshop },
            { name: 'team',           column: 'image_url',     fetchFn: getTeam,          updateFn: updateMember },
        ];

        let totalMigrated = 0;

        try {
            for (const table of tablesToMigrate) {
                const rows = await table.fetchFn();
                if (!rows || rows.error) continue;

                for (let i = 0; i < rows.length; i++) {
                    const item = rows[i];
                    const currentUrl = item[table.column];

                    if (currentUrl && currentUrl.includes('supabase.co')) {
                        const formData = new FormData();
                        formData.append('file', currentUrl);
                        formData.append('upload_preset', UPLOAD_PRESET);
                        formData.append('folder', 'admin_assets');

                        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
                        const cData = await res.json();

                        if (cData.secure_url) {
                            const newUrl = cData.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
                            await table.updateFn(item.id, { [table.column]: newUrl });
                            totalMigrated++;
                        }
                    }
                }
            }
            alert(`Master Migration Complete! Moved ${totalMigrated} total items to Cloudinary.`);
            fetchData();
        } catch (err) {
            alert("Migration Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    

    const renderForm = () => {
        if (activeTab === 'events') {
            return (
                <div className="form-grid">
                    <div className="input-group"><label>Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className="input-group">
                        <label>Status</label>
                        <select name="status" value={formData.status || 'REGISTRATION OPEN'} onChange={handleInputChange}>
                            <option value="REGISTRATION OPEN">REGISTRATION OPEN</option>
                            <option value="REGISTRATION CLOSED">REGISTRATION CLOSED</option>
                            <option value="EVENT ENDED">EVENT ENDED</option>
                        </select>
                    </div>
                    <div className="input-row">
                        <div className="input-group"><label>Date</label><input type="text" name="date" value={formData.date || ''} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Time</label><input type="text" name="time" value={formData.time || ''} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-row">
                        <div className="input-group"><label>Type</label><input type="text" name="type" value={formData.type || ''} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Link</label><input type="text" name="form_link" value={formData.form_link || ''} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-group"><label>Description</label><textarea name="description" value={formData.description || ''} onChange={handleInputChange} /></div>
                    <div className="input-group">
                        <label style={{ color: 'var(--accent-orange)' }}>REQUIRED: 3:2 ASPECT RATIO</label>
                        <div className="upload-container">
                            {previewUrl && (
                                <div className="image-preview" style={{ width: '300px', aspectRatio: '3/2' }}>
                                    <img src={previewUrl} alt="prev" style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <p className="upload-hint">Please maintain 3:2 aspect ratio for best display.</p>
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="checkbox-label">
                            <input type="checkbox" name="is_featured" checked={formData.is_featured || false} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                            Show as Top Announcement Banner
                        </label>
                    </div>
                </div>
            );
        } else if (activeTab === 'youtube_videos') {
            return (
                <div className="form-grid">
                    <div className="input-group"><label>Video Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className="input-group"><label>YouTube URL</label><input type="text" name="video_url" value={formData.video_url || ''} onChange={handleInputChange} required /></div>
                    <div className="input-row">
                        <div className="input-group"><label>Category</label><input type="text" name="category" value={formData.category || ''} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Episode ID</label><input type="text" name="episode_id" value={formData.episode_id || ''} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-group">
                        <label style={{ color: 'var(--accent-orange)' }}>REQUIRED: 3:2 ASPECT RATIO</label>
                        <div className="upload-container">
                            {previewUrl && (
                                <div className="image-preview" style={{ width: '300px', aspectRatio: '3/2' }}>
                                    <img src={previewUrl} alt="prev" style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <p className="upload-hint">Please maintain 3:2 aspect ratio for best display.</p>
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'articles') {
            return (
                <div className="form-grid">
                    <div className="input-group"><label>Article Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className="input-row">
                        <div className="input-group"><label>Type (e.g. POLICY ANALYSIS)</label><input type="text" name="type" value={formData.type || ''} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Display ID (e.g. 01)</label><input type="text" name="display_id" value={formData.display_id || ''} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-row">
                        <div className="input-group"><label>Category (e.g. DEFENSE)</label><input type="text" name="category" value={formData.category || ''} onChange={handleInputChange} /></div>
                        <div className="input-group"><label>Date (e.g. JAN 24, 2026)</label><input type="text" name="date" value={formData.date || ''} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-group"><label>Excerpt / Summary</label><textarea name="excerpt" value={formData.excerpt || ''} onChange={handleInputChange} /></div>
                    <div className="input-group"><label>Redirect URL (External Link)</label><input type="text" name="redirect_url" value={formData.redirect_url || ''} onChange={handleInputChange} placeholder="https://example.com/original-article" /></div>
                    <div className="input-group">
                        <label style={{ color: 'var(--accent-orange)' }}>REQUIRED: 4:5 ASPECT RATIO</label>
                        <div className="upload-container">
                            {previewUrl && (
                                <div className="image-preview" style={{ width: '220px', aspectRatio: '4/5' }}>
                                    <img src={previewUrl} alt="prev" style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <p className="upload-hint">Please maintain 4:5 aspect ratio for best display.</p>
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'team') {
            return (
                <div className="form-grid">
                    <div className="input-group"><label>Member Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required /></div>
                    <div className="input-group"><label>Designation / Role</label><input type="text" name="role" value={formData.role || ''} onChange={handleInputChange} required /></div>
                    <div className="input-group">
                        <label style={{ color: 'var(--accent-orange)' }}>PHOTO</label>

                        {/* OPTION 1: Paste Cloudinary URL directly */}
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '11px', color: '#aaa', letterSpacing: '1px' }}>OPTION 1 — PASTE CLOUDINARY URL</label>
                            <input
                                type="text"
                                placeholder="https://res.cloudinary.com/dgmxkx5x8/..."
                                value={formData.image_url || ''}
                                onChange={(e) => {
                                    setFormData({ ...formData, image_url: e.target.value, imageFile: null });
                                    setPreviewUrl(e.target.value);
                                }}
                                style={{ width: '100%', marginTop: '6px' }}
                            />
                        </div>

                        <div style={{ textAlign: 'center', color: '#555', fontSize: '11px', fontWeight: '800', margin: '10px 0', letterSpacing: '2px' }}>— OR —</div>

                        {/* OPTION 2: Upload from desktop → auto uploads to Cloudinary */}
                        <div className="upload-container">
                            <label style={{ fontSize: '11px', color: '#aaa', letterSpacing: '1px' }}>OPTION 2 — UPLOAD FROM DESKTOP (auto-uploads to Cloudinary)</label>
                            {previewUrl && (
                                <div className="image-preview" style={{ width: '220px', aspectRatio: '4/5', marginTop: '10px' }}>
                                    <img src={previewUrl} alt="prev" style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '8px' }} />
                            <p className="upload-hint">Please maintain 4:5 aspect ratio for best display.</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="form-grid">
                    {!editingId && unassignedEvents.length > 0 && (
                        <div className="input-group" style={{ border: '1px solid var(--accent-orange)', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: 'rgba(232, 90, 36, 0.05)' }}>
                            <label style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>⚡ QUICK IMPORT FROM ENDED EVENT</label>
                            <select
                                style={{ marginTop: '10px', cursor: 'pointer' }}
                                value={formData.event_id || ''}
                                onChange={(e) => {
                                    const event = unassignedEvents.find(ev => ev.id === e.target.value);
                                    if (event) {
                                        setFormData({
                                            ...formData,
                                            title: event.title,
                                            date: event.date,
                                            image_url: event.image_url,
                                            event_id: event.id
                                        });
                                        setPreviewUrl(event.image_url);
                                        showNotice("Event data imported successfully!");
                                    } else {
                                        setFormData({ ...formData, title: '', date: '', image_url: '', event_id: '' });
                                        setPreviewUrl(null);
                                    }
                                }}
                            >
                                <option value="">-- Select an Event to Auto-Fill --</option>
                                {unassignedEvents.map(e => (
                                    <option key={e.id} value={e.id}>{e.title} ({e.date})</option>
                                ))}
                            </select>
                            <p className="upload-hint" style={{ marginTop: '10px' }}>This will directly store the title, date, and thumbnail from the hosted event.</p>
                        </div>
                    )}
                    <div className="input-group"><label>Workshop Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Category</label>
                            <select name="category" value={formData.category || 'VIRTUAL'} onChange={handleInputChange}>
                                <option value="VIRTUAL">VIRTUAL</option>
                                <option value="IN_PERSON">IN_PERSON</option>
                            </select>
                        </div>
                        <div className="input-group"><label>Date (e.g. MAY 2025)</label><input type="text" name="date" value={formData.date || ''} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-group">
                        <label style={{ color: 'var(--accent-orange)' }}>REQUIRED: 3:2 ASPECT RATIO</label>
                        <div className="upload-container">
                            {(previewUrl || formData.image_url) && (
                                <div className="image-preview" style={{ width: '300px', aspectRatio: '3/2', marginBottom: '15px' }}>
                                    <img src={previewUrl || formData.image_url} alt="prev" style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            <p className="upload-hint">Please maintain 3:2 aspect ratio for best display.</p>
                        </div>
                    </div>
                </div>
            );
        }
    };

    // --- RENDER LOGIN SCREEN IF NO USER ---
    if (!user) {
        return (
          <div className="login-container">
            <style>{`
              .login-container { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; font-family: 'Montserrat'; background: #fff; position: fixed; top: 0; left: 0; z-index: 999; }
              .login-card { width: 100%; max-width: 350px; padding: 20px; }
              .login-card h2 { font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 30px; font-size: 0.85rem; text-align: center; }
              .input-group { position: relative; margin-bottom: 12px; }
              .login-card input { width: 100%; padding: 18px; border: 1px solid #eee; outline: none; font-family: inherit; font-size: 0.75rem; transition: border 0.3s ease; }
              .login-card input:focus { border-color: #000; }
              .toggle-pwd { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-size: 0.55rem; font-weight: 900; letter-spacing: 0.1em; cursor: pointer; color: #999; }
              .toggle-pwd:hover { color: #000; }
              .login-btn { width: 100%; padding: 18px; background: #000; color: #fff; border: none; font-weight: 900; cursor: pointer; letter-spacing: 0.2em; transition: opacity 0.3s ease; }
              .login-btn:hover { opacity: 0.8; }
              .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
            <div className="login-card">
              <h2>Studio Access</h2>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                    <input type="email" placeholder="EMAIL" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <input type={showPassword ? "text" : "password"} placeholder="PASSWORD" onChange={(e) => setPassword(e.target.value)} required />
                    <span className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "HIDE" : "SHOW"}
                    </span>
                </div>
                <button className="login-btn" disabled={loading}>
                    {loading ? "AUTHENTICATING..." : "LOGIN"}
                </button>
              </form>
            </div>
          </div>
        );
      }

    return (
        <div className={`admin-page-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* MOBILE OVERLAY */}
            <div className={`mobile-overlay ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

            {/* MOBILE TOP BAR */}
            <header className="mobile-admin-header">
                <div className="mobile-brand">
                    <div className="brand-dot"></div>
                </div>
                <button
                    className={`menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

           <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-dot"></div>
                    {!isCollapsed && <h2>TIESVERSE ADMIN</h2>}
                    <button type="button" className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? '❯' : '❮'}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'events' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('events')}>
                        <span>📅</span> {!isCollapsed && "EVENTS"}
                    </button>
                    <button className={activeTab === 'articles' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('articles')}>
                        <span>📄</span> {!isCollapsed && "ARTICLES"}
                    </button>
                    <button className={activeTab === 'youtube_videos' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('youtube_videos')}>
                        <span>🎬</span> {!isCollapsed && "YOUTUBE"}
                    </button>
                    <button className={activeTab === 'workshops' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('workshops')}>
                        <span>🛠️</span> {!isCollapsed && "WORKSHOPS"}
                    </button>
                    <button className={activeTab === 'team' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('team')}>
                        <span>👥</span> {!isCollapsed && "TEAM"}
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="main-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>{activeTab.toUpperCase()} MANAGEMENT</h1>
                        <p>Total items: {items.length}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {/* MASTER MIGRATE BUTTON */}

                        
                        {/* LOGOUT BUTTON */}
                        <button 
                            onClick={handleLogout}
                            style={{ background: 'transparent', color: '#666', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            LOGOUT
                        </button>
                    </div>
                </header>

                <div className="admin-grid">
                    <section className="form-section">
                        <div className="card shadow-glass">
                            <div className="card-header">
                                <h3>{editingId ? 'Edit Entry' : 'New Entry'}</h3>
                                {editingId && <button onClick={resetForm}>Cancel</button>}
                            </div>
                            <form onSubmit={handleSubmit} className="admin-form-enhanced">
                                {renderForm()}
                                <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Saving...' : 'Publish to Site'}</button>
                            </form>
                        </div>
                    </section>

                    <section className="list-section">
                        <div className="card shadow-glass">
                            <div className="card-header"><h3>Active Content</h3></div>
                            {activeTab === 'youtube_videos' && (
                                <div className="event-visibility-bar dual-limit-bar">
                                    <div className="limit-unit">
                                        <div className="visibility-info">
                                            <p>PC LIMIT</p>
                                            <span>Show {siteSettings.youtube_display_limit_pc || 3} videos</span>
                                        </div>
                                        <div className="visibility-control">
                                            <input 
                                                type="number" 
                                                value={siteSettings.youtube_display_limit_pc || 3} 
                                                onChange={(e) => setSiteSettings({ ...siteSettings, youtube_display_limit_pc: e.target.value })} 
                                            />
                                            <button onClick={() => handleUpdateSetting('youtube_display_limit_pc', siteSettings.youtube_display_limit_pc)}>UPDATE</button>
                                        </div>
                                    </div>
                                    <div className="limit-unit">
                                        <div className="visibility-info">
                                            <p>MOBILE LIMIT</p>
                                            <span>Show {siteSettings.youtube_display_limit_mobile || 2} videos</span>
                                        </div>
                                        <div className="visibility-control">
                                            <input 
                                                type="number" 
                                                value={siteSettings.youtube_display_limit_mobile || 2} 
                                                onChange={(e) => setSiteSettings({ ...siteSettings, youtube_display_limit_mobile: e.target.value })} 
                                            />
                                            <button onClick={() => handleUpdateSetting('youtube_display_limit_mobile', siteSettings.youtube_display_limit_mobile)}>UPDATE</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'events' && (
                                <div className="event-visibility-bar dual-limit-bar">
                                    <div className="limit-unit">
                                        <div className="visibility-info">
                                            <p>PC LIMIT</p>
                                            <span>Show {siteSettings.event_display_limit_pc || 2} entries</span>
                                        </div>
                                        <div className="visibility-control">
                                            <input type="number" value={siteSettings.event_display_limit_pc || 2} onChange={(e) => setSiteSettings({ ...siteSettings, event_display_limit_pc: e.target.value })} />
                                            <button onClick={() => handleUpdateSetting('event_display_limit_pc', siteSettings.event_display_limit_pc)}>UPDATE</button>
                                        </div>
                                    </div>
                                    <div className="limit-unit">
                                        <div className="visibility-info">
                                            <p>MOBILE LIMIT</p>
                                            <span>Show {siteSettings.event_display_limit_mobile || 1} entries</span>
                                        </div>
                                        <div className="visibility-control">
                                            <input type="number" value={siteSettings.event_display_limit_mobile || 1} onChange={(e) => setSiteSettings({ ...siteSettings, event_display_limit_mobile: e.target.value })} />
                                            <button onClick={() => handleUpdateSetting('event_display_limit_mobile', siteSettings.event_display_limit_mobile)}>UPDATE</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'articles' && (
                                <div className="event-visibility-bar dual-limit-bar">
                                    <div className="limit-unit">
                                        <div className="visibility-info">
                                            <p>PC LIMIT</p>
                                            <span>Show {siteSettings.article_display_limit_pc || 3} entries</span>
                                        </div>
                                        <div className="visibility-control">
                                            <input type="number" value={siteSettings.article_display_limit_pc || 3} onChange={(e) => setSiteSettings({ ...siteSettings, article_display_limit_pc: e.target.value })} />
                                            <button onClick={() => handleUpdateSetting('article_display_limit_pc', siteSettings.article_display_limit_pc)}>UPDATE</button>
                                        </div>
                                    </div>
                                    <div className="limit-unit">
                                        <div className="visibility-info">
                                            <p>MOBILE LIMIT</p>
                                            <span>Show {siteSettings.article_display_limit_mobile || 3} entries</span>
                                        </div>
                                        <div className="visibility-control">
                                            <input type="number" value={siteSettings.article_display_limit_mobile || 3} onChange={(e) => setSiteSettings({ ...siteSettings, article_display_limit_mobile: e.target.value })} />
                                            <button onClick={() => handleUpdateSetting('article_display_limit_mobile', siteSettings.article_display_limit_mobile)}>UPDATE</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'workshops' && (
                                <div className="workshop-filter-bar">
                                    <button className={workshopFilter === 'ALL' ? 'active' : ''} onClick={() => setWorkshopFilter('ALL')}>ALL</button>
                                    <button className={workshopFilter === 'VIRTUAL' ? 'active' : ''} onClick={() => setWorkshopFilter('VIRTUAL')}>VIRTUAL</button>
                                    <button className={workshopFilter === 'IN_PERSON' ? 'active' : ''} onClick={() => setWorkshopFilter('IN_PERSON')}>IN-PERSON</button>
                                </div>
                            )}

                            <div className="item-list-container">
                                {items
                                    .filter(item => {
                                        if (activeTab !== 'workshops' || workshopFilter === 'ALL') return true;
                                        return item.category === workshopFilter;
                                    })
                                    .map(item => {
                                        const thumb = getThumbnailFallback(item);
                                        return (
                                            <div key={item.id} className="enhanced-item-card">
                                                <div className="item-main-info">
                                                    {thumb && (
                                                        <div className="item-thumbnail-small">
                                                            <img src={thumb} alt="t" />
                                                        </div>
                                                    )}
                                                    <div className="item-text-details">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <h4>{item.title || item.name}</h4>
                                                            {item.is_featured && <span className="featured-badge">BANNER</span>}
                                                        </div>
                                                        <div className="item-meta">
                                                            <span className="pill-generic">{item.category || item.role}</span>
                                                            {item.date && <span className="item-date-small">{item.date}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="item-actions-row">
                                                    <button className="btn-edit-small" onClick={() => handleEdit(item)}>Edit</button>
                                                    <button className="btn-delete-small" onClick={() => setDeleteModal({ open: true, id: item.id })}>Delete</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {deleteModal.open && (
                <div className="modal-overlay">
                    <div className="custom-modal shadow-glass">
                        <h3>Confirm Deletion</h3>
                        <p>Permanently remove this entry?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel-modal" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</button>
                            <button className="btn-confirm-delete" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            )}

            {swapModal.open && (
                <div className="modal-overlay">
                    <div className="custom-modal shadow-glass">
                        <h3>Replace Banner?</h3>
                        <p><strong>"{swapModal.existingTitle}"</strong> is live. Switch to this one?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel-modal" onClick={() => setSwapModal({ open: false })}>Cancel</button>
                            <button className="btn-confirm-delete" style={{ background: 'var(--accent-orange)' }} onClick={handleSwapConfirm} disabled={loading}>{loading ? 'Swapping...' : 'Replace'}</button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`toast-notification ${notification.type}`}>
                    <div className="toast-content"><p>{notification.msg}</p></div>
                    <div className="toast-progress"></div>
                </div>
            )}

            {sizeWarning.open && (
                <div className="modal-overlay">
                    <div className="custom-modal shadow-glass" style={{ border: '1px solid var(--accent-orange)' }}>
                        <h3 style={{ color: 'var(--accent-orange)' }}>⚠️ ASPECT RATIO MISMATCH</h3>
                        <div style={{ margin: '20px 0', fontSize: '13px', lineHeight: '1.8' }}>
                            <p>Your image is not on the exact ratio given below. Would you like to proceed anyway or choose another?</p>
                            <div style={{ background: 'rgba(232, 90, 36, 0.1)', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Expected Ratio:</span>
                                    <strong style={{ color: '#fff' }}>{sizeWarning.expectedRatio}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ff4d4d' }}>
                                    <span>Your Image Ratio:</span>
                                    <strong>{sizeWarning.actualRatio}</strong>
                                </div>
                            </div>
                            <p style={{ marginTop: '15px', opacity: 0.7 }}>Using non-standard aspect ratios may cause the image to look cropped or stretched on the main website.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel-modal" onClick={() => setSizeWarning({ open: false, file: null })}>Select Another</button>
                            <button className="btn-confirm-delete" style={{ background: 'var(--accent-orange)' }} onClick={proceedWithImage}>Proceed Anyway</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;