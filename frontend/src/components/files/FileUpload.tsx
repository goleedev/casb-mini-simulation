import React, { useState } from 'react';
import {
  Paper,
  Text,
  Button,
  Progress,
  Alert,
  Badge,
  Group,
  Stack,
  Title,
  List,
  ThemeIcon,
  Timeline,
  Card,
  Divider,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import {
  IconUpload,
  IconX,
  IconFile,
  IconCheck,
  IconAlertTriangle,
  IconShieldX,
  IconShieldCheck,
  IconClock,
  IconScan,
} from '@tabler/icons-react';
import { api } from '../../services/api';

interface ScanResult {
  type: 'malware' | 'dlp' | 'policy' | 'fileType';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  action: 'allow' | 'warn' | 'block' | 'quarantine';
}

interface FileScanReport {
  fileName: string;
  fileSize: number;
  mimeType: string;
  scanResults: ScanResult[];
  overallRisk: 'safe' | 'warning' | 'blocked' | 'quarantined';
  riskScore: number;
  scanDuration: number;
}

interface UploadResponse {
  success: boolean;
  message: string;
  file?: any;
  scanReport?: FileScanReport;
  securityEvent?: any;
  quarantineId?: string;
}

export const FileUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanReport, setScanReport] = useState<FileScanReport | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setCurrentFile(file);
    setUploading(true);
    setUploadProgress(0);
    setScanReport(null);
    setUploadResult(null);

    try {
      // 업로드 진행 표시 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'demo-user');

      // API 호출
      const response = (await api.uploadFile(formData)) as UploadResponse;

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadResult(response);
      if (response.scanReport) {
        setScanReport(response.scanReport);
      }

      // 결과에 따른 알림
      if (response.success) {
        notifications.show({
          title: '✅ 업로드 성공',
          message: response.message,
          color: 'green',
        });
      } else {
        notifications.show({
          title: '🚫 업로드 차단',
          message: response.message,
          color: 'red',
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);

      setUploadProgress(100);

      // 서버에서 보안 차단한 경우
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        setUploadResult(errorData);
        if (errorData.scanReport) {
          setScanReport(errorData.scanReport);
        }

        notifications.show({
          title: '🛡️ 보안 정책 차단',
          message: errorData.message,
          color: 'red',
        });
      } else {
        notifications.show({
          title: '❌ 업로드 실패',
          message: '파일 업로드 중 오류가 발생했습니다.',
          color: 'red',
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'safe':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'blocked':
        return 'red';
      case 'quarantined':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <IconShieldX size={16} />;
      case 'high':
        return <IconAlertTriangle size={16} />;
      case 'medium':
        return <IconAlertTriangle size={16} />;
      case 'low':
        return <IconCheck size={16} />;
      default:
        return <IconFile size={16} />;
    }
  };

  return (
    <Stack gap="lg">
      {/* 파일 업로드 영역 */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={3} mb="md">
          🛡️ 보안 파일 업로드
        </Title>

        <Dropzone
          onDrop={handleFileUpload}
          onReject={(files) => {
            notifications.show({
              title: '업로드 실패',
              message: `파일을 업로드할 수 없습니다: ${files[0]?.errors[0]?.message}`,
              color: 'red',
            });
          }}
          maxSize={200 * 1024 * 1024} // 200MB
          accept={undefined} // 모든 파일 허용 (보안 스캔에서 필터링)
          disabled={uploading}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={52}
                color="var(--mantine-color-blue-6)"
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={52}
                color="var(--mantine-color-red-6)"
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFile
                size={52}
                color="var(--mantine-color-gray-6)"
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                파일을 드래그하거나 클릭하여 업로드
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                모든 파일은 자동으로 보안 스캔됩니다
              </Text>
            </div>
          </Group>
        </Dropzone>

        {/* 업로드 진행 상태 */}
        {uploading && currentFile && (
          <Card mt="md" p="md" withBorder>
            <Text fw={500} mb="xs">
              📁 {currentFile.name} (
              {(currentFile.size / 1024 / 1024).toFixed(2)} MB)
            </Text>
            <Progress
              value={uploadProgress}
              size="lg"
              radius="xl"
              color={uploadProgress === 100 ? 'green' : 'blue'}
              mb="xs"
            />
            <Text size="sm" c="dimmed">
              {uploadProgress < 90
                ? '파일 업로드 중...'
                : uploadProgress < 100
                ? '보안 스캔 중...'
                : '완료'}
            </Text>
          </Card>
        )}
      </Paper>

      {/* 스캔 결과 표시 */}
      {scanReport && (
        <Paper shadow="sm" p="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>🔍 보안 스캔 결과</Title>
            <Group gap="xs">
              <Badge
                color={getRiskBadgeColor(scanReport.overallRisk)}
                size="lg"
              >
                {scanReport.overallRisk.toUpperCase()}
              </Badge>
              <Badge color="gray" variant="outline">
                위험도: {scanReport.riskScore}/100
              </Badge>
            </Group>
          </Group>

          <Stack gap="md">
            {/* 파일 정보 */}
            <Card withBorder p="md">
              <Text fw={500} mb="xs">
                📄 파일 정보
              </Text>
              <List spacing="xs" size="sm">
                <List.Item>파일명: {scanReport.fileName}</List.Item>
                <List.Item>
                  크기: {(scanReport.fileSize / 1024 / 1024).toFixed(2)} MB
                </List.Item>
                <List.Item>타입: {scanReport.mimeType}</List.Item>
                <List.Item>스캔 시간: {scanReport.scanDuration}ms</List.Item>
              </List>
            </Card>

            {/* 스캔 결과 상세 */}
            {scanReport.scanResults.length > 0 ? (
              <Card withBorder p="md">
                <Text fw={500} mb="md">
                  ⚠️ 탐지된 보안 이슈
                </Text>
                <Timeline active={scanReport.scanResults.length}>
                  {scanReport.scanResults.map((result, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon
                          size={24}
                          color={getSeverityColor(result.severity)}
                          radius="xl"
                        >
                          {getSeverityIcon(result.severity)}
                        </ThemeIcon>
                      }
                      title={
                        <Group gap="xs">
                          <Text fw={500}>{result.message}</Text>
                          <Badge
                            size="xs"
                            color={getSeverityColor(result.severity)}
                          >
                            {result.severity}
                          </Badge>
                          <Badge size="xs" variant="outline">
                            {result.action}
                          </Badge>
                        </Group>
                      }
                    >
                      <Text size="sm" c="dimmed" mt={4}>
                        {result.type} 검사 • {JSON.stringify(result.details)}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            ) : (
              <Alert
                icon={<IconShieldCheck size={16} />}
                title="안전한 파일"
                color="green"
              >
                보안 위협이 탐지되지 않았습니다.
              </Alert>
            )}
          </Stack>
        </Paper>
      )}

      {/* 업로드 결과 메시지 */}
      {uploadResult && (
        <Paper shadow="sm" p="lg" radius="md">
          <Alert
            icon={
              uploadResult.success ? (
                <IconCheck size={16} />
              ) : (
                <IconX size={16} />
              )
            }
            title={uploadResult.success ? '업로드 성공' : '업로드 실패'}
            color={uploadResult.success ? 'green' : 'red'}
          >
            {uploadResult.message}

            {uploadResult.quarantineId && (
              <Text size="sm" mt="xs">
                격리 ID: {uploadResult.quarantineId}
              </Text>
            )}
          </Alert>
        </Paper>
      )}
    </Stack>
  );
};
