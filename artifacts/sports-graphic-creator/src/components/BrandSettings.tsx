import React, { useState } from 'react';
import { useGetBrand, useSaveBrand } from '@workspace/api-client-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BrandSettings({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: brand, isLoading } = useGetBrand({ query: { retry: false }});
  const { mutate: saveBrand, isPending } = useSaveBrand({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/brand'] });
        toast({ title: "Brand Updated", description: "Your brand settings have been saved successfully." });
        onOpenChange(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save brand settings. Please try again.", variant: "destructive" });
      }
    }
  });

  // Local state for optimistic editing
  const [formData, setFormData] = useState({
    organizationName: '',
    primaryColor: '#00FF66',
    secondaryColor: '#1E293B',
    accentColor: '#FFFFFF',
    logoUrl: ''
  });

  // Sync when data loads
  React.useEffect(() => {
    if (brand) {
      setFormData({
        organizationName: brand.organizationName || 'Team Name',
        primaryColor: brand.primaryColor || '#00FF66',
        secondaryColor: brand.secondaryColor || '#1E293B',
        accentColor: brand.accentColor || '#FFFFFF',
        logoUrl: brand.logoUrl || ''
      });
    }
  }, [brand]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBrand({ data: formData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Brand Configuration</DialogTitle>
          <DialogDescription>
            Set your organization's colors and logo. These will be used by the Auto-Brand feature.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input 
                id="orgName" 
                value={formData.organizationName}
                onChange={e => setFormData({...formData, organizationName: e.target.value})}
                placeholder="e.g. Wildcats Athletics"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Primary</Label>
                <div className="flex items-center gap-2">
                  <input type="color" className="h-10 w-10 cursor-pointer rounded border border-border bg-transparent"
                    value={formData.primaryColor}
                    onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary</Label>
                <div className="flex items-center gap-2">
                  <input type="color" className="h-10 w-10 cursor-pointer rounded border border-border bg-transparent"
                    value={formData.secondaryColor}
                    onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent</Label>
                <div className="flex items-center gap-2">
                  <input type="color" className="h-10 w-10 cursor-pointer rounded border border-border bg-transparent"
                    value={formData.accentColor}
                    onChange={e => setFormData({...formData, accentColor: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Organization Logo</Label>
              <div className="flex items-center gap-4">
                {formData.logoUrl && (
                  <div className="h-16 w-16 rounded-md bg-black/50 p-2 border border-border flex items-center justify-center">
                    <img src={formData.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                <div className="flex-1">
                  <Label htmlFor="logoUpload" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-dashed border-muted-foreground/50 hover:bg-accent/50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="font-sans normal-case">Upload new image</span>
                    </div>
                  </Label>
                  <input id="logoUpload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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
