import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Monitor, ChevronDown } from 'lucide-react';
import { CanvasFormat, FORMAT_PRESETS } from '@/lib/canvas-formats';

export type { CanvasFormat };
export { FORMAT_PRESETS };

interface FormatSelectorProps {
  currentFormat: CanvasFormat;
  onFormatChange: (format: CanvasFormat) => void;
}

export function FormatSelector({ currentFormat, onFormatChange }: FormatSelectorProps) {
  const [open, setOpen] = useState(false);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const isPreset = FORMAT_PRESETS.some(
    (f) => f.width === currentFormat.width && f.height === currentFormat.height
  );

  const handlePresetSelect = (format: CanvasFormat) => {
    onFormatChange(format);
    setOpen(false);
  };

  const handleCustomApply = () => {
    const w = parseInt(customWidth, 10);
    const h = parseInt(customHeight, 10);
    if (w >= 100 && w <= 4096 && h >= 100 && h <= 4096) {
      onFormatChange({ name: 'Custom', width: w, height: h });
      setOpen(false);
      setCustomWidth('');
      setCustomHeight('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="font-sans normal-case gap-2 min-w-[160px] justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="truncate">{currentFormat.name}</span>
          </div>
          <span className="text-muted-foreground text-xs ml-1">{currentFormat.width}×{currentFormat.height}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 bg-card border-border shadow-2xl" align="end">
        <div className="space-y-1">
          {FORMAT_PRESETS.map((f) => (
            <button
              key={f.name}
              onClick={() => handlePresetSelect(f)}
              className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors flex items-center justify-between ${
                currentFormat.width === f.width && currentFormat.height === f.height
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <span>{f.name}</span>
              <span className="text-xs text-muted-foreground">{f.width}×{f.height}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border mt-2 pt-2">
          <p className="text-xs text-muted-foreground px-3 mb-2">Custom Size</p>
          <div className="flex items-center gap-2 px-3">
            <input
              type="number"
              placeholder="W"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              min={100}
              max={4096}
              className="w-20 h-8 bg-background border border-border rounded px-2 text-sm text-foreground"
            />
            <span className="text-muted-foreground text-xs">×</span>
            <input
              type="number"
              placeholder="H"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
              min={100}
              max={4096}
              className="w-20 h-8 bg-background border border-border rounded px-2 text-sm text-foreground"
            />
            <Button size="sm" variant="secondary" onClick={handleCustomApply} className="h-8 px-3">
              Go
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
