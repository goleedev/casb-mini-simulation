import React, { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Timeline,
  Text,
  Badge,
  Group,
  ThemeIcon,
  Button,
  Stack,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconShieldCheck,
  IconShieldX,
  IconAlertTriangle,
  IconFile,
  IconRefresh,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type:
    | 'file_upload'
    | 'policy_violation'
    | 'threat_detected'
    | 'access_denied'
    | 'file_blocked';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  description: string;
  resolved: boolean;
  details?: any;
}

export const SecurityTimeline: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate mock data
  useEffect(() => {
    generateMockEvents();
  }, []);

  const generateMockEvents = () => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        type: 'threat_detected',
        severity: 'critical',
        user: 'demo@company.com',
        description:
          'Malware pattern detected in file upload attempt - blocked',
        resolved: true,
        details: { fileName: 'virus.exe', action: 'quarantine' },
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        type: 'policy_violation',
        severity: 'high',
        user: 'user2@company.com',
        description: 'Sensitive information detected in file upload - warning',
        resolved: false,
        details: { fileName: 'customer_data.xlsx', violation: 'PII detected' },
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        type: 'file_upload',
        severity: 'low',
        user: 'demo@company.com',
        description: 'Safe file upload completed successfully',
        resolved: true,
        details: { fileName: 'report.pdf', scanResult: 'clean' },
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        type: 'file_blocked',
        severity: 'medium',
        user: 'user3@company.com',
        description: 'Unauthorized file type upload blocked',
        resolved: true,
        details: { fileName: 'script.bat', reason: 'executable_blocked' },
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        type: 'access_denied',
        severity: 'medium',
        user: 'external@other.com',
        description: 'External user access blocked',
        resolved: true,
        details: { source: 'external', reason: 'unauthorized_domain' },
      },
    ];

    setEvents(mockEvents);
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

  const getEventIcon = (type: string, severity: string) => {
    switch (type) {
      case 'threat_detected':
        return <IconShieldX size={16} />;
      case 'policy_violation':
        return <IconAlertTriangle size={16} />;
      case 'file_upload':
        return <IconFile size={16} />;
      case 'file_blocked':
        return <IconShieldX size={16} />;
      case 'access_denied':
        return <IconShieldCheck size={16} />;
      default:
        return <IconAlertTriangle size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'threat_detected':
        return 'Threat Detected';
      case 'policy_violation':
        return 'Policy Violation';
      case 'file_upload':
        return 'File Upload';
      case 'file_blocked':
        return 'File Blocked';
      case 'access_denied':
        return 'Access Denied';
      default:
        return type;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString('en-US');
  };

  const refreshEvents = () => {
    setLoading(true);
    setTimeout(() => {
      generateMockEvents();
      setLoading(false);
    }, 500);
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" h="auto">
      <Group justify="space-between" mb="md">
        <Title order={3}>🚨 Real-time Security Events</Title>
        <Button
          variant="light"
          leftSection={<IconRefresh size={16} />}
          onClick={refreshEvents}
          loading={loading}
          size="sm"
        >
          Refresh
        </Button>
      </Group>

      <Timeline active={events.length} bulletSize={32} lineWidth={2}>
        {events.map((event) => (
          <Timeline.Item
            key={event.id}
            bullet={
              <ThemeIcon
                size={32}
                color={getSeverityColor(event.severity)}
                radius="xl"
              >
                {getEventIcon(event.type, event.severity)}
              </ThemeIcon>
            }
            title={
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={2}>
                  <Group gap="xs">
                    <Badge
                      size="xs"
                      color={getSeverityColor(event.severity)}
                      variant="filled"
                    >
                      {event.severity.toUpperCase()}
                    </Badge>
                    <Badge size="xs" variant="outline">
                      {getTypeLabel(event.type)}
                    </Badge>
                    {event.resolved && (
                      <Badge size="xs" color="green" variant="light">
                        Resolved
                      </Badge>
                    )}
                  </Group>
                  <Text fw={500} size="sm">
                    {event.description}
                  </Text>
                </Stack>

                <Group gap="xs">
                  <Tooltip label="View Details">
                    <ActionIcon variant="subtle" size="sm">
                      <IconEye size={14} />
                    </ActionIcon>
                  </Tooltip>
                  {event.resolved && (
                    <Tooltip label="Delete">
                      <ActionIcon variant="subtle" color="red" size="sm">
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Group>
            }
          >
            <Text size="xs" c="dimmed" mt={4}>
              {event.user} • {formatTime(event.timestamp)}
            </Text>
            {event.details && (
              <Text size="xs" c="dimmed" mt={2}>
                File: {event.details.fileName || 'N/A'}
              </Text>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
};
