import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { templateLibrary, templateCategories, TemplateInfo } from '@/lib/templates';

interface TemplateBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (name: string) => void;
}

const layoutIcons: Record<string, React.ReactNode> = {
  'diagonal-split': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.15" />
      <polygon points="0,100 100,100 100,40 0,70" fill="currentColor" opacity="0.5" />
      <polygon points="0,100 100,100 100,55 0,85" fill="currentColor" opacity="0.3" />
      <rect x="8" y="8" width="50" height="8" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="8" y="20" width="35" height="4" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  'versus-split': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="0,0 55,0 45,100 0,100" fill="currentColor" opacity="0.5" />
      <polygon points="55,0 100,0 100,100 45,100" fill="currentColor" opacity="0.25" />
      <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.8" />
      <rect x="10" y="8" width="30" height="8" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="0" y="90" width="100" height="10" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  'centered-badge': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="0" y="0" width="100" height="35" fill="currentColor" opacity="0.3" />
      <rect x="20" y="35" width="60" height="25" rx="4" fill="currentColor" opacity="0.6" />
      <rect x="10" y="65" width="30" height="8" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="60" y="65" width="30" height="8" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="10" y="77" width="30" height="8" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="60" y="77" width="30" height="8" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="30" y="88" width="40" height="8" rx="2" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  'center-stripe': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.15" />
      <rect x="0" y="35" width="100" height="30" fill="currentColor" opacity="0.5" />
      <rect x="15" y="25" width="30" height="5" rx="1" fill="currentColor" opacity="0.4" />
      <text x="30" y="55" textAnchor="middle" fontSize="20" fill="currentColor" opacity="0.9" fontWeight="bold">42</text>
      <text x="50" y="55" textAnchor="middle" fontSize="14" fill="currentColor" opacity="0.6" fontWeight="bold">-</text>
      <text x="70" y="55" textAnchor="middle" fontSize="20" fill="currentColor" opacity="0.9" fontWeight="bold">24</text>
    </svg>
  ),
  'stat-grid': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="0" y="0" width="100" height="20" fill="currentColor" opacity="0.5" />
      <rect x="8" y="28" width="84" height="12" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="8" y="44" width="84" height="12" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="8" y="60" width="84" height="12" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="30" y="80" width="40" height="12" rx="4" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  'trophy-frame': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.08" />
      <rect x="0" y="0" width="100" height="3" fill="currentColor" opacity="0.6" />
      <rect x="0" y="97" width="100" height="3" fill="currentColor" opacity="0.6" />
      <rect x="25" y="12" width="50" height="8" rx="1" fill="currentColor" opacity="0.6" />
      <circle cx="50" cy="45" r="14" fill="currentColor" opacity="0.2" />
      <text x="50" y="50" textAnchor="middle" fontSize="16" fill="currentColor" opacity="0.7">🏆</text>
      <rect x="20" y="65" width="60" height="8" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="25" y="78" width="50" height="4" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  'side-panel': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="65" y="0" width="35" height="100" fill="currentColor" opacity="0.5" />
      <rect x="8" y="8" width="40" height="10" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="8" y="22" width="30" height="8" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="8" y="60" width="25" height="30" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="72" y="25" width="22" height="6" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="72" y="35" width="22" height="6" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  ),
  'elegant-frame': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.08" />
      <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="25" y="10" width="50" height="10" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="20" y="30" width="60" height="40" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="15" y="76" width="70" height="8" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="25" y="88" width="50" height="4" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  'leaderboard': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="0" y="0" width="100" height="18" fill="currentColor" opacity="0.5" />
      <rect x="8" y="24" width="84" height="12" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="8" y="40" width="84" height="12" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="8" y="56" width="84" height="12" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="8" y="72" width="84" height="12" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="8" y="88" width="84" height="12" rx="2" fill="currentColor" opacity="0.15" />
    </svg>
  ),
  'schedule-list': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="0" y="0" width="8" height="100" fill="currentColor" opacity="0.5" />
      <rect x="14" y="8" width="35" height="10" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="14" y="22" width="25" height="4" rx="1" fill="currentColor" opacity="0.3" />
      {[35, 48, 61, 74, 87].map((y, i) => (
        <React.Fragment key={i}>
          <rect x="14" y={y} width="78" height="10" rx="2" fill="currentColor" opacity={i % 2 === 0 ? 0.2 : 0.15} />
        </React.Fragment>
      ))}
    </svg>
  ),
  'info-card': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.3" />
      <rect x="10" y="10" width="80" height="80" rx="5" fill="currentColor" opacity="0.15" />
      <rect x="10" y="14" width="80" height="2" fill="currentColor" opacity="0.5" />
      <rect x="25" y="25" width="50" height="10" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="30" y="40" width="40" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="20" y="50" width="60" height="20" rx="3" fill="currentColor" opacity="0.2" />
      <rect x="30" y="76" width="40" height="4" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  'roster-grid': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="0" y="0" width="100" height="20" fill="currentColor" opacity="0.5" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={8 + c * 32} y={28 + r * 22} width={26} height={18} rx={2} fill="currentColor" opacity={0.2} />
        ))
      )}
      <rect x="0" y="94" width="100" height="6" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  'bold-cta': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.08" />
      <polygon points="0,0 100,0 100,30 0,50" fill="currentColor" opacity="0.4" />
      <polygon points="0,70 100,55 100,100 0,100" fill="currentColor" opacity="0.3" />
      <rect x="8" y="35" width="40" height="12" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="8" y="50" width="40" height="12" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="55" y="65" width="38" height="10" rx="2" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  'landscape-brand': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.4" />
      <polygon points="15,0 75,0 95,100 35,100" fill="currentColor" opacity="0.5" />
      <rect x="40" y="30" width="30" height="25" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  ),
  'blank': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="currentColor" opacity="0.1" />
      <rect x="35" y="45" width="30" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="45" y="35" width="2" height="30" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
};

function TemplateThumbnail({ template, onClick }: { template: TemplateInfo; onClick: () => void }) {
  const [c1, c2, c3] = template.colors;
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col rounded-lg overflow-hidden border border-border bg-background hover:border-primary/60 hover:shadow-[0_0_20px_rgba(0,255,102,0.15)] transition-all duration-200 text-left"
    >
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 60%, ${c3} 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4" style={{ color: c3 }}>
          {layoutIcons[template.layout] || layoutIcons['blank']}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold bg-primary/90 px-3 py-1.5 rounded-full shadow-lg">
            Use Template
          </span>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-display font-bold uppercase tracking-wider text-foreground truncate">
          {template.name}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
          {template.description}
        </p>
      </div>
    </button>
  );
}

export function TemplateBrowser({ open, onOpenChange, onSelectTemplate }: TemplateBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleSelect = (name: string) => {
    onSelectTemplate(name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle>Template Library</DialogTitle>
          <DialogDescription>
            Choose a template to start your graphic. All templates support Auto-Brand color matching.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="px-6 pt-3 shrink-0">
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {templateCategories.map((cat) => {
                const count = cat === 'All' ? templateLibrary.length : templateLibrary.filter(t => t.category === cat).length;
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {cat}
                    <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {templateCategories.map((cat) => (
            <TabsContent key={cat} value={cat} className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-6">
                  {(cat === 'All' ? templateLibrary : templateLibrary.filter(t => t.category === cat)).map((template) => (
                    <TemplateThumbnail
                      key={template.name}
                      template={template}
                      onClick={() => handleSelect(template.name)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
