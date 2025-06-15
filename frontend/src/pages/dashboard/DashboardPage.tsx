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
        {/* 상단 통계 카드들 */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <StatsCard
            title="총 파일"
            value="1,247"
            diff={12.5}
            icon={<IconFile size={24} />}
            color="blue"
            description="업로드된 전체 파일"
            progress={85}
            progressColor="blue"
          />

          <StatsCard
            title="차단된 위협"
            value="28"
            diff={-15.2}
            icon={<IconBan size={24} />}
            color="red"
            description="이번 주 차단 건수"
            progress={92}
            progressColor="red"
          />

          <StatsCard
            title="활성 정책"
            value="12"
            diff={0}
            icon={<IconShield size={24} />}
            color="green"
            description="현재 적용 중인 정책"
            progress={100}
            progressColor="green"
          />

          <StatsCard
            title="보안 점수"
            value="72/100"
            diff={8.1}
            icon={<IconAlertTriangle size={24} />}
            color="orange"
            description="전체 보안 수준"
            progress={72}
            progressColor="orange"
          />
        </SimpleGrid>

        {/* 중간 섹션: 차트 및 분석 */}
        <RiskChart />

        {/* 하단 섹션: 실시간 이벤트 */}
        <SimpleGrid cols={{ base: 1, lg: 1 }} spacing="lg">
          <SecurityTimeline />
        </SimpleGrid>

        {/* 추가 통계 카드들 */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <StatsCard
            title="일일 업로드"
            value="156"
            diff={23.1}
            icon={<IconCloudUpload size={24} />}
            color="cyan"
            description="오늘 업로드된 파일"
          />

          <StatsCard
            title="활성 사용자"
            value="89"
            diff={5.3}
            icon={<IconUsers size={24} />}
            color="violet"
            description="최근 24시간 활성 사용자"
          />

          <StatsCard
            title="평균 스캔 시간"
            value="1.2초"
            diff={-12.8}
            icon={<IconAlertTriangle size={24} />}
            color="lime"
            description="파일당 평균 스캔 시간"
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
};
