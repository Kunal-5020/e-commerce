// lib/api.ts
import { auth } from '../components/firebase/firebase';

export const BASE_API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
    body?: string;
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<any> => {
    const user = auth ? auth.currentUser : null;

    if (!user) {
        console.warn('Attempted authenticated fetch without a logged-in Firebase user (for demo purposes).');
        // For a demo, you might still proceed or throw an error.
        // Throwing an error is safer practice even for demos if the route truly requires a user.
        throw new Error('Authentication required for this demo feature: No user logged in.');
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // No Authorization header needed as backend trusts raw data
    // If you want to send UID/Email in headers for some reason:
    (headers as Record<string, string>)['X-Firebase-UID'] = user.uid;
    // (headers as Record<string, string>)['X-Firebase-Email'] = user.email || '';


    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};