import { Container, Tabs } from '@mantine/core';
import { IconFolder, IconUpload } from '@tabler/icons-react';
import React from 'react';
import { FileList } from '../../components/files/FileList';
import { FileUpload } from '../../components/files/FileUpload';

export const FilesPage: React.FC = () => {
  return (
    <Container size="xl" py="md">
      <Tabs defaultValue="upload" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="upload" leftSection={<IconUpload size={16} />}>
            파일 업로드
          </Tabs.Tab>
          <Tabs.Tab value="manage" leftSection={<IconFolder size={16} />}>
            파일 관리
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="upload" pt="md">
          <FileUpload />
        </Tabs.Panel>

        <Tabs.Panel value="manage" pt="md">
          <FileList />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};
