import React, { useState, useRef } from 'react';
import { useGetBrand, useSaveBrand } from '@workspace/api-client-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2, Save, X, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const isValidHex = (val: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val);

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [hexInput, setHexInput] = useState(value);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setHexInput(value);
    setError(false);
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    if (isValidHex(raw)) {
      onChange(raw);
      setError(false);
    } else {
      setError(raw.length > 0);
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex(hexInput)) {
      setHexInput(value);
      setError(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 shrink-0 rounded-lg border-2 border-border overflow-hidden cursor-pointer shadow-inner" style={{ backgroundColor: value }}>
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        </div>
        <Input
          value={hexInput}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          className={`bg-background font-mono uppercase text-sm h-10 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          placeholder="#000000"
          maxLength={7}
        />
      </div>
      {error && <p className="text-xs text-red-400">Enter a valid hex color (e.g. #FF0000)</p>}
    </div>
  );
}

function BrandPreviewBar({ primary, secondary, accent }: { primary: string; secondary: string; accent: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
        <Palette className="h-3 w-3" /> Live Preview
      </Label>
      <div className="rounded-lg overflow-hidden border border-border shadow-md">
        <div className="flex h-14">
          <div className="flex-1 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: primary, color: getContrastText(primary) }}>
            PRIMARY
          </div>
          <div className="flex-1 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: secondary, color: getContrastText(secondary) }}>
            SECONDARY
          </div>
          <div className="flex-1 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: accent, color: getContrastText(accent) }}>
            ACCENT
          </div>
        </div>
        <div className="h-8 flex items-center justify-center text-xs bg-black/90" style={{ color: primary }}>
          Sample text on dark background
        </div>
      </div>
    </div>
  );
}

function normalizeHex(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length === 3) return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return '#' + h.slice(0, 6);
}

function getContrastText(hex: string): string {
  const norm = normalizeHex(hex);
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function BrandSettings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: brand, isLoading } = useGetBrand({ query: { retry: false } });
  const { mutate: saveBrand, isPending } = useSaveBrand({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/brand'] });
        toast({ title: 'Brand Updated', description: 'Your brand settings have been saved successfully.' });
        onOpenChange(false);
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to save brand settings. Please try again.', variant: 'destructive' });
      },
    },
  });

  const [formData, setFormData] = useState({
    organizationName: '',
    primaryColor: '#1a3a6b',
    secondaryColor: '#c8a951',
    accentColor: '#ffffff',
    logoUrl: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (brand) {
      setFormData({
        organizationName: brand.organizationName || 'My Team',
        primaryColor: brand.primaryColor || '#1a3a6b',
        secondaryColor: brand.secondaryColor || '#c8a951',
        accentColor: brand.accentColor || '#ffffff',
        logoUrl: brand.logoUrl || '',
      });
    }
  }, [brand]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Logo must be under 5MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidHex(formData.primaryColor) || !isValidHex(formData.secondaryColor) || !isValidHex(formData.accentColor)) {
      toast({ title: 'Invalid Colors', description: 'Please enter valid hex colors for all fields.', variant: 'destructive' });
      return;
    }
    saveBrand({ data: formData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Brand Configuration</DialogTitle>
          <DialogDescription>
            Set your organization's colors and logo. These will be applied when you click Auto-Brand.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="orgName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Organization Name</Label>
              <Input
                id="orgName"
                value={formData.organizationName}
                onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="e.g. Wildcats Athletics"
                className="bg-background"
              />
            </div>

            <div className="h-px bg-border -mx-6" />

            <div className="grid grid-cols-3 gap-4">
              <ColorPickerField
                label="Primary"
                value={formData.primaryColor}
                onChange={v => setFormData({ ...formData, primaryColor: v })}
              />
              <ColorPickerField
                label="Secondary"
                value={formData.secondaryColor}
                onChange={v => setFormData({ ...formData, secondaryColor: v })}
              />
              <ColorPickerField
                label="Accent"
                value={formData.accentColor}
                onChange={v => setFormData({ ...formData, accentColor: v })}
              />
            </div>

            <BrandPreviewBar
              primary={formData.primaryColor}
              secondary={formData.secondaryColor}
              accent={formData.accentColor}
            />

            <div className="h-px bg-border -mx-6" />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Organization Logo</Label>
              <div className="flex items-start gap-4">
                <div className={`h-20 w-20 rounded-lg border-2 border-dashed flex items-center justify-center shrink-0 transition-colors ${formData.logoUrl ? 'border-border bg-black/30' : 'border-muted-foreground/30 bg-muted/20'}`}>
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain p-1.5" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      {formData.logoUrl ? 'Replace' : 'Upload'}
                    </Button>
                    {formData.logoUrl && (
                      <Button type="button" variant="outline" size="sm" onClick={removeLogo} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <X className="h-3.5 w-3.5 mr-1.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">PNG or SVG recommended. Max 5MB.</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Save Brand
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
