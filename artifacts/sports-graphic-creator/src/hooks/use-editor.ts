import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { CustomFabricObject, asCustom } from '@/lib/fabric-types';
import { applyTemplate } from '@/lib/templates';
import { useGetBrand } from '@workspace/api-client-react';

export function useEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<CustomFabricObject | null>(null);
  const [objects, setObjects] = useState<CustomFabricObject[]>([]);
  const [zoom, setZoom] = useState(1);
  const [styleRotation, setStyleRotation] = useState(0);

  const { data: brand } = useGetBrand({
    query: {
      retry: false, // Don't block UI if backend is not setup
    }
  });

  // Default brand fallback if API fails
  const currentBrand = brand || {
    primaryColor: '#00FF66',
    secondaryColor: '#1E293B',
    accentColor: '#FFFFFF',
    logoUrl: `${import.meta.env.BASE_URL}images/default-logo.png`,
    organizationName: 'Team Name'
  };

  const syncObjects = useCallback((c: fabric.Canvas) => {
    // Reverse so top layers are at the top of the list
    setObjects([...c.getObjects().map(asCustom)].reverse());
  }, []);

  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const c = new fabric.Canvas(canvasRef.current, {
      width: 1080,
      height: 1080,
      preserveObjectStacking: true,
      selectionColor: 'rgba(0, 255, 102, 0.2)',
      selectionBorderColor: '#00FF66',
      selectionLineWidth: 2,
    });

    // Custom properties to serialize
    const originalToJSON = c.toJSON;
    c.toJSON = function (propertiesToInclude = []) {
      return originalToJSON.call(this, ['id', 'name', 'role', 'locked', ...propertiesToInclude]);
    };

    c.on('selection:created', (e) => setActiveObject(asCustom(e.selected?.[0] as fabric.Object)));
    c.on('selection:updated', (e) => setActiveObject(asCustom(e.selected?.[0] as fabric.Object)));
    c.on('selection:cleared', () => setActiveObject(null));
    
    c.on('object:added', () => syncObjects(c));
    c.on('object:removed', () => syncObjects(c));
    c.on('object:modified', () => syncObjects(c));
    c.on('text:changed', () => { c.renderAll(); syncObjects(c); });

    setCanvas(c);
    applyTemplate(c, 'Game Day', currentBrand.logoUrl);

    return () => {
      c.dispose();
      setCanvas(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  // Actions
  const loadTemplate = (name: string) => {
    if (!canvas) return;
    applyTemplate(canvas, name, currentBrand.logoUrl);
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('NEW TEXT', {
      fontFamily: 'Teko',
      fontSize: 100,
      fill: '#ffffff',
      left: 540,
      top: 540,
      originX: 'center',
      originY: 'center',
    });
    Object.assign(text, { id: crypto.randomUUID(), name: 'Text Layer', role: 'text' });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!canvas) return;
    let shape;
    const common = { fill: currentBrand.primaryColor, left: 540, top: 540, originX: 'center', originY: 'center' as const };
    
    if (type === 'rect') shape = new fabric.Rect({ ...common, width: 200, height: 200 });
    else if (type === 'circle') shape = new fabric.Circle({ ...common, radius: 100 });
    else shape = new fabric.Triangle({ ...common, width: 200, height: 200 });

    Object.assign(shape, { id: crypto.randomUUID(), name: `New ${type}`, role: 'primary' });
    canvas.add(shape);
    canvas.setActiveObject(shape);
  };

  const autoBrand = () => {
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      const cObj = asCustom(obj);
      if (cObj.role === 'primary') obj.set('fill', currentBrand.primaryColor);
      if (cObj.role === 'secondary') obj.set('fill', currentBrand.secondaryColor);
      if (cObj.role === 'accent') obj.set('fill', currentBrand.accentColor);
      
      if (cObj.role === 'logo' && currentBrand.logoUrl) {
         fabric.Image.fromURL(currentBrand.logoUrl, (newImg) => {
           if (!newImg) return;
           newImg.set({
             left: obj.left, top: obj.top,
             scaleX: obj.scaleX, scaleY: obj.scaleY,
             originX: obj.originX, originY: obj.originY,
             angle: obj.angle
           });
           Object.assign(newImg, { id: cObj.id, name: cObj.name, role: cObj.role });
           canvas.remove(obj);
           canvas.add(newImg);
           canvas.renderAll();
         }, { crossOrigin: 'anonymous' });
      }
    });
    canvas.renderAll();
    syncObjects(canvas);
  };

  const switchStyle = () => {
    if (!canvas) return;
    const nextRot = (styleRotation + 1) % 3;
    setStyleRotation(nextRot);

    // Rotations:
    // 0: P->P, S->S, A->A
    // 1: P->S, S->A, A->P
    // 2: P->A, S->P, A->S
    const palettes = [
      { primary: currentBrand.primaryColor, secondary: currentBrand.secondaryColor, accent: currentBrand.accentColor },
      { primary: currentBrand.secondaryColor, secondary: currentBrand.accentColor, accent: currentBrand.primaryColor },
      { primary: currentBrand.accentColor, secondary: currentBrand.primaryColor, accent: currentBrand.secondaryColor },
    ];

    const currentPalette = palettes[nextRot];

    canvas.getObjects().forEach((obj) => {
      const cObj = asCustom(obj);
      if (cObj.role === 'primary') obj.set('fill', currentPalette.primary);
      if (cObj.role === 'secondary') obj.set('fill', currentPalette.secondary);
      if (cObj.role === 'accent') obj.set('fill', currentPalette.accent);
    });
    canvas.renderAll();
    syncObjects(canvas);
  };

  const deleteActive = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject as fabric.Object);
    canvas.discardActiveObject();
  };

  const exportCanvas = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `sports-graphic-${Date.now()}.png`;
    a.click();
  };

  // Property updaters
  const updateObjectProp = (key: string, value: any) => {
    if (!canvas || !activeObject) return;
    (activeObject as any).set(key, value);
    canvas.renderAll();
    syncObjects(canvas);
    // Force re-render of active object properties
    setActiveObject({ ...asCustom(activeObject as fabric.Object) }); 
  };

  const moveLayer = (obj: CustomFabricObject, direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!canvas) return;
    const fObj = obj as fabric.Object;
    if (direction === 'up') canvas.bringForward(fObj);
    if (direction === 'down') canvas.sendBackwards(fObj);
    if (direction === 'top') canvas.bringToFront(fObj);
    if (direction === 'bottom') canvas.sendToBack(fObj);
    canvas.renderAll();
    syncObjects(canvas);
  };

  return {
    canvasRef,
    canvas,
    objects,
    activeObject,
    zoom,
    setZoom,
    actions: {
      loadTemplate,
      addText,
      addShape,
      autoBrand,
      switchStyle,
      deleteActive,
      exportCanvas,
      updateObjectProp,
      moveLayer,
    }
  };
}
