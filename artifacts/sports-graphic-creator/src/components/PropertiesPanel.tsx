import React, { useState, useCallback } from 'react';
import { CustomFabricObject } from '@/lib/fabric-types';
import * as fabric from 'fabric';
import { Sliders, Type, Palette, ImageIcon, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PropertiesPanelProps {
  activeObject: CustomFabricObject | null;
  onUpdate: (key: string, value: any) => void;
  canvas: fabric.Canvas | null;
}

export function PropertiesPanel({ activeObject, onUpdate, canvas }: PropertiesPanelProps) {
  const [bgRemovalLoading, setBgRemovalLoading] = useState(false);
  const [bgRemovalProgress, setBgRemovalProgress] = useState('');

  const isImage = activeObject && (activeObject as fabric.Object).type === 'image';
  const fObj = activeObject as any;

  const getFilterValue = useCallback((filterType: string): number => {
    if (!isImage || !fObj.filters) return filterType === 'brightness' ? 0 : filterType === 'contrast' ? 0 : filterType === 'saturation' ? 0 : 0;
    for (const f of fObj.filters) {
      if (!f) continue;
      if (filterType === 'brightness' && f instanceof fabric.filters.Brightness) return f.brightness ?? 0;
      if (filterType === 'contrast' && f instanceof fabric.filters.Contrast) return f.contrast ?? 0;
      if (filterType === 'saturation' && f instanceof fabric.filters.Saturation) return f.saturation ?? 0;
    }
    return 0;
  }, [isImage, fObj]);

  const isGrayscale = useCallback((): boolean => {
    if (!isImage || !fObj.filters) return false;
    return fObj.filters.some((f: any) => f instanceof fabric.filters.Grayscale);
  }, [isImage, fObj]);

  const applyFilter = useCallback((filterType: string, value: number | boolean) => {
    if (!isImage || !canvas) return;
    const imgObj = activeObject as unknown as fabric.Image;
    if (!imgObj.filters) imgObj.filters = [];

    if (filterType === 'grayscale') {
      const idx = imgObj.filters.findIndex((f: any) => f instanceof fabric.filters.Grayscale);
      if (value && idx === -1) {
        imgObj.filters.push(new fabric.filters.Grayscale());
      } else if (!value && idx !== -1) {
        imgObj.filters.splice(idx, 1);
      }
    } else {
      const FilterClass = filterType === 'brightness' ? fabric.filters.Brightness
        : filterType === 'contrast' ? fabric.filters.Contrast
        : fabric.filters.Saturation;

      const propName = filterType;
      let idx = imgObj.filters.findIndex((f: any) => f instanceof FilterClass);
      if (idx === -1) {
        const newFilter = new FilterClass({ [propName]: value as number });
        imgObj.filters.push(newFilter);
      } else {
        (imgObj.filters[idx] as any)[propName] = value;
      }
    }

    imgObj.applyFilters();
    canvas.renderAll();
  }, [isImage, activeObject, canvas]);

  const handleRemoveBackground = useCallback(async () => {
    if (!isImage || !canvas || !activeObject) return;
    const imgObj = activeObject as unknown as fabric.Image;
    const el = imgObj.getElement() as HTMLImageElement;

    setBgRemovalLoading(true);
    setBgRemovalProgress('Loading model...');

    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = el.naturalWidth || el.width;
      srcCanvas.height = el.naturalHeight || el.height;
      const ctx = srcCanvas.getContext('2d');
      if (!ctx) {
        setBgRemovalProgress('Failed — canvas context unavailable');
        setTimeout(() => setBgRemovalProgress(''), 3000);
        setBgRemovalLoading(false);
        return;
      }
      ctx.drawImage(el, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => srcCanvas.toBlob((b) => resolve(b), 'image/png'));
      if (!blob) {
        setBgRemovalProgress('Failed — could not create image blob');
        setTimeout(() => setBgRemovalProgress(''), 3000);
        setBgRemovalLoading(false);
        return;
      }

      setBgRemovalProgress('Removing background...');
      const resultBlob = await removeBackground(blob, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setBgRemovalProgress(`${key}: ${pct}%`);
          }
        },
      });

      const resultUrl = URL.createObjectURL(resultBlob);
      const newImgEl = new Image();
      newImgEl.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        newImgEl.onload = () => resolve();
        newImgEl.onerror = reject;
        newImgEl.src = resultUrl;
      });

      imgObj.setElement(newImgEl);
      imgObj.applyFilters();
      canvas.renderAll();
      URL.revokeObjectURL(resultUrl);

      setBgRemovalProgress('Done!');
      setTimeout(() => setBgRemovalProgress(''), 2000);
    } catch (err) {
      console.error('Background removal failed:', err);
      setBgRemovalProgress('Failed — try again');
      setTimeout(() => setBgRemovalProgress(''), 3000);
    } finally {
      setBgRemovalLoading(false);
    }
  }, [isImage, activeObject, canvas]);

  if (!activeObject) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col items-center justify-center text-muted-foreground p-8 shrink-0 text-center">
        <Sliders className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="font-display text-xl uppercase tracking-wider mb-2">No Selection</h3>
        <p className="font-sans text-sm opacity-60">Select an object on the canvas to edit its properties.</p>
      </div>
    );
  }

  const isText = ['i-text', 'textbox', 'text'].includes((activeObject as fabric.Object).type || '');

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col shrink-0">
      <div className="h-12 border-b border-border flex items-center px-4 shrink-0 bg-background/50 uppercase font-display tracking-wider text-muted-foreground text-sm">
        <Sliders className="h-4 w-4 mr-2" /> Properties
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Layer Name</Label>
            <Input 
              value={activeObject.name || ''} 
              onChange={e => onUpdate('name', e.target.value)} 
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Role (Used by Auto-Brand)</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={activeObject.role || 'none'}
              onChange={e => onUpdate('role', e.target.value)}
              disabled={activeObject.locked}
            >
              <option value="none">None</option>
              <option value="primary">Primary Color</option>
              <option value="secondary">Secondary Color</option>
              <option value="accent">Accent Color</option>
              <option value="text">Text Elements</option>
              <option value="logo">Team Logo</option>
              <option value="background">Background</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-border/50 -mx-5" />

        {isText && (
          <div className="space-y-4">
            <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              <Type className="h-3 w-3 mr-2" /> Text Styling
            </h4>
            
            <div className="space-y-2">
              <Label>Content</Label>
              <textarea 
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                value={fObj.text || ''}
                onChange={e => onUpdate('text', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                  value={fObj.fontFamily || 'Inter'}
                  onChange={e => onUpdate('fontFamily', e.target.value)}
                >
                  <option value="Teko">Teko (Display)</option>
                  <option value="Inter">Inter (Sans)</option>
                  <option value="Impact">Impact</option>
                  <option value="Arial">Arial</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Input 
                  type="number" 
                  value={fObj.fontSize || 40} 
                  onChange={e => onUpdate('fontSize', parseInt(e.target.value) || 40)}
                  className="bg-background"
                />
              </div>
            </div>
          </div>
        )}

        {isImage && (
          <>
            <div className="space-y-4">
              <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                <ImageIcon className="h-3 w-3 mr-2" /> Image Controls
              </h4>

              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={bgRemovalLoading}
                  onClick={handleRemoveBackground}
                >
                  {bgRemovalLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    'Remove Background'
                  )}
                </Button>
                {bgRemovalProgress && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">{bgRemovalProgress}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-border/50 -mx-5" />

            <div className="space-y-4">
              <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                <Sliders className="h-3 w-3 mr-2" /> Photo Filters
              </h4>

              <div className="space-y-2">
                <Label>Brightness: {Math.round(getFilterValue('brightness') * 100)}%</Label>
                <input
                  type="range"
                  min="-1" max="1" step="0.05"
                  className="w-full accent-primary"
                  value={getFilterValue('brightness')}
                  onChange={e => applyFilter('brightness', parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Contrast: {Math.round(getFilterValue('contrast') * 100)}%</Label>
                <input
                  type="range"
                  min="-1" max="1" step="0.05"
                  className="w-full accent-primary"
                  value={getFilterValue('contrast')}
                  onChange={e => applyFilter('contrast', parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Saturation: {Math.round(getFilterValue('saturation') * 100)}%</Label>
                <input
                  type="range"
                  min="-1" max="1" step="0.05"
                  className="w-full accent-primary"
                  value={getFilterValue('saturation')}
                  onChange={e => applyFilter('saturation', parseFloat(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Grayscale</Label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isGrayscale()}
                  onClick={() => applyFilter('grayscale', !isGrayscale())}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isGrayscale() ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isGrayscale() ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="space-y-4">
          <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            <Palette className="h-3 w-3 mr-2" /> Appearance
          </h4>
          
          {!isImage && (
            <div className="space-y-2">
              <Label>Fill Color</Label>
              <div className="flex gap-2 items-center">
                <div className="h-10 w-10 rounded border border-border overflow-hidden shrink-0">
                  <input 
                    type="color" 
                    className="h-16 w-16 -m-2 cursor-pointer"
                    value={typeof fObj.fill === 'string' ? fObj.fill : '#000000'}
                    onChange={e => onUpdate('fill', e.target.value)}
                  />
                </div>
                <Input 
                  value={typeof fObj.fill === 'string' ? fObj.fill : ''} 
                  onChange={e => onUpdate('fill', e.target.value)}
                  className="bg-background font-mono uppercase"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Opacity: {Math.round((fObj.opacity || 1) * 100)}%</Label>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              className="w-full accent-primary"
              value={fObj.opacity || 1}
              onChange={e => onUpdate('opacity', parseFloat(e.target.value))}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
