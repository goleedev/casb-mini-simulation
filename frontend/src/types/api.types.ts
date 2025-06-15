// API 응답 기본 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  department: string;
  avatar?: string;
  lastLogin?: Date;
}

// 파일 관련 타입
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

// 보안 이벤트 타입
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

// 정책 타입
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

// 대시보드 통계 타입
export interface DashboardStats {
  totalFiles: number;
  threatsBlocked: number;
  activePolicies: number;
  riskScore: number;
  recentEvents: SecurityEvent[];
  fileTypeDistribution: { type: string; count: number }[];
  threatTrends: { date: string; count: number }[];
}
