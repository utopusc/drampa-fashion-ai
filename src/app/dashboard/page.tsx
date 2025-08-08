"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraText } from "@/components/magicui/aurora-text";
import { FeatureCard4 } from "@/components/ui/feature-card-4";
import { formatCreditsAsDollars } from "@/lib/format";
import projectService, { ProjectListItem } from "@/services/projectService";
import { Camera, Package2, Ghost } from "lucide-react";
import useProjectStore from "@/store/projectStore";
import { usePipelineStore } from "@/store/pipelineStore";
import ProjectPreview from "@/components/ProjectPreview";
import ProjectImageSlideshow from "@/components/ProjectImageSlideshow";
import { 
  Plus, 
  Clock, 
  Edit3, 
  Trash2, 
  Copy, 
  MoreVertical,
  FolderOpen,
  Archive,
  Sparkles
} from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { createProject } = useProjectStore();
  const { clearPipeline } = usePipelineStore();
  
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  // Helper function to detect project type
  const getProjectType = (project: ProjectListItem) => {
    // Check if project has nodes with data
    if (project.nodes && project.nodes.length > 0) {
      const firstNode = project.nodes[0];
      
      // Check for generation type in node data
      if (firstNode.data?.generationType) {
        switch (firstNode.data.generationType) {
          case 'on-model':
            return { icon: Camera, label: 'On-Model', color: 'bg-blue-500' };
          case 'flat-lay':
            return { icon: Package2, label: 'Flat Lay', color: 'bg-green-500' };
          case 'mannequin':
            return { icon: Ghost, label: 'Mannequin', color: 'bg-purple-500' };
          default:
            return { icon: Camera, label: 'Fashion', color: 'bg-orange-500' };
        }
      }
      
      // Check for portrait mode
      if (firstNode.data?.isPortraitMode) {
        return { icon: Camera, label: 'Portrait', color: 'bg-pink-500' };
      }
    }
    
    return { icon: Camera, label: 'Fashion', color: 'bg-orange-500' };
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, currentPage, selectedStatus]);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await projectService.getUserProjects({
        page: currentPage,
        limit: 9,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });
      
      setProjects(response.projects);
      setTotalProjects(response.totalProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      // Clear pipeline store before creating new project
      clearPipeline();
      const project = await createProject();
      router.push(`/create?project=${project._id}`);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`);
    
    if (!confirmed) return;
    
    try {
      setDeletingProjectId(projectId);
      await projectService.deleteProject(projectId);
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      const newProject = await projectService.duplicateProject(projectId);
      toast.success('Project duplicated successfully');
      loadProjects();
    } catch (error) {
      toast.error('Failed to duplicate project');
    }
  };

  const handleRenameProject = async (projectId: string) => {
    if (!newProjectName.trim()) {
      setRenamingProjectId(null);
      setNewProjectName('');
      return;
    }
    
    try {
      await projectService.renameProject(projectId, newProjectName.trim());
      toast.success('Project renamed successfully');
      setRenamingProjectId(null);
      setNewProjectName('');
      loadProjects();
    } catch (error) {
      toast.error('Failed to rename project');
      setRenamingProjectId(null);
      setNewProjectName('');
    }
  };

  const orangeAuroraColors = ["#FF7722", "#FF9933", "#FFB366", "#FFC999"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome back,{" "}
            <AuroraText colors={orangeAuroraColors} speed={0.8}>
              {user.name || user.email}
            </AuroraText>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Continue working on your fashion projects or create a new one
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-3xl font-bold text-primary mb-1">{totalProjects}</div>
            <div className="text-muted-foreground text-sm">Total Projects</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-3xl font-bold text-primary mb-1">
              {projects.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-muted-foreground text-sm">Drafts</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-3xl font-bold text-primary mb-1">
              {formatCreditsAsDollars(user?.credits || 0)}
            </div>
            <div className="text-muted-foreground text-sm">Balance</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="text-3xl font-bold text-green-500 mb-1">Active</div>
            <div className="text-muted-foreground text-sm">Status</div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Fashion Collections</h2>
              <p className="text-muted-foreground text-lg">Create stunning AI-powered fashion photography</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium"
            >
              <Sparkles className="w-5 h-5" />
              New Collection
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-3 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedStatus === 'all'
                  ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              All Collections
            </button>
            <button
              onClick={() => setSelectedStatus('draft')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedStatus === 'draft'
                  ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setSelectedStatus('published')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedStatus === 'published'
                  ? 'bg-white dark:bg-gray-900 text-orange-600 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Published
            </button>
          </div>

          {/* Projects Grid */}
          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                  <div className="h-40 bg-muted rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-2xl border border-orange-200 dark:border-orange-800/30 p-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Start Your Fashion Journey</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  {selectedStatus === 'all' 
                    ? "Create your first collection and bring your fashion ideas to life with AI"
                    : `No ${selectedStatus} collections found`}
                </p>
                {selectedStatus === 'all' && (
                  <button
                    onClick={handleCreateProject}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 font-medium text-lg"
                  >
                    Create First Collection
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300"
                  >
                    <Link href={`/create?project=${project._id}`}>
                      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <ProjectImageSlideshow 
                            nodes={project.nodes || []} 
                            className="w-full h-full"
                          />
                        )}
                        {/* Project Type Badge */}
                        {(() => {
                          const projectType = getProjectType(project);
                          const Icon = projectType.icon;
                          return (
                            <div className={`absolute top-3 left-3 px-3 py-1.5 ${projectType.color} backdrop-blur-sm rounded-full flex items-center gap-1.5 text-white shadow-lg`}>
                              <Icon className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{projectType.label}</span>
                            </div>
                          );
                        })()}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                          {project.status}
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-5">
                      {renamingProjectId === project._id ? (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRenameProject(project._id);
                          }}
                          className="flex gap-2 mb-2"
                        >
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder={project.name}
                            className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingProjectId(null);
                              setNewProjectName('');
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <h3 className="font-semibold text-lg text-foreground mb-2 truncate group-hover:text-orange-600 transition-colors">
                          {project.name}
                        </h3>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                        </div>
                        
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button 
                              className="p-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition-colors group-hover:opacity-100 opacity-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </DropdownMenu.Trigger>
                          
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-1.5 min-w-[180px] z-50"
                              sideOffset={5}
                            >
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted cursor-pointer"
                                onClick={() => router.push(`/create?project=${project._id}`)}
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted cursor-pointer"
                                onClick={() => {
                                  setRenamingProjectId(project._id);
                                  setNewProjectName(project.name);
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                                Rename
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-muted cursor-pointer"
                                onClick={() => handleDuplicateProject(project._id)}
                              >
                                <Copy className="w-4 h-4" />
                                Duplicate
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Separator className="h-px bg-border my-1" />
                              
                              <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-destructive/10 text-destructive cursor-pointer"
                                onClick={() => handleDeleteProject(project._id, project.name)}
                                disabled={deletingProjectId === project._id}
                              >
                                <Trash2 className="w-4 h-4" />
                                {deletingProjectId === project._id ? 'Deleting...' : 'Delete'}
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;