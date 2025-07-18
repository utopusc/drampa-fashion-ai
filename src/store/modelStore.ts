import { create } from 'zustand';
import { Model } from '@/types';

interface ModelState {
  models: Model[];
  selectedModel: Model | null;
  loading: boolean;
  error: string | null;
  setModels: (models: Model[]) => void;
  addModel: (model: Model) => void;
  updateModel: (model: Model) => void;
  deleteModel: (id: string) => void;
  selectModel: (model: Model | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  selectedModel: null,
  loading: false,
  error: null,
  setModels: (models) => set({ models }),
  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  updateModel: (model) => set((state) => ({
    models: state.models.map((m) => (m.id === model.id ? model : m)),
  })),
  deleteModel: (id) => set((state) => ({
    models: state.models.filter((m) => m.id !== id),
  })),
  selectModel: (model) => set({ selectedModel: model }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 