import { AreaChart, DonutChart } from '@mantine/charts';
import {
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';

export const RiskChart: React.FC = () => {
  // Mock 데이터
  const weeklyThreatData = [
    { date: '월', threats: 12, blocked: 10, warnings: 8 },
    { date: '화', threats: 8, blocked: 6, warnings: 12 },
    { date: '수', threats: 15, blocked: 13, warnings: 6 },
    { date: '목', threats: 22, blocked: 18, warnings: 15 },
    { date: '금', threats: 18, blocked: 15, warnings: 9 },
    { date: '토', threats: 5, blocked: 4, warnings: 2 },
    { date: '일', threats: 3, blocked: 2, warnings: 1 },
  ];

  const fileTypeDistribution = [
    { name: 'PDF', value: 35, color: 'blue.6' },
    { name: 'Office', value: 28, color: 'green.6' },
    { name: 'Images', value: 20, color: 'yellow.6' },
    { name: 'Archive', value: 12, color: 'orange.6' },
    { name: 'Others', value: 5, color: 'red.6' },
  ];

  const riskLevels = [
    { label: 'Critical', value: 5, color: 'red' },
    { label: 'High', value: 12, color: 'orange' },
    { label: 'Medium', value: 25, color: 'yellow' },
    { label: 'Low', value: 58, color: 'green' },
  ];

  const totalRiskScore = 72;

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
      {/* 주간 위협 트렌드 */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          📈 주간 위협 트렌드
        </Title>
        <AreaChart
          h={250}
          data={weeklyThreatData}
          dataKey="date"
          series={[
            { name: 'threats', label: '탐지된 위협', color: 'red.6' },
            { name: 'blocked', label: '차단된 위협', color: 'orange.6' },
            { name: 'warnings', label: '경고', color: 'yellow.6' },
          ]}
          curveType="linear"
          withLegend
          withGradient
          withDots={false}
          gridAxis="xy"
        />
      </Paper>

      {/* 파일 타입 분포 */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          📊 파일 타입 분포
        </Title>
        <DonutChart
          h={250}
          data={fileTypeDistribution}
          chartLabel="파일 타입"
          withLabelsLine
          withLabels
        />
      </Paper>

      {/* 전체 위험도 */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          🎯 전체 위험도
        </Title>
        <Group justify="center" mb="md">
          <RingProgress
            size={180}
            thickness={20}
            sections={[
              {
                value: totalRiskScore,
                color:
                  totalRiskScore > 80
                    ? 'red'
                    : totalRiskScore > 60
                    ? 'orange'
                    : 'green',
              },
            ]}
            label={
              <Text ta="center" fw={700} size="xl">
                {totalRiskScore}%
              </Text>
            }
          />
        </Group>
        <Text ta="center" c="dimmed" size="sm">
          현재 보안 위험도 수준
        </Text>
      </Paper>

      {/* 위험도 레벨 분포 */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          ⚠️ 위험도 레벨 분포
        </Title>
        <Stack gap="md">
          {riskLevels.map((level) => (
            <Group key={level.label} justify="space-between">
              <Group gap="xs">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: `var(--mantine-color-${level.color}-6)`,
                  }}
                />
                <Text size="sm" fw={500}>
                  {level.label}
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={600}>
                  {level.value}%
                </Text>
                <div style={{ width: 100 }}>
                  <div
                    style={{
                      height: 8,
                      backgroundColor: `var(--mantine-color-${level.color}-6)`,
                      borderRadius: 4,
                      width: `${level.value}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </Group>
            </Group>
          ))}
        </Stack>
      </Paper>
    </SimpleGrid>
  );
};
