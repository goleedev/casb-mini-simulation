import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Table,
  ActionIcon,
  Tooltip,
  TextInput,
  Select,
  Pagination,
  Card,
  SimpleGrid,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconEye,
  IconDownload,
  IconTrash,
  IconAlertTriangle,
  IconShieldCheck,
  IconShieldX,
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
  source: string;
  resolved: boolean;
  details: any;
}

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const eventsPerPage = 10;

  useEffect(() => {
    generateMockEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, severityFilter, typeFilter]);

  const generateMockEvents = () => {
    const mockEvents: SecurityEvent[] = [];
    const types = [
      'file_upload',
      'policy_violation',
      'threat_detected',
      'access_denied',
      'file_blocked',
    ];
    const severities = ['low', 'medium', 'high', 'critical'];
    const users = [
      'demo@company.com',
      'user1@company.com',
      'user2@company.com',
      'admin@company.com',
    ];

    for (let i = 0; i < 50; i++) {
      const type = types[Math.floor(Math.random() * types.length)] as any;
      const severity = severities[
        Math.floor(Math.random() * severities.length)
      ] as any;
      const user = users[Math.floor(Math.random() * users.length)];

      mockEvents.push({
        id: `event-${i + 1}`,
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ), // 지난 7일 내
        type,
        severity,
        user,
        description: getEventDescription(type, severity),
        source:
          type === 'file_upload' ? 'File Upload System' : 'CASB Policy Engine',
        resolved: Math.random() > 0.3, // 70% 해결됨
        details: {
          fileName: type.includes('file') ? `document_${i}.pdf` : undefined,
          policyId:
            type === 'policy_violation'
              ? `policy-${Math.floor(Math.random() * 5) + 1}`
              : undefined,
          riskScore: Math.floor(Math.random() * 100),
          action: ['block', 'warn', 'quarantine', 'allow'][
            Math.floor(Math.random() * 4)
          ],
        },
      });
    }

    setEvents(
      mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    );
  };

  const getEventDescription = (type: string, severity: string) => {
    const descriptions = {
      file_upload: {
        low: '안전한 파일 업로드 완료',
        medium: '대용량 파일 업로드 감지',
        high: '의심스러운 파일 형식 업로드',
        critical: '악성코드 포함 파일 업로드 시도',
      },
      policy_violation: {
        low: '정책 위반 경고 발생',
        medium: '파일 크기 제한 위반',
        high: '민감 정보 포함 파일 탐지',
        critical: '중요 보안 정책 위반',
      },
      threat_detected: {
        low: '의심스러운 활동 탐지',
        medium: '알려진 위협 패턴 일치',
        high: '악성 행위 탐지',
        critical: '심각한 보안 위협 탐지',
      },
      access_denied: {
        low: '일반 접근 거부',
        medium: '권한 없는 접근 시도',
        high: '비정상적인 접근 패턴',
        critical: '무단 접근 시도 차단',
      },
      file_blocked: {
        low: '파일 업로드 제한',
        medium: '허용되지 않은 파일 형식',
        high: '위험한 파일 확장자 차단',
        critical: '악성 파일 업로드 차단',
      },
    };

    return descriptions[type]?.[severity] || '보안 이벤트 발생';
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (severityFilter) {
      filtered = filtered.filter((event) => event.severity === severityFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((event) => event.type === typeFilter);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'threat_detected':
        return <IconShieldX size={16} />;
      case 'access_denied':
        return <IconShieldCheck size={16} />;
      default:
        return <IconAlertTriangle size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'file_upload':
        return '파일 업로드';
      case 'policy_violation':
        return '정책 위반';
      case 'threat_detected':
        return '위협 탐지';
      case 'access_denied':
        return '접근 거부';
      case 'file_blocked':
        return '파일 차단';
      default:
        return type;
    }
  };

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* 헤더 */}
        <Group justify="space-between">
          <div>
            <Title order={2}>🚨 보안 이벤트</Title>
            <Text c="dimmed" mt="xs">
              실시간 보안 이벤트 모니터링 및 관리
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={generateMockEvents}
            loading={loading}
          >
            새로고침
          </Button>
        </Group>

        {/* 이벤트 통계 */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              총 이벤트
            </Text>
            <Text fw={700} size="xl">
              {events.length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              지난 7일
            </Text>
          </Card>

          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              심각한 위협
            </Text>
            <Text fw={700} size="xl" c="red">
              {events.filter((e) => e.severity === 'critical').length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              즉시 조치 필요
            </Text>
          </Card>

          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              해결된 이벤트
            </Text>
            <Text fw={700} size="xl" c="green">
              {events.filter((e) => e.resolved).length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              전체 대비{' '}
              {Math.round(
                (events.filter((e) => e.resolved).length / events.length) * 100
              )}
              %
            </Text>
          </Card>

          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              미해결 이벤트
            </Text>
            <Text fw={700} size="xl" c="orange">
              {events.filter((e) => !e.resolved).length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              조치 대기 중
            </Text>
          </Card>
        </SimpleGrid>

        {/* 필터링 */}
        <Paper shadow="sm" p="md" radius="md">
          <Group>
            <TextInput
              placeholder="이벤트 검색..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="심각도"
              data={[
                { value: '', label: '모든 심각도' },
                { value: 'critical', label: '심각' },
                { value: 'high', label: '높음' },
                { value: 'medium', label: '중간' },
                { value: 'low', label: '낮음' },
              ]}
              value={severityFilter}
              onChange={(value) => setSeverityFilter(value || '')}
              w={150}
            />
            <Select
              placeholder="이벤트 유형"
              data={[
                { value: '', label: '모든 유형' },
                { value: 'threat_detected', label: '위협 탐지' },
                { value: 'policy_violation', label: '정책 위반' },
                { value: 'file_upload', label: '파일 업로드' },
                { value: 'access_denied', label: '접근 거부' },
                { value: 'file_blocked', label: '파일 차단' },
              ]}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value || '')}
              w={150}
            />
          </Group>
        </Paper>

        {/* 이벤트 테이블 */}
        <Paper shadow="sm" radius="md">
          <Table.ScrollContainer minWidth={1000}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>시간</Table.Th>
                  <Table.Th>유형</Table.Th>
                  <Table.Th>심각도</Table.Th>
                  <Table.Th>설명</Table.Th>
                  <Table.Th>사용자</Table.Th>
                  <Table.Th>상태</Table.Th>
                  <Table.Th>작업</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedEvents.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <Text size="sm">
                        {event.timestamp.toLocaleString('ko-KR')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        leftSection={getTypeIcon(event.type)}
                        variant="light"
                      >
                        {getTypeLabel(event.type)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {event.description}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{event.user}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={event.resolved ? 'green' : 'orange'}
                        variant="light"
                      >
                        {event.resolved ? '해결됨' : '대기중'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="상세 보기">
                          <ActionIcon variant="subtle" size="sm">
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="다운로드">
                          <ActionIcon variant="subtle" size="sm">
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="삭제">
                          <ActionIcon variant="subtle" color="red" size="sm">
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

          {/* 페이지네이션 */}
          <Group justify="center" p="md">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
};
