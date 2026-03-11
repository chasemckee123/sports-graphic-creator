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
  logoUrl?: string,
  canvasWidth: number = 1080,
  canvasHeight: number = 1080
) => {
  canvas.clear();
  canvas.backgroundColor = '#000000';

  const dims = templateDimensions[templateName] || { width: canvasWidth, height: canvasHeight };
  canvas.setDimensions(dims);

  const sx = dims.width / 1080;
  const sy = dims.height / 1080;

  const addObj = (obj: any, customProps: Partial<CustomFabricObject>) => {
    Object.assign(obj, { id: generateId(), ...customProps });
    canvas.add(obj);
  };

  switch (templateName) {
    case 'Game Day':
      const bg = new fabric.Rect({
        width: dims.width, height: dims.height, fill: '#111111', selectable: false
      });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const angle = new fabric.Polygon([
        { x: 0, y: dims.height }, { x: dims.width, y: dims.height }, { x: dims.width, y: 400 * sy }, { x: 0, y: 800 * sy }
      ], { fill: defaultColors.primary, opacity: 0.9 });
      addObj(angle, { name: 'Primary Angle', role: 'primary' });
      
      const angle2 = new fabric.Polygon([
        { x: 0, y: dims.height }, { x: dims.width, y: dims.height }, { x: dims.width, y: 500 * sy }, { x: 0, y: 900 * sy }
      ], { fill: defaultColors.secondary, opacity: 0.8 });
      addObj(angle2, { name: 'Secondary Angle', role: 'secondary' });

      const title = new fabric.Textbox('GAME DAY', {
        fontFamily: 'Teko', fontSize: 200 * Math.min(sx, sy), fill: '#ffffff',
        left: 50 * sx, top: 50 * sy, fontWeight: 'bold', fontStyle: 'italic',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 5, offsetY: 5 })
      });
      addObj(title, { name: 'Main Title', role: 'text' });

      const subtitle = new fabric.Textbox('FRIDAY NIGHT LIGHTS', {
        fontFamily: 'Inter', fontSize: 40 * Math.min(sx, sy), fill: defaultColors.accent,
        left: 55 * sx, top: 250 * sy, fontWeight: 'bold', charSpacing: 100
      });
      addObj(subtitle, { name: 'Subtitle', role: 'accent' });

      const vsBox = new fabric.Rect({
        width: 800 * sx, height: 150 * sy, fill: defaultColors.secondary,
        left: 140 * sx, top: 850 * sy, rx: 10, ry: 10
      });
      addObj(vsBox, { name: 'Matchup Box', role: 'secondary' });

      const vsText = new fabric.Textbox('HOME TEAM   VS   AWAY TEAM', {
        fontFamily: 'Teko', fontSize: 80 * Math.min(sx, sy), fill: '#ffffff',
        left: 540 * sx, top: 925 * sy, originX: 'center', originY: 'center'
      });
      addObj(vsText, { name: 'Matchup Text', role: 'text' });

      break;

    case 'Score Announcement':
      const scoreBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: defaultColors.secondary });
      addObj(scoreBg, { name: 'Background', role: 'secondary', locked: true });

      const centerStripe = new fabric.Rect({ width: dims.width, height: 300 * sy, fill: defaultColors.primary, top: 390 * sy });
      addObj(centerStripe, { name: 'Center Stripe', role: 'primary' });

      const finalScoreLabel = new fabric.Textbox('FINAL SCORE', {
        fontFamily: 'Inter', fontSize: 40 * Math.min(sx, sy), fill: defaultColors.accent,
        left: dims.width / 2, top: 300 * sy, originX: 'center', fontWeight: 'bold', charSpacing: 200
      });
      addObj(finalScoreLabel, { name: 'Label', role: 'accent' });

      const team1Score = new fabric.Textbox('42', {
        fontFamily: 'Teko', fontSize: 250 * Math.min(sx, sy), fill: '#ffffff',
        left: dims.width * 0.25, top: 540 * sy, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(team1Score, { name: 'Home Score', role: 'text' });

      const team2Score = new fabric.Textbox('24', {
        fontFamily: 'Teko', fontSize: 250 * Math.min(sx, sy), fill: '#ffffff',
        left: dims.width * 0.75, top: 540 * sy, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(team2Score, { name: 'Away Score', role: 'text' });
      
      const dash = new fabric.Textbox('-', {
        fontFamily: 'Teko', fontSize: 200 * Math.min(sx, sy), fill: defaultColors.accent,
        left: dims.width / 2, top: 520 * sy, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(dash, { name: 'Divider', role: 'accent' });

      break;
      
    case 'Player Spotlight':
      const spotBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: '#111' });
      addObj(spotBg, { name: 'Background', role: 'background', locked: true });
      
      const statBox = new fabric.Rect({
        width: 400 * sx, height: dims.height, fill: defaultColors.primary, left: 680 * sx, top: 0
      });
      addObj(statBox, { name: 'Stat Panel', role: 'primary' });
      
      const playerName = new fabric.Textbox('JOHN\nDOE', {
        fontFamily: 'Teko', fontSize: 180 * Math.min(sx, sy), fill: '#ffffff',
        left: 50 * sx, top: 50 * sy, fontWeight: 'bold', lineHeight: 0.8
      });
      addObj(playerName, { name: 'Player Name', role: 'text' });
      
      const number = new fabric.Textbox('#10', {
        fontFamily: 'Teko', fontSize: 400 * Math.min(sx, sy), fill: defaultColors.secondary, opacity: 0.5,
        left: 20 * sx, top: 600 * sy, fontWeight: 'bold'
      });
      addObj(number, { name: 'Jersey Number', role: 'secondary' });
      
      const stat1 = new fabric.Textbox('POINTS\n24', {
        fontFamily: 'Teko', fontSize: 80 * Math.min(sx, sy), fill: '#ffffff', left: 720 * sx, top: 200 * sy, textAlign: 'center'
      });
      addObj(stat1, { name: 'Stat 1', role: 'text' });
      break;

    case 'Branded Landscape': {
      const lBg = new fabric.Rect({
        width: 1920, height: 1080, fill: '#162c54', selectable: false
      });
      addObj(lBg, { name: 'Background', role: 'primary', locked: true });

      const secondaryShape = new fabric.Polygon([
        { x: 100, y: 0 },
        { x: 1100, y: 0 },
        { x: 1820, y: 1080 },
        { x: 820, y: 1080 }
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
      const blankBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: '#1e293b' });
      addObj(blankBg, { name: 'Background', role: 'background' });
      break;
  }

  const isLandscape = templateName === 'Branded Landscape';
  const logoCenterX = isLandscape ? dims.width / 2 : dims.width / 2;
  const logoCenterY = isLandscape ? dims.height / 2 : 100 * sy;
  const logoSize = isLandscape ? 400 : 200 * Math.min(sx, sy);

  const addLandscapeTexture = () => {
    const textureOverlay = new fabric.Rect({
      width: 1920, height: 1080, left: 0, top: 0,
      fill: 'rgba(0,0,0,0)',
      selectable: false, evented: false,
      globalCompositeOperation: 'multiply'
    });
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 4;
    patternCanvas.height = 200;
    const pCtx = patternCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = 'rgba(200,200,200,0.06)';
      pCtx.fillRect(0, 0, 4, 200);
      for (let y = 0; y < 200; y++) {
        const alpha = Math.random() * 0.08;
        pCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        pCtx.fillRect(0, y, 1, 1);
        pCtx.fillRect(2, y, 1, 1);
      }
    }
    const texturePattern = new fabric.Pattern({
      source: patternCanvas,
      repeat: 'repeat'
    });
    textureOverlay.set('fill', texturePattern);
    textureOverlay.set('opacity', 0.5);
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
