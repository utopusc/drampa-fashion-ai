"use client";

import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  ReactFlowProvider,
  Node,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { usePipelineStore } from '@/store/pipelineStore';
import CleanModelNode from './nodes/CleanModelNode';
import UnifiedSidebar from './sidebar/UnifiedSidebar';
import { useCustomNodesState } from './hooks/useCustomNodesState';
import { DragProvider, useDrag } from './DragContext';
import useProjectStore from '@/store/projectStore';

// Custom node types
const nodeTypes = {
  modelNode: CleanModelNode,
};

interface SelectedItem {
  type: string;
  value: string;
}

function PipelineEditorV3() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<any>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  
  // Project store
  const { currentProject, updateNodes, updateViewport } = useProjectStore();
  
  // Use custom nodes state hook - initialize with project nodes if available
  const [nodes, setNodes, onNodesChange] = useCustomNodesState([]);
  
  // Create reusable handlers
  const createNodeHandlers = useCallback((nodeId: string) => ({
    onDelete: () => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    },
    onUpdate: (updatedData: any) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: { 
                ...n.data,
                ...updatedData,
                onDelete: n.data.onDelete,
                onUpdate: n.data.onUpdate
              },
            };
          }
          return n;
        })
      );
    },
  }), [setNodes]);
  
  // Add node function for cloning
  const addNodeWithData = useCallback((nodeData: any) => {
    const handlers = createNodeHandlers(nodeData.id);
    setNodes((nds) => [...nds, {
      ...nodeData,
      data: {
        ...nodeData.data,
        ...handlers
      }
    }]);
  }, [createNodeHandlers, setNodes]);
  
  // Load nodes from project when it changes
  useEffect(() => {
    console.log('Project changed:', currentProject);
    if (currentProject?.nodes && currentProject.nodes.length > 0) {
      console.log('Loading nodes:', currentProject.nodes);
      // Convert project nodes to React Flow nodes with handlers
      const flowNodes = currentProject.nodes.map((node: any) => ({
        ...node,
        data: {
          ...node.data,
          ...createNodeHandlers(node.id),
          addNodeWithData,
        },
      }));
      console.log('Setting flow nodes:', flowNodes);
      setNodes(flowNodes);
    }
  }, [currentProject?._id]); // Only trigger on project ID change
  
  const { setNodes: setStoreNodes, selectNode } = usePipelineStore();

  // Handle node click
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      try {
        // Check for different data types
        const modelDataString = event.dataTransfer.getData('modelData');
        
        // Only create a new model node if we're dropping a model
        if (!modelDataString) {
          console.log('No model data found, ignoring drop');
          return;
        }

        // Parse model data
        let modelInfo;
        try {
          modelInfo = JSON.parse(modelDataString);
        } catch (error) {
          console.error('Failed to parse model data:', error);
          return;
        }

        // Get the current position
        let position = { x: 100, y: 100 };
        
        if (reactFlowWrapper.current && reactFlowInstance.current) {
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          
          // Get the position relative to the ReactFlow pane
          const flowPosition = reactFlowInstance.current.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          
          position = {
            x: flowPosition.x - 160, // Center the node
            y: flowPosition.y - 100,
          };
        } else if (reactFlowWrapper.current) {
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          position = {
            x: event.clientX - reactFlowBounds.left - 160,
            y: event.clientY - reactFlowBounds.top - 100,
          };
        }

        const nodeId = `model-${Date.now()}`;
        
        // Create completely new node object
        const newNode: Node = {
          id: nodeId,
          type: 'modelNode',
          position: { x: position.x, y: position.y },
          data: {
            model: { ...modelInfo.model },
            imageSize: 'square_hd',
            numImages: 1,
            ...createNodeHandlers(nodeId),
            addNodeWithData,
          },
        };

        // Add node
        setNodes((nds) => [...nds, newNode]);
        
      } catch (error) {
        console.error('Error in onDrop:', error);
      }
    },
    [setNodes]
  );

  // Handle sidebar drop
  const handleSidebarDrop = useCallback((item: any, type: string) => {
    const newItem: SelectedItem = {
      type,
      value: item.tag || item.name,
    };
    setSelectedItems((items) => [...items, newItem]);
  }, []);

  // Handle remove item
  const handleRemoveItem = useCallback((index: number) => {
    setSelectedItems((items) => items.filter((_, i) => i !== index));
  }, []);

  // Sync with pipeline store
  React.useEffect(() => {
    setStoreNodes(nodes as any);
  }, [nodes, setStoreNodes]);
  
  // Sync with project store (debounced to avoid infinite loops)
  React.useEffect(() => {
    console.log('PipelineEditor useEffect:', {
      hasProject: !!currentProject,
      projectId: currentProject?._id,
      nodesCount: nodes.length
    });
    
    if (!currentProject || nodes.length === 0) return;
    
    const timeoutId = setTimeout(() => {
      // Convert nodes to project format (without handlers)
      const projectNodes = nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          model: node.data.model,
          prompt: node.data.prompt,
          imageSize: node.data.imageSize,
          numImages: node.data.numImages,
          styleItems: node.data.styleItems,
        },
      }));
      console.log('PipelineEditor: Calling updateNodes with', projectNodes.length, 'nodes');
      updateNodes(projectNodes);
    }, 500); // Debounce for 500ms
    
    return () => clearTimeout(timeoutId);
  }, [nodes, updateNodes]); // updateNodes is stable from zustand

  // Store ReactFlow instance
  const onInit = useCallback((instance: any) => {
    reactFlowInstance.current = instance;
    
    // Restore viewport if available
    if (currentProject?.viewport) {
      instance.setViewport(currentProject.viewport);
    }
  }, [currentProject?.viewport]);
  
  // Handle viewport changes
  const onViewportChange = useCallback((viewport: any) => {
    if (currentProject) {
      updateViewport(viewport);
    }
  }, [currentProject, updateViewport]);

  return (
    <div className="h-full w-full flex">
      <div 
        className="flex-1 relative bg-gray-50 dark:bg-gray-950" 
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={[]}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={onInit}
          onViewportChange={onViewportChange}
          nodeTypes={nodeTypes}
          fitView={false}
          className="bg-transparent"
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            className="opacity-20"
            color="currentColor"
          />
          <Controls 
            showZoom
            showFitView
            showInteractive
            position="bottom-left"
            className="bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-800"
          />
          <MiniMap 
            nodeColor={() => '#6366f1'}
            nodeBorderRadius={16}
            pannable
            zoomable
            position="top-left"
            className="bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-800"
          />
          
          {/* Drop hint */}
          {nodes.length === 0 && (
            <Panel position="top-center" className="bg-white dark:bg-gray-900 rounded-xl px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Drag a model from the sidebar to start</p>
            </Panel>
          )}
        </ReactFlow>
      </div>
      
      {/* Unified Sidebar */}
      <UnifiedSidebar 
        onDrop={handleSidebarDrop}
        selectedItems={selectedItems}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

// Export with providers
export default function PipelineEditorV3Wrapper() {
  return (
    <DragProvider>
      <ReactFlowProvider>
        <PipelineEditorV3 />
      </ReactFlowProvider>
    </DragProvider>
  );
}