import React from 'react';
import { Container, SimpleGrid, Stack } from '@mantine/core';
import {
  IconShield,
  IconFile,
  IconAlertTriangle,
  IconUsers,
  IconCloudUpload,
  IconBan,
} from '@tabler/icons-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SecurityTimeline } from '../../components/dashboard/SecurityTimeline';
import { RiskChart } from '../../components/dashboard/RiskChart';

export const DashboardPage: React.FC = () => {
  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Top Statistics Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <StatsCard
            title="Total Files"
            value="1,247"
            diff={12.5}
            icon={<IconFile size={24} />}
            color="blue"
            description="Total uploaded files"
            progress={85}
            progressColor="blue"
          />

          <StatsCard
            title="Blocked Threats"
            value="28"
            diff={-15.2}
            icon={<IconBan size={24} />}
            color="red"
            description="Blocked this week"
            progress={92}
            progressColor="red"
          />

          <StatsCard
            title="Active Policies"
            value="12"
            diff={0}
            icon={<IconShield size={24} />}
            color="green"
            description="Currently active policies"
            progress={100}
            progressColor="green"
          />

          <StatsCard
            title="Security Score"
            value="72/100"
            diff={8.1}
            icon={<IconAlertTriangle size={24} />}
            color="orange"
            description="Overall security level"
            progress={72}
            progressColor="orange"
          />
        </SimpleGrid>

        {/* Middle Section: Charts and Analysis */}
        <RiskChart />

        {/* Bottom Section: Real-time Events */}
        <SimpleGrid cols={{ base: 1, lg: 1 }} spacing="lg">
          <SecurityTimeline />
        </SimpleGrid>

        {/* Additional Statistics Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <StatsCard
            title="Daily Uploads"
            value="156"
            diff={23.1}
            icon={<IconCloudUpload size={24} />}
            color="cyan"
            description="Files uploaded today"
          />

          <StatsCard
            title="Active Users"
            value="89"
            diff={5.3}
            icon={<IconUsers size={24} />}
            color="violet"
            description="Active users in last 24h"
          />

          <StatsCard
            title="Avg Scan Time"
            value="1.2s"
            diff={-12.8}
            icon={<IconAlertTriangle size={24} />}
            color="lime"
            description="Average scan time per file"
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
};
