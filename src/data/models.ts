export interface ModelData {
  id: string;
  name: string;
  gender: 'male' | 'female';
  photo: string;
  loraUrl: string;
  description?: string;
}

export const models: ModelData[] = [
  {
    id: 'emma',
    name: 'Emma',
    gender: 'female',
    photo: '/assets/models/(women)/emma.jpeg',
    loraUrl: 'https://v3.fal.media/files/penguin/B9rZ94GAlkyqdeqCfHtgU_pytorch_lora_weights.safetensors',
    description: 'Young professional model'
  }
];