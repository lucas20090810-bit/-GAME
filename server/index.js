const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const { packageUpdate } = require('./package-update');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'data.json');
const MANIFEST_PATH = path.join(__dirname, 'public/updates/manifest.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read/write persistent data
const getData = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (e) {
        return { users: {}, shop: [], news: [], popups: [] };
    }
};
const setData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// Version Manifest helper
const getManifest = () => {
    try {
        if (fs.existsSync(MANIFEST_PATH)) {
            return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        }
    } catch (e) { }
    return {
        version: "1.1.0",
        bundleId: "initial",
        url: "https://game-xhnj.onrender.com/updates/latest.zip",
        message: "UI 介面全面進化！",
        changelog: ["全新 2048 遊戲邏輯", "介面優化"]
    };
};

app.get('/api/version', (req, res) => res.json(getManifest()));

// Profile API
app.get('/api/user/:id', (req, res) => {
    const data = getData();
    const user = data.users[req.params.id];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

app.post('/api/user/:id/update', (req, res) => {
    const { name, avatar } = req.body;
    const data = getData();
    if (!data.users[req.params.id]) {
        // Create user if doesn't exist for demo/initial purposes
        data.users[req.params.id] = { id: req.params.id, name: '新玩家', avatar: 'https://via.placeholder.com/150', coins: 1000, inventory: [], mails: [] };
    }

    data.users[req.params.id].name = name || data.users[req.params.id].name;
    data.users[req.params.id].avatar = avatar || data.users[req.params.id].avatar;

    setData(data);
    res.json(data.users[req.params.id]);
});

// Shop API
app.get('/api/shop', (req, res) => res.json(getData().shop));

app.post('/api/shop/buy', (req, res) => {
    const { userId, itemId } = req.body;
    const data = getData();
    const user = data.users[userId];
    const item = data.shop.find(i => i.id === itemId);

    if (!user || !item) return res.status(400).json({ error: 'Invalid operation' });
    if (user.coins < item.price) return res.status(400).json({ error: 'Insufficient coins' });

    user.coins -= item.price;
    user.inventory.push(item);
    setData(data);
    res.json({ success: true, user });
});

// Mail API
app.get('/api/user/:id/mails', (req, res) => {
    const data = getData();
    res.json(data.users[req.params.id]?.mails || []);
});

// News API
app.get('/api/news', (req, res) => res.json(getData().news));

// Admin API
app.post('/api/admin/news', (req, res) => {
    const data = getData();
    const newNews = { id: Date.now().toString(), ...req.body, date: new Date().toISOString().split('T')[0] };
    data.news.unshift(newNews);
    setData(data);
    res.json(newNews);
});

app.post('/api/admin/mail', (req, res) => {
    const { targetId, title, content } = req.body;
    const data = getData();
    const mail = { id: Date.now().toString(), title, content, date: new Date().toISOString().split('T')[0], read: false };

    if (targetId === 'all') {
        Object.values(data.users).forEach(u => u.mails.unshift(mail));
    } else if (data.users[targetId]) {
        data.users[targetId].mails.unshift(mail);
    }

    setData(data);
    res.json({ success: true });
});

// Popup Management API
app.get('/api/popups', (req, res) => {
    const data = getData();
    const activePopups = data.popups?.filter(p => p.active) || [];
    res.json(activePopups);
});

app.post('/api/admin/popup', (req, res) => {
    const data = getData();
    const newPopup = {
        id: Date.now().toString(),
        ...req.body,
        active: true,
        createdAt: new Date().toISOString()
    };
    if (!data.popups) data.popups = [];
    data.popups.unshift(newPopup);
    setData(data);
    res.json(newPopup);
});

app.delete('/api/admin/popup/:id', (req, res) => {
    const data = getData();
    if (!data.popups) data.popups = [];
    data.popups = data.popups.filter(p => p.id !== req.params.id);
    setData(data);
    res.json({ success: true });
});

app.delete('/api/admin/news/:id', (req, res) => {
    const data = getData();
    data.news = data.news.filter(n => n.id !== req.params.id);
    setData(data);
    res.json({ success: true });
});

// ========================================
// OTA Live Update APIs
// ========================================

// Get update manifest
app.get('/api/live-update/manifest', (req, res) => {
    try {
        const manifestPath = path.join(__dirname, 'public/updates/manifest.json');
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            res.json(manifest);
        } else {
            res.status(404).json({ error: 'No updates available' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to read manifest' });
    }
});

// Trigger update packaging (admin only)
app.post('/api/admin/trigger-update', async (req, res) => {
    try {
        const { version, message } = req.body;
        console.log(`📦 Triggering OTA update: v${version} - ${message}`);

        // Package the latest build
        packageUpdate();

        res.json({
            success: true,
            message: 'Update package created and deployed!',
            version
        });
    } catch (error) {
        console.error('OTA Error:', error);
        res.status(500).json({ error: 'Failed to trigger update' });
    }
});

// Serve update bundles
app.use('/updates', express.static(path.join(__dirname, 'public/updates')));

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
