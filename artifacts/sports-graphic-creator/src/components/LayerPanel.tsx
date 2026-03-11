import React from 'react';
import { CustomFabricObject } from '@/lib/fabric-types';
import * as fabric from 'fabric';
import { Layers, Image as ImageIcon, Type, Square, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayerPanelProps {
  objects: CustomFabricObject[];
  activeObject: CustomFabricObject | null;
  canvas: fabric.Canvas | null;
  onMove: (obj: CustomFabricObject, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onDelete: () => void;
}

export function LayerPanel({ objects, activeObject, canvas, onMove, onDelete }: LayerPanelProps) {
  const selectObject = (obj: CustomFabricObject) => {
    if (!canvas) return;
    canvas.setActiveObject(obj as fabric.Object);
    canvas.requestRenderAll();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'i-text':
      case 'textbox':
        return <Type className="h-4 w-4 text-blue-400" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-green-400" />;
      default:
        return <Square className="h-4 w-4 text-orange-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'primary': return 'bg-primary/20 text-primary border-primary/50';
      case 'secondary': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'accent': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'text': return 'bg-white/10 text-white/80 border-white/20';
      case 'logo': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'background': return 'bg-black/50 text-gray-500 border-gray-800';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col shrink-0">
      <div className="h-12 border-b border-border flex items-center px-4 shrink-0 bg-background/50 uppercase font-display tracking-wider text-muted-foreground text-sm">
        <Layers className="h-4 w-4 mr-2" /> Layers
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {objects.length === 0 && (
          <div className="text-center p-4 text-sm text-muted-foreground font-sans">
            Canvas is empty
          </div>
        )}
        
        {objects.map((obj, i) => {
          const isActive = activeObject?.id === obj.id;
          return (
            <div 
              key={obj.id || i}
              onClick={() => selectObject(obj)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer border transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 border-primary/50 shadow-[inset_0_0_10px_rgba(0,255,102,0.1)]' 
                  : 'bg-background border-transparent hover:border-border hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {getIcon((obj as fabric.Object).type || '')}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-sans truncate whitespace-nowrap leading-tight">
                    {obj.name || obj.type || 'Layer'}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[3px] border mt-1 w-fit ${getRoleColor(obj.role)}`}>
                    {obj.role}
                  </span>
                </div>
              </div>

              {isActive && !obj.locked && (
                <div className="flex flex-col opacity-50 hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onMove(obj, 'top'); }} className="hover:text-primary"><ChevronUp className="h-3 w-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); onMove(obj, 'bottom'); }} className="hover:text-primary"><ChevronDown className="h-3 w-3" /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border bg-background/50 shrink-0">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full opacity-80 hover:opacity-100 font-sans normal-case"
          disabled={!activeObject || activeObject.locked}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete Layer
        </Button>
      </div>
    </div>
  );
}
