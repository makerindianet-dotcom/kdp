
export interface ColoringPage {
  id: string;
  title: string;
  prompt: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
}

export enum PageStyle {
  Simple = 'Simple & Clean (Kids)',
  Detailed = 'Intricate & Detailed (Adults)',
  Mandala = 'Mandala Style',
  Sketch = 'Hand-drawn Sketch',
  Vector = 'Crisp Vector Lines'
}

export interface CollectionConfig {
  theme: string;
  style: PageStyle;
  targetAudience: string;
}
