export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
};

export type Model = {
  id: string;
  user_id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  body_type: string;
  facial_features: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  category: 'clothing' | 'bags' | 'accessories';
  description?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type Collection = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type GeneratedImage = {
  id: string;
  user_id: string;
  model_id: string;
  product_id?: string;
  collection_id?: string;
  image_url: string;
  settings: {
    background?: string;
    pose?: string;
    angle?: string;
    resolution?: string;
  };
  created_at: string;
}; 