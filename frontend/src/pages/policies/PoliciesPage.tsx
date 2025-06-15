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
      name: '민감 데이터 유출 방지',
      type: 'dlp',
      enabled: true,
      description: '신용카드 번호, 주민등록번호 등 민감 정보 탐지 및 차단',
      severity: 'critical',
      rules: 8,
      lastModified: new Date('2024-06-10'),
    },
    {
      id: '2',
      name: '파일 형식 제어',
      type: 'access',
      enabled: true,
      description: '실행 파일 및 위험한 파일 형식 업로드 차단',
      severity: 'high',
      rules: 12,
      lastModified: new Date('2024-06-12'),
    },
    {
      id: '3',
      name: '악성코드 보호',
      type: 'threat',
      enabled: true,
      description: '알려진 악성코드 패턴 및 의심스러운 행위 탐지',
      severity: 'critical',
      rules: 25,
      lastModified: new Date('2024-06-14'),
    },
    {
      id: '4',
      name: '파일 크기 제한',
      type: 'access',
      enabled: false,
      description: '대용량 파일 업로드 제한 (100MB 초과)',
      severity: 'medium',
      rules: 3,
      lastModified: new Date('2024-06-08'),
    },
    {
      id: '5',
      name: '규정 준수 검사',
      type: 'compliance',
      enabled: true,
      description: 'GDPR, 개인정보보호법 등 규정 준수 검사',
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
        return '접근 제어';
      case 'threat':
        return '위협 탐지';
      case 'compliance':
        return '규정 준수';
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
        {/* 헤더 */}
        <Group justify="space-between">
          <div>
            <Title order={2}>🔒 보안 정책 관리</Title>
            <Text c="dimmed" mt="xs">
              CASB 보안 정책을 설정하고 관리합니다
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            새 정책 추가
          </Button>
        </Group>

        {/* 정책 통계 */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  전체 정책
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
                  활성 정책
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
                  중요 정책
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
                  총 규칙
                </Text>
                <Text fw={700} size="xl">
                  {policies.reduce((sum, p) => sum + p.rules, 0)}
                </Text>
              </div>
              <IconFile size={24} color="var(--mantine-color-orange-6)" />
            </Group>
          </Card>
        </SimpleGrid>

        {/* 정책 목록 */}
        <Paper shadow="sm" p="lg" radius="md">
          <Title order={3} mb="md">
            정책 목록
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
                    <Tooltip label="편집">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => setEditingPolicy(policy)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="삭제">
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
                      {policy.rules}개 규칙
                    </Badge>
                  </Group>

                  <Text size="xs" c="dimmed">
                    수정: {policy.lastModified.toLocaleDateString('ko-KR')}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Stack>

      {/* 정책 생성/편집 모달 */}
      <Modal
        opened={createModalOpen || !!editingPolicy}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingPolicy(null);
        }}
        title={editingPolicy ? '정책 편집' : '새 정책 추가'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="정책 이름"
            placeholder="정책 이름을 입력하세요"
            defaultValue={editingPolicy?.name || ''}
            required
          />

          <Select
            label="정책 유형"
            placeholder="정책 유형을 선택하세요"
            data={[
              { value: 'dlp', label: 'DLP (데이터 유출 방지)' },
              { value: 'access', label: '접근 제어' },
              { value: 'threat', label: '위협 탐지' },
              { value: 'compliance', label: '규정 준수' },
            ]}
            defaultValue={editingPolicy?.type || ''}
            required
          />

          <Select
            label="심각도"
            placeholder="심각도를 선택하세요"
            data={[
              { value: 'low', label: '낮음' },
              { value: 'medium', label: '중간' },
              { value: 'high', label: '높음' },
              { value: 'critical', label: '심각' },
            ]}
            defaultValue={editingPolicy?.severity || ''}
            required
          />

          <Textarea
            label="설명"
            placeholder="정책에 대한 설명을 입력하세요"
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
              취소
            </Button>
            <Button>{editingPolicy ? '수정' : '생성'}</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};
