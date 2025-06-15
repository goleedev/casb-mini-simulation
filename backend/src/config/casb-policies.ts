import { CASBPolicy } from '../types';

export const defaultCASBPolicies: CASBPolicy[] = [
  {
    id: 'dlp-sensitive-data',
    name: 'Sensitive Data Loss Prevention',
    type: 'dlp',
    enabled: true,
    severity: 'critical',
    rules: [
      {
        id: 'credit-card-detection',
        condition: 'content matches credit card pattern',
        action: 'block',
        description: 'Block upload when credit card number pattern is detected',
      },
      {
        id: 'ssn-detection',
        condition: 'content matches SSN pattern',
        action: 'block',
        description:
          'Block upload when Social Security Number pattern is detected',
      },
    ],
  },
  {
    id: 'file-type-control',
    name: 'File Type Control',
    type: 'access',
    enabled: true,
    severity: 'high',
    rules: [
      {
        id: 'executable-block',
        condition: 'file extension in [.exe, .bat, .scr, .com]',
        action: 'block',
        description: 'Block executable file uploads',
      },
      {
        id: 'archive-scan',
        condition: 'file extension in [.zip, .rar, .7z]',
        action: 'warn',
        description: 'Additional scanning for archive file uploads',
      },
    ],
  },
  {
    id: 'size-limit',
    name: 'File Size Limit',
    type: 'access',
    enabled: true,
    severity: 'medium',
    rules: [
      {
        id: 'max-file-size',
        condition: 'file size > 100MB',
        action: 'block',
        description: 'Block files exceeding 100MB',
      },
    ],
  },
  {
    id: 'malware-protection',
    name: 'Malware Protection',
    type: 'threat',
    enabled: true,
    severity: 'critical',
    rules: [
      {
        id: 'virus-scan',
        condition: 'file contains malware signature',
        action: 'quarantine',
        description: 'Quarantine when malware is detected',
      },
    ],
  },
];

// List of dangerous file extensions
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

// List of allowed file extensions
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

// Sensitive data patterns
export const SENSITIVE_PATTERNS = {
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  ssn: /\b\d{6}[-\s]?\d{7}\b/g, // Korean SSN pattern
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{3}[-\s]?\d{4}[-\s]?\d{4}\b/g,
};
