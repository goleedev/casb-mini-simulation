import React from 'react';
import { Paper, Text, Group, ThemeIcon, Progress, Stack } from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from '@tabler/icons-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  diff?: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  progress?: number;
  progressColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  diff,
  icon,
  color,
  description,
  progress,
  progressColor,
}) => {
  const getTrendIcon = () => {
    if (diff === undefined) return null;
    if (diff > 0) return <IconTrendingUp size={16} color="green" />;
    if (diff < 0) return <IconTrendingDown size={16} color="red" />;
    return <IconMinus size={16} color="gray" />;
  };

  const getTrendColor = () => {
    if (diff === undefined) return 'dimmed';
    if (diff > 0) return 'green';
    if (diff < 0) return 'red';
    return 'dimmed';
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {title}
          </Text>
          <Text fw={700} fz="xl">
            {value}
          </Text>

          {diff !== undefined && (
            <Group gap={4} mt={5}>
              {getTrendIcon()}
              <Text c={getTrendColor()} fz="sm" fw={500}>
                {Math.abs(diff)}%
              </Text>
              <Text c="dimmed" fz="sm">
                vs last week
              </Text>
            </Group>
          )}

          {description && (
            <Text c="dimmed" fz="sm" mt="xs">
              {description}
            </Text>
          )}
        </div>

        <ThemeIcon color={color} variant="light" size={60} radius="md">
          {icon}
        </ThemeIcon>
      </Group>

      {progress !== undefined && (
        <Stack gap={4} mt="md">
          <Progress
            value={progress}
            color={progressColor || color}
            size="sm"
            radius="xl"
          />
          <Text size="xs" c="dimmed">
            {progress}% vs last year
          </Text>
        </Stack>
      )}
    </Paper>
  );
};
