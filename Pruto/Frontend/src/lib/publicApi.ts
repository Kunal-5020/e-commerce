// lib/publicApi.ts
export const BASE_API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
    body?: string;
}

// Function to fetch public data from the backend without authentication
export const fetchPublic = async (url: string, options: FetchOptions = {}): Promise<any> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        // You might want more specific error handling here for public fetches
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};