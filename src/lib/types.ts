
export type ThreatLevel = 'low' | 'medium' | 'high';

export interface ThreatMessage {
  id: string;
  timestamp: Date;
  senderId: string;
  message: string;
  threatLevel: ThreatLevel;
  keywords: string[];
  patterns: string[];
  reason: string;
  warrantsReview: boolean;
}

export interface CommunityPost {
    id: string;
    author: string;
    avatarUrl: string;
    timestamp: Date;
    content: string;
    likes: number;
    dislikes: number;
    comments: number;
    isFlagged?: boolean;
}
