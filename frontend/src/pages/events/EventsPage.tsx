import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconDownload,
  IconEye,
  IconRefresh,
  IconSearch,
  IconShieldCheck,
  IconShieldX,
  IconTrash,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

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
        ),
        type,
        severity,
        user,
        description: getEventDescription(type, severity),
        source:
          type === 'file_upload' ? 'File Upload System' : 'CASB Policy Engine',
        resolved: Math.random() > 0.3,
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
        low: 'Safe file upload completed',
        medium: 'Large file upload detected',
        high: 'Suspicious file type uploaded',
        critical: 'Malware-infected file upload attempt',
      },
      policy_violation: {
        low: 'Policy violation warning generated',
        medium: 'File size limit violation',
        high: 'Sensitive information detected in file',
        critical: 'Critical security policy violation',
      },
      threat_detected: {
        low: 'Suspicious activity detected',
        medium: 'Known threat pattern matched',
        high: 'Malicious behavior detected',
        critical: 'Critical security threat detected',
      },
      access_denied: {
        low: 'General access denied',
        medium: 'Unauthorized access attempt',
        high: 'Abnormal access pattern',
        critical: 'Unauthorized access attempt blocked',
      },
      file_blocked: {
        low: 'File upload restricted',
        medium: 'Unauthorized file type',
        high: 'Dangerous file extension blocked',
        critical: 'Malicious file upload blocked',
      },
    };

    return descriptions[type]?.[severity] || 'Security event occurred';
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
        return 'File Upload';
      case 'policy_violation':
        return 'Policy Violation';
      case 'threat_detected':
        return 'Threat Detected';
      case 'access_denied':
        return 'Access Denied';
      case 'file_blocked':
        return 'File Blocked';
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
        <Group justify="space-between">
          <div>
            <Title order={2}>🚨 Security Events</Title>
            <Text c="dimmed" mt="xs">
              Real-time security event monitoring and management
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={generateMockEvents}
          >
            Refresh
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Total events
            </Text>
            <Text fw={700} size="xl">
              {events.length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Last 7 days
            </Text>
          </Card>

          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Critical Threats
            </Text>
            <Text fw={700} size="xl" c="red">
              {events.filter((e) => e.severity === 'critical').length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Immediate action required
            </Text>
          </Card>

          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Resolved Events
            </Text>
            <Text fw={700} size="xl" c="green">
              {events.filter((e) => e.resolved).length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              {`Percentage: ${Math.round(
                (events.filter((e) => e.resolved).length / events.length) * 100
              )}%`}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Unresolved Events
            </Text>
            <Text fw={700} size="xl" c="orange">
              {events.filter((e) => !e.resolved).length}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Awaiting action
            </Text>
          </Card>
        </SimpleGrid>

        {/* Filtering */}
        <Paper shadow="sm" p="md" radius="md">
          <Group>
            <TextInput
              placeholder="Search events..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Severity"
              data={[
                { value: '', label: 'All Severities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              value={severityFilter}
              onChange={(value) => setSeverityFilter(value || '')}
              w={150}
            />
            <Select
              placeholder="Event Type"
              data={[
                { value: '', label: 'All Types' },
                { value: 'threat_detected', label: 'Threat Detected' },
                { value: 'policy_violation', label: 'Policy Violation' },
                { value: 'file_upload', label: 'File Upload' },
                { value: 'access_denied', label: 'Access Denied' },
                { value: 'file_blocked', label: 'File Blocked' },
              ]}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value || '')}
              w={150}
            />
          </Group>
        </Paper>

        {/* Events Table */}
        <Paper shadow="sm" radius="md">
          <Table.ScrollContainer minWidth={1000}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Time</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Severity</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedEvents.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <Text size="sm">
                        {event.timestamp.toLocaleString('en-US')}
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
                        {event.resolved ? 'Resolved' : 'Pending'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="View Details">
                          <ActionIcon variant="subtle" size="sm">
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Download">
                          <ActionIcon variant="subtle" size="sm">
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete">
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

          {/* Pagination */}
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
