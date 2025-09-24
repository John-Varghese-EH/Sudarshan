
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-threat-message.ts';
import '@/ai/flows/flag-message-for-review.ts';
import '@/ai/flows/drug-awareness-chatbot.ts';
import '@/ai/flows/analyze-web-text.ts';
import '@/ai/flows/moderate-community-post.ts';
import '@/ai/flows/batch-moderate-community-posts.ts';
import '@/ai/flows/proxy-fetch.ts';
    

    
