/**
 * @fileOverview A simulated OSINT service for fetching suspicious keywords.
 * In a real-world scenario, this service would scrape or query external OSINT sources.
 */

export type ThreatKeywords = {
  high: string[];
  medium: string[];
  low: string[];
};

// Keywords are embedded here to ensure they are available in serverless environments.
const allKeywords = [
    'fraud', 'scam', 'bitcoin', 'phishing', 'malware', 'darknet', 'crypto', 'untraceable', 
    'laundering', 'weed', 'ganja', 'marijuana', 'cannabis', 'hash', 'charas', 'bhang', 
    'joint', 'dope', 'pot', 'grass', 'herb', '420', 'stuff', 'smoke', 'trip', 'acid', 'lsd', 
    'tabs', 'blotter', 'mushrooms', 'shrooms', 'magic', 'psychedelic', 'mdma', 'ecstasy', 
    'xtc', 'molly', 'party pills', 'amphetamine', 'speed', 'coke', 'cocaine', 'crack', 'blow', 
    'powder', 'line', 'snow', 'smack', 'brown sugar', 'heroin', 'gear', 'fix', 'inject', 
    'oxy', 'oxycodone', 'oxycontin', 'perk', 'percs', 'hydro', 'hydrocodone', 'fentanyl', 
    'benzo', 'valium', 'diazepam', 'xanax', 'bars', 'alprazolam', 'ket', 'ketamine', 
    'special k', 'meth', 'crystal', 'ice', 'shard', 'methamphetamine', 'adderall', 'ritalin', 
    'pillz', 'script', 'prescription', 'dose', 'high', 'stash', 'supply', 'plug', 'connect', 
    'dealer', 'drop', 'reship', 'stealth', 'pack', 'shipping', 'delivery', 'paytm', 'upi', 
    'btc', 'bitcoin', 'crypto', 'darknet', 'telegram', 'whatsapp', 'wickr', 'discord', 
    'dm for price', 'cheap', 'bulk', 'wholesale'
];


/**
 * Fetches suspicious keywords from a simulated OSINT source.
 * @returns {Promise<ThreatKeywords>} A promise that resolves to an object containing high, medium, and low risk keywords.
 */
export async function getSuspiciousKeywords(): Promise<ThreatKeywords> {
  // In a real application, this would involve web scraping or API calls to OSINT sources.
  // For this demo, we're returning a static list to simulate the functionality.
  console.log('Fetching keywords from simulated OSINT source...');
  return Promise.resolve({
    high: ['coke', 'heroin', 'meth', 'untraceable', 'kilo', 'laundering', 'darknet', 'trafficking', 'fentanyl', 'cocaine', 'smack'],
    medium: ['pills', 'molly', 'acid', 'powder', 'grams', 'shipment', 'meetup', 'crypto', 'burner phone', 'xanax', 'oxycodone'],
    low: ['green', 'smoke', 'edibles', 'party pack', '420', 'oz', 'delivery', 'drop', 'vendor', 'stuff', 'ganja', 'weed'],
  });
}

/**
 * Returns all keywords for analysis.
 * @returns {string[]} An array of all keywords.
 */
export function getAllKeywords(): string[] {
    return allKeywords;
}
