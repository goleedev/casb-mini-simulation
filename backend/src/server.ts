import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fileRoutes from './routes/files';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000', // React 개발 서버
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 업로드된 파일을 위한 정적 폴더
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 기본 라우트
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CASB Simulation Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 라우터 연결 (나중에 추가)
// app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
// app.use('/api/policies', policyRoutes);
// app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
