"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PortraitEditor from "./components/PortraitEditor";
import GenerateButton from "./components/GenerateButton";
import { Toaster } from "react-hot-toast";
import { ArrowLeftIcon, Save, Loader2 } from "lucide-react";
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
    clearProject
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
            <h1 className="text-lg font-semibold text-foreground">
              {currentProject?.name || 'Fashion Design Studio'}
            </h1>
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