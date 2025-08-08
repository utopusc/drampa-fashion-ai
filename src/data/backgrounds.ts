export interface BackgroundData {
  id: string;
  name: string;
  image: string;
  tag: string;
}

export const backgrounds: BackgroundData[] = [
  { 
    id: 'beach', 
    name: 'Beach', 
    image: '/assets/Background/beach.jpg', 
    tag: 'beach background, sunny, coastal'
  },
  { 
    id: 'nature', 
    name: 'Nature', 
    image: '/assets/Background/nature.jpg', 
    tag: 'nature background, forest, outdoors'
  },
  { 
    id: 'city', 
    name: 'Big City', 
    image: '/assets/Background/BigCity.webp', 
    tag: 'urban city background, metropolitan'
  }
];