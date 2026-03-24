// API Key entity type definitions
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  scopes: string[];
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PrismaApiKey = ApiKey;
