import * as fabric from 'fabric';
import { generateId } from './utils';
import { CustomFabricObject } from './fabric-types';

const defaultColors = {
  primary: '#1d4ed8', // Blue
  secondary: '#1e293b', // Dark slate
  accent: '#facc15', // Yellow
};

export const templateDimensions: Record<string, { width: number; height: number }> = {
  'Game Day': { width: 1080, height: 1080 },
  'Score Announcement': { width: 1080, height: 1080 },
  'Player Spotlight': { width: 1080, height: 1080 },
  'Blank Canvas': { width: 1080, height: 1080 },
  'Branded Landscape': { width: 1920, height: 1080 },
};

export const applyTemplate = async (
  canvas: fabric.Canvas,
  templateName: string,
  logoUrl?: string
) => {
  canvas.clear();
  canvas.backgroundColor = '#000000';

  const dims = templateDimensions[templateName] || { width: 1080, height: 1080 };
  canvas.setDimensions(dims);

  const addObj = (obj: any, customProps: Partial<CustomFabricObject>) => {
    Object.assign(obj, { id: generateId(), ...customProps });
    canvas.add(obj);
  };

  switch (templateName) {
    case 'Game Day':
      // Background
      const bg = new fabric.Rect({
        width: 1080, height: 1080, fill: '#111111', selectable: false
      });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      // Action Angle
      const angle = new fabric.Polygon([
        { x: 0, y: 1080 }, { x: 1080, y: 1080 }, { x: 1080, y: 400 }, { x: 0, y: 800 }
      ], { fill: defaultColors.primary, opacity: 0.9 });
      addObj(angle, { name: 'Primary Angle', role: 'primary' });
      
      const angle2 = new fabric.Polygon([
        { x: 0, y: 1080 }, { x: 1080, y: 1080 }, { x: 1080, y: 500 }, { x: 0, y: 900 }
      ], { fill: defaultColors.secondary, opacity: 0.8 });
      addObj(angle2, { name: 'Secondary Angle', role: 'secondary' });

      // Title Text
      const title = new fabric.Textbox('GAME DAY', {
        fontFamily: 'Teko', fontSize: 200, fill: '#ffffff',
        left: 50, top: 50, fontWeight: 'bold', fontStyle: 'italic',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 5, offsetY: 5 })
      });
      addObj(title, { name: 'Main Title', role: 'text' });

      // Subtitle Text
      const subtitle = new fabric.Textbox('FRIDAY NIGHT LIGHTS', {
        fontFamily: 'Inter', fontSize: 40, fill: defaultColors.accent,
        left: 55, top: 250, fontWeight: 'bold', charSpacing: 100
      });
      addObj(subtitle, { name: 'Subtitle', role: 'accent' });

      // Team vs Team
      const vsBox = new fabric.Rect({
        width: 800, height: 150, fill: defaultColors.secondary,
        left: 140, top: 850, rx: 10, ry: 10
      });
      addObj(vsBox, { name: 'Matchup Box', role: 'secondary' });

      const vsText = new fabric.Textbox('HOME TEAM   VS   AWAY TEAM', {
        fontFamily: 'Teko', fontSize: 80, fill: '#ffffff',
        left: 540, top: 925, originX: 'center', originY: 'center'
      });
      addObj(vsText, { name: 'Matchup Text', role: 'text' });

      break;

    case 'Score Announcement':
      const scoreBg = new fabric.Rect({ width: 1080, height: 1080, fill: defaultColors.secondary });
      addObj(scoreBg, { name: 'Background', role: 'secondary', locked: true });

      const centerStripe = new fabric.Rect({ width: 1080, height: 300, fill: defaultColors.primary, top: 390 });
      addObj(centerStripe, { name: 'Center Stripe', role: 'primary' });

      const finalScoreLabel = new fabric.Textbox('FINAL SCORE', {
        fontFamily: 'Inter', fontSize: 40, fill: defaultColors.accent,
        left: 540, top: 300, originX: 'center', fontWeight: 'bold', charSpacing: 200
      });
      addObj(finalScoreLabel, { name: 'Label', role: 'accent' });

      const team1Score = new fabric.Textbox('42', {
        fontFamily: 'Teko', fontSize: 250, fill: '#ffffff',
        left: 270, top: 540, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(team1Score, { name: 'Home Score', role: 'text' });

      const team2Score = new fabric.Textbox('24', {
        fontFamily: 'Teko', fontSize: 250, fill: '#ffffff',
        left: 810, top: 540, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(team2Score, { name: 'Away Score', role: 'text' });
      
      const dash = new fabric.Textbox('-', {
        fontFamily: 'Teko', fontSize: 200, fill: defaultColors.accent,
        left: 540, top: 520, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(dash, { name: 'Divider', role: 'accent' });

      break;
      
    case 'Player Spotlight':
      const spotBg = new fabric.Rect({ width: 1080, height: 1080, fill: '#111' });
      addObj(spotBg, { name: 'Background', role: 'background', locked: true });
      
      const statBox = new fabric.Rect({
        width: 400, height: 1080, fill: defaultColors.primary, left: 680, top: 0
      });
      addObj(statBox, { name: 'Stat Panel', role: 'primary' });
      
      const playerName = new fabric.Textbox('JOHN\nDOE', {
        fontFamily: 'Teko', fontSize: 180, fill: '#ffffff',
        left: 50, top: 50, fontWeight: 'bold', lineHeight: 0.8
      });
      addObj(playerName, { name: 'Player Name', role: 'text' });
      
      const number = new fabric.Textbox('#10', {
        fontFamily: 'Teko', fontSize: 400, fill: defaultColors.secondary, opacity: 0.5,
        left: 20, top: 600, fontWeight: 'bold'
      });
      addObj(number, { name: 'Jersey Number', role: 'secondary' });
      
      const stat1 = new fabric.Textbox('POINTS\n24', {
        fontFamily: 'Teko', fontSize: 80, fill: '#ffffff', left: 720, top: 200, textAlign: 'center'
      });
      addObj(stat1, { name: 'Stat 1', role: 'text' });
      break;

    case 'Branded Landscape': {
      const lBg = new fabric.Rect({
        width: 1920, height: 1080, fill: '#111111', selectable: false
      });
      addObj(lBg, { name: 'Background', role: 'background', locked: true });

      const primaryShape = new fabric.Rect({
        width: 1920, height: 1080, fill: '#162c54', left: 0, top: 0, selectable: false
      });
      addObj(primaryShape, { name: 'Primary Color', role: 'primary', locked: true });

      const secondaryShape = new fabric.Polygon([
        { x: 150, y: 0 },
        { x: 1350, y: 0 },
        { x: 1770, y: 1080 },
        { x: 570, y: 1080 }
      ], {
        fill: '#78cef4',
        selectable: false
      });
      addObj(secondaryShape, { name: 'Secondary Color', role: 'secondary', locked: true });

      const logoPlaceholder = new fabric.Rect({
        width: 520, height: 447, fill: 'rgba(255,255,255,0.08)',
        left: 960, top: 540, originX: 'center', originY: 'center',
        rx: 10, ry: 10, stroke: 'rgba(255,255,255,0.15)', strokeWidth: 2,
        selectable: false, evented: false
      });
      addObj(logoPlaceholder, { name: 'Logo Placeholder', role: 'background', locked: true });

      break;
    }

    default:
      // Blank canvas
      const blankBg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1e293b' });
      addObj(blankBg, { name: 'Background', role: 'background' });
      break;
  }

  const isLandscape = templateName === 'Branded Landscape';
  const logoCenterX = isLandscape ? dims.width / 2 : 540;
  const logoCenterY = isLandscape ? dims.height / 2 : 100;
  const logoSize = isLandscape ? 400 : 200;

  const addLandscapeTexture = () => {
    const textureOverlay = new fabric.Rect({
      width: 1920, height: 1080, left: 0, top: 0,
      fill: 'rgba(0,0,0,0)',
      selectable: false, evented: false,
      globalCompositeOperation: 'multiply'
    });
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 200;
    patternCanvas.height = 200;
    const pCtx = patternCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = 'rgba(139,119,101,0.3)';
      pCtx.fillRect(0, 0, 200, 200);
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const size = Math.random() * 2 + 0.5;
        const alpha = Math.random() * 0.12;
        pCtx.fillStyle = `rgba(${100 + Math.floor(Math.random() * 80)},${80 + Math.floor(Math.random() * 60)},${60 + Math.floor(Math.random() * 40)},${alpha})`;
        pCtx.fillRect(x, y, size, size);
      }
    }
    const texturePattern = new fabric.Pattern({
      source: patternCanvas,
      repeat: 'repeat'
    });
    textureOverlay.set('fill', texturePattern);
    textureOverlay.set('opacity', 0.8);
    addObj(textureOverlay, { name: 'Texture Overlay', role: 'background', locked: true });
    canvas.renderAll();
  };

  if (isLandscape) {
    addLandscapeTexture();
  }

  if (logoUrl) {
    fabric.Image.fromURL(logoUrl, (img) => {
      if (isLandscape) {
        const placeholder = canvas.getObjects().find(
          (o) => (o as CustomFabricObject).name === 'Logo Placeholder'
        );
        if (placeholder) canvas.remove(placeholder);
      }
      img.scaleToWidth(logoSize);
      img.set({ left: logoCenterX, top: logoCenterY, originX: 'center', originY: 'center' });
      addObj(img, { name: 'Team Logo', role: 'logo' });
      if (isLandscape) {
        const texture = canvas.getObjects().find(
          (o) => (o as CustomFabricObject).name === 'Texture Overlay'
        );
        if (texture) {
          const topIndex = canvas.getObjects().length - 1;
          canvas.moveTo(texture, topIndex);
        }
      }
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
  } else if (!isLandscape) {
    fabric.Image.fromURL(`${import.meta.env.BASE_URL}images/default-logo.png`, (img) => {
      if(img) {
        img.scaleToWidth(logoSize);
        img.set({ left: logoCenterX, top: logoCenterY, originX: 'center', originY: 'center' });
        addObj(img, { name: 'Team Logo', role: 'logo' });
        canvas.renderAll();
      }
    });
  }

  canvas.renderAll();
};
