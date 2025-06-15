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
   * 파일 전체 보안 스캔 실행
   */
  static async scanFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<FileScanReport> {
    const startTime = Date.now();
    const scanResults: ScanResult[] = [];

    console.log(`🔍 Starting security scan for: ${fileName}`);

    // 1. 파일 확장자 검사
    const extensionResult = this.scanFileExtension(fileName);
    if (extensionResult) scanResults.push(extensionResult);

    // 2. 파일 크기 검사
    const sizeResult = this.scanFileSize(fileName, fileBuffer.length);
    if (sizeResult) scanResults.push(sizeResult);

    // 3. MIME 타입 검사
    const mimeResult = this.scanMimeType(fileName, mimeType);
    if (mimeResult) scanResults.push(mimeResult);

    // 4. 악성코드 시뮬레이션 (실제 환경에서는 실제 스캔)
    const malwareResult = await this.simulateMalwareScan(fileName, fileBuffer);
    if (malwareResult) scanResults.push(malwareResult);

    // 5. DLP 스캔 (민감 데이터 탐지)
    const dlpResult = await this.scanSensitiveData(fileName, fileBuffer);
    if (dlpResult) scanResults.push(dlpResult);

    // 6. 전체 위험도 계산
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
   * 파일 확장자 검사
   */
  private static scanFileExtension(fileName: string): ScanResult | null {
    const ext = path.extname(fileName).toLowerCase();

    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      return {
        type: 'fileType',
        severity: 'critical',
        message: `위험한 파일 확장자 탐지: ${ext}`,
        details: { extension: ext, category: 'executable' },
        action: 'block',
      };
    }

    if (!ALLOWED_EXTENSIONS.includes(ext) && ext !== '') {
      return {
        type: 'fileType',
        severity: 'medium',
        message: `허용되지 않은 파일 확장자: ${ext}`,
        details: { extension: ext, category: 'unknown' },
        action: 'warn',
      };
    }

    return null;
  }

  /**
   * 파일 크기 검사
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
        message: `파일 크기 제한 초과: ${(size / 1024 / 1024).toFixed(2)}MB`,
        details: { size, maxSize, category: 'size_limit' },
        action: 'block',
      };
    }

    if (size > warningSize) {
      return {
        type: 'policy',
        severity: 'medium',
        message: `큰 파일 크기 경고: ${(size / 1024 / 1024).toFixed(2)}MB`,
        details: { size, warningSize, category: 'size_warning' },
        action: 'warn',
      };
    }

    return null;
  }

  /**
   * MIME 타입 검사
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
        message: `위험한 MIME 타입 탐지: ${mimeType}`,
        details: { mimeType, category: 'dangerous_mime' },
        action: 'block',
      };
    }

    return null;
  }

  /**
   * 악성코드 스캔 시뮬레이션
   */
  private static async simulateMalwareScan(
    fileName: string,
    fileBuffer: Buffer
  ): Promise<ScanResult | null> {
    // 실제 환경에서는 ClamAV, VirusTotal API 등을 사용

    // 시뮬레이션: 특정 패턴이나 파일명으로 악성코드 판단
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
          message: `악성코드 패턴 탐지: ${pattern}`,
          details: {
            pattern,
            detection_method: 'signature',
            engine: 'CASB_Simulator',
          },
          action: 'quarantine',
        };
      }
    }

    // 랜덤하게 5% 확률로 의심스러운 파일 판정 (시뮬레이션)
    if (Math.random() < 0.05) {
      return {
        type: 'malware',
        severity: 'medium',
        message: '의심스러운 파일 패턴 탐지',
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
   * 민감 데이터 스캔 (DLP)
   */
  private static async scanSensitiveData(
    fileName: string,
    fileBuffer: Buffer
  ): Promise<ScanResult | null> {
    try {
      // 텍스트 기반 파일만 스캔 (PDF, DOC 등은 실제로는 별도 파싱 필요)
      const content = fileBuffer.toString('utf8');
      const findings: string[] = [];

      // 신용카드 번호 탐지
      const creditCardMatches = content.match(SENSITIVE_PATTERNS.creditCard);
      if (creditCardMatches) {
        findings.push(`신용카드 번호 ${creditCardMatches.length}개 탐지`);
      }

      // 주민등록번호 탐지
      const ssnMatches = content.match(SENSITIVE_PATTERNS.ssn);
      if (ssnMatches) {
        findings.push(`주민등록번호 ${ssnMatches.length}개 탐지`);
      }

      // 이메일 주소 탐지 (많은 경우 민감하지 않지만 예시용)
      const emailMatches = content.match(SENSITIVE_PATTERNS.email);
      if (emailMatches && emailMatches.length > 10) {
        findings.push(`대량 이메일 주소 ${emailMatches.length}개 탐지`);
      }

      if (findings.length > 0) {
        const severity =
          creditCardMatches || ssnMatches ? 'critical' : 'medium';
        return {
          type: 'dlp',
          severity,
          message: `민감 데이터 탐지: ${findings.join(', ')}`,
          details: { findings, patterns_matched: findings.length },
          action: severity === 'critical' ? 'block' : 'warn',
        };
      }
    } catch (error) {
      // 바이너리 파일 등 텍스트 변환 실패 시 무시
      console.log(`ℹ️ Could not scan file content for DLP: ${fileName}`);
    }

    return null;
  }

  /**
   * 전체 위험도 점수 계산
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
      // 심각도에 따른 점수 부여
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

      // 액션에 따른 최종 판정
      if (result.action === 'quarantine') hasQuarantine = true;
      if (result.action === 'block') hasBlock = true;
    }

    // 최대 100점으로 제한
    const riskScore = Math.min(totalScore, 100);

    // 최종 위험도 판정
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
