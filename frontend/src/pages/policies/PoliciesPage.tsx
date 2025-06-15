import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Switch,
  Card,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Select,
  SimpleGrid,
} from '@mantine/core';
import {
  IconShield,
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlertTriangle,
  IconFile,
  IconBan,
} from '@tabler/icons-react';

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'dlp' | 'access' | 'threat' | 'compliance';
  enabled: boolean;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rules: number;
  lastModified: Date;
}

export const PoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<SecurityPolicy[]>([
    {
      id: '1',
      name: 'Sensitive Data Loss Prevention',
      type: 'dlp',
      enabled: true,
      description:
        'Detect and block credit card numbers, SSNs, and other sensitive information',
      severity: 'critical',
      rules: 8,
      lastModified: new Date('2024-06-10'),
    },
    {
      id: '2',
      name: 'File Type Control',
      type: 'access',
      enabled: true,
      description: 'Block executable files and dangerous file type uploads',
      severity: 'high',
      rules: 12,
      lastModified: new Date('2024-06-12'),
    },
    {
      id: '3',
      name: 'Malware Protection',
      type: 'threat',
      enabled: true,
      description: 'Detect known malware patterns and suspicious behavior',
      severity: 'critical',
      rules: 25,
      lastModified: new Date('2024-06-14'),
    },
    {
      id: '4',
      name: 'File Size Limit',
      type: 'access',
      enabled: false,
      description: 'Limit large file uploads (over 100MB)',
      severity: 'medium',
      rules: 3,
      lastModified: new Date('2024-06-08'),
    },
    {
      id: '5',
      name: 'Compliance Check',
      type: 'compliance',
      enabled: true,
      description: 'GDPR, HIPAA, and data protection regulation compliance',
      severity: 'high',
      rules: 15,
      lastModified: new Date('2024-06-13'),
    },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<SecurityPolicy | null>(
    null
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dlp':
        return 'red';
      case 'access':
        return 'blue';
      case 'threat':
        return 'orange';
      case 'compliance':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dlp':
        return 'DLP';
      case 'access':
        return 'Access Control';
      case 'threat':
        return 'Threat Detection';
      case 'compliance':
        return 'Compliance';
      default:
        return type;
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

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === id ? { ...policy, enabled: !policy.enabled } : policy
      )
    );
  };

  const deletePolicy = (id: string) => {
    setPolicies((prev) => prev.filter((policy) => policy.id !== id));
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>🔒 Security Policy Management</Title>
            <Text c="dimmed" mt="xs">
              Configure and manage CASB security policies
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Add New Policy
          </Button>
        </Group>

        {/* Policy Statistics */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Policies
                </Text>
                <Text fw={700} size="xl">
                  {policies.length}
                </Text>
              </div>
              <IconShield size={24} color="var(--mantine-color-blue-6)" />
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Active Policies
                </Text>
                <Text fw={700} size="xl">
                  {policies.filter((p) => p.enabled).length}
                </Text>
              </div>
              <IconAlertTriangle
                size={24}
                color="var(--mantine-color-green-6)"
              />
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Critical Policies
                </Text>
                <Text fw={700} size="xl">
                  {policies.filter((p) => p.severity === 'critical').length}
                </Text>
              </div>
              <IconBan size={24} color="var(--mantine-color-red-6)" />
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Rules
                </Text>
                <Text fw={700} size="xl">
                  {policies.reduce((sum, p) => sum + p.rules, 0)}
                </Text>
              </div>
              <IconFile size={24} color="var(--mantine-color-orange-6)" />
            </Group>
          </Card>
        </SimpleGrid>

        {/* Policy List */}
        <Paper shadow="sm" p="lg" radius="md">
          <Title order={3} mb="md">
            Policy List
          </Title>

          <Stack gap="md">
            {policies.map((policy) => (
              <Card key={policy.id} withBorder p="md">
                <Group justify="space-between" mb="md">
                  <Group>
                    <Switch
                      checked={policy.enabled}
                      onChange={() => togglePolicy(policy.id)}
                      color={policy.enabled ? 'green' : 'gray'}
                    />
                    <div>
                      <Text fw={600} size="md">
                        {policy.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {policy.description}
                      </Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <Tooltip label="Edit">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => setEditingPolicy(policy)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => deletePolicy(policy.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Group justify="space-between">
                  <Group gap="sm">
                    <Badge color={getTypeColor(policy.type)} variant="light">
                      {getTypeLabel(policy.type)}
                    </Badge>
                    <Badge
                      color={getSeverityColor(policy.severity)}
                      variant="outline"
                    >
                      {policy.severity.toUpperCase()}
                    </Badge>
                    <Badge color="gray" variant="outline">
                      {policy.rules} rules
                    </Badge>
                  </Group>

                  <Text size="xs" c="dimmed">
                    Modified: {policy.lastModified.toLocaleDateString('en-US')}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Stack>

      {/* Policy Create/Edit Modal */}
      <Modal
        opened={createModalOpen || !!editingPolicy}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingPolicy(null);
        }}
        title={editingPolicy ? 'Edit Policy' : 'Add New Policy'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Policy Name"
            placeholder="Enter policy name"
            defaultValue={editingPolicy?.name || ''}
            required
          />

          <Select
            label="Policy Type"
            placeholder="Select policy type"
            data={[
              { value: 'dlp', label: 'DLP (Data Loss Prevention)' },
              { value: 'access', label: 'Access Control' },
              { value: 'threat', label: 'Threat Detection' },
              { value: 'compliance', label: 'Compliance' },
            ]}
            defaultValue={editingPolicy?.type || ''}
            required
          />

          <Select
            label="Severity"
            placeholder="Select severity level"
            data={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
            defaultValue={editingPolicy?.severity || ''}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter policy description"
            defaultValue={editingPolicy?.description || ''}
            rows={3}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                setCreateModalOpen(false);
                setEditingPolicy(null);
              }}
            >
              Cancel
            </Button>
            <Button>{editingPolicy ? 'Update' : 'Create'}</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};
