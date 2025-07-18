import { create } from 'zustand';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  selectProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) => set((state) => ({
    products: state.products.map((p) => (p.id === product.id ? product : p)),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),
  selectProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 