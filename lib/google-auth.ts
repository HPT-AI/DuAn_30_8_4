// Google OAuth service for frontend - Simplified version

interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
}

class GoogleAuthService {
    private clientId: string;
    private isInitialized: boolean = false;

    constructor() {
        this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
        console.log('[GOOGLE-AUTH-SERVICE] Initialized with client ID:', this.clientId ? 'Present' : 'Missing');
    }

    async initialize(): Promise<void> {
        console.log('[GOOGLE-AUTH-SERVICE] Initializing Google Auth Service...');
        if (this.isInitialized) {
            console.log('[GOOGLE-AUTH-SERVICE] Already initialized, skipping...');
            return;
        }

        return new Promise((resolve, reject) => {
            if (!document.getElementById('google-identity-script')) {
                console.log('[GOOGLE-AUTH-SERVICE] Loading Google Identity Services script...');
                const script = document.createElement('script');
                script.id = 'google-identity-script';
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    console.log('[GOOGLE-AUTH-SERVICE] Google Identity Services script loaded successfully');
                    this.isInitialized = true;
                    resolve();
                };
                script.onerror = () => {
                    console.error('[GOOGLE-AUTH-SERVICE] Failed to load Google Identity Services script');
                    reject(new Error('Failed to load Google Identity Services'));
                };
                document.head.appendChild(script);
            } else {
                console.log('[GOOGLE-AUTH-SERVICE] Google Identity Services script already exists');
                this.isInitialized = true;
                resolve();
            }
        });
    }

    async signInWithPopup(): Promise<string> {
        console.log('[GOOGLE-AUTH-SERVICE] Starting signInWithPopup...');

        await this.initialize();

        return new Promise((resolve, reject) => {
            try {
                // Use OAuth2 popup flow
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: this.clientId,
                    scope: 'openid email profile',
                    callback: async (response: any) => {
                        console.log('[GOOGLE-AUTH-SERVICE] OAuth2 response received');
                        
                        if (response.error) {
                            console.error('[GOOGLE-AUTH-SERVICE] OAuth2 error:', response.error);
                            reject(new Error(response.error));
                            return;
                        }

                        try {
                            // Get user info using the access token
                            console.log('[GOOGLE-AUTH-SERVICE] Fetching user info...');
                            const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
                            
                            if (!userInfoResponse.ok) {
                                throw new Error(`Failed to fetch user info: ${userInfoResponse.status}`);
                            }
                            
                            const userInfo = await userInfoResponse.json();
                            console.log('[GOOGLE-AUTH-SERVICE] User info received:', {
                                email: userInfo.email,
                                name: userInfo.name,
                                hasId: !!userInfo.id
                            });
                            
                            // Create a simple token with user info
                            const userToken = btoa(JSON.stringify({
                                email: userInfo.email,
                                name: userInfo.name,
                                picture: userInfo.picture,
                                id: userInfo.id,
                                access_token: response.access_token
                            }));
                            
                            console.log('[GOOGLE-AUTH-SERVICE] User token created successfully');
                            resolve(userToken);
                        } catch (error) {
                            console.error('[GOOGLE-AUTH-SERVICE] Error fetching user info:', error);
                            reject(error as Error);
                        }
                    },
                    error_callback: (error: any) => {
                        console.error('[GOOGLE-AUTH-SERVICE] OAuth2 error callback:', error);
                        reject(new Error(error.message || 'OAuth2 authentication failed'));
                    }
                });

                console.log('[GOOGLE-AUTH-SERVICE] Requesting access token...');
                client.requestAccessToken();
                
            } catch (e) {
                console.error('[GOOGLE-AUTH-SERVICE] Error in signInWithPopup:', e);
                reject(e as Error);
            }
        });
    }
}

// Global instance
const googleAuthService = new GoogleAuthService();

export default googleAuthService;

// Type declarations for Google Identity Services
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (callback?: (notification: any) => void) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                };
                oauth2: {
                    initTokenClient: (config: any) => {
                        requestAccessToken: () => void;
                    };
                };
            };
        };
    }
}