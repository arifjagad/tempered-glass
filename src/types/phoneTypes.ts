export type CameraPosition = 'center' | 'left' | 'right' | 'punch-hole' | 'notch' | 'under-display' | 'unknown';

export interface PhoneType {
  brand: string;
  model: string;
  screenSize: string;
  resolution: string;
  screenToBody: string;
  dimensions: string;
  cameraPosition: CameraPosition;
  imageUrl: string;
  phonearenaUrl: string;
}