import type { AuthState } from '../types';

const TOKEN_KEY = 'lathe_token';
const USER_KEY = 'lathe_user';

/**
 * Get stored auth state
 */
export function getAuthState(): AuthState {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    return {
        token,
        user: userStr ? JSON.parse(userStr) : null,
    };
}

/**
 * Store auth token and user
 */
export function setAuthState(token: string, user: any) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clear auth state (logout)
 */
export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Core fetch wrapper with JWT auth
 */
async function fetchJSON<T = any>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const { token } = getAuthState();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// ─── Auth API ───────────────────────────────────────────────────

export const authAPI = {
    login: (email: string, password: string) =>
        fetchJSON('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (email: string, password: string, name: string) =>
        fetchJSON('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        }),

    me: () => fetchJSON('/api/auth/me'),
};

// ─── Invitations API ────────────────────────────────────────────

export const invitationsAPI = {
    list: () => fetchJSON('/api/invitations'),

    getPublic: (slug: string) =>
        fetchJSON(`/api/invitations/${slug}/public`),

    getDetail: (id: string) =>
        fetchJSON(`/api/invitations/${id}/detail`),

    create: (data: any) =>
        fetchJSON('/api/invitations', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        fetchJSON(`/api/invitations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchJSON(`/api/invitations/${id}`, { method: 'DELETE' }),
};

// ─── Guests API ─────────────────────────────────────────────────

export const guestsAPI = {
    list: (invitationId: string) =>
        fetchJSON(`/api/invitations/${invitationId}/guests`),

    add: (invitationId: string, data: any) =>
        fetchJSON(`/api/invitations/${invitationId}/guests`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    batchImport: (invitationId: string, guests: any[]) =>
        fetchJSON(`/api/invitations/${invitationId}/guests/import`, {
            method: 'POST',
            body: JSON.stringify({ guests }),
        }),

    update: (guestId: string, data: any) =>
        fetchJSON(`/api/guests/${guestId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (guestId: string) =>
        fetchJSON(`/api/guests/${guestId}`, { method: 'DELETE' }),
};

// ─── Check-In API ───────────────────────────────────────────────

export const checkinAPI = {
    scanQR: (qrToken: string) =>
        fetchJSON(`/api/checkin/${qrToken}`, { method: 'POST' }),

    search: (slug: string, query: string) =>
        fetchJSON(`/api/checkin/${slug}/search?q=${encodeURIComponent(query)}`),

    manualCheckIn: (slug: string, guestId: string) =>
        fetchJSON(`/api/checkin/${slug}/manual`, {
            method: 'POST',
            body: JSON.stringify({ guest_id: guestId }),
        }),

    getStats: (slug: string) =>
        fetchJSON(`/api/checkin/${slug}/stats`),
};

// ─── Guest Book API ─────────────────────────────────────────────

export const guestbookAPI = {
    submit: (slug: string, data: any) =>
        fetchJSON(`/api/guestbook/${slug}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    list: (slug: string) =>
        fetchJSON(`/api/guestbook/${slug}`),
};

// ─── Upload API ─────────────────────────────────────────────────

export const uploadAPI = {
    upload: async (file: File, type: string = 'media'): Promise<{ url: string }> => {
        const { token } = getAuthState();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(err.error);
        }

        return res.json();
    },
};


// ─── Billing API ────────────────────────────────────────────────

export const billingAPI = {
    usage: () => fetchJSON('/api/billing/usage'),
    checkout: (data: { method?: string; credits?: number } = {}) =>
        fetchJSON('/api/billing/checkout', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
