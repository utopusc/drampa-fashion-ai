"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PortraitEditor from "./components/PortraitEditor";
import GenerateButton from "./components/GenerateButton";
import { Toaster } from "react-hot-toast";
import { ArrowLeftIcon, Save, Loader2, Edit3, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatCreditsAsDollars } from "@/lib/format";
import useProjectStore from "@/store/projectStore";
import { usePipelineStore } from "@/store/pipelineStore";
import { toast } from "sonner";

function CreatePageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userBalance, setUserBalance] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState('');
  
  // Project store
  const { 
    currentProject, 
    loadProject, 
    createProject, 
    saveProject,
    updateProject,
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    clearProject,
    setIsEditingProjectName
  } = useProjectStore();
  
  // Pipeline store
  const { clearPipeline, loadPipeline } = usePipelineStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    } else if (user) {
      setUserBalance(user.credits || 0);
      
      // Load or create project
      const projectId = searchParams.get('project');
      if (projectId && projectId !== currentProject?._id) {
        // Clear pipeline before loading new project
        clearPipeline();
        // Load project only if it's different from current one
        loadProject(projectId).then((project) => {
          // Load nodes and edges to pipeline store
          if (project.nodes && project.edges) {
            // Convert ProjectNode to PipelineNode format
            const pipelineNodes = project.nodes.map((node: any) => ({
              id: node.id,
              type: node.type,
              position: node.position,
              data: {
                ...node.data,
                label: node.data.model?.name || 'Model',
                type: 'processing' as const,
              },
            }));
            loadPipeline(pipelineNodes, project.edges);
          }
        }).catch((error) => {
          toast.error('Failed to load project');
          router.push('/dashboard');
        });
      } else if (!projectId) {
        // Clear any existing project and pipeline first
        clearProject();
        clearPipeline();
        // Create new project if no ID provided
        createProject('Untitled Project').then((project) => {
          // Update URL with new project ID without reloading
          const url = new URL(window.location.href);
          url.searchParams.set('project', project._id);
          window.history.pushState({}, '', url.toString());
        }).catch((error) => {
          toast.error('Failed to create project');
          router.push('/dashboard');
        });
      }
    }
  }, [user, loading, router, searchParams]);
  
  // Update project name when project changes
  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
    }
  }, [currentProject]);
  
  // Handle project rename
  const handleRenameProject = async () => {
    if (!currentProject || !projectName.trim() || projectName === currentProject.name) {
      setIsEditingName(false);
      setIsEditingProjectName(false);
      return;
    }
    
    try {
      await updateProject({ name: projectName });
      toast.success('Project renamed successfully');
      setIsEditingName(false);
      setIsEditingProjectName(false);
    } catch (error) {
      toast.error('Failed to rename project');
      setProjectName(currentProject.name);
      setIsEditingProjectName(false);
    }
  };

  // Show loading while checking auth
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

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Simple Header */}
      <header className="h-16 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">
                {currentProject?.name || 'Fashion Design Studio'}
              </h1>
              {currentProject && (
                <button
                  onClick={() => {
                    setIsEditingName(true);
                    setIsEditingProjectName(true);
                  }}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {hasUnsavedChanges ? 'Unsaved changes' : lastSaved ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Create your perfect look'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          
          {/* Save indicator */}
          {(isSaving || hasUnsavedChanges) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>Auto-save pending</span>
                </>
              )}
            </div>
          )}
          
          {/* Save button */}
          <button
            onClick={async () => {
              try {
                await saveProject();
                toast.success('Project saved successfully');
              } catch (error) {
                console.error('Save error:', error);
                toast.error('Failed to save project');
              }
            }}
            disabled={!hasUnsavedChanges || isSaving}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-card border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          
          <span className="text-sm text-muted-foreground">
            Balance: <span className="font-medium text-foreground">{formatCreditsAsDollars(userBalance)}</span>
          </span>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <PortraitEditor 
          onGenerateClick={() => {
            // This will be handled by the GenerateButton in the header
            const generateBtn = document.querySelector('[data-generate-button]');
            if (generateBtn) {
              (generateBtn as HTMLButtonElement).click();
            }
          }}
        />
      </div>
      
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
      
      {/* Project Name Edit Modal */}
      <AnimatePresence>
        {isEditingName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsEditingName(false);
              setIsEditingProjectName(false);
              setProjectName(currentProject?.name || '');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-md w-full mx-4 border border-border shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Edit Project Name</h2>
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setIsEditingProjectName(false);
                    setProjectName(currentProject?.name || '');
                  }}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRenameProject();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-2 text-lg bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter project name..."
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setIsEditingProjectName(false);
                      setProjectName(currentProject?.name || '');
                    }}
                    className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!projectName.trim() || projectName === currentProject?.name}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}