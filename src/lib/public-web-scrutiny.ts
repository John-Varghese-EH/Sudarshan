
/**
 * @fileoverview Functions for public web scrutiny to detect phishing sites and unsafe links.
 */

const SAFE_BROWSING_API_KEY = process.env.NEXT_PUBLIC_SAFE_BROWSING_API_KEY;
const SAFE_BROWSING_API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;

/**
 * Checks if a URL is safe using the Google Safe Browsing API.
 * @param url The URL to check.
 * @returns A promise that resolves with a boolean indicating if the URL is safe.
 */
export const isUrlSafe = async (url: string): Promise<boolean> => {
  if (!SAFE_BROWSING_API_KEY) {
    console.warn('Safe Browsing API key not found. URL safety check will be skipped.');
    // In a real app, you might want to handle this more gracefully.
    return true;
  }

  try {
    const response = await fetch(SAFE_BROWSING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: {
          clientId: 'sudarshan-app',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      }),
    });

    const data = await response.json();
    return !data.matches;
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return false;
  }
};

/**
 * Checks for unsafe redirects for a given URL.
 * This is a simplified implementation.
 * @param url The URL to check.
 * @returns A promise that resolves with a boolean indicating if the redirects are safe.
 */
export const checkRedirects = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      if (location) {
        return isUrlSafe(location);
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking redirects:', error);
    return false;
  }
};
