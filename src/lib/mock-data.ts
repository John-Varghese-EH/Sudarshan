
import type { ThreatMessage, ThreatLevel, CommunityPost } from './types';
import { subMinutes, subSeconds, subHours, subDays } from 'date-fns';

const keywords = {
  high: ['coke', 'heroin', 'meth', 'untraceable', 'drop point', 'kilo', 'laundering'],
  medium: ['pills', 'molly', 'acid', 'powder', 'grams', 'shipment', 'meetup', 'crypto'],
  low: ['green', 'smoke', 'edibles', 'party pack', '420', 'oz', 'delivery'],
};

const senders = Array.from({ length: 20 }, (_, i) => `user_${Math.random().toString(36).substring(2, 9)}`);

const templates = [
  'Can you supply {quantity} of {drug}? Need it by tomorrow.',
  'The package has been delivered to the usual {location}. Payment sent via {payment}.',
  'Is the new {drug} shipment in? Looking for top quality.',
  'Let\'s meet at {location}. I have the {payment}. Don\'t be late.',
  'Need something for the weekend party. Got any {drug}?',
  'The quality of the last batch of {drug} was excellent. Need more.',
];

const locations = ['spot', 'location', 'drop point', 'address'];
const payments = ['cash', 'crypto', 'wire transfer'];
const quantities = ['a few grams', 'an oz', 'a kilo', 'a small batch'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateMockMessage = (): Omit<ThreatMessage, 'id' | 'timestamp'> => {
  const levelProb = Math.random();
  const threatLevel: ThreatLevel = levelProb > 0.9 ? 'high' : levelProb > 0.6 ? 'medium' : 'low';
  
  const drug = getRandomElement(keywords[threatLevel]);
  let template = getRandomElement(templates);

  let message = template
    .replace('{quantity}', getRandomElement(quantities))
    .replace('{drug}', drug)
    .replace('{location}', getRandomElement(locations))
    .replace('{payment}', getRandomElement(payments));

  const identifiedKeywords = keywords[threatLevel].filter(kw => message.includes(kw));

  return {
    senderId: getRandomElement(senders),
    message,
    threatLevel,
    keywords: identifiedKeywords,
    patterns: ['Encrypted communication', 'Use of slang'],
    reason: `Message contains keywords related to illicit substances ('${identifiedKeywords.join("', '")}') and discusses transaction details.`,
    warrantsReview: threatLevel !== 'low',
  };
};

export const generateNewMessage = (): ThreatMessage => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: subSeconds(new Date(), Math.floor(Math.random() * 30)),
    ...generateMockMessage(),
  };
};

export const generateInitialMessages = (count = 50): ThreatMessage[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Math.random().toString(36).substring(2, 15),
    timestamp: subMinutes(new Date(), i * 5 + Math.random() * 5),
    ...generateMockMessage(),
  }));
};


// Community Posts Mock Data
const communityAuthors = [
    { name: 'Aarav Sharma', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Priya Patel', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Rohan Gupta', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Name Hidden', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Vikram Singh', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Isha Reddy', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Anonymous User', avatar: 'https://placehold.co/100x100.png' },
    { name: 'Suresh Kumar', avatar: 'https://placehold.co/100x100.png' },
];

const safePostContent = [
    "Just a reminder to everyone: always verify the source before clicking on links. Phishing attempts are getting more sophisticated.",
    "Has anyone seen an increase in spear-phishing emails targeting financial departments? We've had a few slip past our filters.",
    "What are your thoughts on the latest zero-day vulnerability? The patch seems straightforward, but the potential impact is huge.",
    "Looking for recommendations on a good open-source intelligence (OSINT) tool for tracking social media.",
    "Great discussion in the 'Advanced Persistent Threats' channel today. Learned a lot about new TTPs.",
];

const harmfulPostContent = [
    "I need to get a package to a client without it being tracked. DM me for untraceable delivery options, payment in crypto only.",
    "Anyone know a reliable vendor for high-quality party pills? My usual guy is out. Not looking for scams.",
    "The 'green' from my last delivery was top-notch. Looking to get a bigger batch this time, maybe an oz or two.",
    "The darknet market is a joke. Let's start our own private group. Who's in? We can use this app to coordinate drops.",
    "Selling bulk Xanax bars and other prescription meds. Cheap prices, stealth shipping guaranteed. Message me for the full menu.",
];

export const generateCommunityPosts = (count: number): CommunityPost[] => {
    const posts: CommunityPost[] = [];
    for (let i = 0; i < count; i++) {
        const author = getRandomElement(communityAuthors);
        const isHarmful = Math.random() < 0.25; // 25% chance of being a harmful post
        const content = isHarmful ? getRandomElement(harmfulPostContent) : getRandomElement(safePostContent);
        
        posts.push({
            id: `post-${i}-${Math.random().toString(36).substring(2, 9)}`,
            author: author.name,
            avatarUrl: author.avatar,
            timestamp: subHours(new Date(), i * 2 + Math.random() * 5),
            content,
            likes: Math.floor(Math.random() * 150),
            dislikes: Math.floor(Math.random() * 20),
            comments: Math.floor(Math.random() * 40),
        });
    }
    return posts;
};
