const API_BASE = "https://game-xhnj.onrender.com/api";

const fetchWithTimeout = (url: string, options: any = {}) => {
    console.log(`[API] Fetching: ${url}`);
    const start = Date.now();
    return fetch(url, options)
        .then(res => {
            const duration = Date.now() - start;
            console.log(`[API] Success: ${url} (${duration}ms)`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .catch(err => {
            const duration = Date.now() - start;
            console.error(`[API] Error: ${url} (${duration}ms) - ${err.message}`);
            throw err;
        });
};

export const getVersion = (signal?: AbortSignal) =>
    fetchWithTimeout(`${API_BASE}/version`, { signal });

export const api = {
    getVersion,
    getUser: (id: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/user/${id}`, { signal }),

    updateUser: (id: string, name: string, avatar: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/user/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, avatar }),
            signal
        }),

    getShop: (signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/shop`, { signal }),

    getNews: (signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/news`, { signal }),

    buyItem: (userId: string, itemId: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId }),
            signal
        }),

    // Popup Management
    getPopups: (signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/popups`, { signal }),

    createPopup: (title: string, message: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/popup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, message, active: true }),
            signal
        }),

    deletePopup: (id: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/popup/${id}`, {
            method: 'DELETE',
            signal
        }),

    // News Management
    createNews: (title: string, content: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/news`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
            signal
        }),

    deleteNews: (id: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/news/${id}`, {
            method: 'DELETE',
            signal
        }),

    sendMail: (targetId: string, title: string, content: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/mail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId, title, content }),
            signal
        }),

    deleteMail: (targetId: string, mailId: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/mail/${targetId}/${mailId}`, {
            method: 'DELETE',
            signal
        }),
};
