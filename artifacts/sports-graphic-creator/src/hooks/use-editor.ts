import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { CustomFabricObject, asCustom } from '@/lib/fabric-types';
import { applyTemplate, templateDimensions } from '@/lib/templates';
import { useGetBrand } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { CanvasFormat, FORMAT_PRESETS } from '@/lib/canvas-formats';

fabric.FabricObject.ownDefaults.originX = 'left';
fabric.FabricObject.ownDefaults.originY = 'top';

interface BrandData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  organizationName: string;
}

const DEFAULT_BRAND: BrandData = {
  primaryColor: '#1a3a6b',
  secondaryColor: '#c8a951',
  accentColor: '#ffffff',
  organizationName: 'My Team',
};

export function useEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<CustomFabricObject | null>(null);
  const [objects, setObjects] = useState<CustomFabricObject[]>([]);
  const [zoom, setZoom] = useState(1);
  const [styleRotation, setStyleRotation] = useState(0);
  const [canvasFormat, setCanvasFormat] = useState<CanvasFormat>(FORMAT_PRESETS[0]);
  const queryClient = useQueryClient();

  const { data: brand } = useGetBrand({
    query: {
      retry: false,
    },
  });

  const currentBrand: BrandData = brand
    ? {
        primaryColor: brand.primaryColor || DEFAULT_BRAND.primaryColor,
        secondaryColor: brand.secondaryColor || DEFAULT_BRAND.secondaryColor,
        accentColor: brand.accentColor || DEFAULT_BRAND.accentColor,
        logoUrl: brand.logoUrl,
        organizationName: brand.organizationName || DEFAULT_BRAND.organizationName,
      }
    : DEFAULT_BRAND;

  const syncObjects = useCallback((c: fabric.Canvas) => {
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
    c.on('text:changed', () => {
      c.renderAll();
      syncObjects(c);
    });

    setCanvas(c);
    applyTemplate(c, 'Game Day', currentBrand.logoUrl);

    return () => {
      c.dispose();
      setCanvas(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  const changeFormat = (format: CanvasFormat) => {
    if (!canvas) return;
    const oldWidth = canvas.getWidth();
    const oldHeight = canvas.getHeight();
    const ratioX = format.width / oldWidth;
    const ratioY = format.height / oldHeight;
    const uniformScale = Math.min(ratioX, ratioY);

    canvas.getObjects().forEach((obj) => {
      const cObj = asCustom(obj);
      const left = obj.left ?? 0;
      const top = obj.top ?? 0;

      if (cObj.role === 'background') {
        obj.set({
          left: 0,
          top: 0,
          width: format.width,
          height: format.height,
          scaleX: 1,
          scaleY: 1,
        });
      } else {
        obj.set({
          left: left * ratioX,
          top: top * ratioY,
          scaleX: (obj.scaleX ?? 1) * uniformScale,
          scaleY: (obj.scaleY ?? 1) * uniformScale,
        });
      }
      obj.setCoords();
    });

    canvas.setDimensions({ width: format.width, height: format.height });
    canvas.renderAll();
    syncObjects(canvas);
    setCanvasFormat(format);
  };

  const loadTemplate = (name: string) => {
    if (!canvas) return;
    const dims = templateDimensions[name] || { width: canvasFormat.width, height: canvasFormat.height };
    setCanvasFormat({ name: canvasFormat.name, width: dims.width, height: dims.height });
    applyTemplate(canvas, name, currentBrand.logoUrl, dims.width, dims.height);
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox('NEW TEXT', {
      fontFamily: 'Teko',
      fontSize: 100,
      fill: '#ffffff',
      width: 500,
      left: canvasFormat.width / 2,
      top: canvasFormat.height / 2,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });
    Object.assign(text, { id: crypto.randomUUID(), name: 'Text Layer', role: 'text' });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addImage = () => {
    if (!canvas) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onerror = () => {
        console.error('Failed to read image file');
      };
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!dataUrl) return;
        const imgEl = new Image();
        imgEl.onerror = () => {
          console.error('Failed to load image');
        };
        imgEl.onload = () => {
          const fImg = new fabric.Image(imgEl);
          const maxDim = 600;
          const scale = Math.min(maxDim / imgEl.width, maxDim / imgEl.height, 1);
          fImg.set({
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
          });
          Object.assign(fImg, { id: crypto.randomUUID(), name: 'Image Layer', role: 'none' });
          canvas.add(fImg);
          canvas.setActiveObject(fImg);
          canvas.renderAll();
        };
        imgEl.src = dataUrl;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!canvas) return;
    let shape;
    const common = { fill: currentBrand.primaryColor, left: canvasFormat.width / 2, top: canvasFormat.height / 2, originX: 'center', originY: 'center' as const };

    if (type === 'rect') shape = new fabric.Rect({ ...common, width: 200, height: 200 });
    else if (type === 'circle') shape = new fabric.Circle({ ...common, radius: 100 });
    else shape = new fabric.Triangle({ ...common, width: 200, height: 200 });

    Object.assign(shape, { id: crypto.randomUUID(), name: `New ${type}`, role: 'primary' });
    canvas.add(shape);
    canvas.setActiveObject(shape);
  };

  const autoBrand = async (): Promise<{ success: boolean; brand: BrandData }> => {
    if (!canvas) return { success: false, brand: currentBrand };

    let freshBrand: BrandData = currentBrand;
    try {
      await queryClient.invalidateQueries({ queryKey: ['/api/brand'] });
      const response = await fetch('/api/brand');
      if (response.ok) {
        const data = await response.json();
        freshBrand = {
          primaryColor: data.primaryColor || DEFAULT_BRAND.primaryColor,
          secondaryColor: data.secondaryColor || DEFAULT_BRAND.secondaryColor,
          accentColor: data.accentColor || DEFAULT_BRAND.accentColor,
          logoUrl: data.logoUrl,
          organizationName: data.organizationName || DEFAULT_BRAND.organizationName,
        };
        queryClient.setQueryData(['/api/brand'], data);
      }
    } catch {
      // Fall back to cached brand
    }

    setStyleRotation(0);

    const objectsToProcess = [...canvas.getObjects()];
    for (const obj of objectsToProcess) {
      const cObj = asCustom(obj);
      if (cObj.role === 'primary') obj.set('fill', freshBrand.primaryColor);
      if (cObj.role === 'secondary') obj.set('fill', freshBrand.secondaryColor);
      if (cObj.role === 'accent') obj.set('fill', freshBrand.accentColor);

      if (cObj.role === 'logo' && freshBrand.logoUrl) {
        try {
          const newImg = await fabric.Image.fromURL(
            freshBrand.logoUrl!,
            { crossOrigin: 'anonymous' }
          );
          if (newImg) {
            newImg.set({
              left: obj.left,
              top: obj.top,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              originX: obj.originX,
              originY: obj.originY,
              angle: obj.angle,
            });
            Object.assign(newImg, { id: cObj.id, name: cObj.name, role: cObj.role });
            canvas.remove(obj);
            canvas.add(newImg);
          }
        } catch {
          // Keep existing logo if loading fails
        }
      }
    }
    canvas.renderAll();
    syncObjects(canvas);
    return { success: true, brand: freshBrand };
  };

  const switchStyle = (): { rotation: number; brand: BrandData } => {
    if (!canvas) return { rotation: 0, brand: currentBrand };
    const nextRot = (styleRotation + 1) % 3;
    setStyleRotation(nextRot);

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
    return { rotation: nextRot, brand: currentBrand };
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
    const formatSlug = canvasFormat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `sports-graphic-${formatSlug}-${canvasFormat.width}x${canvasFormat.height}-${Date.now()}.png`;
    a.click();
  };

  const updateObjectProp = (key: string, value: any) => {
    if (!canvas || !activeObject) return;
    (activeObject as any).set(key, value);
    canvas.renderAll();
    syncObjects(canvas);
    const freshRef = canvas.getActiveObject();
    setActiveObject(freshRef ? asCustom(freshRef) : asCustom(activeObject as fabric.Object));
  };

  const moveLayer = (obj: CustomFabricObject, direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!canvas) return;
    const fObj = obj as fabric.Object;
    if (direction === 'up') canvas.bringObjectForward(fObj);
    if (direction === 'down') canvas.sendObjectBackwards(fObj);
    if (direction === 'top') canvas.bringObjectToFront(fObj);
    if (direction === 'bottom') canvas.sendObjectToBack(fObj);
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
    currentBrand,
    canvasFormat,
    actions: {
      loadTemplate,
      addText,
      addImage,
      addShape,
      autoBrand,
      switchStyle,
      deleteActive,
      exportCanvas,
      updateObjectProp,
      moveLayer,
      changeFormat,
    },
  };
}
