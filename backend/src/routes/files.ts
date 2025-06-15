import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileSecurityScanner } from '../utils/file-scanner';
import { promises as fs } from 'fs';

const router = express.Router();

// Multer 설정 (메모리 저장)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB (스캔 후 실제 제한 적용)
  },
  fileFilter: (req, file, cb) => {
    // 기본적인 파일 필터링 (실제 보안 검사는 스캔에서)
    console.log(
      `📁 File upload initiated: ${file.originalname} (${file.mimetype})`
    );
    cb(null, true);
  },
});

// 파일 업로드 엔드포인트
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: '파일이 업로드되지 않았습니다.',
      });
      return;
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const userId = req.body.userId || 'demo-user'; // 실제로는 인증에서 가져옴

    console.log(`🔍 Processing file upload: ${originalname} (${size} bytes)`);

    // 1. 보안 스캔 실행
    const scanReport = await FileSecurityScanner.scanFile(
      originalname,
      buffer,
      mimetype
    );

    if (scanReport.overallRisk === 'blocked') {
      console.log(`🚫 File blocked: ${originalname}`);

      // 보안 이벤트 로그 생성 (실제로는 DB에 저장)
      const securityEvent = {
        id: uuidv4(),
        timestamp: new Date(),
        type: 'file_upload_blocked',
        severity: 'high',
        userId,
        description: `파일 업로드 차단: ${originalname}`,
        details: scanReport,
      };

      res.status(403).json({
        success: false,
        message: '보안 정책에 의해 파일 업로드가 차단되었습니다.',
        scanReport,
        securityEvent,
      });
      return;
    }
    if (scanReport.overallRisk === 'quarantined') {
      console.log(`🔒 File quarantined: ${originalname}`);

      // 격리 폴더에 저장 (실제로는 별도 격리 시스템)
      const quarantineDir = path.join(__dirname, '../../quarantine');
      await fs.mkdir(quarantineDir, { recursive: true });

      const quarantineFileName = `${uuidv4()}_${originalname}`;
      await fs.writeFile(path.join(quarantineDir, quarantineFileName), buffer);

      res.status(202).json({
        success: false,
        message: '파일이 격리되었습니다. 관리자 검토가 필요합니다.',
        scanReport,
        quarantineId: quarantineFileName,
      });
      return;
    }

    // 3. 안전한 파일 저장
    const uploadsDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileId = uuidv4();
    const fileExtension = path.extname(originalname);
    const savedFileName = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadsDir, savedFileName);

    await fs.writeFile(filePath, buffer);

    // 4. 파일 메타데이터 생성 (실제로는 DB에 저장)
    const fileMetadata = {
      id: fileId,
      originalName: originalname,
      savedName: savedFileName,
      mimeType: mimetype,
      size,
      uploadedBy: userId,
      uploadedAt: new Date(),
      path: `/uploads/${savedFileName}`,
      scanReport,
      riskScore: scanReport.riskScore,
      status: scanReport.overallRisk,
    };

    console.log(
      `✅ File uploaded successfully: ${originalname} -> ${savedFileName}`
    );

    // 5. 경고가 있는 경우 알림
    if (scanReport.overallRisk === 'warning') {
      const warningEvent = {
        id: uuidv4(),
        timestamp: new Date(),
        type: 'file_upload_warning',
        severity: 'medium',
        userId,
        description: `파일 업로드 경고: ${originalname}`,
        details: scanReport,
      };

      // 실제로는 알림 시스템으로 전송
      console.log(`⚠️ Warning event generated for: ${originalname}`);
    }

    res.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      file: fileMetadata,
      scanReport,
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({
      success: false,
      message: '파일 업로드 중 오류가 발생했습니다.',
      error:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
});

// 파일 목록 조회
router.get('/', async (req, res) => {
  try {
    // 실제로는 DB에서 조회, 여기서는 Mock 데이터
    const files = [
      {
        id: '1',
        originalName: 'document.pdf',
        size: 1024 * 1024,
        uploadedAt: new Date(),
        uploadedBy: 'demo@company.com',
        riskScore: 15,
        status: 'safe',
      },
      {
        id: '2',
        originalName: 'suspicious.zip',
        size: 5 * 1024 * 1024,
        uploadedAt: new Date(),
        uploadedBy: 'demo@company.com',
        riskScore: 65,
        status: 'warning',
      },
    ];

    res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error('❌ Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: '파일 목록을 가져오는 중 오류가 발생했습니다.',
    });
  }
});

export default router;
