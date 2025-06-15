import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileSecurityScanner } from '../utils/file-scanner';
import { promises as fs } from 'fs';

const router = express.Router();

// Multer configuration (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB (actual limit applied after scanning)
  },
  fileFilter: (req, file, cb) => {
    // Basic file filtering (actual security checks in scanner)
    console.log(
      `📁 File upload initiated: ${file.originalname} (${file.mimetype})`
    );
    cb(null, true);
  },
});

// File upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file was uploaded.',
      });
      return;
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const userId = req.body.userId || 'demo-user'; // In production, get from authentication

    console.log(`🔍 Processing file upload: ${originalname} (${size} bytes)`);

    // 1. Execute security scan
    const scanReport = await FileSecurityScanner.scanFile(
      originalname,
      buffer,
      mimetype
    );

    if (scanReport.overallRisk === 'blocked') {
      console.log(`🚫 File blocked: ${originalname}`);

      // Generate security event log (in production, save to DB)
      const securityEvent = {
        id: uuidv4(),
        timestamp: new Date(),
        type: 'file_upload_blocked',
        severity: 'high',
        userId,
        description: `File upload blocked: ${originalname}`,
        details: scanReport,
      };

      res.status(403).json({
        success: false,
        message: 'File upload blocked by security policy.',
        scanReport,
        securityEvent,
      });
      return;
    }

    if (scanReport.overallRisk === 'quarantined') {
      console.log(`🔒 File quarantined: ${originalname}`);

      // Save to quarantine folder (in production, use separate quarantine system)
      const quarantineDir = path.join(__dirname, '../../quarantine');
      await fs.mkdir(quarantineDir, { recursive: true });

      const quarantineFileName = `${uuidv4()}_${originalname}`;
      await fs.writeFile(path.join(quarantineDir, quarantineFileName), buffer);

      res.status(202).json({
        success: false,
        message: 'File has been quarantined. Administrator review required.',
        scanReport,
        quarantineId: quarantineFileName,
      });
      return;
    }

    // 3. Save safe file
    const uploadsDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileId = uuidv4();
    const fileExtension = path.extname(originalname);
    const savedFileName = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadsDir, savedFileName);

    await fs.writeFile(filePath, buffer);

    // 4. Generate file metadata (in production, save to DB)
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

    // 5. Generate warning notification if needed
    if (scanReport.overallRisk === 'warning') {
      const warningEvent = {
        id: uuidv4(),
        timestamp: new Date(),
        type: 'file_upload_warning',
        severity: 'medium',
        userId,
        description: `File upload warning: ${originalname}`,
        details: scanReport,
      };

      // In production, send to notification system
      console.log(`⚠️ Warning event generated for: ${originalname}`);
    }

    res.json({
      success: true,
      message: 'File uploaded successfully.',
      file: fileMetadata,
      scanReport,
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during file upload.',
      error:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
});

// Get file list
router.get('/', async (req, res) => {
  try {
    // In production, query from database; here using mock data
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
      message: 'An error occurred while fetching file list.',
    });
  }
});

export default router;
