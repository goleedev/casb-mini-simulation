// Basic API response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  department: string;
  avatar?: string;
  lastLogin?: Date;
}

// File related types
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  path: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'blocked' | 'quarantined';
  scanResults?: ScanResult[];
}

export interface ScanResult {
  type: 'malware' | 'dlp' | 'policy';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
}

// Security event type
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type:
    | 'file_upload'
    | 'policy_violation'
    | 'threat_detected'
    | 'access_denied';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  description: string;
  resolved: boolean;
  details: any;
}

// Policy type
export interface SecurityPolicy {
  id: string;
  name: string;
  type: 'dlp' | 'access' | 'threat';
  enabled: boolean;
  description: string;
  rules: PolicyRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'allow' | 'block' | 'warn' | 'quarantine';
  description: string;
}

// Dashboard statistics type
export interface DashboardStats {
  totalFiles: number;
  threatsBlocked: number;
  activePolicies: number;
  riskScore: number;
  recentEvents: SecurityEvent[];
  fileTypeDistribution: { type: string; count: number }[];
  threatTrends: { date: string; count: number }[];
}
