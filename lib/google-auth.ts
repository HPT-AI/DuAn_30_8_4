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
                // Use Google Identity Services for ID token (recommended approach)
                window.google.accounts.id.initialize({
                    client_id: this.clientId,
                    callback: async (response: any) => {
                        console.log('[GOOGLE-AUTH-SERVICE] ID token response received');
                        
                        if (response.error) {
                            console.error('[GOOGLE-AUTH-SERVICE] ID token error:', response.error);
                            reject(new Error(response.error));
                            return;
                        }

                        try {
                            console.log('[GOOGLE-AUTH-SERVICE] Sending ID token to backend...');
                            
                            // Send ID token directly to backend
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
                            const backendResponse = await fetch(`${apiUrl}/api/v1/auth/google/token`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: response.credential // This is the ID token
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
                            console.log('[GOOGLE-AUTH-SERVICE] Backend authentication successful');
                            resolve(backendData); // Trả về backend response (có access_token, refresh_token)
                            
                        } catch (error) {
                            console.error('[GOOGLE-AUTH-SERVICE] Error processing ID token:', error);
                            reject(error as Error);
                        }
                    },
                    auto_select: false,
                    cancel_on_tap_outside: false
                });

                // Trigger the One Tap flow or popup
                console.log('[GOOGLE-AUTH-SERVICE] Triggering Google Sign-In popup...');
                window.google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Fallback to popup if One Tap is not available
                        console.log('[GOOGLE-AUTH-SERVICE] One Tap not available, using popup...');
                        
                        // Create a temporary button for popup trigger
                        const tempDiv = document.createElement('div');
                        tempDiv.style.display = 'none';
                        document.body.appendChild(tempDiv);
                        
                        window.google.accounts.id.renderButton(tempDiv, {
                            theme: 'outline',
                            size: 'large',
                            type: 'standard'
                        });
                        
                        // Trigger click programmatically
                        const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
                        if (button) {
                            button.click();
                        }
                        
                        // Clean up
                        setTimeout(() => {
                            document.body.removeChild(tempDiv);
                        }, 100);
                    }
                });
                
            } catch (e) {
                console.error('[GOOGLE-AUTH-SERVICE] Error in signInWithPopup:', e);
                reject(e as Error);
            }
        });
    }
}

// Global instance
const googleAuthService = new GoogleAuthService();

// Export the service as default
export default googleAuthService;

// Export convenience function for backward compatibility
export const signInWithGoogle = async () => {
    try {
        const token = await googleAuthService.signInWithPopup();
        return { success: true, token };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

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