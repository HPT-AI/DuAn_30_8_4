// Google OAuth service for frontend

interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
}

interface GoogleAuthResponse {
    credential: string;
    select_by: string;
}

class GoogleAuthService {
    private clientId: string;
    private isInitialized: boolean = false;

    constructor() {
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
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

    // Use Google Identity Services to obtain an ID token in the browser
    await this.initialize();

    return new Promise((resolve, reject) => {
        try {
            this.renderSignInButton(
            (credential: string) => {
                console.log('[GOOGLE-AUTH-SERVICE] Received credential from GIS');
                resolve(credential);
            },
            (error: Error) => {
                console.error('[GOOGLE-AUTH-SERVICE] GIS sign-in error:', error);
                reject(error);
            }
            );
        } catch (e) {
            reject(e as Error);
        }
      });
    }

    private renderSignInButton(
        onSuccess: (credential: string) => void,
        onError: (error: Error) => void
        ): void {
        const container = document.createElement('div');
        container.id = 'google-signin-button-temp';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '10000';
        container.style.backgroundColor = 'white';
        container.style.padding = '20px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(container);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
        document.body.removeChild(container);
        onError(new Error('User cancelled sign-in'));
        };
        container.appendChild(closeButton);

        const title = document.createElement('h3');
        title.textContent = 'Đăng nhập với Google';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        container.appendChild(title);

    // Render Google Sign-In button
    window.google.accounts.id.initialize({
    client_id: this.clientId,
    callback: (response: GoogleAuthResponse) => {
        document.body.removeChild(container);
        onSuccess(response.credential);
    },
});

window.google.accounts.id.renderButton(container, {
  theme: 'outline',
  size: 'large',
  text: 'signin_with',
  shape: 'rectangular',
  logo_alignment: 'left',
});
    }

    async signInWithCredential(token: string): Promise<any> {
        console.log('[GOOGLE-AUTH-SERVICE] Processing token from OAuth callback...');
        console.log('[GOOGLE-AUTH-SERVICE] Token received:', !!token);
        return { access_token: token, token_type: 'bearer' };
    }

    decodeJWT(token: string): GoogleUser | null {
        try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
        );

        const payload = JSON.parse(jsonPayload);
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
        } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
        }
    }
}

// Global type declarations
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (callback?: (notification: any) => void) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

export const googleAuthService = new GoogleAuthService();

// Convenience function for sign in with Google
export async function signInWithGoogle(): Promise<{
    success: boolean;
    token?: string;
    error?: string;
}> {
  try {
      console.log('[GOOGLE-AUTH] Starting Google sign-in process...');
      console.log('[GOOGLE-AUTH] Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Set' : 'Not set');

      console.log('[GOOGLE-AUTH] Calling signInWithPopup...');
      const credential = await googleAuthService.signInWithPopup();
      console.log('[GOOGLE-AUTH] Received credential:', credential ? 'Yes' : 'No');

      console.log('[GOOGLE-AUTH] Sending credential to backend...');
      const result = await googleAuthService.signInWithCredential(credential);
      console.log('[GOOGLE-AUTH] Backend response:', result);

      return { success: true, token: result.access_token || result.token };
  } 
  catch (error) {
      console.error('[GOOGLE-AUTH] Google sign-in failed:', error);
      console.error('[GOOGLE-AUTH] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export type { GoogleUser, GoogleAuthResponse };