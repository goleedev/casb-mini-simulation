import {
  AppShell,
  Badge,
  Button,
  Group,
  MantineProvider,
  Stack,
  Text,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// CSS 임포트
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

// 페이지 컴포넌트들 임포트
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { EventsPage } from './pages/events/EventsPage';
import { FilesPage } from './pages/files/FilesPage';
import { PoliciesPage } from './pages/policies/PoliciesPage';

// 네비게이션 컴포넌트
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '📊 대시보드', key: 'dashboard' },
    { path: '/files', label: '📁 파일 관리', key: 'files' },
    { path: '/policies', label: '🔒 보안 정책', key: 'policies' },
    { path: '/events', label: '⚠️ 보안 이벤트', key: 'events' },
    { path: '/reports', label: '📈 리포트', key: 'reports' },
    { path: '/settings', label: '⚙️ 설정', key: 'settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Stack gap="xs">
      <Text fw={600} size="sm" c="dimmed" mb="sm">
        보안 관리
      </Text>

      {menuItems.map((item) => (
        <Button
          key={item.key}
          variant={isActive(item.path) ? 'filled' : 'light'}
          justify="start"
          fullWidth
          onClick={() => navigate(item.path)}
          style={{
            fontWeight: isActive(item.path) ? 600 : 400,
          }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
};

// 메인 레이아웃 컴포넌트
const MainLayout: React.FC = () => {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: navbarCollapsed },
      }}
      padding="lg"
    >
      {/* 상단 헤더 */}
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group>
            <Text size="xl" fw={700} c="blue">
              🛡️ CASB Security Dashboard
            </Text>
            <Badge color="green" variant="light" size="sm">
              Simulation Mode
            </Badge>
          </Group>

          <Group>
            <Badge color="orange" variant="outline">
              Demo User
            </Badge>
          </Group>
        </Group>
      </AppShell.Header>

      {/* 왼쪽 네비게이션 */}
      <AppShell.Navbar p="md">
        <Navigation />
      </AppShell.Navbar>

      {/* 메인 콘텐츠 영역 */}
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

// 임시 플레이스홀더 페이지 (나중에 실제 페이지로 교체)
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Text size="xl" fw={600} mb="md">
        {title}
      </Text>
      <Text c="dimmed" mb="lg">
        이 페이지는 현재 개발 중입니다.
      </Text>
      <div
        style={{
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px dashed #dee2e6',
        }}
      >
        <Text size="lg" fw={500} c="dimmed">
          🚧 Coming Soon
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          {title} 기능을 구현할 예정입니다
        </Text>
      </div>
    </div>
  );
};

// 404 페이지
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      <Text size="xl" fw={700} mb="md">
        404 - 페이지를 찾을 수 없습니다
      </Text>
      <Text c="dimmed" mb="lg">
        요청하신 페이지가 존재하지 않습니다.
      </Text>
      <Button onClick={() => navigate('/')}>대시보드로 돌아가기</Button>
    </div>
  );
};

// 메인 App 컴포넌트
function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        colors: {
          // CASB 보안 테마 컬러 정의
          security: [
            '#f0f9ff', // 가장 연한색
            '#e0f2fe',
            '#bae6fd',
            '#7dd3fc',
            '#38bdf8',
            '#0ea5e9', // 기본색
            '#0284c7',
            '#0369a1',
            '#075985',
            '#0c4a6e', // 가장 진한색
          ],
          danger: [
            '#fef2f2',
            '#fee2e2',
            '#fecaca',
            '#fca5a5',
            '#f87171',
            '#ef4444', // 기본 빨간색
            '#dc2626',
            '#b91c1c',
            '#991b1b',
            '#7f1d1d',
          ],
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
        headings: { fontFamily: 'system-ui, -apple-system, sans-serif' },
      }}
    >
      <Notifications position="top-right" />

      <Router>
        <MainLayout />
      </Router>
    </MantineProvider>
  );
}

export default App;
