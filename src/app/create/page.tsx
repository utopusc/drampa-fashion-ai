"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PipelineEditorV3 from "./components/PipelineEditorV3";
import GenerateButton from "./components/GenerateButton";
import { Toaster } from "react-hot-toast";
import { ArrowLeftIcon, Save, Loader2, Edit3, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCreditsAsDollars } from "@/lib/format";
import useProjectStore from "@/store/projectStore";
import { toast } from "sonner";
import ImageGallery from "./components/ImageGallery";

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userBalance, setUserBalance] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  
  // Project store
  const { 
    currentProject, 
    loadProject, 
    createProject, 
    saveProject,
    updateProject,
    isSaving,
    hasUnsavedChanges,
    lastSaved 
  } = useProjectStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    } else if (user) {
      setUserBalance(user.credits || 0);
      
      // Load or create project
      const projectId = searchParams.get('project');
      if (projectId) {
        loadProject(projectId).catch((error) => {
          toast.error('Failed to load project');
          router.push('/dashboard');
        });
      } else {
        // Create new project if no ID provided
        createProject('Untitled Project').catch((error) => {
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
      return;
    }
    
    try {
      await updateProject({ name: projectName });
      toast.success('Project renamed successfully');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to rename project');
      setProjectName(currentProject.name);
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
            {isEditingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRenameProject();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={handleRenameProject}
                  className="px-2 py-1 text-lg font-semibold bg-transparent border-b-2 border-primary focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingName(false);
                    setProjectName(currentProject?.name || '');
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {currentProject?.name || 'Fashion Design Studio'}
                </h1>
                {currentProject && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {hasUnsavedChanges ? 'Unsaved changes' : lastSaved ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Create your perfect look'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Gallery Button */}
          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Gallery
          </button>
          
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
          <GenerateButton
            userBalance={userBalance}
            onGenerate={(cost) => setUserBalance(prev => prev - cost)}
          />
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <PipelineEditorV3 />
      </div>
      
      {/* Image Gallery */}
      <ImageGallery 
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
      />
      
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
    </div>
  );
}