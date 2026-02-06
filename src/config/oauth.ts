// OAuth Configuration
// Copy your Client IDs here after setting up Google/Facebook

export const OAUTH_CONFIG = {
    google: {
        // Get from: https://console.cloud.google.com/
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        // Redirect URI for OAuth callback
        redirectUri: window.location.origin + '/oauth/callback'
    },
    facebook: {
        // Get from: https://developers.facebook.com/
        appId: 'YOUR_FACEBOOK_APP_ID',
        redirectUri: window.location.origin + '/oauth/callback'
    }
};

// Backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
