import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Connection, Edge, Node } from '@xyflow/react';

export interface PipelineNode extends Node {
  data: {
    label: string;
    type: 'input' | 'processing' | 'output';
    config?: any;
    isValid?: boolean;
    error?: string;
  };
}

export interface PipelineState {
  nodes: PipelineNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  executionProgress: number;
  executionResults: Record<string, any>;
  errors: Record<string, string>;
}

interface PipelineActions {
  // Node management
  addNode: (node: PipelineNode) => void;
  updateNode: (nodeId: string, updates: Partial<PipelineNode>) => void;
  removeNode: (nodeId: string) => void;
  setNodes: (nodes: PipelineNode[]) => void;
  
  // Edge management
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
  setEdges: (edges: Edge[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  
  // Execution
  startExecution: () => void;
  updateProgress: (progress: number) => void;
  setExecutionResult: (nodeId: string, result: any) => void;
  setNodeError: (nodeId: string, error: string) => void;
  completeExecution: () => void;
  
  // Pipeline management
  clearPipeline: () => void;
  loadPipeline: (nodes: PipelineNode[], edges: Edge[]) => void;
  validatePipeline: () => boolean;
}

export const usePipelineStore = create<PipelineState & PipelineActions>()(
  immer((set, get) => ({
    // Initial state
    nodes: [],
    edges: [],
    selectedNodeId: null,
    isExecuting: false,
    executionProgress: 0,
    executionResults: {},
    errors: {},
    
    // Node management
    addNode: (node) => set((state) => {
      state.nodes.push({...node} as any);
    }),
    
    updateNode: (nodeId, updates) => set((state) => {
      const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex >= 0) {
        Object.assign(state.nodes[nodeIndex], updates);
      }
    }),
    
    removeNode: (nodeId) => set((state) => {
      state.nodes = state.nodes.filter(n => n.id !== nodeId);
      state.edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId = null;
      }
      delete state.executionResults[nodeId];
      delete state.errors[nodeId];
    }),
    
    setNodes: (nodes) => set((state) => {
      state.nodes = nodes.map(n => ({...n})) as any;
    }),
    
    // Edge management
    addEdge: (edge) => set((state) => {
      state.edges.push(edge);
    }),
    
    removeEdge: (edgeId) => set((state) => {
      state.edges = state.edges.filter(e => e.id !== edgeId);
    }),
    
    setEdges: (edges) => set((state) => {
      state.edges = edges.map(e => ({...e})) as any;
    }),
    
    onConnect: (connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      if (!source || !target) return;
      
      const id = `${source}-${target}`;
      const newEdge: Edge = {
        id,
        source,
        target,
        sourceHandle: sourceHandle || undefined,
        targetHandle: targetHandle || undefined,
        type: 'smoothstep',
      };
      
      get().addEdge(newEdge);
    },
    
    // Selection
    selectNode: (nodeId) => set((state) => {
      state.selectedNodeId = nodeId;
    }),
    
    // Execution
    startExecution: () => set((state) => {
      state.isExecuting = true;
      state.executionProgress = 0;
      state.executionResults = {};
      state.errors = {};
    }),
    
    updateProgress: (progress) => set((state) => {
      state.executionProgress = progress;
    }),
    
    setExecutionResult: (nodeId, result) => set((state) => {
      state.executionResults[nodeId] = result;
    }),
    
    setNodeError: (nodeId, error) => set((state) => {
      state.errors[nodeId] = error;
      const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex >= 0) {
        state.nodes[nodeIndex].data.isValid = false;
        state.nodes[nodeIndex].data.error = error;
      }
    }),
    
    completeExecution: () => set((state) => {
      state.isExecuting = false;
      state.executionProgress = 100;
    }),
    
    // Pipeline management
    clearPipeline: () => set((state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
      state.executionResults = {};
      state.errors = {};
      state.executionProgress = 0;
    }),
    
    loadPipeline: (nodes, edges) => set((state) => {
      state.nodes = nodes.map(n => ({...n})) as any;
      state.edges = edges.map(e => ({...e})) as any;
      state.selectedNodeId = null;
      state.executionResults = {};
      state.errors = {};
      state.executionProgress = 0;
    }),
    
    validatePipeline: () => {
      const state = get();
      
      // Check if pipeline has at least one input and one output
      const hasInput = state.nodes.some(n => n.data.type === 'input');
      const hasOutput = state.nodes.some(n => n.data.type === 'output');
      
      if (!hasInput || !hasOutput) {
        return false;
      }
      
      // Check if all nodes are connected (except input nodes)
      const nonInputNodes = state.nodes.filter(n => n.data.type !== 'input');
      for (const node of nonInputNodes) {
        const hasIncomingEdge = state.edges.some(e => e.target === node.id);
        if (!hasIncomingEdge) {
          return false;
        }
      }
      
      // TODO: Add more validation rules as needed
      
      return true;
    },
  }))
);