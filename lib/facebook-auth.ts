// Facebook OAuth service for frontend
interface FacebookUser {
    id: string;
    email: string;
    name: string;
    picture: {
        data: {
            url: string;
        };
    };
}

interface FacebookAuthResponse {
    authResponse: {
        accessToken: string;
        userID: string;
    };
    status: string;
}

class FacebookAuthService {
    private appId: string;
    private isInitialized: boolean = false;

    constructor() {
        this.appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
        console.log('[FACEBOOK-AUTH-SERVICE] Initialized with app ID:', this.appId ? 'Present' : 'Missing');
    }

    async initialize(): Promise<void> {
        console.log('[FACEBOOK-AUTH-SERVICE] Initializing Facebook Auth Service...');
        if (this.isInitialized) {
            console.log('[FACEBOOK-AUTH-SERVICE] Already initialized, skipping...');
            return;
        }

        return new Promise((resolve, reject) => {
            if (!document.getElementById('facebook-jssdk')) {
                console.log('[FACEBOOK-AUTH-SERVICE] Loading Facebook SDK...');
                
                // Add Facebook SDK script
                const script = document.createElement('script');
                script.id = 'facebook-jssdk';
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    console.log('[FACEBOOK-AUTH-SERVICE] Facebook SDK loaded successfully');
                    
                    // Initialize Facebook SDK
                    window.FB.init({
                        appId: this.appId,
                        cookie: true,
                        xfbml: true,
                        version: 'v18.0'
                    });
                    
                    this.isInitialized = true;
                    resolve();
                };
                
                script.onerror = () => {
                    console.error('[FACEBOOK-AUTH-SERVICE] Failed to load Facebook SDK');
                    reject(new Error('Failed to load Facebook SDK'));
                };
                
                document.head.appendChild(script);
            } else {
                console.log('[FACEBOOK-AUTH-SERVICE] Facebook SDK already exists');
                this.isInitialized = true;
                resolve();
            }
        });
    }

    async signInWithPopup(): Promise<string> {
        console.log('[FACEBOOK-AUTH-SERVICE] Starting signInWithPopup...');

        await this.initialize();

        return new Promise((resolve, reject) => {
            try {
                console.log('[FACEBOOK-AUTH-SERVICE] Calling FB.login...');
                
                window.FB.login((response: FacebookAuthResponse) => {
                    console.log('[FACEBOOK-AUTH-SERVICE] FB.login response:', response);
                    
                    if (response.status === 'connected') {
                        const accessToken = response.authResponse.accessToken;
                        console.log('[FACEBOOK-AUTH-SERVICE] Access token received');
                        
                        // Get user info
                        window.FB.api('/me', { fields: 'name,email,picture' }, async (userInfo: FacebookUser) => {
                            console.log('[FACEBOOK-AUTH-SERVICE] User info received:', {
                                email: userInfo.email,
                                name: userInfo.name,
                                hasId: !!userInfo.id
                            });

                            try {
                                // Send to backend API
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
                                const backendResponse = await fetch(`${apiUrl}/api/v1/auth/facebook/token`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        token: accessToken
                                    }),
                                });

                                if (!backendResponse.ok) {
                                    const errorText = await backendResponse.text();
                                    let errorMessage = `HTTP ${backendResponse.status}`;
                                    try {
                                        const errorData = JSON.parse(errorText);
                                        errorMessage = errorData.detail || errorMessage;
                                    } catch {
                                        errorMessage = errorText || errorMessage;
                                    }
                                    throw new Error(`Backend error: ${errorMessage}`);
                                }

                                const backendData = await backendResponse.json();
                                console.log('[FACEBOOK-AUTH-SERVICE] Backend authentication successful');
                                resolve(backendData);
                                
                            } catch (error) {
                                console.error('[FACEBOOK-AUTH-SERVICE] Error processing access token:', error);
                                reject(error as Error);
                            }
                        });
                    } else {
                        console.error('[FACEBOOK-AUTH-SERVICE] Facebook login failed:', response);
                        reject(new Error('Facebook login failed or was cancelled'));
                    }
                }, { scope: 'email,public_profile' });
                
            } catch (e) {
                console.error('[FACEBOOK-AUTH-SERVICE] Error in signInWithPopup:', e);
                reject(e as Error);
            }
        });
    }
}

// Global instance
const facebookAuthService = new FacebookAuthService();

// Export the service as default
export default facebookAuthService;

// Export convenience function for backward compatibility
export const signInWithFacebook = async () => {
    try {
        const token = await facebookAuthService.signInWithPopup();
        return { success: true, token };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Type declarations for Facebook SDK
declare global {
    interface Window {
        FB: {
            init: (config: any) => void;
            login: (callback: (response: FacebookAuthResponse) => void, options?: any) => void;
            api: (path: string, params: any, callback: (response: any) => void) => void;
        };
    }
}