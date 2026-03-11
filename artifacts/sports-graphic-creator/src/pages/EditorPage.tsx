import React, { useEffect } from 'react';
import { useEditor } from '@/hooks/use-editor';
import { LayerPanel } from '@/components/LayerPanel';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { TopBar } from '@/components/TopBar';
import { Type, Square, Play, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditorPage() {
  const {
    canvasRef,
    canvas,
    objects,
    activeObject,
    zoom,
    setZoom,
    canvasDimensions,
    currentBrand,
    actions,
  } = useEditor();

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        const padding = 80;
        const scaleX = (clientWidth - padding) / canvasDimensions.width;
        const scaleY = (clientHeight - padding) / canvasDimensions.height;
        const fitZoom = Math.min(scaleX, scaleY);
        setZoom(Number(fitZoom.toFixed(2)));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [setZoom, canvasDimensions]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      <LayerPanel
        objects={objects}
        activeObject={activeObject}
        canvas={canvas}
        onMove={actions.moveLayer}
        onDelete={actions.deleteActive}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <TopBar
          onExport={actions.exportCanvas}
          onAutoBrand={actions.autoBrand}
          onSwitchStyle={actions.switchStyle}
          zoom={zoom}
          setZoom={setZoom}
          onLoadTemplate={actions.loadTemplate}
          currentBrand={currentBrand}
        />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 glass-panel rounded-full px-4 py-2 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary" onClick={actions.addText} title="Add Text">
            <Type className="h-5 w-5" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary" onClick={() => actions.addShape('rect')} title="Add Rectangle">
            <Square className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary" onClick={() => actions.addShape('triangle')} title="Add Triangle">
            <Play className="h-5 w-5 -rotate-90" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary" onClick={actions.addImage} title="Add Image">
            <ImagePlus className="h-5 w-5" />
          </Button>
        </div>

        <div
          ref={wrapperRef}
          className="flex-1 bg-[#050810] relative flex items-center justify-center overflow-auto pattern-grid"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        >
          <div
            className="canvas-shadow transition-transform duration-200 ease-out origin-center"
            style={{
              width: canvasDimensions.width,
              height: canvasDimensions.height,
              transform: `scale(${zoom})`,
              backgroundColor: '#000',
            }}
          >
            <canvas ref={canvasRef} id="canvas" />
          </div>
        </div>
      </main>

      <PropertiesPanel activeObject={activeObject} onUpdate={actions.updateObjectProp} canvas={canvas} />
    </div>
  );
}
