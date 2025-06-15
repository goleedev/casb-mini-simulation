import path from 'path';
import {
  DANGEROUS_EXTENSIONS,
  ALLOWED_EXTENSIONS,
  SENSITIVE_PATTERNS,
} from '../config/casb-policies';

export interface ScanResult {
  type: 'malware' | 'dlp' | 'policy' | 'fileType';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  action: 'allow' | 'warn' | 'block' | 'quarantine';
}

export interface FileScanReport {
  fileName: string;
  fileSize: number;
  mimeType: string;
  scanResults: ScanResult[];
  overallRisk: 'safe' | 'warning' | 'blocked' | 'quarantined';
  riskScore: number; // 0-100
  scanDuration: number;
}

export class FileSecurityScanner {
  /**
   * Execute comprehensive file security scan
   */
  static async scanFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<FileScanReport> {
    const startTime = Date.now();
    const scanResults: ScanResult[] = [];

    console.log(`🔍 Starting security scan for: ${fileName}`);

    // 1. File extension check
    const extensionResult = this.scanFileExtension(fileName);
    if (extensionResult) scanResults.push(extensionResult);

    // 2. File size check
    const sizeResult = this.scanFileSize(fileName, fileBuffer.length);
    if (sizeResult) scanResults.push(sizeResult);

    // 3. MIME type check
    const mimeResult = this.scanMimeType(fileName, mimeType);
    if (mimeResult) scanResults.push(mimeResult);

    // 4. Malware simulation (actual environment would use real scanning)
    const malwareResult = await this.simulateMalwareScan(fileName, fileBuffer);
    if (malwareResult) scanResults.push(malwareResult);

    // 5. DLP scan (sensitive data detection)
    const dlpResult = await this.scanSensitiveData(fileName, fileBuffer);
    if (dlpResult) scanResults.push(dlpResult);

    // 6. Calculate overall risk
    const { overallRisk, riskScore } = this.calculateRiskScore(scanResults);

    const scanDuration = Date.now() - startTime;

    console.log(
      `✅ Scan completed for ${fileName}: ${overallRisk} (${riskScore}/100) in ${scanDuration}ms`
    );

    return {
      fileName,
      fileSize: fileBuffer.length,
      mimeType,
      scanResults,
      overallRisk,
      riskScore,
      scanDuration,
    };
  }

  /**
   * File extension validation
   */
  private static scanFileExtension(fileName: string): ScanResult | null {
    const ext = path.extname(fileName).toLowerCase();

    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      return {
        type: 'fileType',
        severity: 'critical',
        message: `Dangerous file extension detected: ${ext}`,
        details: { extension: ext, category: 'executable' },
        action: 'block',
      };
    }

    if (!ALLOWED_EXTENSIONS.includes(ext) && ext !== '') {
      return {
        type: 'fileType',
        severity: 'medium',
        message: `Unauthorized file extension: ${ext}`,
        details: { extension: ext, category: 'unknown' },
        action: 'warn',
      };
    }

