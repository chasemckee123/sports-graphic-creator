export interface CanvasFormat {
  name: string;
  width: number;
  height: number;
}

export const FORMAT_PRESETS: CanvasFormat[] = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Twitter/X Post', width: 1600, height: 900 },
  { name: 'Facebook Cover', width: 1640, height: 924 },
];
