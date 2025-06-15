import React, { useState, useEffect } from 'react';
import {
  Table,
  Paper,
  Title,
  Badge,
  Button,
  Group,
  Text,
  ActionIcon,
  Progress,
  Tooltip,
  Stack,
} from '@mantine/core';
import {
  IconDownload,
  IconEye,
  IconTrash,
  IconShield,
  IconAlertTriangle,
  IconCheck,
} from '@tabler/icons-react';
import { api } from '../../services/api';

interface FileItem {
  id: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'blocked' | 'quarantined';
}

export const FileList: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await api.getFiles();
      if (response.success) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <IconCheck size={16} />;
      case 'warning':
        return <IconAlertTriangle size={16} />;
      case 'blocked':
        return <IconShield size={16} />;
      case 'quarantined':
        return <IconShield size={16} />;
      default:
        return <IconShield size={16} />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'red';
    if (score >= 40) return 'yellow';
    return 'green';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  if (loading) {
    return (
      <Paper shadow="sm" p="lg" radius="md">
        <Text>Loading file list...</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Title order={3}>📁 File Management</Title>
        <Button variant="light" onClick={loadFiles}>
          Refresh
        </Button>
      </Group>

      {files.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No uploaded files found.
        </Text>
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>File Name</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Upload Date</Table.Th>
                <Table.Th>Uploaded By</Table.Th>
                <Table.Th>Risk Score</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {files.map((file) => (
                <Table.Tr key={file.id}>
                  <Table.Td>
                    <Text fw={500}>{file.originalName}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatFileSize(file.size)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(file.uploadedAt)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{file.uploadedBy}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={4}>
                      <Progress
                        value={file.riskScore}
                        color={getRiskColor(file.riskScore)}
                        size="sm"
                        radius="xl"
                      />
                      <Text size="xs" c="dimmed">
                        {file.riskScore}/100
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(file.status)}
                      variant="light"
                      leftSection={getStatusIcon(file.status)}
                    >
                      {file.status.toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Preview">
                        <ActionIcon variant="subtle" color="blue">
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>

                      {file.status === 'safe' && (
                        <Tooltip label="Download">
                          <ActionIcon variant="subtle" color="green">
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}

                      <Tooltip label="Delete">
                        <ActionIcon variant="subtle" color="red">
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Paper>
  );
};
