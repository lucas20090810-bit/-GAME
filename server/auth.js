const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

// Google OAuth Client (will be initialized with client ID from env)
let googleClient = null;

const initGoogleClient = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
        googleClient = new OAuth2Client(clientId);
        console.log('✅ Google OAuth Client initialized');
    } else {
        console.warn('⚠️  GOOGLE_CLIENT_ID not set - Google login will fail');
    }
};

/**
 * Generate JWT access token
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Middleware: Require authentication
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
};

/**
 * Verify Google ID Token
 */
const verifyGoogleToken = async (idToken) => {
    if (!googleClient) {
        throw new Error('Google Client not initialized. Set GOOGLE_CLIENT_ID environment variable.');
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            provider: 'google'
        };
    } catch (error) {
        console.error('Google token verification failed:', error.message);
        throw new Error('Invalid Google token');
    }
};

/**
 * Verify Facebook Access Token
 */
const verifyFacebookToken = async (accessToken) => {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error('Facebook App ID/Secret not configured');
    }

    try {
        // Verify token with Facebook
        const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;
        const debugResponse = await axios.get(debugUrl);

        if (!debugResponse.data.data.is_valid) {
            throw new Error('Invalid Facebook token');
        }

        // Get user info
        const userUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
        const userResponse = await axios.get(userUrl);

        return {
            id: userResponse.data.id,
            email: userResponse.data.email,
            name: userResponse.data.name,
            picture: userResponse.data.picture?.data?.url,
            provider: 'facebook'
        };
    } catch (error) {
        console.error('Facebook token verification failed:', error.message);
        throw new Error('Invalid Facebook token');
    }
};

module.exports = {
    initGoogleClient,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    requireAuth,
    verifyGoogleToken,
    verifyFacebookToken
};
