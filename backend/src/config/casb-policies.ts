import { CASBPolicy } from '../types';

export const defaultCASBPolicies: CASBPolicy[] = [
  {
    id: 'dlp-sensitive-data',
    name: '민감 데이터 유출 방지',
    type: 'dlp',
    enabled: true,
    severity: 'critical',
    rules: [
      {
        id: 'credit-card-detection',
        condition: 'content matches credit card pattern',
        action: 'block',
        description: '신용카드 번호 패턴 탐지 시 업로드 차단',
      },
      {
        id: 'ssn-detection',
        condition: 'content matches SSN pattern',
        action: 'block',
        description: '주민등록번호 패턴 탐지 시 업로드 차단',
      },
    ],
  },
  {
    id: 'file-type-control',
    name: '파일 형식 제어',
    type: 'access',
    enabled: true,
    severity: 'high',
    rules: [
      {
        id: 'executable-block',
        condition: 'file extension in [.exe, .bat, .scr, .com]',
        action: 'block',
        description: '실행 파일 업로드 차단',
      },
      {
        id: 'archive-scan',
        condition: 'file extension in [.zip, .rar, .7z]',
        action: 'warn',
        description: '압축 파일 업로드 시 추가 검사',
      },
    ],
  },
  {
    id: 'size-limit',
    name: '파일 크기 제한',
    type: 'access',
    enabled: true,
    severity: 'medium',
    rules: [
      {
        id: 'max-file-size',
        condition: 'file size > 100MB',
        action: 'block',
        description: '100MB 초과 파일 업로드 차단',
      },
    ],
  },
  {
    id: 'malware-protection',
    name: '악성코드 보호',
    type: 'threat',
    enabled: true,
    severity: 'critical',
    rules: [
      {
        id: 'virus-scan',
        condition: 'file contains malware signature',
        action: 'quarantine',
        description: '악성코드 탐지 시 격리',
      },
    ],
  },
];

// 위험한 파일 확장자 목록
export const DANGEROUS_EXTENSIONS = [
  '.exe',
  '.bat',
  '.cmd',
  '.com',
  '.scr',
  '.pif',
  '.vbs',
  '.js',
  '.jar',
];

// 허용된 파일 확장자 목록
export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.mp4',
  '.mp3',
];

// 민감 데이터 패턴
export const SENSITIVE_PATTERNS = {
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  ssn: /\b\d{6}[-\s]?\d{7}\b/g, // 한국 주민등록번호 패턴
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{3}[-\s]?\d{4}[-\s]?\d{4}\b/g,
};
