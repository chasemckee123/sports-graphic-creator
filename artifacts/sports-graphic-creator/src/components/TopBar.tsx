import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, Wand2, Settings, ZoomIn, ZoomOut, LayoutTemplate } from 'lucide-react';
import { BrandSettings } from './BrandSettings';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TopBarProps {
  onExport: () => void;
  onAutoBrand: () => void;
  onSwitchStyle: () => void;
  zoom: number;
  setZoom: (z: number) => void;
  onLoadTemplate: (name: string) => void;
}

export function TopBar({ onExport, onAutoBrand, onSwitchStyle, zoom, setZoom, onLoadTemplate }: TopBarProps) {
  const [brandOpen, setBrandOpen] = useState(false);

  const templates = ['Game Day', 'Score Announcement', 'Player Spotlight', 'Blank Canvas'];

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl text-primary drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]">GIPPER<span className="text-foreground">PRO</span></h1>
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="font-sans normal-case gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 bg-card border-border shadow-2xl">
            <div className="space-y-1">
              {templates.map(t => (
                <button 
                  key={t}
                  onClick={() => onLoadTemplate(t)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary/20 hover:text-primary rounded-sm transition-colors uppercase font-display tracking-wide"
                >
                  {t}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-background rounded-md px-2 py-1 mr-4 border border-border">
          <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-1 hover:text-primary transition-colors"><ZoomOut className="h-4 w-4" /></button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1 hover:text-primary transition-colors"><ZoomIn className="h-4 w-4" /></button>
        </div>

        <Button variant="outline" size="sm" onClick={() => setBrandOpen(true)} title="Brand Settings">
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
        <Button variant="secondary" size="sm" onClick={onSwitchStyle} className="group">
          <RefreshCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Switch Style
        </Button>
        <Button variant="default" size="sm" onClick={onAutoBrand} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(0,255,102,0.3)]">
          <Wand2 className="h-4 w-4 mr-2" /> Auto-Brand
        </Button>
        <div className="h-6 w-px bg-border mx-2"></div>
        <Button variant="default" size="sm" onClick={onExport} className="bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      <BrandSettings open={brandOpen} onOpenChange={setBrandOpen} />
    </div>
  );
}
