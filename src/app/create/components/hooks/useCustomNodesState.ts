import { useCallback, useState } from 'react';
import { Node, NodeChange } from '@xyflow/react';

export function useCustomNodesState(initialNodes: Node[]) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((currentNodes) => {
      // Create a completely new array
      let newNodes = [...currentNodes];

      changes.forEach((change) => {
        switch (change.type) {
          case 'position':
            if (change.position) {
              const nodeIndex = newNodes.findIndex((n) => n.id === change.id);
              if (nodeIndex !== -1) {
                // Create a new node object with updated position
                newNodes[nodeIndex] = {
                  ...newNodes[nodeIndex],
                  position: { ...change.position },
                  positionAbsolute: change.positionAbsolute ? { ...change.positionAbsolute } : undefined,
                };
              }
            }
            break;

          case 'dimensions':
            const dimNodeIndex = newNodes.findIndex((n) => n.id === change.id);
            if (dimNodeIndex !== -1 && change.dimensions) {
              // Create new node with updated dimensions
              newNodes[dimNodeIndex] = {
                ...newNodes[dimNodeIndex],
                width: change.dimensions.width,
                height: change.dimensions.height,
              };
            }
            break;

          case 'select':
            const selectNodeIndex = newNodes.findIndex((n) => n.id === change.id);
            if (selectNodeIndex !== -1) {
              newNodes[selectNodeIndex] = {
                ...newNodes[selectNodeIndex],
                selected: change.selected,
              };
            }
            break;

          case 'remove':
            newNodes = newNodes.filter((n) => n.id !== change.id);
            break;

          case 'add':
            if (change.item) {
              newNodes.push({ ...change.item });
            }
            break;

          case 'reset':
            if (change.item) {
              newNodes = change.item.map(n => ({ ...n }));
            }
            break;
        }
      });

      return newNodes;
    });
  }, []);

  return [nodes, setNodes, onNodesChange] as const;
}