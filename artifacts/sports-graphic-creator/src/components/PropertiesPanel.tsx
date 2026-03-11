import React from 'react';
import { CustomFabricObject } from '@/lib/fabric-types';
import * as fabric from 'fabric';
import { Sliders, Type, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertiesPanelProps {
  activeObject: CustomFabricObject | null;
  onUpdate: (key: string, value: any) => void;
}

export function PropertiesPanel({ activeObject, onUpdate }: PropertiesPanelProps) {
  
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
  const fObj = activeObject as any; // Cast for easier dynamic access

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col shrink-0">
      <div className="h-12 border-b border-border flex items-center px-4 shrink-0 bg-background/50 uppercase font-display tracking-wider text-muted-foreground text-sm">
        <Sliders className="h-4 w-4 mr-2" /> Properties
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* IDENTITY */}
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

        {/* TEXT PROPERTIES */}
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

        {/* APPEARANCE */}
        <div className="space-y-4">
          <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            <Palette className="h-3 w-3 mr-2" /> Appearance
          </h4>
          
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
