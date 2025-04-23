export type CameraPosition = 
  | 'top-bezel'
  | 'mini-drop'
  | 'waterdrop'
  | 'punch-hole'
  | 'punch-hole-left'
  | 'punch-hole-right'
  | 'punch-hole-center'
  | 'notch'
  | 'wide-notch'
  | 'under-display'
  | 'unknown';

export interface PhoneType {
  brand: string;
  model: string;
  screenSize: string;
  resolution: string;
  screenToBody: string;
  dimensions: string;
  cameraPosition: CameraPosition;
  imageUrl: string;
  gsmarenaUrl: string;
}