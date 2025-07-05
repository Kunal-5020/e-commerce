// lib/api.ts
import { auth } from '../components/firebase/firebase'; 

// --- API Base URL (REPLACE WITH YOUR BACKEND URL) ---
export const BASE_API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
    body?: string;
}

// Function to fetch data from the backend with authentication
export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<any> => {
    const user = auth ? auth.currentUser : null;
    let idToken: string | null = null;

    if (user) {
        idToken = await user.getIdToken();
    }
    // console.log(idToken);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (idToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${idToken}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};
