import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import projectService, { Project, ProjectNode } from '@/services/projectService';
import { debounce } from 'lodash';

interface ProjectStore {
  // Current project
  currentProject: Project | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastSaved: Date | null;

  // Auto-save
  autoSaveEnabled: boolean;
  hasUnsavedChanges: boolean;
  isEditingProjectName: boolean;

  // Actions
  createProject: (name?: string) => Promise<Project>;
  loadProject: (id: string) => Promise<Project>;
  updateProject: (updates: Partial<Project>) => Promise<void>;
  saveProject: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project>;
  
  // Node/Edge updates
  updateNodes: (nodes: ProjectNode[]) => void;
  updateEdges: (edges: any[]) => void;
  updateViewport: (viewport: any) => void;
  
  // Utils
  setAutoSave: (enabled: boolean) => void;
  clearProject: () => void;
  setError: (error: string | null) => void;
  setIsEditingProjectName: (isEditing: boolean) => void;
}

const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => {
      // Debounced auto-save function
      const debouncedAutoSave = debounce(async () => {
        const { currentProject, autoSaveEnabled, hasUnsavedChanges, isEditingProjectName } = get();
        
        console.log('Auto-save triggered:', {
          hasProject: !!currentProject,
          autoSaveEnabled,
          hasUnsavedChanges,
          isEditingProjectName,
          nodesCount: currentProject?.nodes?.length || 0
        });
        
        if (!currentProject || !autoSaveEnabled || !hasUnsavedChanges || isEditingProjectName) return;

        set({ isSaving: true });
        
        try {
          console.log('Auto-saving project:', currentProject._id, 'with', currentProject.nodes.length, 'nodes');
          await projectService.autoSaveProject(currentProject._id, {
            nodes: currentProject.nodes,
            edges: currentProject.edges,
            viewport: currentProject.viewport
          });
          
          console.log('Auto-save successful');
          set({
            hasUnsavedChanges: false,
            lastSaved: new Date(),
            isSaving: false
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
          set({ isSaving: false });
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return {
        currentProject: null,
        isLoading: false,
        isSaving: false,
        error: null,
        lastSaved: null,
        autoSaveEnabled: true,
        hasUnsavedChanges: false,
        isEditingProjectName: false,

        createProject: async (name = 'Untitled Project') => {
          set({ isLoading: true, error: null });
          
          try {
            const project = await projectService.createProject({ name });
            set({
              currentProject: project,
              isLoading: false,
              hasUnsavedChanges: false,
              lastSaved: new Date()
            });
            return project;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to create project',
              isLoading: false
            });
            throw error;
          }
        },

        loadProject: async (id: string) => {
          // Clear any existing project data first
          set({ 
            currentProject: null,
            hasUnsavedChanges: false,
            isLoading: true, 
            error: null 
          });
          
          try {
            const project = await projectService.getProject(id);
            set({
              currentProject: project,
              isLoading: false,
              hasUnsavedChanges: false,
              lastSaved: new Date(project.lastModified)
            });
            return project;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to load project',
              isLoading: false
            });
            throw error;
          }
        },

        updateProject: async (updates: Partial<Project>) => {
          const { currentProject } = get();
          if (!currentProject) return;

          set({ isSaving: true, error: null });
          
          try {
            const updatedProject = await projectService.updateProject(
              currentProject._id,
              updates
            );
            set({
              currentProject: updatedProject,
              isSaving: false,
              hasUnsavedChanges: false,
              lastSaved: new Date()
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to update project',
              isSaving: false
            });
            throw error;
          }
        },

        saveProject: async () => {
          const { currentProject } = get();
          if (!currentProject) return;

          set({ isSaving: true, error: null });
          
          try {
            const updatedProject = await projectService.updateProject(
              currentProject._id,
              {
                nodes: currentProject.nodes,
                edges: currentProject.edges,
                viewport: currentProject.viewport
              }
            );
            set({
              currentProject: updatedProject,
              isSaving: false,
              hasUnsavedChanges: false,
              lastSaved: new Date()
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to save project',
              isSaving: false
            });
            throw error;
          }
        },

        deleteProject: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            await projectService.deleteProject(id);
            const { currentProject } = get();
            if (currentProject?._id === id) {
              set({ currentProject: null });
            }
            set({ isLoading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to delete project',
              isLoading: false
            });
            throw error;
          }
        },

        duplicateProject: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const newProject = await projectService.duplicateProject(id);
            set({ isLoading: false });
            return newProject;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to duplicate project',
              isLoading: false
            });
            throw error;
          }
        },

        updateNodes: (nodes: ProjectNode[]) => {
          const { currentProject } = get();
          if (!currentProject) {
            console.log('updateNodes: No current project');
            return;
          }

          console.log('updateNodes: Updating', nodes.length, 'nodes for project', currentProject._id);
          set({
            currentProject: { ...currentProject, nodes },
            hasUnsavedChanges: true
          });

          // Trigger auto-save
          debouncedAutoSave();
        },

        updateEdges: (edges: any[]) => {
          const { currentProject } = get();
          if (!currentProject) return;

          set({
            currentProject: { ...currentProject, edges },
            hasUnsavedChanges: true
          });

          // Trigger auto-save
          debouncedAutoSave();
        },

        updateViewport: (viewport: any) => {
          const { currentProject } = get();
          if (!currentProject) return;

          set({
            currentProject: { ...currentProject, viewport },
            hasUnsavedChanges: true
          });

          // Trigger auto-save
          debouncedAutoSave();
        },

        setAutoSave: (enabled: boolean) => {
          set({ autoSaveEnabled: enabled });
        },

        clearProject: () => {
          set({
            currentProject: null,
            hasUnsavedChanges: false,
            error: null
          });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setIsEditingProjectName: (isEditing: boolean) => {
          set({ isEditingProjectName: isEditing });
        }
      };
    },
    {
      name: 'drampa-project-store',
      partialize: (state) => ({
        autoSaveEnabled: state.autoSaveEnabled
      })
    }
  )
);

export default useProjectStore;