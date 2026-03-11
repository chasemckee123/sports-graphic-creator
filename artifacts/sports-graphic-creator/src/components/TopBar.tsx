import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, Wand2, Settings, ZoomIn, ZoomOut, LayoutTemplate } from 'lucide-react';
import { BrandSettings } from './BrandSettings';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

interface BrandData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  organizationName: string;
}

interface TopBarProps {
  onExport: () => void;
  onAutoBrand: () => Promise<{ success: boolean; brand: BrandData }>;
  onSwitchStyle: () => { rotation: number; brand: BrandData };
  zoom: number;
  setZoom: (z: number) => void;
  onLoadTemplate: (name: string) => void;
  currentBrand: BrandData;
}

function BrandPaletteDots({ brand }: { brand: BrandData }) {
  return (
    <div className="flex items-center gap-1 mr-2" title={`Brand: ${brand.organizationName}`}>
      <div className="h-4 w-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: brand.primaryColor }} />
      <div className="h-4 w-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: brand.secondaryColor }} />
      <div className="h-4 w-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: brand.accentColor }} />
    </div>
  );
}

export function TopBar({ onExport, onAutoBrand, onSwitchStyle, zoom, setZoom, onLoadTemplate, currentBrand }: TopBarProps) {
  const [brandOpen, setBrandOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const templates = ['Game Day', 'Score Announcement', 'Player Spotlight', 'Blank Canvas'];

  const styleLabels = ['Original', 'Variation A', 'Variation B'];

  const handleAutoBrand = async () => {
    setIsApplying(true);
    try {
      const result = await onAutoBrand();
      if (result.success) {
        const b = result.brand;
        toast({
          title: 'Auto-Brand Applied',
          description: `Applied ${b.organizationName} colors: ${b.primaryColor}, ${b.secondaryColor}, ${b.accentColor}`,
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleSwitchStyle = () => {
    const result = onSwitchStyle();
    const b = result.brand;
    const rotations = [
      [b.primaryColor, b.secondaryColor, b.accentColor],
      [b.secondaryColor, b.accentColor, b.primaryColor],
      [b.accentColor, b.primaryColor, b.secondaryColor],
    ];
    const active = rotations[result.rotation];
    toast({
      title: `Style: ${styleLabels[result.rotation]}`,
      description: `Colors: ${active[0]}, ${active[1]}, ${active[2]}`,
    });
  };

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl text-primary drop-shadow-[0_0_8px_rgba(0,255,102,0.3)]">
          GIPPER<span className="text-foreground">PRO</span>
        </h1>
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
              {templates.map((t) => (
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
          <button onClick={() => setZoom(Math.max(0.2, zoom - 0.1))} className="p-1 hover:text-primary transition-colors">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1 hover:text-primary transition-colors">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        <BrandPaletteDots brand={currentBrand} />

        <Button variant="outline" size="sm" onClick={() => setBrandOpen(true)} title="Brand Settings">
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Button>
        <Button variant="secondary" size="sm" onClick={handleSwitchStyle} className="group">
          <RefreshCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Switch Style
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleAutoBrand}
          disabled={isApplying}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(0,255,102,0.3)]"
        >
          <Wand2 className={`h-4 w-4 mr-2 ${isApplying ? 'animate-spin' : ''}`} /> {isApplying ? 'Applying...' : 'Auto-Brand'}
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
