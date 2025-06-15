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
      // Upload progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'demo-user');

      // API call
      const response = (await api.uploadFile(formData)) as UploadResponse;

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadResult(response);
      if (response.scanReport) {
        setScanReport(response.scanReport);
      }

      // Show notification based on result
      if (response.success) {
        notifications.show({
          title: '✅ Upload Successful',
          message: response.message,
          color: 'green',
        });
      } else {
        notifications.show({
          title: '🚫 Upload Blocked',
          message: response.message,
          color: 'red',
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);

      setUploadProgress(100);

      // Handle security blocking from server
      if (error.response?.status === 403) {
        const errorData = error.response.data;
        setUploadResult(errorData);
        if (errorData.scanReport) {
          setScanReport(errorData.scanReport);
        }

        notifications.show({
          title: '🛡️ Security Policy Blocked',
          message: errorData.message,
          color: 'red',
        });
      } else {
        notifications.show({
          title: '❌ Upload Failed',
          message: 'An error occurred during file upload.',
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
      {/* File Upload Area */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={3} mb="md">
          🛡️ Secure File Upload
        </Title>

        <Dropzone
          onDrop={handleFileUpload}
          onReject={(files) => {
            notifications.show({
              title: 'Upload Failed',
              message: `Cannot upload file: ${files[0]?.errors[0]?.message}`,
              color: 'red',
            });
          }}
          maxSize={200 * 1024 * 1024} // 200MB
          accept={undefined} // Allow all files (filtering in security scan)
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
                Drag files here or click to upload
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                All files are automatically scanned for security
              </Text>
            </div>
          </Group>
        </Dropzone>

        {/* Upload Progress */}
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
                ? 'Uploading file...'
                : uploadProgress < 100
                ? 'Security scanning...'
                : 'Complete'}
            </Text>
          </Card>
        )}
      </Paper>

      {/* Scan Results Display */}
      {scanReport && (
        <Paper shadow="sm" p="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>🔍 Security Scan Results</Title>
            <Group gap="xs">
              <Badge
                color={getRiskBadgeColor(scanReport.overallRisk)}
                size="lg"
              >
                {scanReport.overallRisk.toUpperCase()}
              </Badge>
              <Badge color="gray" variant="outline">
                Risk Score: {scanReport.riskScore}/100
              </Badge>
            </Group>
          </Group>

          <Stack gap="md">
            {/* File Information */}
            <Card withBorder p="md">
              <Text fw={500} mb="xs">
                📄 File Information
              </Text>
              <List spacing="xs" size="sm">
                <List.Item>File Name: {scanReport.fileName}</List.Item>
                <List.Item>
                  Size: {(scanReport.fileSize / 1024 / 1024).toFixed(2)} MB
                </List.Item>
                <List.Item>Type: {scanReport.mimeType}</List.Item>
                <List.Item>Scan Time: {scanReport.scanDuration}ms</List.Item>
              </List>
            </Card>

            {/* Detailed Scan Results */}
            {scanReport.scanResults.length > 0 ? (
              <Card withBorder p="md">
                <Text fw={500} mb="md">
                  ⚠️ Detected Security Issues
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
                        {result.type} scan • {JSON.stringify(result.details)}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            ) : (
              <Alert
                icon={<IconShieldCheck size={16} />}
                title="Safe File"
                color="green"
              >
                No security threats detected.
              </Alert>
            )}
          </Stack>
        </Paper>
      )}

      {/* Upload Result Message */}
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
            title={uploadResult.success ? 'Upload Successful' : 'Upload Failed'}
            color={uploadResult.success ? 'green' : 'red'}
          >
            {uploadResult.message}

            {uploadResult.quarantineId && (
              <Text size="sm" mt="xs">
                Quarantine ID: {uploadResult.quarantineId}
              </Text>
            )}
          </Alert>
        </Paper>
      )}
    </Stack>
  );
};
