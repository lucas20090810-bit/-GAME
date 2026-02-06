const API_BASE = "https://game-xhnj.onrender.com/api";

/**
 * Get stored JWT access token
 */
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

/**
 * Set JWT access token
 */
export const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
};

/**
 * Remove JWT access token (logout)
 */
export const removeAccessToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_profile');
};

/**
 * Get headers with Authentication
 */
const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const fetchWithTimeout = (url: string, options: any = {}) => {
    console.log(`[API] Fetching: ${url}`);

    // Add auth headers if not already present
    if (!options.headers) {
        options.headers = getAuthHeaders();
    }

    const start = Date.now();
    return fetch(url, options)
        .then(res => {
            const duration = Date.now() - start;
            console.log(`[API] Success: ${url} (${duration}ms)`);

            // Handle 401 Unauthorized
            if (res.status === 401) {
                console.warn('[API] Unauthorized - token may be expired');
                removeAccessToken();
                window.location.reload(); // Force re- login
            }

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
    // ========================================
    // OAuth Authentication
    // ========================================

    /**
     * Authenticate with Google ID Token
     */
    loginWithGoogle: async (idToken: string, signal?: AbortSignal) => {
        const response = await fetchWithTimeout(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
            signal
        });

        if (response.success) {
            setAccessToken(response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            return response.user;
        }

        throw new Error(response.error || 'Login failed');
    },

    /**
     * Authenticate with Facebook Access Token
     */
    loginWithFacebook: async (accessToken: string, signal?: AbortSignal) => {
        const response = await fetchWithTimeout(`${API_BASE}/auth/facebook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken }),
            signal
        });

        if (response.success) {
            setAccessToken(response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            return response.user;
        }

        throw new Error(response.error || 'Login failed');
    },

    /**
     * Verify current JWT token
     */
    verifyToken: async (signal?: AbortSignal) => {
        try {
            const response = await fetchWithTimeout(`${API_BASE}/auth/verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
                signal
            });
            return response.valid ? response.user : null;
        } catch (error) {
            return null;
        }
    },

    // ========================================
    // User APIs (Protected)
    // ========================================

    getVersion,
    getUser: (id: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/user/${id}`, { signal }),

    updateUser: (id: string, name: string, avatar: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/user/${id}`, {
            method: 'POST',
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
            body: JSON.stringify({ userId, itemId }),
            signal
        }),

    // Popup Management
    getPopups: (signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/popups`, { signal }),

    createPopup: (title: string, message: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/popup`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, message, active: true }),
            signal
        }),

    deletePopup: (id: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/popup/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            signal
        }),

    // News Management
    createNews: (title: string, content: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/news`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, content }),
            signal
        }),

    deleteNews: (id: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/news/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            signal
        }),

    sendMail: (targetId: string, title: string, content: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/mail`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ targetId, title, content }),
            signal
        }),

    deleteMail: (targetId: string, mailId: string, signal?: AbortSignal) =>
        fetchWithTimeout(`${API_BASE}/admin/mail/${targetId}/${mailId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            signal
        }),
};
