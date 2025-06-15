// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  department: string;
  createdAt: Date;
}

// File metadata
export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  path: string;
  sharingLevel: 'private' | 'internal' | 'public';
  tags: string[];
}

// CASB policy
export interface CASBPolicy {
  id: string;
  name: string;
  type: 'dlp' | 'access' | 'threat' | 'compliance';
  enabled: boolean;
  rules: PolicyRule[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'block' | 'warn' | 'log' | 'quarantine';
  description: string;
}

// Security event
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  policyId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  resolved: boolean;
}

// Activity log
export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'upload' | 'download' | 'share' | 'delete' | 'view';
  resourceId: string;
  resourceType: 'file' | 'folder' | 'app';
  ipAddress: string;
  userAgent: string;
  successful: boolean;
}
