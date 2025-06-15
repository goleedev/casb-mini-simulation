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

  // Mock 데이터 생성
  useEffect(() => {
    generateMockEvents();
  }, []);

  const generateMockEvents = () => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
        type: 'threat_detected',
        severity: 'critical',
        user: 'demo@company.com',
        description: '악성코드 패턴이 포함된 파일 업로드 시도 차단',
        resolved: true,
        details: { fileName: 'virus.exe', action: 'quarantine' },
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15분 전
        type: 'policy_violation',
        severity: 'high',
        user: 'user2@company.com',
        description: '민감 정보 포함 파일 업로드 경고',
        resolved: false,
        details: { fileName: 'customer_data.xlsx', violation: 'PII detected' },
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
        type: 'file_upload',
        severity: 'low',
        user: 'demo@company.com',
        description: '안전한 파일 업로드 완료',
        resolved: true,
        details: { fileName: 'report.pdf', scanResult: 'clean' },
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45분 전
        type: 'file_blocked',
        severity: 'medium',
        user: 'user3@company.com',
        description: '허용되지 않은 파일 형식 업로드 차단',
        resolved: true,
        details: { fileName: 'script.bat', reason: 'executable_blocked' },
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1시간 전
        type: 'access_denied',
        severity: 'medium',
        user: 'external@other.com',
        description: '외부 사용자 접근 차단',
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
        return '위협 탐지';
      case 'policy_violation':
        return '정책 위반';
      case 'file_upload':
        return '파일 업로드';
      case 'file_blocked':
        return '파일 차단';
      case 'access_denied':
        return '접근 거부';
      default:
        return type;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
    return date.toLocaleDateString('ko-KR');
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
        <Title order={3}>🚨 실시간 보안 이벤트</Title>
        <Button
          variant="light"
          leftSection={<IconRefresh size={16} />}
          onClick={refreshEvents}
          loading={loading}
          size="sm"
        >
          새로고침
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
                        해결됨
                      </Badge>
                    )}
                  </Group>
                  <Text fw={500} size="sm">
                    {event.description}
                  </Text>
                </Stack>

                <Group gap="xs">
                  <Tooltip label="상세 보기">
                    <ActionIcon variant="subtle" size="sm">
                      <IconEye size={14} />
                    </ActionIcon>
                  </Tooltip>
                  {event.resolved && (
                    <Tooltip label="삭제">
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
                파일: {event.details.fileName || 'N/A'}
              </Text>
            )}
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
};
