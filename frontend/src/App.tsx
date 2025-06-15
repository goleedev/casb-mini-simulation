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

// CSS imports
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

// Page component imports
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { EventsPage } from './pages/events/EventsPage';
import { FilesPage } from './pages/files/FilesPage';
import { PoliciesPage } from './pages/policies/PoliciesPage';

// Navigation component
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '📊 Dashboard', key: 'dashboard' },
    { path: '/files', label: '📁 File Management', key: 'files' },
    { path: '/policies', label: '🔒 Security Policies', key: 'policies' },
    { path: '/events', label: '⚠️ Security Events', key: 'events' },
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
        Security Management
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

// Main layout component
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
      {/* Top header */}
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

      {/* Left navigation */}
      <AppShell.Navbar p="md">
        <Navigation />
      </AppShell.Navbar>

      {/* Main content area */}
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

// Temporary placeholder page (to be replaced with actual pages later)
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Text size="xl" fw={600} mb="md">
        {title}
      </Text>
      <Text c="dimmed" mb="lg">
        This page is currently under development.
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
          {title} functionality will be implemented soon
        </Text>
      </div>
    </div>
  );
};

// 404 page
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
        404 - Page Not Found
      </Text>
      <Text c="dimmed" mb="lg">
        The requested page does not exist.
      </Text>
      <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
    </div>
  );
};

// Main App component
function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        colors: {
          // CASB security theme color definitions
          security: [
            '#f0f9ff', // Lightest
            '#e0f2fe',
            '#bae6fd',
            '#7dd3fc',
            '#38bdf8',
            '#0ea5e9', // Base color
            '#0284c7',
            '#0369a1',
            '#075985',
            '#0c4a6e', // Darkest
          ],
          danger: [
            '#fef2f2',
            '#fee2e2',
            '#fecaca',
            '#fca5a5',
            '#f87171',
            '#ef4444', // Base red
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
