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
import useProjectStore from "@/store/projectStore";
import ProjectPreview from "@/components/ProjectPreview";
import { 
  Plus, 
  Clock, 
  Edit3, 
  Trash2, 
  Copy, 
  MoreVertical,
  FolderOpen,
  Archive
} from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { createProject } = useProjectStore();
  
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

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
      const project = await createProject();
      router.push(`/create?project=${project._id}`);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
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
    if (!newProjectName.trim()) return;
    
    try {
      await projectService.renameProject(projectId, newProjectName);
      toast.success('Project renamed successfully');
      setRenamingProjectId(null);
      setNewProjectName('');
      loadProjects();
    } catch (error) {
      toast.error('Failed to rename project');
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
              <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
              <p className="text-muted-foreground">Manage and edit your fashion projects</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setSelectedStatus('draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'draft'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setSelectedStatus('published')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'published'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
            <div className="bg-card rounded-xl border border-border p-12">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedStatus === 'all' 
                    ? "Create your first project to get started"
                    : `No ${selectedStatus} projects found`}
                </p>
                {selectedStatus === 'all' && (
                  <button
                    onClick={handleCreateProject}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Create First Project
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
                    className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                  >
                    <Link href={`/create?project=${project._id}`}>
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ProjectPreview 
                            nodes={project.nodes || []} 
                            className="w-full h-full"
                          />
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                          {project.status}
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-4">
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
                            className="flex-1 px-2 py-1 bg-background border border-border rounded text-sm"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="text-xs text-primary hover:text-primary/80"
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
                        <h3 className="font-semibold text-foreground mb-2 truncate">
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
                              className="p-1 hover:bg-muted rounded-lg transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                              className="bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[160px]"
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
                                onClick={() => handleDeleteProject(project._id)}
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