    return null;
  }

  /**
   * File size validation
   */
  private static scanFileSize(
    fileName: string,
    size: number
  ): ScanResult | null {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const warningSize = 50 * 1024 * 1024; // 50MB

    if (size > maxSize) {
      return {
        type: 'policy',
        severity: 'high',
        message: `File size limit exceeded: ${(size / 1024 / 1024).toFixed(
          2
        )}MB`,
        details: { size, maxSize, category: 'size_limit' },
        action: 'block',
      };
    }

    if (size > warningSize) {
      return {
        type: 'policy',
        severity: 'medium',
        message: `Large file size warning: ${(size / 1024 / 1024).toFixed(
          2
        )}MB`,
        details: { size, warningSize, category: 'size_warning' },
        action: 'warn',
      };
    }

    return null;
  }

  /**
   * MIME type validation
   */
  private static scanMimeType(
    fileName: string,
    mimeType: string
  ): ScanResult | null {
    const dangerousMimes = [
      'application/x-executable',
      'application/x-msdownload',
      'application/x-msdos-program',
      'application/octet-stream',
    ];

    if (dangerousMimes.includes(mimeType)) {
      return {
        type: 'fileType',
        severity: 'high',
        message: `Dangerous MIME type detected: ${mimeType}`,
        details: { mimeType, category: 'dangerous_mime' },
        action: 'block',
      };
    }

    return null;
  }

  /**
   * Malware scan simulation
   */
  private static async simulateMalwareScan(
    fileName: string,
    fileBuffer: Buffer
  ): Promise<ScanResult | null> {
    // In production environment, use ClamAV, VirusTotal API, etc.

    // Simulation: Determine malware based on specific patterns or file names
    const suspiciousPatterns = [
      'virus',
      'malware',
      'trojan',
      'backdoor',
      'keylogger',
      'ransomware',
      'spyware',
      'adware',
      'rootkit',
    ];

    const fileContent = fileBuffer.toString(
      'utf8',
      0,
      Math.min(1024, fileBuffer.length)
    );
    const lowerFileName = fileName.toLowerCase();

    for (const pattern of suspiciousPatterns) {
      if (
        lowerFileName.includes(pattern) ||
        fileContent.toLowerCase().includes(pattern)
      ) {
        return {
          type: 'malware',
          severity: 'critical',
          message: `Malware pattern detected: ${pattern}`,
          details: {
            pattern,
            detection_method: 'signature',
            engine: 'CASB_Simulator',
          },
          action: 'quarantine',
        };
      }
    }

    // Random 5% chance for suspicious file detection (simulation)
    if (Math.random() < 0.05) {
      return {
        type: 'malware',
        severity: 'medium',
        message: 'Suspicious file pattern detected',
        details: {
          confidence: 0.7,
          detection_method: 'heuristic',
          engine: 'CASB_Simulator',
        },
        action: 'warn',
      };
    }

    return null;
  }

  /**
   * Sensitive data scan (DLP)
   */
  private static async scanSensitiveData(
    fileName: string,
    fileBuffer: Buffer
  ): Promise<ScanResult | null> {
    try {
      // Scan only text-based files (PDF, DOC would need separate parsing in production)
      const content = fileBuffer.toString('utf8');
      const findings: string[] = [];

      // Credit card number detection
      const creditCardMatches = content.match(SENSITIVE_PATTERNS.creditCard);
      if (creditCardMatches) {
        findings.push(
          `${creditCardMatches.length} credit card number(s) detected`
        );
      }

      // Social Security Number detection
      const ssnMatches = content.match(SENSITIVE_PATTERNS.ssn);
      if (ssnMatches) {
        findings.push(`${ssnMatches.length} SSN(s) detected`);
      }

      // Email address detection (often not sensitive but for demonstration)
      const emailMatches = content.match(SENSITIVE_PATTERNS.email);
      if (emailMatches && emailMatches.length > 10) {
        findings.push(`${emailMatches.length} bulk email addresses detected`);
      }

      if (findings.length > 0) {
        const severity =
          creditCardMatches || ssnMatches ? 'critical' : 'medium';
        return {
          type: 'dlp',
          severity,
          message: `Sensitive data detected: ${findings.join(', ')}`,
          details: { findings, patterns_matched: findings.length },
          action: severity === 'critical' ? 'block' : 'warn',
        };
      }
    } catch (error) {
      // Ignore text conversion failures for binary files
      console.log(`ℹ️ Could not scan file content for DLP: ${fileName}`);
    }

    return null;
  }

  /**
   * Calculate overall risk score
   */
  private static calculateRiskScore(scanResults: ScanResult[]): {
    overallRisk: 'safe' | 'warning' | 'blocked' | 'quarantined';
    riskScore: number;
  } {
    if (scanResults.length === 0) {
      return { overallRisk: 'safe', riskScore: 0 };
    }

    let totalScore = 0;
    let hasBlock = false;
    let hasQuarantine = false;

    for (const result of scanResults) {
      // Assign scores based on severity
      switch (result.severity) {
        case 'critical':
          totalScore += 40;
          break;
        case 'high':
          totalScore += 25;
          break;
        case 'medium':
          totalScore += 15;
          break;
        case 'low':
          totalScore += 5;
          break;
      }

      // Final decision based on action
      if (result.action === 'quarantine') hasQuarantine = true;
      if (result.action === 'block') hasBlock = true;
    }

    // Cap at 100 points
    const riskScore = Math.min(totalScore, 100);

    // Final risk determination
    let overallRisk: 'safe' | 'warning' | 'blocked' | 'quarantined';

    if (hasQuarantine) {
      overallRisk = 'quarantined';
    } else if (hasBlock) {
      overallRisk = 'blocked';
    } else if (riskScore > 20) {
      overallRisk = 'warning';
    } else {
      overallRisk = 'safe';
    }

    return { overallRisk, riskScore };
  }
}
