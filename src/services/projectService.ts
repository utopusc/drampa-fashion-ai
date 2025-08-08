import api from './api';

export interface StyleItem {
  id: string;
  type: 'background' | 'pose' | 'fashion';
  tag: string;
  image?: string;
  name: string;
}

export interface ProjectNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    model: {
      id: string;
      name: string;
      image: string;
      loraUrl?: string;
    };
    prompt?: string;
    imageSize?: string;
    numImages?: number;
    styleItems?: StyleItem[];
    generatedImages?: any[];
    [key: string]: any; // Allow additional properties
  };
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  nodes: ProjectNode[];
  edges: any[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  thumbnail?: string;
  uiState?: any;
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectListItem {
  _id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  nodes?: ProjectNode[]; // Add nodes for preview
  lastModified: Date;
  createdAt: Date;
}

export interface ProjectsResponse {
  projects: ProjectListItem[];
  totalPages: number;
  currentPage: number;
  totalProjects: number;
}

class ProjectService {
  // Create new project
  async createProject(data: {
    name?: string;
    description?: string;
    nodes?: ProjectNode[];
    edges?: any[];
    viewport?: any;
  }) {
    const response = await api.post('/projects', data);
    return (response.data as any).project;
  }

  // Get user's projects
  async getUserProjects(options: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
  } = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.status) params.append('status', options.status);
    if (options.sortBy) params.append('sortBy', options.sortBy);

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data as ProjectsResponse;
  }

  // Get single project
  async getProject(id: string) {
    const response = await api.get(`/projects/${id}`);
    return (response.data as any).project as Project;
  }

  // Update project
  async updateProject(id: string, data: Partial<Project>) {
    const response = await api.put(`/projects/${id}`, data);
    return (response.data as any).project;
  }

  // Auto-save project (for frequent updates)
  async autoSaveProject(id: string, data: {
    nodes: ProjectNode[];
    edges: any[];
    viewport: any;
  }) {
    const response = await api.patch(`/projects/${id}/autosave`, data);
    return response.data as any;
  }

  // Delete project
  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data as any;
  }

  // Duplicate project
  async duplicateProject(id: string) {
    const response = await api.post(`/projects/${id}/duplicate`);
    return (response.data as any).project;
  }

  // Rename project
  async renameProject(id: string, name: string) {
    const response = await api.put(`/projects/${id}`, { name });
    return (response.data as any).project;
  }

  // Update project status
  async updateProjectStatus(id: string, status: 'draft' | 'published' | 'archived') {
    const response = await api.put(`/projects/${id}`, { status });
    return (response.data as any).project;
  }
}

export default new ProjectService();