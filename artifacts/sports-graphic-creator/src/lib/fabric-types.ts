import * as fabric from 'fabric';

// Extend Fabric Object to include our custom properties for the sports graphics
export interface CustomFabricObject extends fabric.Object {
  id: string;
  name: string;
  role: 'primary' | 'secondary' | 'accent' | 'text' | 'logo' | 'background' | 'none';
  locked?: boolean;
}

// Utility to safely cast a standard fabric object to our custom type
export const asCustom = (obj: fabric.Object): CustomFabricObject => {
  return obj as unknown as CustomFabricObject;
};
