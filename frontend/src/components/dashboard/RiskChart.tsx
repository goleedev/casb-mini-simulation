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
  // Mock data
  const weeklyThreatData = [
    { date: 'Mon', threats: 12, blocked: 10, warnings: 8 },
    { date: 'Tue', threats: 8, blocked: 6, warnings: 12 },
    { date: 'Wed', threats: 15, blocked: 13, warnings: 6 },
    { date: 'Thu', threats: 22, blocked: 18, warnings: 15 },
    { date: 'Fri', threats: 18, blocked: 15, warnings: 9 },
    { date: 'Sat', threats: 5, blocked: 4, warnings: 2 },
    { date: 'Sun', threats: 3, blocked: 2, warnings: 1 },
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
      {/* Weekly Threat Trends */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          📈 Weekly Threat Trends
        </Title>
        <AreaChart
          h={250}
          data={weeklyThreatData}
          dataKey="date"
          series={[
            { name: 'threats', label: 'Detected Threats', color: 'red.6' },
            { name: 'blocked', label: 'Blocked Threats', color: 'orange.6' },
            { name: 'warnings', label: 'Warnings', color: 'yellow.6' },
          ]}
          curveType="linear"
          withLegend
          withGradient
          withDots={false}
          gridAxis="xy"
        />
      </Paper>

      {/* File Type Distribution */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          📊 File Type Distribution
        </Title>
        <DonutChart
          h={250}
          data={fileTypeDistribution}
          chartLabel="File Types"
          withLabelsLine
          withLabels
        />
      </Paper>

      {/* Overall Risk Score */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          🎯 Overall Risk Score
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
          Current security risk level
        </Text>
      </Paper>

      {/* Risk Level Distribution */}
      <Paper shadow="sm" p="lg" radius="md">
        <Title order={4} mb="md">
          ⚠️ Risk Level Distribution
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
