import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

// OAuth Configuration (inline to avoid circular dependency)
const OAUTH_CONFIG = {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        redirectUri: typeof window !== 'undefined' ? window.location.origin + '/oauth/callback' : ''
    },
    facebook: {
        appId: 'YOUR_FACEBOOK_APP_ID',
        redirectUri: typeof window !== 'undefined' ? window.location.origin + '/oauth/callback' : ''
    }
};

/**
 * Generate OAuth URL for Google
 */
export const getGoogleOAuthUrl = () => {
    const params = new URLSearchParams({
        client_id: OAUTH_CONFIG.google.clientId,
        redirect_uri: OAUTH_CONFIG.google.redirectUri,
        response_type: 'id_token token',
        scope: 'openid email profile',
        nonce: Math.random().toString(36).substring(7),
        // For mobile, use postMessage
        ...(Capacitor.isNativePlatform() && {
            prompt: 'select_account'
        })
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Generate OAuth URL for Facebook
 */
export const getFacebookOAuthUrl = () => {
    const params = new URLSearchParams({
        client_id: OAUTH_CONFIG.facebook.appId,
        redirect_uri: OAUTH_CONFIG.facebook.redirectUri,
        response_type: 'token',
        scope: 'email,public_profile',
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
};

/**
 * Open Google OAuth in browser and handle response
 */
export const loginWithGoogle = async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const url = getGoogleOAuthUrl();

        try {
            // Open OAuth browser
            await Browser.open({
                url,
                windowName: '_blank',
                presentationStyle: 'popover'
            });

            // Listen for browser close or redirect
            const listener = await Browser.addListener('browserFinished', () => {
                reject(new Error('User closed browser'));
                listener.remove();
            });

            // In a real app, you'd use deep linking to capture the callback
            // For now, we'll use a simplified approach with postMessage

            // Setup message listener for OAuth callback
            window.addEventListener('message', function handler(event) {
                if (event.data && event.data.type === 'oauth-callback') {
                    window.removeEventListener('message', handler);
                    Browser.close();
                    listener.remove();

                    const { id_token } = event.data;
                    if (id_token) {
                        resolve(id_token);
                    } else {
                        reject(new Error('No ID token received'));
                    }
                }
            });

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Open Facebook OAuth in browser and handle response
 */
export const loginWithFacebook = async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const url = getFacebookOAuthUrl();

        try {
            await Browser.open({
                url,
                windowName: '_blank',
                presentationStyle: 'popover'
            });

            const listener = await Browser.addListener('browserFinished', () => {
                reject(new Error('User closed browser'));
                listener.remove();
            });

            window.addEventListener('message', function handler(event) {
                if (event.data && event.data.type === 'oauth-callback') {
                    window.removeEventListener('message', handler);
                    Browser.close();
                    listener.remove();

                    const { access_token } = event.data;
                    if (access_token) {
                        resolve(access_token);
                    } else {
                        reject(new Error('No access token received'));
                    }
                }
            });

        } catch (error) {
            reject(error);
        }
    });
};
