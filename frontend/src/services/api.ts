/// <reference types="node" />
import axios from 'axios';
import { ApiResponse } from '../types/api.types';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // 인증 만료 시 로그아웃 처리
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API 함수들
export const api = {
  // 헬스 체크
  health: (): Promise<ApiResponse<any>> =>
    apiClient.get('/health').then((res) => res.data),

  // 파일 관련
  uploadFile: (formData: FormData): Promise<ApiResponse<any>> =>
    apiClient
      .post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data),

  getFiles: (): Promise<ApiResponse<any>> =>
    apiClient.get('/files').then((res) => res.data),

  // 보안 정책 관련
  getPolicies: (): Promise<ApiResponse<any>> =>
    apiClient.get('/policies').then((res) => res.data),

  // 보안 이벤트 관련
  getSecurityEvents: (): Promise<ApiResponse<any>> =>
    apiClient.get('/events').then((res) => res.data),

  // 대시보드 통계
  getDashboardStats: (): Promise<ApiResponse<any>> =>
    apiClient.get('/dashboard/stats').then((res) => res.data),
};

export default apiClient;
