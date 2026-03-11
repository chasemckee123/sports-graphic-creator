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
  'Rivalry Matchup': { width: 1080, height: 1080 },
  'Conference Tournament': { width: 1080, height: 1080 },
  'Score Announcement': { width: 1080, height: 1080 },
  'Weekly Recap': { width: 1080, height: 1080 },
  'Championship': { width: 1080, height: 1080 },
  'Player Spotlight': { width: 1080, height: 1080 },
  'Senior Night': { width: 1080, height: 1080 },
  'Stat Leader Board': { width: 1080, height: 1080 },
  'Season Schedule': { width: 1080, height: 1080 },
  'Practice Update': { width: 1080, height: 1080 },
  'Team Roster Reveal': { width: 1080, height: 1080 },
  'Recruitment Graphic': { width: 1080, height: 1080 },
  'Blank Canvas': { width: 1080, height: 1080 },
  'Branded Landscape': { width: 1920, height: 1080 },
  'Athlete of the Week': { width: 1920, height: 1080 },
};

export interface TemplateInfo {
  name: string;
  category: 'Game Day' | 'Scores & Results' | 'Player Features' | 'Schedule & Events' | 'Announcements' | 'Blank';
  description: string;
  colors: [string, string, string];
  layout: string;
}

export const templateLibrary: TemplateInfo[] = [
  { name: 'Game Day', category: 'Game Day', description: 'Bold angled matchup graphic', colors: ['#1d4ed8', '#1e293b', '#facc15'], layout: 'diagonal-split' },
  { name: 'Rivalry Matchup', category: 'Game Day', description: 'Head-to-head rivalry showdown', colors: ['#dc2626', '#111827', '#f59e0b'], layout: 'versus-split' },
  { name: 'Conference Tournament', category: 'Game Day', description: 'Tournament bracket announcement', colors: ['#7c3aed', '#0f172a', '#fbbf24'], layout: 'centered-badge' },
  { name: 'Branded Landscape', category: 'Game Day', description: 'Wide-format branded template', colors: ['#162c54', '#78cef4', '#ffffff'], layout: 'landscape-brand' },
  { name: 'Score Announcement', category: 'Scores & Results', description: 'Post-game final score display', colors: ['#1d4ed8', '#1e293b', '#facc15'], layout: 'center-stripe' },
  { name: 'Weekly Recap', category: 'Scores & Results', description: 'Multi-game weekly results summary', colors: ['#059669', '#0f172a', '#f0fdf4'], layout: 'stat-grid' },
  { name: 'Championship', category: 'Scores & Results', description: 'Championship celebration graphic', colors: ['#d97706', '#1c1917', '#fef3c7'], layout: 'trophy-frame' },
  { name: 'Player Spotlight', category: 'Player Features', description: 'Individual player feature with stats', colors: ['#1d4ed8', '#1e293b', '#facc15'], layout: 'side-panel' },
  { name: 'Senior Night', category: 'Player Features', description: 'Senior class celebration', colors: ['#b91c1c', '#1c1917', '#fde68a'], layout: 'elegant-frame' },
  { name: 'Stat Leader Board', category: 'Player Features', description: 'Top performers stat comparison', colors: ['#0ea5e9', '#020617', '#e0f2fe'], layout: 'leaderboard' },
  { name: 'Athlete of the Week', category: 'Player Features', description: 'Athlete of the week recognition with curved panel', colors: ['#2dd4bf', '#0a0a0a', '#ffffff'], layout: 'curved-split' },
  { name: 'Season Schedule', category: 'Schedule & Events', description: 'Full season game schedule', colors: ['#1e40af', '#0f172a', '#dbeafe'], layout: 'schedule-list' },
  { name: 'Practice Update', category: 'Schedule & Events', description: 'Practice info and announcements', colors: ['#16a34a', '#14532d', '#bbf7d0'], layout: 'info-card' },
  { name: 'Team Roster Reveal', category: 'Announcements', description: 'Roster lineup reveal graphic', colors: ['#7c3aed', '#1e1b4b', '#ede9fe'], layout: 'roster-grid' },
  { name: 'Recruitment Graphic', category: 'Announcements', description: 'Recruiting call-to-action', colors: ['#ea580c', '#1c1917', '#fff7ed'], layout: 'bold-cta' },
  { name: 'Blank Canvas', category: 'Blank', description: 'Start from scratch', colors: ['#1e293b', '#334155', '#94a3b8'], layout: 'blank' },
];

export const templateCategories = ['All', 'Game Day', 'Scores & Results', 'Player Features', 'Schedule & Events', 'Announcements', 'Blank'] as const;

export const applyTemplate = async (
  canvas: fabric.Canvas,
  templateName: string,
  logoUrl?: string,
  canvasWidth: number = 1080,
  canvasHeight: number = 1080,
  brandColors?: { primary: string; secondary: string; accent: string }
) => {
  canvas.clear();
  canvas.backgroundColor = '#000000';

  const colors = brandColors || defaultColors;

  const dims = templateDimensions[templateName] || { width: canvasWidth, height: canvasHeight };
  canvas.setDimensions(dims);

  const sx = dims.width / 1080;
  const sy = dims.height / 1080;

  const addObj = (obj: any, customProps: Partial<CustomFabricObject>) => {
    const lockProps = customProps.locked
      ? { selectable: false, evented: false }
      : {};
    Object.assign(obj, { id: generateId(), ...customProps, ...lockProps });
    canvas.add(obj);
  };

  switch (templateName) {
    case 'Game Day': {
      const bg = new fabric.Rect({
        width: dims.width, height: dims.height, fill: '#0a0a0a', selectable: false
      });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const bgTextureDots: fabric.Circle[] = [];
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 18; col++) {
          bgTextureDots.push(new fabric.Circle({
            radius: 2, fill: '#ffffff', opacity: 0.04,
            left: col * 62 * sx, top: col * 62 * sy
          }));
        }
      }
      bgTextureDots.forEach(d => addObj(d, { name: 'Dot', role: 'none', locked: true }));

      const deepAngle = new fabric.Polygon([
        { x: 0, y: dims.height }, { x: dims.width, y: dims.height },
        { x: dims.width, y: 350 * sy }, { x: 0, y: 700 * sy }
      ], { fill: colors.primary, opacity: 0.35 });
      addObj(deepAngle, { name: 'Deep Angle', role: 'primary' });

      const angle = new fabric.Polygon([
        { x: 0, y: dims.height }, { x: dims.width, y: dims.height },
        { x: dims.width, y: 440 * sy }, { x: 0, y: 780 * sy }
      ], { fill: colors.primary, opacity: 0.9 });
      addObj(angle, { name: 'Primary Angle', role: 'primary' });

      const angle2 = new fabric.Polygon([
        { x: 0, y: dims.height }, { x: dims.width, y: dims.height },
        { x: dims.width, y: 540 * sy }, { x: 0, y: 880 * sy }
      ], { fill: colors.secondary, opacity: 0.85 });
      addObj(angle2, { name: 'Secondary Angle', role: 'secondary' });

      const accentStripe1 = new fabric.Polygon([
        { x: 0, y: 790 * sy }, { x: dims.width, y: 450 * sy },
        { x: dims.width, y: 458 * sy }, { x: 0, y: 798 * sy }
      ], { fill: colors.accent, opacity: 0.7 });
      addObj(accentStripe1, { name: 'Accent Stripe 1', role: 'accent' });

      const accentStripe2 = new fabric.Polygon([
        { x: 0, y: 810 * sy }, { x: dims.width, y: 470 * sy },
        { x: dims.width, y: 475 * sy }, { x: 0, y: 815 * sy }
      ], { fill: colors.accent, opacity: 0.4 });
      addObj(accentStripe2, { name: 'Accent Stripe 2', role: 'accent' });

      const topAccent = new fabric.Rect({
        width: 6 * sx, height: 180 * sy, fill: colors.accent,
        left: 50 * sx, top: 320 * sy
      });
      addObj(topAccent, { name: 'Side Accent', role: 'accent' });

      const title = new fabric.Textbox('GAME DAY', {
        fontFamily: 'Teko', fontSize: 220 * Math.min(sx, sy), fill: '#ffffff',
        width: 980 * sx, left: 50 * sx, top: 40 * sy, fontWeight: 'bold', fontStyle: 'italic',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.6)', blur: 15, offsetX: 6, offsetY: 6 })
      });
      addObj(title, { name: 'Main Title', role: 'text' });

      const subtitle = new fabric.Textbox('FRIDAY NIGHT LIGHTS', {
        fontFamily: 'Inter', fontSize: 36 * Math.min(sx, sy), fill: colors.accent,
        width: 970 * sx, left: 75 * sx, top: 270 * sy, fontWeight: 'bold', charSpacing: 200
      });
      addObj(subtitle, { name: 'Subtitle', role: 'accent' });

      const matchupShape = new fabric.Polygon([
        { x: 100 * sx, y: 840 * sy }, { x: 980 * sx, y: 840 * sy },
        { x: 1020 * sx, y: 1000 * sy }, { x: 60 * sx, y: 1000 * sy }
      ], { fill: colors.secondary, opacity: 0.95 });
      addObj(matchupShape, { name: 'Matchup Box', role: 'secondary' });

      const matchupAccent = new fabric.Polygon([
        { x: 95 * sx, y: 838 * sy }, { x: 985 * sx, y: 838 * sy },
        { x: 988 * sx, y: 845 * sy }, { x: 92 * sx, y: 845 * sy }
      ], { fill: colors.accent });
      addObj(matchupAccent, { name: 'Matchup Top Accent', role: 'accent' });

      const vsText = new fabric.Textbox('HOME TEAM   VS   AWAY TEAM', {
        fontFamily: 'Teko', fontSize: 80 * Math.min(sx, sy), fill: '#ffffff',
        width: 820 * sx, left: 540 * sx, top: 920 * sy, originX: 'center', originY: 'center',
        textAlign: 'center'
      });
      addObj(vsText, { name: 'Matchup Text', role: 'text' });

      const bottomStripe = new fabric.Rect({
        width: dims.width, height: 10 * sy, fill: colors.accent,
        left: 0, top: dims.height - 10 * sy
      });
      addObj(bottomStripe, { name: 'Bottom Stripe', role: 'accent' });
      break;
    }

    case 'Rivalry Matchup': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#0a0a0f', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const leftPanel = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 600, y: 0 }, { x: 480, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#dc2626', opacity: 0.9 });
      addObj(leftPanel, { name: 'Left Panel', role: 'primary' });

      const leftOverlay = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 560, y: 0 }, { x: 440, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#dc2626', opacity: 0.15 });
      addObj(leftOverlay, { name: 'Left Depth', role: 'primary' });

      for (let i = 0; i < 8; i++) {
        const hx = 50 + i * 60;
        addObj(new fabric.Rect({
          width: 3, height: 1080, fill: '#ffffff', opacity: 0.06,
          left: hx, top: 0
        }), { name: `Left Hash ${i}`, role: 'none', locked: true });
      }

      const rightPanel = new fabric.Polygon([
        { x: 620, y: 0 }, { x: 1080, y: 0 }, { x: 1080, y: 1080 }, { x: 500, y: 1080 }
      ], { fill: '#1e293b', opacity: 0.9 });
      addObj(rightPanel, { name: 'Right Panel', role: 'secondary' });

      const rightOverlay = new fabric.Polygon([
        { x: 660, y: 0 }, { x: 1080, y: 0 }, { x: 1080, y: 1080 }, { x: 540, y: 1080 }
      ], { fill: '#1e293b', opacity: 0.2 });
      addObj(rightOverlay, { name: 'Right Depth', role: 'secondary' });

      for (let i = 0; i < 8; i++) {
        const hx = 620 + i * 60;
        addObj(new fabric.Rect({
          width: 3, height: 1080, fill: '#ffffff', opacity: 0.04,
          left: hx, top: 0
        }), { name: `Right Hash ${i}`, role: 'none', locked: true });
      }

      const centerLine = new fabric.Rect({
        width: 4, height: 700, fill: '#f59e0b', opacity: 0.5,
        left: 540, top: 100, originX: 'center'
      });
      addObj(centerLine, { name: 'Center Line', role: 'accent' });

      const vsOuter = new fabric.Circle({
        radius: 85, fill: 'transparent', left: 540, top: 500,
        originX: 'center', originY: 'center',
        stroke: '#f59e0b', strokeWidth: 4
      });
      addObj(vsOuter, { name: 'VS Outer Ring', role: 'accent' });

      const vsCircle = new fabric.Circle({
        radius: 65, fill: '#f59e0b', left: 540, top: 500,
        originX: 'center', originY: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(245,158,11,0.5)', blur: 25 })
      });
      addObj(vsCircle, { name: 'VS Badge', role: 'accent' });

      const vsLabel = new fabric.Textbox('VS', {
        fontFamily: 'Teko', fontSize: 75, fill: '#111827',
        width: 130, left: 540, top: 500, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(vsLabel, { name: 'VS Text', role: 'text' });

      const rivalryTitle = new fabric.Textbox('RIVALRY\nWEEK', {
        fontFamily: 'Teko', fontSize: 170, fill: '#ffffff',
        width: 460, left: 50, top: 70, fontWeight: 'bold', lineHeight: 0.8,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 10, offsetX: 3, offsetY: 3 })
      });
      addObj(rivalryTitle, { name: 'Title', role: 'text' });

      const titleUnderline = new fabric.Rect({
        width: 120, height: 6, fill: '#f59e0b',
        left: 55, top: 340
      });
      addObj(titleUnderline, { name: 'Title Underline', role: 'accent' });

      const team1Bg = new fabric.Polygon([
        { x: 30, y: 800 }, { x: 430, y: 800 },
        { x: 400, y: 920 }, { x: 0, y: 920 }
      ], { fill: '#000000', opacity: 0.3 });
      addObj(team1Bg, { name: 'Home Team Bg', role: 'secondary' });

      const team1 = new fabric.Textbox('HOME', {
        fontFamily: 'Teko', fontSize: 110, fill: '#ffffff',
        width: 400, left: 200, top: 850, originX: 'center', fontWeight: 'bold',
        textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 8 })
      });
      addObj(team1, { name: 'Home Team', role: 'text' });

      const team2Bg = new fabric.Polygon([
        { x: 650, y: 800 }, { x: 1080, y: 800 },
        { x: 1080, y: 920 }, { x: 680, y: 920 }
      ], { fill: '#000000', opacity: 0.3 });
      addObj(team2Bg, { name: 'Away Team Bg', role: 'secondary' });

      const team2 = new fabric.Textbox('AWAY', {
        fontFamily: 'Teko', fontSize: 110, fill: '#ffffff',
        width: 400, left: 860, top: 850, originX: 'center', fontWeight: 'bold',
        textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 8 })
      });
      addObj(team2, { name: 'Away Team', role: 'text' });

      const dateBar = new fabric.Polygon([
        { x: 0, y: 960 }, { x: 1080, y: 940 },
        { x: 1080, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#f59e0b' });
      addObj(dateBar, { name: 'Date Bar', role: 'accent' });

      const dateText = new fabric.Textbox('FRIDAY • 7:00 PM • HOME STADIUM', {
        fontFamily: 'Inter', fontSize: 30, fill: '#111827',
        width: 1000, left: 540, top: 1020, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 100, textAlign: 'center'
      });
      addObj(dateText, { name: 'Date Info', role: 'text' });
      break;
    }

    case 'Conference Tournament': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#080c1a', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const topGrad = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 350 }, { x: 0, y: 420 }
      ], { fill: '#7c3aed', opacity: 0.5 });
      addObj(topGrad, { name: 'Top Overlay', role: 'primary' });

      const topGrad2 = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 280 }, { x: 0, y: 350 }
      ], { fill: '#7c3aed', opacity: 0.3 });
      addObj(topGrad2, { name: 'Top Overlay 2', role: 'primary' });

      const yearText = new fabric.Textbox('2026', {
        fontFamily: 'Teko', fontSize: 350, fill: '#fbbf24', opacity: 0.08,
        width: 800, left: 540, top: 350, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(yearText, { name: 'Year Watermark', role: 'accent' });

      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const len = 200;
        const cx = 540, cy = 400;
        addObj(new fabric.Rect({
          width: 2, height: len, fill: '#fbbf24', opacity: 0.12,
          left: cx + Math.cos(angle) * 80, top: cy + Math.sin(angle) * 80 - len / 2,
          angle: (i * 60) + 90, originX: 'center', originY: 'center'
        }), { name: `Radial ${i}`, role: 'none', locked: true });
      }

      const badgeOuter = new fabric.Rect({
        width: 740, height: 270, fill: 'transparent',
        left: 540, top: 400, originX: 'center', originY: 'center',
        rx: 20, ry: 20, stroke: '#fbbf24', strokeWidth: 3, opacity: 0.5
      });
      addObj(badgeOuter, { name: 'Badge Glow', role: 'accent' });

      const centerBadge = new fabric.Rect({
        width: 700, height: 240, fill: '#7c3aed',
        left: 540, top: 400, originX: 'center', originY: 'center', rx: 14, ry: 14,
        shadow: new fabric.Shadow({ color: 'rgba(124,58,237,0.6)', blur: 30 })
      });
      addObj(centerBadge, { name: 'Center Badge', role: 'primary' });

      const confTitle = new fabric.Textbox('CONFERENCE\nTOURNAMENT', {
        fontFamily: 'Teko', fontSize: 115, fill: '#ffffff',
        width: 680, left: 540, top: 400, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center', lineHeight: 0.85,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 8 })
      });
      addObj(confTitle, { name: 'Title', role: 'text' });

      const bracketSlots = [
        { x: 80, y: 620 }, { x: 80, y: 710 },
        { x: 680, y: 620 }, { x: 680, y: 710 },
      ];
      const slotNames = ['TEAM A', 'TEAM B', 'TEAM C', 'TEAM D'];

      bracketSlots.forEach((s, i) => {
        addObj(new fabric.Rect({
          width: 320, height: 65, fill: '#1e293b',
          left: s.x, top: s.y, rx: 6, ry: 6
        }), { name: `Bracket Slot ${i + 1}`, role: 'secondary' });

        addObj(new fabric.Rect({
          width: 6, height: 65, fill: '#7c3aed',
          left: s.x, top: s.y
        }), { name: `Slot ${i + 1} Accent`, role: 'primary' });

        addObj(new fabric.Textbox(slotNames[i], {
          fontFamily: 'Inter', fontSize: 26, fill: '#ffffff',
          width: 280, left: s.x + 170, top: s.y + 33, originX: 'center', originY: 'center',
          fontWeight: 'bold', textAlign: 'center'
        }), { name: `Slot ${i + 1} Text`, role: 'text' });
      });

      addObj(new fabric.Rect({
        width: 3, height: 50, fill: '#fbbf24', opacity: 0.4,
        left: 240, top: 685, originX: 'center'
      }), { name: 'Left Bracket Line', role: 'accent' });

      addObj(new fabric.Rect({
        width: 3, height: 50, fill: '#fbbf24', opacity: 0.4,
        left: 840, top: 685, originX: 'center'
      }), { name: 'Right Bracket Line', role: 'accent' });

      addObj(new fabric.Rect({
        width: 600, height: 3, fill: '#fbbf24', opacity: 0.3,
        left: 240, top: 810
      }), { name: 'Finals Connector', role: 'accent' });

      addObj(new fabric.Rect({
        width: 3, height: 40, fill: '#fbbf24', opacity: 0.3,
        left: 540, top: 810, originX: 'center'
      }), { name: 'Finals Drop', role: 'accent' });

      const finalBox = new fabric.Rect({
        width: 380, height: 80, fill: '#fbbf24',
        left: 540, top: 890, originX: 'center', originY: 'center', rx: 6, ry: 6,
        shadow: new fabric.Shadow({ color: 'rgba(251,191,36,0.4)', blur: 20 })
      });
      addObj(finalBox, { name: 'Final Box', role: 'accent' });

      const finalText = new fabric.Textbox('CHAMPIONSHIP', {
        fontFamily: 'Teko', fontSize: 44, fill: '#0f172a',
        width: 380, left: 540, top: 890, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(finalText, { name: 'Final Label', role: 'text' });

      addObj(new fabric.Rect({
        width: 1080, height: 8, fill: '#7c3aed', opacity: 0.6,
        left: 0, top: 1000
      }), { name: 'Bottom Accent', role: 'primary' });

      const dateLabel = new fabric.Textbox('MARCH 2026 • CONFERENCE CENTER', {
        fontFamily: 'Inter', fontSize: 22, fill: '#a78bfa',
        width: 800, left: 540, top: 1040, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 120, textAlign: 'center'
      });
      addObj(dateLabel, { name: 'Date Label', role: 'accent' });
      break;
    }

    case 'Score Announcement': {
      const scoreBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: '#0c1220', selectable: false });
      addObj(scoreBg, { name: 'Background', role: 'background', locked: true });

      for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {
          if ((r + c) % 3 === 0) {
            addObj(new fabric.Circle({
              radius: 3, fill: '#ffffff', opacity: 0.03,
              left: 45 + c * 90, top: 45 + r * 90
            }), { name: `Dot ${r}-${c}`, role: 'none', locked: true });
          }
        }
      }

      const topAccent = new fabric.Polygon([
        { x: 0, y: 0 }, { x: dims.width, y: 0 },
        { x: dims.width, y: 10 * sy }, { x: 0, y: 10 * sy }
      ], { fill: colors.accent });
      addObj(topAccent, { name: 'Top Accent', role: 'accent' });

      const centerStripe = new fabric.Polygon([
        { x: 0, y: 360 * sy }, { x: dims.width, y: 320 * sy },
        { x: dims.width, y: 720 * sy }, { x: 0, y: 760 * sy }
      ], { fill: colors.primary, opacity: 0.95 });
      addObj(centerStripe, { name: 'Center Stripe', role: 'primary' });

      const stripeTopEdge = new fabric.Polygon([
        { x: 0, y: 355 * sy }, { x: dims.width, y: 315 * sy },
        { x: dims.width, y: 322 * sy }, { x: 0, y: 362 * sy }
      ], { fill: colors.accent, opacity: 0.8 });
      addObj(stripeTopEdge, { name: 'Stripe Top Edge', role: 'accent' });

      const stripeBotEdge = new fabric.Polygon([
        { x: 0, y: 758 * sy }, { x: dims.width, y: 718 * sy },
        { x: dims.width, y: 725 * sy }, { x: 0, y: 765 * sy }
      ], { fill: colors.accent, opacity: 0.5 });
      addObj(stripeBotEdge, { name: 'Stripe Bottom Edge', role: 'accent' });

      const finalBadge = new fabric.Rect({
        width: 220 * sx, height: 50 * sy, fill: colors.accent,
        left: dims.width / 2, top: 240 * sy, originX: 'center', originY: 'center',
        rx: 4, ry: 4
      });
      addObj(finalBadge, { name: 'Final Badge', role: 'accent' });

      const finalScoreLabel = new fabric.Textbox('FINAL SCORE', {
        fontFamily: 'Inter', fontSize: 28 * Math.min(sx, sy), fill: colors.secondary,
        width: 300 * sx, left: dims.width / 2, top: 240 * sy, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 200, textAlign: 'center'
      });
      addObj(finalScoreLabel, { name: 'Label', role: 'text' });

      const team1Name = new fabric.Textbox('HOME TEAM', {
        fontFamily: 'Inter', fontSize: 30 * Math.min(sx, sy), fill: '#ffffff',
        width: 400 * sx, left: dims.width * 0.25, top: 350 * sy, originX: 'center',
        fontWeight: 'bold', charSpacing: 80, textAlign: 'center', opacity: 0.7
      });
      addObj(team1Name, { name: 'Home Team Name', role: 'text' });

      const team1Score = new fabric.Textbox('42', {
        fontFamily: 'Teko', fontSize: 280 * Math.min(sx, sy), fill: '#ffffff',
        width: 350 * sx, left: dims.width * 0.25, top: 540 * sy, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 12, offsetX: 4, offsetY: 4 })
      });
      addObj(team1Score, { name: 'Home Score', role: 'text' });

      const team2Name = new fabric.Textbox('AWAY TEAM', {
        fontFamily: 'Inter', fontSize: 30 * Math.min(sx, sy), fill: '#ffffff',
        width: 400 * sx, left: dims.width * 0.75, top: 350 * sy, originX: 'center',
        fontWeight: 'bold', charSpacing: 80, textAlign: 'center', opacity: 0.7
      });
      addObj(team2Name, { name: 'Away Team Name', role: 'text' });

      const team2Score = new fabric.Textbox('24', {
        fontFamily: 'Teko', fontSize: 280 * Math.min(sx, sy), fill: '#ffffff',
        width: 350 * sx, left: dims.width * 0.75, top: 540 * sy, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 12, offsetX: 4, offsetY: 4 })
      });
      addObj(team2Score, { name: 'Away Score', role: 'text' });

      const dividerCircle = new fabric.Circle({
        radius: 40 * Math.min(sx, sy), fill: colors.accent,
        left: dims.width / 2, top: 540 * sy, originX: 'center', originY: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(250,204,21,0.4)', blur: 20 })
      });
      addObj(dividerCircle, { name: 'Divider Circle', role: 'accent' });

      const dash = new fabric.Textbox('VS', {
        fontFamily: 'Teko', fontSize: 45 * Math.min(sx, sy), fill: colors.secondary,
        width: 80 * sx, left: dims.width / 2, top: 540 * sy, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(dash, { name: 'Divider', role: 'text' });

      const bottomBar = new fabric.Rect({
        width: dims.width, height: 100 * sy, fill: colors.secondary,
        left: 0, top: dims.height - 100 * sy
      });
      addObj(bottomBar, { name: 'Bottom Bar', role: 'secondary' });

      const gameDetails = new fabric.Textbox('FRIDAY • NOVEMBER 15 • HOME STADIUM', {
        fontFamily: 'Inter', fontSize: 22 * Math.min(sx, sy), fill: '#ffffff',
        width: 800 * sx, left: dims.width / 2, top: dims.height - 50 * sy,
        originX: 'center', originY: 'center', fontWeight: 'bold',
        charSpacing: 100, textAlign: 'center', opacity: 0.6
      });
      addObj(gameDetails, { name: 'Game Details', role: 'text' });
      break;
    }

    case 'Weekly Recap': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#070d1a', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const headerBar = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 190 }, { x: 0, y: 230 }
      ], { fill: '#059669' });
      addObj(headerBar, { name: 'Header Bar', role: 'primary' });

      const headerAccent = new fabric.Polygon([
        { x: 0, y: 228 }, { x: 1080, y: 188 },
        { x: 1080, y: 196 }, { x: 0, y: 236 }
      ], { fill: '#4ade80', opacity: 0.6 });
      addObj(headerAccent, { name: 'Header Accent', role: 'accent' });

      const recapTitle = new fabric.Textbox('WEEKLY RECAP', {
        fontFamily: 'Teko', fontSize: 140, fill: '#ffffff',
        width: 900, left: 540, top: 95, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 10 })
      });
      addObj(recapTitle, { name: 'Title', role: 'text' });

      const weekBadge = new fabric.Rect({
        width: 260, height: 42, fill: '#f0fdf4',
        left: 540, top: 275, originX: 'center', originY: 'center', rx: 4, ry: 4
      });
      addObj(weekBadge, { name: 'Week Badge', role: 'accent' });

      const weekLabel = new fabric.Textbox('WEEK 8 RESULTS', {
        fontFamily: 'Inter', fontSize: 22, fill: '#064e3b',
        width: 260, left: 540, top: 275, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 120, textAlign: 'center'
      });
      addObj(weekLabel, { name: 'Week Label', role: 'text' });

      const gameRows = [
        { y: 340, teams: 'EAGLES vs HAWKS', score: 'W 35 - 21', num: '01' },
        { y: 490, teams: 'EAGLES vs TIGERS', score: 'W 28 - 14', num: '02' },
        { y: 640, teams: 'EAGLES vs BEARS', score: 'L 17 - 24', num: '03' },
      ];

      gameRows.forEach((row, i) => {
        const isWin = row.score.startsWith('W');

        const rowBg = new fabric.Rect({
          width: 920, height: 110, fill: i % 2 === 0 ? '#111d30' : '#162032',
          left: 80, top: row.y, rx: 8, ry: 8
        });
        addObj(rowBg, { name: `Row ${i + 1} Bg`, role: 'secondary' });

        addObj(new fabric.Rect({
          width: 6, height: 110, fill: isWin ? '#4ade80' : '#f87171',
          left: 80, top: row.y, rx: 3, ry: 0
        }), { name: `Row ${i + 1} Indicator`, role: 'accent' });

        addObj(new fabric.Circle({
          radius: 22, fill: isWin ? '#059669' : '#dc2626', opacity: 0.25,
          left: 125, top: row.y + 55, originX: 'center', originY: 'center'
        }), { name: `Row ${i + 1} Num Bg`, role: 'primary' });

        addObj(new fabric.Textbox(row.num, {
          fontFamily: 'Teko', fontSize: 28, fill: isWin ? '#4ade80' : '#f87171',
          width: 44, left: 125, top: row.y + 55, originX: 'center', originY: 'center',
          fontWeight: 'bold', textAlign: 'center'
        }), { name: `Row ${i + 1} Number`, role: 'accent' });

        const teamText = new fabric.Textbox(row.teams, {
          fontFamily: 'Inter', fontSize: 30, fill: '#ffffff',
          width: 520, left: 170, top: row.y + 40, fontWeight: 'bold'
        });
        addObj(teamText, { name: `Game ${i + 1} Teams`, role: 'text' });

        const scoreText = new fabric.Textbox(row.score, {
          fontFamily: 'Teko', fontSize: 50, fill: isWin ? '#4ade80' : '#f87171',
          width: 200, left: 870, top: row.y + 55, originX: 'center', originY: 'center',
          fontWeight: 'bold', textAlign: 'center'
        });
        addObj(scoreText, { name: `Game ${i + 1} Score`, role: 'accent' });
      });

      const recordOuter = new fabric.Rect({
        width: 440, height: 130, fill: 'transparent',
        left: 540, top: 890, originX: 'center', originY: 'center',
        rx: 14, ry: 14, stroke: '#059669', strokeWidth: 3
      });
      addObj(recordOuter, { name: 'Record Border', role: 'primary' });

      const recordBox = new fabric.Rect({
        width: 420, height: 110, fill: '#059669',
        left: 540, top: 890, originX: 'center', originY: 'center', rx: 10, ry: 10,
        shadow: new fabric.Shadow({ color: 'rgba(5,150,105,0.4)', blur: 20 })
      });
      addObj(recordBox, { name: 'Record Box', role: 'primary' });

      const recordText = new fabric.Textbox('SEASON: 6-2', {
        fontFamily: 'Teko', fontSize: 65, fill: '#ffffff',
        width: 400, left: 540, top: 890, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(recordText, { name: 'Season Record', role: 'text' });

      addObj(new fabric.Rect({
        width: 1080, height: 6, fill: '#059669', opacity: 0.4,
        left: 0, top: 1020
      }), { name: 'Bottom Line', role: 'primary' });

      addObj(new fabric.Textbox('#TEAMNAME', {
        fontFamily: 'Inter', fontSize: 18, fill: '#4ade80', opacity: 0.5,
        width: 600, left: 540, top: 1050, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 150, textAlign: 'center'
      }), { name: 'Hashtag', role: 'accent' });
      break;
    }

    case 'Championship': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#110f0d', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const goldOverlay = new fabric.Rect({
        width: 1080, height: 1080, fill: '#d97706', opacity: 0.06
      });
      addObj(goldOverlay, { name: 'Gold Overlay', role: 'accent' });

      const outerFrame = new fabric.Rect({
        width: 1040, height: 1040, fill: 'transparent',
        left: 20, top: 20, stroke: '#d97706', strokeWidth: 3
      });
      addObj(outerFrame, { name: 'Outer Frame', role: 'accent' });

      const innerFrame = new fabric.Rect({
        width: 1000, height: 1000, fill: 'transparent',
        left: 40, top: 40, stroke: '#d97706', strokeWidth: 1, opacity: 0.5
      });
      addObj(innerFrame, { name: 'Inner Frame', role: 'accent' });

      const cornerSize = 40;
      const corners = [
        { x: 20, y: 20 }, { x: 1020, y: 20 },
        { x: 20, y: 1020 }, { x: 1020, y: 1020 }
      ];
      corners.forEach((c, i) => {
        const flipH = i % 2 === 1 ? -1 : 1;
        const flipV = i >= 2 ? -1 : 1;
        addObj(new fabric.Rect({
          width: cornerSize, height: 4, fill: '#fbbf24',
          left: c.x, top: c.y,
          originX: flipH === 1 ? 'left' : 'right',
          originY: flipV === 1 ? 'top' : 'bottom'
        }), { name: `Corner ${i + 1} H`, role: 'accent' });
        addObj(new fabric.Rect({
          width: 4, height: cornerSize, fill: '#fbbf24',
          left: c.x, top: c.y,
          originX: flipH === 1 ? 'left' : 'right',
          originY: flipV === 1 ? 'top' : 'bottom'
        }), { name: `Corner ${i + 1} V`, role: 'accent' });
      });

      const topBorder = new fabric.Rect({
        width: 1080, height: 8, fill: '#d97706', left: 0, top: 0
      });
      addObj(topBorder, { name: 'Top Border', role: 'accent' });

      const bottomBorder = new fabric.Rect({
        width: 1080, height: 8, fill: '#d97706', left: 0, top: 1072
      });
      addObj(bottomBorder, { name: 'Bottom Border', role: 'accent' });

      const yearWatermark = new fabric.Textbox('2026', {
        fontFamily: 'Teko', fontSize: 450, fill: '#ffffff', opacity: 0.04,
        width: 900, left: 540, top: 500, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(yearWatermark, { name: 'Year Watermark', role: 'text' });

      const champLabel = new fabric.Textbox('CHAMPIONS', {
        fontFamily: 'Teko', fontSize: 160, fill: '#d97706',
        width: 900, left: 540, top: 150, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(217,119,6,0.3)', blur: 20 })
      });
      addObj(champLabel, { name: 'Champions Title', role: 'accent' });

      const starLeft = new fabric.Polygon([
        { x: 0, y: -12 }, { x: 4, y: -4 }, { x: 12, y: -4 },
        { x: 6, y: 2 }, { x: 8, y: 10 }, { x: 0, y: 5 },
        { x: -8, y: 10 }, { x: -6, y: 2 }, { x: -12, y: -4 }, { x: -4, y: -4 }
      ], { fill: '#fbbf24', left: 160, top: 150, originX: 'center', originY: 'center', scaleX: 2, scaleY: 2 });
      addObj(starLeft, { name: 'Star Left', role: 'accent' });

      const starRight = new fabric.Polygon([
        { x: 0, y: -12 }, { x: 4, y: -4 }, { x: 12, y: -4 },
        { x: 6, y: 2 }, { x: 8, y: 10 }, { x: 0, y: 5 },
        { x: -8, y: 10 }, { x: -6, y: 2 }, { x: -12, y: -4 }, { x: -4, y: -4 }
      ], { fill: '#fbbf24', left: 920, top: 150, originX: 'center', originY: 'center', scaleX: 2, scaleY: 2 });
      addObj(starRight, { name: 'Star Right', role: 'accent' });

      const trophyOuter = new fabric.Circle({
        radius: 160, fill: '#d97706', opacity: 0.1,
        left: 540, top: 440, originX: 'center', originY: 'center'
      });
      addObj(trophyOuter, { name: 'Trophy Outer', role: 'primary' });

      const trophyBg = new fabric.Circle({
        radius: 120, fill: '#d97706', opacity: 0.2,
        left: 540, top: 440, originX: 'center', originY: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(217,119,6,0.3)', blur: 30 })
      });
      addObj(trophyBg, { name: 'Trophy Circle', role: 'primary' });

      const trophyCup = new fabric.Polygon([
        { x: -45, y: -50 }, { x: 45, y: -50 },
        { x: 35, y: 20 }, { x: -35, y: 20 }
      ], { fill: '#fbbf24', left: 540, top: 420, originX: 'center', originY: 'center' });
      addObj(trophyCup, { name: 'Trophy Cup', role: 'accent' });

      const trophyStem = new fabric.Rect({
        width: 16, height: 35, fill: '#fbbf24',
        left: 540, top: 455, originX: 'center'
      });
      addObj(trophyStem, { name: 'Trophy Stem', role: 'accent' });

      const trophyBase = new fabric.Rect({
        width: 50, height: 12, fill: '#fbbf24',
        left: 540, top: 490, originX: 'center', rx: 2, ry: 2
      });
      addObj(trophyBase, { name: 'Trophy Base', role: 'accent' });

      const teamNameChamp = new fabric.Textbox('TEAM NAME', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        width: 800, left: 540, top: 640, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10 })
      });
      addObj(teamNameChamp, { name: 'Team Name', role: 'text' });

      const ribbonLeft = new fabric.Polygon([
        { x: 140, y: 735 }, { x: 540, y: 735 },
        { x: 540, y: 795 }, { x: 160, y: 795 }, { x: 180, y: 765 }
      ], { fill: '#d97706', opacity: 0.3 });
      addObj(ribbonLeft, { name: 'Ribbon Left', role: 'primary' });

      const ribbonRight = new fabric.Polygon([
        { x: 540, y: 735 }, { x: 940, y: 735 },
        { x: 920, y: 765 }, { x: 940, y: 795 }, { x: 540, y: 795 }
      ], { fill: '#d97706', opacity: 0.3 });
      addObj(ribbonRight, { name: 'Ribbon Right', role: 'primary' });

      const confLabel = new fabric.Textbox('CONFERENCE CHAMPIONS', {
        fontFamily: 'Inter', fontSize: 28, fill: '#fef3c7',
        width: 800, left: 540, top: 765, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 200, textAlign: 'center'
      });
      addObj(confLabel, { name: 'Conference Label', role: 'accent' });

      addObj(new fabric.Rect({
        width: 120, height: 3, fill: '#d97706',
        left: 540, top: 850, originX: 'center'
      }), { name: 'Divider', role: 'accent' });

      const recordChamp = new fabric.Textbox('UNDEFEATED • 12-0', {
        fontFamily: 'Inter', fontSize: 30, fill: '#d97706',
        width: 600, left: 540, top: 900, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 120, textAlign: 'center'
      });
      addObj(recordChamp, { name: 'Record', role: 'accent' });
      break;
    }

    case 'Player Spotlight': {
      const spotBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: '#0a0a0a', selectable: false });
      addObj(spotBg, { name: 'Background', role: 'background', locked: true });

      const diagStripe = new fabric.Polygon([
        { x: 200 * sx, y: 0 }, { x: 350 * sx, y: 0 },
        { x: 50 * sx, y: dims.height }, { x: -100 * sx, y: dims.height }
      ], { fill: colors.primary, opacity: 0.08 });
      addObj(diagStripe, { name: 'Background Stripe', role: 'primary' });

      const statPanel = new fabric.Polygon([
        { x: 650 * sx, y: 0 }, { x: dims.width, y: 0 },
        { x: dims.width, y: dims.height }, { x: 720 * sx, y: dims.height }
      ], { fill: colors.primary });
      addObj(statPanel, { name: 'Stat Panel', role: 'primary' });

      const panelEdge = new fabric.Polygon([
        { x: 645 * sx, y: 0 }, { x: 655 * sx, y: 0 },
        { x: 725 * sx, y: dims.height }, { x: 715 * sx, y: dims.height }
      ], { fill: colors.accent, opacity: 0.6 });
      addObj(panelEdge, { name: 'Panel Edge', role: 'accent' });

      const nameBacking = new fabric.Polygon([
        { x: 0, y: 30 * sy }, { x: 620 * sx, y: 30 * sy },
        { x: 580 * sx, y: 360 * sy }, { x: 0, y: 360 * sy }
      ], { fill: '#1a1a1a' });
      addObj(nameBacking, { name: 'Name Backing', role: 'secondary' });

      const playerName = new fabric.Textbox('JOHN\nDOE', {
        fontFamily: 'Teko', fontSize: 200 * Math.min(sx, sy), fill: '#ffffff',
        width: 550 * sx, left: 50 * sx, top: 50 * sy, fontWeight: 'bold', lineHeight: 0.8,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 10 })
      });
      addObj(playerName, { name: 'Player Name', role: 'text' });

      const posLabel = new fabric.Textbox('POINT GUARD', {
        fontFamily: 'Inter', fontSize: 24 * Math.min(sx, sy), fill: colors.accent,
        width: 400 * sx, left: 55 * sx, top: 380 * sy, fontWeight: 'bold', charSpacing: 200
      });
      addObj(posLabel, { name: 'Position', role: 'accent' });

      const number = new fabric.Textbox('#10', {
        fontFamily: 'Teko', fontSize: 500 * Math.min(sx, sy), fill: '#ffffff', opacity: 0.06,
        width: 600 * sx, left: -30 * sx, top: 500 * sy, fontWeight: 'bold'
      });
      addObj(number, { name: 'Jersey Number', role: 'secondary' });

      const statData = [
        { label: 'PTS', value: '24.5', y: 120 },
        { label: 'REB', value: '8.2', y: 320 },
        { label: 'AST', value: '6.1', y: 520 },
        { label: 'STL', value: '2.3', y: 720 },
      ];

      statData.forEach((s, i) => {
        addObj(new fabric.Rect({
          width: 280 * sx, height: 3, fill: '#ffffff', opacity: 0.15,
          left: 730 * sx, top: (s.y + 150) * sy
        }), { name: `Stat ${i + 1} Divider`, role: 'none', locked: true });

        addObj(new fabric.Textbox(s.label, {
          fontFamily: 'Inter', fontSize: 22 * Math.min(sx, sy), fill: colors.accent,
          width: 280 * sx, left: 730 * sx, top: (s.y + 20) * sy,
          fontWeight: 'bold', charSpacing: 200, textAlign: 'center'
        }), { name: `Stat ${i + 1} Label`, role: 'accent' });

        addObj(new fabric.Textbox(s.value, {
          fontFamily: 'Teko', fontSize: 90 * Math.min(sx, sy), fill: '#ffffff',
          width: 280 * sx, left: 730 * sx, top: (s.y + 50) * sy,
          fontWeight: 'bold', textAlign: 'center'
        }), { name: `Stat ${i + 1}`, role: 'text' });
      });

      addObj(new fabric.Rect({
        width: dims.width, height: 8 * sy, fill: colors.accent,
        left: 0, top: dims.height - 8 * sy
      }), { name: 'Bottom Accent', role: 'accent' });
      break;
    }

    case 'Branded Landscape': {
      const lBg = new fabric.Rect({
        width: 1920, height: 1080, fill: '#0f2240', selectable: false
      });
      addObj(lBg, { name: 'Background', role: 'primary', locked: true });

      const depthShape = new fabric.Polygon([
        { x: 50, y: 0 }, { x: 1050, y: 0 },
        { x: 1870, y: 1080 }, { x: 870, y: 1080 }
      ], { fill: '#78cef4', opacity: 0.15, selectable: false });
      addObj(depthShape, { name: 'Depth Layer', role: 'secondary', locked: true });

      const secondaryShape = new fabric.Polygon([
        { x: 150, y: 0 }, { x: 1150, y: 0 },
        { x: 1820, y: 1080 }, { x: 820, y: 1080 }
      ], { fill: '#78cef4', selectable: false });
      addObj(secondaryShape, { name: 'Secondary Color', role: 'secondary', locked: true });

      const edgeLine = new fabric.Polygon([
        { x: 145, y: 0 }, { x: 155, y: 0 },
        { x: 825, y: 1080 }, { x: 815, y: 1080 }
      ], { fill: '#ffffff', opacity: 0.2, selectable: false });
      addObj(edgeLine, { name: 'Edge Line', role: 'none', locked: true });

      addObj(new fabric.Rect({
        width: 60, height: 4, fill: '#ffffff', opacity: 0.3,
        left: 40, top: 40
      }), { name: 'Corner TL H', role: 'none', locked: true });
      addObj(new fabric.Rect({
        width: 4, height: 60, fill: '#ffffff', opacity: 0.3,
        left: 40, top: 40
      }), { name: 'Corner TL V', role: 'none', locked: true });
      addObj(new fabric.Rect({
        width: 60, height: 4, fill: '#ffffff', opacity: 0.3,
        left: 1820, top: 1036
      }), { name: 'Corner BR H', role: 'none', locked: true });
      addObj(new fabric.Rect({
        width: 4, height: 60, fill: '#ffffff', opacity: 0.3,
        left: 1876, top: 1016
      }), { name: 'Corner BR V', role: 'none', locked: true });

      const logoPlaceholder = new fabric.Rect({
        width: 520, height: 447, fill: 'rgba(255,255,255,0.06)',
        left: 960, top: 540, originX: 'center', originY: 'center',
        rx: 10, ry: 10, stroke: 'rgba(255,255,255,0.12)', strokeWidth: 2,
        selectable: false, evented: false
      });
      addObj(logoPlaceholder, { name: 'Logo Placeholder', role: 'background', locked: true });

      break;
    }

    case 'Senior Night': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#13110f', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const outerFrame = new fabric.Rect({
        width: 1020, height: 1020, fill: 'transparent',
        left: 30, top: 30, stroke: '#fde68a', strokeWidth: 3
      });
      addObj(outerFrame, { name: 'Decorative Frame', role: 'accent' });

      const innerFrame = new fabric.Rect({
        width: 980, height: 980, fill: 'transparent',
        left: 50, top: 50, stroke: '#fde68a', strokeWidth: 1, opacity: 0.4
      });
      addObj(innerFrame, { name: 'Inner Frame', role: 'accent' });

      const cSize = 30;
      [[30, 30], [1020, 30], [30, 1020], [1020, 1020]].forEach(([cx, cy], i) => {
        const fH = i % 2 === 1 ? -1 : 1;
        const fV = i >= 2 ? -1 : 1;
        addObj(new fabric.Rect({
          width: cSize, height: 3, fill: '#fbbf24',
          left: cx, top: cy,
          originX: fH === 1 ? 'left' : 'right',
          originY: fV === 1 ? 'top' : 'bottom'
        }), { name: `Corner ${i + 1} H`, role: 'accent' });
        addObj(new fabric.Rect({
          width: 3, height: cSize, fill: '#fbbf24',
          left: cx, top: cy,
          originX: fH === 1 ? 'left' : 'right',
          originY: fV === 1 ? 'top' : 'bottom'
        }), { name: `Corner ${i + 1} V`, role: 'accent' });
      });

      const bannerShape = new fabric.Polygon([
        { x: 190, y: 75 }, { x: 890, y: 75 },
        { x: 870, y: 165 }, { x: 210, y: 165 }
      ], { fill: '#b91c1c' });
      addObj(bannerShape, { name: 'Senior Banner', role: 'primary' });

      const bannerTailL = new fabric.Polygon([
        { x: 190, y: 75 }, { x: 210, y: 165 },
        { x: 170, y: 130 }
      ], { fill: '#991b1b' });
      addObj(bannerTailL, { name: 'Banner Tail Left', role: 'primary' });

      const bannerTailR = new fabric.Polygon([
        { x: 890, y: 75 }, { x: 870, y: 165 },
        { x: 910, y: 130 }
      ], { fill: '#991b1b' });
      addObj(bannerTailR, { name: 'Banner Tail Right', role: 'primary' });

      const seniorLabel = new fabric.Textbox('SENIOR NIGHT', {
        fontFamily: 'Teko', fontSize: 85, fill: '#ffffff',
        width: 650, left: 540, top: 120, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 8 })
      });
      addObj(seniorLabel, { name: 'Senior Label', role: 'text' });

      addObj(new fabric.Rect({
        width: 80, height: 3, fill: '#fde68a', opacity: 0.6,
        left: 540, top: 190, originX: 'center'
      }), { name: 'Class Divider', role: 'accent' });

      const classOf = new fabric.Textbox('CLASS OF 2026', {
        fontFamily: 'Inter', fontSize: 26, fill: '#fde68a',
        width: 600, left: 540, top: 215, originX: 'center', fontWeight: 'bold',
        charSpacing: 250, textAlign: 'center'
      });
      addObj(classOf, { name: 'Class Of', role: 'accent' });

      const photoBorder = new fabric.Rect({
        width: 520, height: 470, fill: 'transparent',
        left: 540, top: 490, originX: 'center', originY: 'center',
        stroke: '#fde68a', strokeWidth: 2, opacity: 0.4, rx: 8, ry: 8
      });
      addObj(photoBorder, { name: 'Photo Border', role: 'accent' });

      const playerPlaceholder = new fabric.Rect({
        width: 500, height: 450, fill: '#1c1a17',
        left: 540, top: 490, originX: 'center', originY: 'center', rx: 6, ry: 6
      });
      addObj(playerPlaceholder, { name: 'Photo Area', role: 'secondary' });

      const photoLabel = new fabric.Textbox('PLAYER\nPHOTO', {
        fontFamily: 'Inter', fontSize: 36, fill: '#57534e',
        width: 300, left: 540, top: 490, originX: 'center', originY: 'center',
        textAlign: 'center'
      });
      addObj(photoLabel, { name: 'Photo Label', role: 'none' });

      const seniorName = new fabric.Textbox('PLAYER NAME', {
        fontFamily: 'Teko', fontSize: 110, fill: '#ffffff',
        width: 800, left: 540, top: 780, originX: 'center', fontWeight: 'bold',
        textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 8 })
      });
      addObj(seniorName, { name: 'Player Name', role: 'text' });

      addObj(new fabric.Rect({
        width: 200, height: 2, fill: '#fde68a', opacity: 0.5,
        left: 540, top: 870, originX: 'center'
      }), { name: 'Name Divider', role: 'accent' });

      const seniorInfo = new fabric.Textbox('#00 • POSITION • 4 YEARS', {
        fontFamily: 'Inter', fontSize: 24, fill: '#fde68a',
        width: 800, left: 540, top: 900, originX: 'center', fontWeight: 'bold',
        charSpacing: 100, textAlign: 'center'
      });
      addObj(seniorInfo, { name: 'Player Info', role: 'accent' });

      const thankYou = new fabric.Textbox('THANK YOU FOR YOUR DEDICATION', {
        fontFamily: 'Inter', fontSize: 18, fill: '#78716c',
        width: 900, left: 540, top: 970, originX: 'center',
        charSpacing: 150, textAlign: 'center'
      });
      addObj(thankYou, { name: 'Thank You', role: 'text' });
      break;
    }

    case 'Stat Leader Board': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#020617', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const headerBg = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 170 }, { x: 0, y: 210 }
      ], { fill: '#0ea5e9' });
      addObj(headerBg, { name: 'Header', role: 'primary' });

      const headerAccent = new fabric.Polygon([
        { x: 0, y: 208 }, { x: 1080, y: 168 },
        { x: 1080, y: 178 }, { x: 0, y: 218 }
      ], { fill: '#38bdf8', opacity: 0.5 });
      addObj(headerAccent, { name: 'Header Edge', role: 'accent' });

      const lbTitle = new fabric.Textbox('STAT LEADERS', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        width: 900, left: 540, top: 85, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 10 })
      });
      addObj(lbTitle, { name: 'Title', role: 'text' });

      const catLabel = new fabric.Textbox('POINTS PER GAME', {
        fontFamily: 'Inter', fontSize: 20, fill: '#bae6fd',
        width: 400, left: 540, top: 248, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 200, textAlign: 'center'
      });
      addObj(catLabel, { name: 'Category Label', role: 'accent' });

      const players = [
        { rank: '1', name: 'J. SMITH', stat: '28.5 PPG', y: 290 },
        { rank: '2', name: 'M. JOHNSON', stat: '24.2 PPG', y: 440 },
        { rank: '3', name: 'D. WILLIAMS', stat: '21.8 PPG', y: 580 },
        { rank: '4', name: 'A. BROWN', stat: '19.4 PPG', y: 710 },
        { rank: '5', name: 'K. DAVIS', stat: '17.1 PPG', y: 840 },
      ];

      players.forEach((p, i) => {
        const isTop = i === 0;
        const rowH = isTop ? 120 : 100;

        const rowBg = new fabric.Rect({
          width: 920, height: rowH,
          fill: isTop ? '#0c2d4a' : (i % 2 === 0 ? '#0f172a' : '#131c2e'),
          left: 80, top: p.y, rx: 8, ry: 8,
          stroke: isTop ? '#0ea5e9' : 'transparent',
          strokeWidth: isTop ? 2 : 0
        });
        addObj(rowBg, { name: `Row ${i + 1}`, role: 'secondary' });

        addObj(new fabric.Rect({
          width: 5, height: rowH, fill: '#0ea5e9',
          left: 80, top: p.y, opacity: isTop ? 1 : 0.3
        }), { name: `Row ${i + 1} Accent`, role: 'accent' });

        const badgeR = isTop ? 28 : 22;
        addObj(new fabric.Circle({
          radius: badgeR, fill: isTop ? '#0ea5e9' : 'transparent',
          left: 130, top: p.y + rowH / 2, originX: 'center', originY: 'center',
          stroke: isTop ? 'transparent' : '#0ea5e9',
          strokeWidth: isTop ? 0 : 2
        }), { name: `Rank ${i + 1} Badge`, role: 'primary' });

        const rankText = new fabric.Textbox(p.rank, {
          fontFamily: 'Teko', fontSize: isTop ? 40 : 35,
          fill: isTop ? '#ffffff' : '#0ea5e9',
          width: 60, left: 130, top: p.y + rowH / 2,
          originX: 'center', originY: 'center',
          fontWeight: 'bold', textAlign: 'center'
        });
        addObj(rankText, { name: `Rank ${i + 1}`, role: 'accent' });

        const nameText = new fabric.Textbox(p.name, {
          fontFamily: 'Inter', fontSize: isTop ? 38 : 32, fill: '#ffffff',
          width: 500, left: 190, top: p.y + (rowH / 2) - 12,
          fontWeight: 'bold'
        });
        addObj(nameText, { name: `Player ${i + 1} Name`, role: 'text' });

        const statText = new fabric.Textbox(p.stat, {
          fontFamily: 'Teko', fontSize: isTop ? 55 : 45, fill: '#e0f2fe',
          width: 200, left: 900, top: p.y + rowH / 2,
          originX: 'center', originY: 'center',
          fontWeight: 'bold', textAlign: 'center'
        });
        addObj(statText, { name: `Player ${i + 1} Stat`, role: 'text' });
      });

      addObj(new fabric.Rect({
        width: 1080, height: 6, fill: '#0ea5e9', opacity: 0.3,
        left: 0, top: 980
      }), { name: 'Bottom Line', role: 'primary' });

      addObj(new fabric.Textbox('2025-2026 SEASON', {
        fontFamily: 'Inter', fontSize: 18, fill: '#38bdf8', opacity: 0.5,
        width: 500, left: 540, top: 1030, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 200, textAlign: 'center'
      }), { name: 'Season Label', role: 'accent' });
      break;
    }

    case 'Season Schedule': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#070d1a', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const sideBand = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 120, y: 0 },
        { x: 90, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#1e40af' });
      addObj(sideBand, { name: 'Side Band', role: 'primary' });

      const sideEdge = new fabric.Polygon([
        { x: 118, y: 0 }, { x: 126, y: 0 },
        { x: 96, y: 1080 }, { x: 88, y: 1080 }
      ], { fill: '#dbeafe', opacity: 0.3 });
      addObj(sideEdge, { name: 'Side Edge', role: 'accent' });

      const headerDecor = new fabric.Polygon([
        { x: 140, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 40 }, { x: 140, y: 40 }
      ], { fill: '#1e40af', opacity: 0.15 });
      addObj(headerDecor, { name: 'Header Decor', role: 'primary' });

      const schedTitle = new fabric.Textbox('2026\nSEASON', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        width: 500, left: 160, top: 60, fontWeight: 'bold', lineHeight: 0.8,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 8 })
      });
      addObj(schedTitle, { name: 'Title', role: 'text' });

      const schedLabel = new fabric.Textbox('SCHEDULE', {
        fontFamily: 'Inter', fontSize: 22, fill: '#dbeafe',
        width: 500, left: 165, top: 285, fontWeight: 'bold', charSpacing: 350
      });
      addObj(schedLabel, { name: 'Schedule Label', role: 'accent' });

      addObj(new fabric.Rect({
        width: 60, height: 4, fill: '#3b82f6',
        left: 165, top: 320
      }), { name: 'Title Underline', role: 'accent' });

      const games = [
        { date: 'SEP 5', opp: 'vs HAWKS', loc: 'HOME' },
        { date: 'SEP 12', opp: 'at TIGERS', loc: 'AWAY' },
        { date: 'SEP 19', opp: 'vs BEARS', loc: 'HOME' },
        { date: 'SEP 26', opp: 'at WOLVES', loc: 'AWAY' },
        { date: 'OCT 3', opp: 'vs LIONS', loc: 'HOME' },
        { date: 'OCT 10', opp: 'at PANTHERS', loc: 'AWAY' },
      ];

      games.forEach((g, i) => {
        const y = 370 + i * 108;
        const isHome = g.loc === 'HOME';

        const rowBg = new fabric.Rect({
          width: 860, height: 85, fill: i % 2 === 0 ? '#111d30' : '#0d1525',
          left: 150, top: y, rx: 6, ry: 6
        });
        addObj(rowBg, { name: `Game ${i + 1} Row`, role: 'secondary' });

        addObj(new fabric.Rect({
          width: 5, height: 85, fill: isHome ? '#3b82f6' : '#64748b',
          left: 150, top: y, opacity: 0.6
        }), { name: `Game ${i + 1} Accent`, role: 'primary' });

        addObj(new fabric.Rect({
          width: 8, height: 8, fill: '#3b82f6',
          left: 172, top: y + 38, angle: 45, originX: 'center', originY: 'center'
        }), { name: `Game ${i + 1} Diamond`, role: 'accent' });

        const dateText = new fabric.Textbox(g.date, {
          fontFamily: 'Inter', fontSize: 22, fill: '#93c5fd',
          width: 120, left: 200, top: y + 30, fontWeight: 'bold'
        });
        addObj(dateText, { name: `Game ${i + 1} Date`, role: 'accent' });

        const oppText = new fabric.Textbox(g.opp, {
          fontFamily: 'Teko', fontSize: 42, fill: '#ffffff',
          width: 400, left: 400, top: y + 43, originY: 'center', fontWeight: 'bold'
        });
        addObj(oppText, { name: `Game ${i + 1} Opponent`, role: 'text' });

        const locBadge = new fabric.Rect({
          width: 80, height: 30, fill: isHome ? '#166534' : '#713f12',
          left: 900, top: y + 28, rx: 4, ry: 4, opacity: 0.5
        });
        addObj(locBadge, { name: `Game ${i + 1} Loc Badge`, role: 'secondary' });

        const locText = new fabric.Textbox(g.loc, {
          fontFamily: 'Inter', fontSize: 16, fill: isHome ? '#4ade80' : '#fbbf24',
          width: 80, left: 940, top: y + 43, originX: 'center', originY: 'center',
          fontWeight: 'bold', textAlign: 'center'
        });
        addObj(locText, { name: `Game ${i + 1} Location`, role: 'accent' });
      });

      addObj(new fabric.Rect({
        width: 1080, height: 5, fill: '#1e40af', opacity: 0.4,
        left: 0, top: 1030
      }), { name: 'Bottom Line', role: 'primary' });

      addObj(new fabric.Textbox('#GOTEAM', {
        fontFamily: 'Inter', fontSize: 16, fill: '#3b82f6', opacity: 0.4,
        width: 400, left: 540, top: 1055, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 200, textAlign: 'center'
      }), { name: 'Hashtag', role: 'accent' });
      break;
    }

    case 'Practice Update': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#0a2818', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          if ((r + c) % 4 === 0) {
            addObj(new fabric.Rect({
              width: 4, height: 4, fill: '#16a34a', opacity: 0.06,
              left: 54 + c * 108, top: 54 + r * 108, angle: 45,
              originX: 'center', originY: 'center'
            }), { name: `Pattern ${r}-${c}`, role: 'none', locked: true });
          }
        }
      }

      const mainCard = new fabric.Rect({
        width: 920, height: 920, fill: '#0c1a2e',
        left: 540, top: 540, originX: 'center', originY: 'center', rx: 16, ry: 16
      });
      addObj(mainCard, { name: 'Main Card', role: 'secondary' });

      const cardTopStripe = new fabric.Rect({
        width: 920, height: 10, fill: '#16a34a',
        left: 80, top: 80, rx: 16, ry: 0
      });
      addObj(cardTopStripe, { name: 'Card Top Stripe', role: 'primary' });

      const cBrk = 25;
      [[80, 80], [970, 80], [80, 970], [970, 970]].forEach(([cx, cy], i) => {
        const fH = i % 2 === 1 ? -1 : 1;
        const fV = i >= 2 ? -1 : 1;
        addObj(new fabric.Rect({
          width: cBrk, height: 2, fill: '#4ade80', opacity: 0.4,
          left: cx, top: cy,
          originX: fH === 1 ? 'left' : 'right',
          originY: fV === 1 ? 'top' : 'bottom'
        }), { name: `Card Corner ${i + 1} H`, role: 'accent' });
        addObj(new fabric.Rect({
          width: 2, height: cBrk, fill: '#4ade80', opacity: 0.4,
          left: cx, top: cy,
          originX: fH === 1 ? 'left' : 'right',
          originY: fV === 1 ? 'top' : 'bottom'
        }), { name: `Card Corner ${i + 1} V`, role: 'accent' });
      });

      const accentLine = new fabric.Rect({
        width: 6, height: 100, fill: '#16a34a',
        left: 160, top: 145
      });
      addObj(accentLine, { name: 'Accent Line', role: 'primary' });

      const practiceTitle = new fabric.Textbox('PRACTICE\nUPDATE', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        width: 650, left: 190, top: 140,
        fontWeight: 'bold', lineHeight: 0.85,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 8 })
      });
      addObj(practiceTitle, { name: 'Title', role: 'text' });

      const divider = new fabric.Rect({
        width: 780, height: 2, fill: '#16a34a', opacity: 0.3,
        left: 540, top: 340, originX: 'center'
      });
      addObj(divider, { name: 'Divider', role: 'primary' });

      const infoItems = [
        { icon: 'square', label: 'DATE', value: 'TUESDAY, MARCH 10', y: 390 },
        { icon: 'circle', label: 'TIME', value: '3:30 PM - 5:30 PM', y: 470 },
        { icon: 'diamond', label: 'LOCATION', value: 'MAIN FIELD', y: 550 },
      ];

      infoItems.forEach((item, i) => {
        const shapes: Record<string, () => fabric.Object> = {
          square: () => new fabric.Rect({ width: 14, height: 14, fill: '#4ade80', left: 180, top: item.y + 20, angle: 0 }),
          circle: () => new fabric.Circle({ radius: 7, fill: '#4ade80', left: 180, top: item.y + 20 }),
          diamond: () => new fabric.Rect({ width: 12, height: 12, fill: '#4ade80', left: 187, top: item.y + 27, angle: 45, originX: 'center', originY: 'center' }),
        };
        addObj(shapes[item.icon](), { name: `Info ${i + 1} Icon`, role: 'accent' });

        addObj(new fabric.Textbox(item.label, {
          fontFamily: 'Inter', fontSize: 18, fill: '#4ade80',
          width: 200, left: 215, top: item.y, fontWeight: 'bold', charSpacing: 200
        }), { name: `Info ${i + 1} Label`, role: 'accent' });

        addObj(new fabric.Textbox(item.value, {
          fontFamily: 'Teko', fontSize: 42, fill: '#ffffff',
          width: 600, left: 215, top: item.y + 22, fontWeight: 'bold'
        }), { name: `Info ${i + 1} Value`, role: 'text' });
      });

      const noteBox = new fabric.Polygon([
        { x: 180, y: 660 }, { x: 900, y: 645 },
        { x: 900, y: 830 }, { x: 180, y: 830 }
      ], { fill: '#132035', rx: 10, ry: 10 });
      addObj(noteBox, { name: 'Note Box', role: 'secondary' });

      addObj(new fabric.Rect({
        width: 720, height: 4, fill: '#16a34a', opacity: 0.5,
        left: 180, top: 660
      }), { name: 'Note Top Accent', role: 'primary' });

      const noteText = new fabric.Textbox('BRING FULL GEAR\nFOCUS: DEFENSIVE DRILLS', {
        fontFamily: 'Teko', fontSize: 50, fill: '#ffffff',
        width: 680, left: 540, top: 740, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2
      });
      addObj(noteText, { name: 'Note Text', role: 'text' });

      const footerBg = new fabric.Rect({
        width: 700, height: 50, fill: '#16a34a', opacity: 0.15,
        left: 540, top: 900, originX: 'center', originY: 'center', rx: 6, ry: 6
      });
      addObj(footerBg, { name: 'Footer Bg', role: 'primary' });

      const footer = new fabric.Textbox('BE ON TIME • BE PREPARED • BE GREAT', {
        fontFamily: 'Inter', fontSize: 18, fill: '#4ade80',
        width: 700, left: 540, top: 900, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 100, textAlign: 'center'
      });
      addObj(footer, { name: 'Footer', role: 'accent' });
      break;
    }

    case 'Team Roster Reveal': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#110e30', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const headerStripe = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 190 }, { x: 0, y: 230 }
      ], { fill: '#7c3aed' });
      addObj(headerStripe, { name: 'Header', role: 'primary' });

      const headerEdge = new fabric.Polygon([
        { x: 0, y: 228 }, { x: 1080, y: 188 },
        { x: 1080, y: 198 }, { x: 0, y: 238 }
      ], { fill: '#a78bfa', opacity: 0.4 });
      addObj(headerEdge, { name: 'Header Edge', role: 'accent' });

      for (let i = 0; i < 4; i++) {
        addObj(new fabric.Rect({
          width: 3, height: 60, fill: '#ffffff', opacity: 0.08,
          left: 180 + i * 240, top: 0
        }), { name: `Header Line ${i}`, role: 'none', locked: true });
      }

      const rosterTitle = new fabric.Textbox('ROSTER REVEAL', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        width: 900, left: 540, top: 95, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 10 })
      });
      addObj(rosterTitle, { name: 'Title', role: 'text' });

      const seasonLabel = new fabric.Textbox('2025-2026 SEASON', {
        fontFamily: 'Inter', fontSize: 22, fill: '#c4b5fd',
        width: 700, left: 540, top: 265, originX: 'center', fontWeight: 'bold',
        charSpacing: 200, textAlign: 'center'
      });
      addObj(seasonLabel, { name: 'Season Label', role: 'accent' });

      const gridData = [
        ['SMITH', 'JONES', 'DAVIS'],
        ['WILSON', 'BROWN', 'GARCIA'],
        ['MILLER', 'TAYLOR', 'THOMAS'],
      ];
      const gridNums = [
        ['#1', '#2', '#3'],
        ['#4', '#5', '#6'],
        ['#7', '#8', '#9'],
      ];

      gridData.forEach((row, ri) => {
        row.forEach((player, ci) => {
          const x = 110 + ci * 300;
          const y = 310 + ri * 225;
          const idx = ri * 3 + ci + 1;

          const cell = new fabric.Rect({
            width: 275, height: 195, fill: '#1e1a50',
            left: x, top: y, rx: 8, ry: 8
          });
          addObj(cell, { name: `Cell ${idx}`, role: 'secondary' });

          addObj(new fabric.Rect({
            width: 275, height: 5, fill: '#7c3aed',
            left: x, top: y, rx: 8, ry: 0
          }), { name: `Cell ${idx} Top`, role: 'primary' });

          addObj(new fabric.Circle({
            radius: 24, fill: '#7c3aed', opacity: 0.3,
            left: x + 137, top: y + 65, originX: 'center', originY: 'center'
          }), { name: `Cell ${idx} Num Bg`, role: 'primary' });

          addObj(new fabric.Textbox(gridNums[ri][ci], {
            fontFamily: 'Teko', fontSize: 30, fill: '#c4b5fd',
            width: 48, left: x + 137, top: y + 65,
            originX: 'center', originY: 'center',
            fontWeight: 'bold', textAlign: 'center'
          }), { name: `Cell ${idx} Number`, role: 'accent' });

          const playerText = new fabric.Textbox(player, {
            fontFamily: 'Teko', fontSize: 38, fill: '#ffffff',
            width: 255, left: x + 137, top: y + 140,
            originX: 'center', originY: 'center',
            fontWeight: 'bold', textAlign: 'center'
          });
          addObj(playerText, { name: `Player ${idx}`, role: 'text' });
        });
      });

      const bottomBar = new fabric.Polygon([
        { x: 0, y: 995 }, { x: 1080, y: 1015 },
        { x: 1080, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#7c3aed' });
      addObj(bottomBar, { name: 'Bottom Bar', role: 'primary' });

      addObj(new fabric.Textbox('LET\'S GO!', {
        fontFamily: 'Teko', fontSize: 40, fill: '#ffffff',
        width: 400, left: 540, top: 1045, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center', opacity: 0.8
      }), { name: 'Bottom Text', role: 'text' });
      break;
    }

    case 'Recruitment Graphic': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#110f0d', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const diagDeep = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 350 }, { x: 0, y: 550 }
      ], { fill: '#ea580c', opacity: 0.2 });
      addObj(diagDeep, { name: 'Top Deep', role: 'primary' });

      const diag1 = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 },
        { x: 1080, y: 280 }, { x: 0, y: 480 }
      ], { fill: '#ea580c', opacity: 0.85 });
      addObj(diag1, { name: 'Top Diagonal', role: 'primary' });

      const diagEdge1 = new fabric.Polygon([
        { x: 0, y: 478 }, { x: 1080, y: 278 },
        { x: 1080, y: 286 }, { x: 0, y: 486 }
      ], { fill: '#fb923c', opacity: 0.5 });
      addObj(diagEdge1, { name: 'Top Edge', role: 'accent' });

      for (let i = 0; i < 6; i++) {
        const yOff = 80 + i * 70;
        addObj(new fabric.Rect({
          width: 1080, height: 3, fill: '#ffffff', opacity: 0.05,
          left: 0, top: yOff
        }), { name: `Top Hash ${i}`, role: 'none', locked: true });
      }

      const diagDeep2 = new fabric.Polygon([
        { x: 0, y: 730 }, { x: 1080, y: 530 },
        { x: 1080, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#ea580c', opacity: 0.15 });
      addObj(diagDeep2, { name: 'Bottom Deep', role: 'primary' });

      const diag2 = new fabric.Polygon([
        { x: 0, y: 800 }, { x: 1080, y: 600 },
        { x: 1080, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#ea580c', opacity: 0.65 });
      addObj(diag2, { name: 'Bottom Diagonal', role: 'primary' });

      const diagEdge2 = new fabric.Polygon([
        { x: 0, y: 795 }, { x: 1080, y: 595 },
        { x: 1080, y: 603 }, { x: 0, y: 803 }
      ], { fill: '#fb923c', opacity: 0.4 });
      addObj(diagEdge2, { name: 'Bottom Edge', role: 'accent' });

      const seasonBadge = new fabric.Rect({
        width: 220, height: 40, fill: '#fff7ed',
        left: 80, top: 100, rx: 4, ry: 4
      });
      addObj(seasonBadge, { name: 'Season Badge', role: 'accent' });

      const seasonText = new fabric.Textbox('SEASON 2026', {
        fontFamily: 'Inter', fontSize: 20, fill: '#1c1917',
        width: 220, left: 190, top: 120, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 150, textAlign: 'center'
      });
      addObj(seasonText, { name: 'Season Text', role: 'text' });

      const recruitTitle = new fabric.Textbox('JOIN\nTHE\nTEAM', {
        fontFamily: 'Teko', fontSize: 210, fill: '#ffffff',
        width: 520, left: 60, top: 320, fontWeight: 'bold', lineHeight: 0.78,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 15, offsetX: 5, offsetY: 5 })
      });
      addObj(recruitTitle, { name: 'Title', role: 'text' });

      const ctaShape = new fabric.Polygon([
        { x: 580, y: 680 }, { x: 1040, y: 680 },
        { x: 1020, y: 770 }, { x: 560, y: 770 }
      ], { fill: '#fff7ed' });
      addObj(ctaShape, { name: 'CTA Box', role: 'accent' });

      const ctaText = new fabric.Textbox('TRYOUTS: MAR 15', {
        fontFamily: 'Teko', fontSize: 50, fill: '#1c1917',
        width: 440, left: 800, top: 725, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center'
      });
      addObj(ctaText, { name: 'CTA Text', role: 'text' });

      addObj(new fabric.Circle({
        radius: 6, fill: '#ea580c',
        left: 585, top: 810
      }), { name: 'Contact Icon', role: 'accent' });

      const contactInfo = new fabric.Textbox('CONTACT: COACH@SCHOOL.EDU', {
        fontFamily: 'Inter', fontSize: 22, fill: '#fff7ed',
        width: 460, left: 810, top: 815, originX: 'center',
        fontWeight: 'bold', charSpacing: 60, textAlign: 'center'
      });
      addObj(contactInfo, { name: 'Contact', role: 'accent' });

      addObj(new fabric.Rect({
        width: 1080, height: 6, fill: '#ea580c', opacity: 0.5,
        left: 0, top: 1000
      }), { name: 'Bottom Line', role: 'primary' });

      const tagline = new fabric.Textbox('BE PART OF SOMETHING GREATER', {
        fontFamily: 'Inter', fontSize: 18, fill: '#fb923c',
        width: 800, left: 540, top: 1040, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 180, textAlign: 'center'
      });
      addObj(tagline, { name: 'Tagline', role: 'accent' });
      break;
    }

    case 'Athlete of the Week': {
      const aotw = { w: 1920, h: 1080 };

      const aotwBg = new fabric.Rect({
        width: aotw.w, height: aotw.h, fill: '#0a0a0a', selectable: false
      });
      addObj(aotwBg, { name: 'Background', role: 'background', locked: true });

      const photoArea = new fabric.Rect({
        width: 750, height: 900, fill: '#111111',
        left: 80, top: 90, rx: 12, ry: 12
      });
      addObj(photoArea, { name: 'Photo Area', role: 'secondary' });

      const photoLabel = new fabric.Textbox('PLAYER\nPHOTO', {
        fontFamily: 'Inter', fontSize: 40, fill: '#333333',
        width: 400, left: 455, top: 540, originX: 'center', originY: 'center',
        textAlign: 'center', fontWeight: 'bold'
      });
      addObj(photoLabel, { name: 'Photo Label', role: 'none' });

      const curvePathData =
        'M 820 0 ' +
        'C 680 270, 650 540, 720 810 ' +
        'C 760 920, 780 1000, 700 1080 ' +
        'L 1920 1080 ' +
        'L 1920 0 ' +
        'Z';
      const curvedPanel = new fabric.Path(curvePathData, {
        fill: '#ffffff',
        selectable: false
      });
      addObj(curvedPanel, { name: 'White Panel', role: 'accent', locked: true });

      const curveBezier = (t: number) => {
        if (t <= 0.75) {
          const u = t / 0.75;
          const mt = 1 - u;
          const x = mt * mt * mt * 820 + 3 * mt * mt * u * 680 + 3 * mt * u * u * 650 + u * u * u * 720;
          const y = mt * mt * mt * 0 + 3 * mt * mt * u * 270 + 3 * mt * u * u * 540 + u * u * u * 810;
          return { x, y };
        } else {
          const u = (t - 0.75) / 0.25;
          const mt = 1 - u;
          const x = mt * mt * mt * 720 + 3 * mt * mt * u * 760 + 3 * mt * u * u * 780 + u * u * u * 700;
          const y = mt * mt * mt * 810 + 3 * mt * mt * u * 920 + 3 * mt * u * u * 1000 + u * u * u * 1080;
          return { x, y };
        }
      };

      const dotCount = 55;
      for (let i = 0; i <= dotCount; i++) {
        const t = i / dotCount;
        const pt = curveBezier(t);
        const dot = new fabric.Circle({
          radius: 4, fill: '#ffffff', opacity: 0.45,
          left: pt.x - 15, top: pt.y, originX: 'center', originY: 'center'
        });
        addObj(dot, { name: `Curve Dot ${i}`, role: 'none', locked: true });
      }

      const logoBadge = new fabric.Circle({
        radius: 48, fill: '#ffffff',
        left: 85, top: 85, originX: 'center', originY: 'center',
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 10 })
      });
      addObj(logoBadge, { name: 'Logo Badge', role: 'accent' });

      const aotwLabel1 = new fabric.Textbox('ATHLETE OF THE', {
        fontFamily: 'Teko', fontSize: 58, fill: '#1a1a1a',
        width: 700, left: 1130, top: 220,
        fontWeight: 'bold', charSpacing: 120
      });
      addObj(aotwLabel1, { name: 'Title Line 1', role: 'text' });

      const aotwLabel2 = new fabric.Textbox('WEEK', {
        fontFamily: 'Teko', fontSize: 180, fill: '#1a1a1a',
        width: 700, left: 1130, top: 260,
        fontWeight: 'bold', lineHeight: 0.9
      });
      addObj(aotwLabel2, { name: 'Title Line 2', role: 'text' });

      const nameBarWidth = 620;
      const nameBarHeight = 70;
      const nameBarLeft = 1130;
      const nameBarTop = 520;

      const nameBar = new fabric.Rect({
        width: nameBarWidth, height: nameBarHeight,
        fill: colors.primary,
        left: nameBarLeft, top: nameBarTop,
        rx: 4, ry: 4
      });
      addObj(nameBar, { name: 'Name Bar', role: 'primary' });

      const playerName = new fabric.Textbox('RILEY JEAN SULLIVAN', {
        fontFamily: 'Teko', fontSize: 42, fill: '#ffffff',
        width: nameBarWidth - 30, left: nameBarLeft + 15, top: nameBarTop + 12,
        fontWeight: 'bold', charSpacing: 80
      });
      addObj(playerName, { name: 'Player Name', role: 'text' });

      const statsLine = new fabric.Textbox('5 GOALS  |  7 ASSISTS', {
        fontFamily: 'Inter', fontSize: 28, fill: '#444444',
        width: 500, left: 1130, top: 630,
        fontWeight: 'bold', charSpacing: 60
      });
      addObj(statsLine, { name: 'Stats', role: 'text' });

      const schoolName = new fabric.Textbox('SOUTH MERIST ACADEMY', {
        fontFamily: 'Inter', fontSize: 20, fill: '#888888',
        width: 500, left: 1130, top: 900,
        fontWeight: 'bold', charSpacing: 200
      });
      addObj(schoolName, { name: 'School Name', role: 'text' });

      addObj(new fabric.Rect({
        width: 60, height: 3, fill: '#cccccc',
        left: 1130, top: 880
      }), { name: 'School Divider', role: 'none', locked: true });

      break;
    }

    case 'Blank Canvas': {
      const blankBg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1e293b', selectable: false });
      addObj(blankBg, { name: 'Background', role: 'background', locked: true });
      break;
    }

    default: {
      const defaultBg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1e293b', selectable: false });
      addObj(defaultBg, { name: 'Background', role: 'background', locked: true });
      break;
    }
  }

  if (brandColors) {
    canvas.getObjects().forEach((obj) => {
      const cObj = obj as unknown as CustomFabricObject;
      if (cObj.role === 'primary') obj.set('fill', brandColors.primary);
      if (cObj.role === 'secondary') obj.set('fill', brandColors.secondary);
      if (cObj.role === 'accent') obj.set('fill', brandColors.accent);
    });
  }

  const isLandscape = templateName === 'Branded Landscape';
  const isAOTW = templateName === 'Athlete of the Week';
  const logoCenterX = isAOTW ? 85 : dims.width / 2;
  const logoCenterY = isAOTW ? 85 : isLandscape ? dims.height / 2 : 100 * sy;
  const logoSize = isAOTW ? 70 : isLandscape ? 400 : 200 * Math.min(sx, sy);

  const addLandscapeTexture = () => {
    const textureOverlay = new fabric.Rect({
      width: 1920, height: 1080, left: 0, top: 0,
      fill: 'rgba(0,0,0,0)',
      selectable: false, evented: false,
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

  try {
    if (logoUrl) {
      const img = await fabric.Image.fromURL(logoUrl, { crossOrigin: 'anonymous' });
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
          canvas.bringObjectToFront(texture);
        }
      }
      canvas.renderAll();
    } else if (!isLandscape) {
      const img = await fabric.Image.fromURL(
        `${import.meta.env.BASE_URL}images/default-logo.png`,
        { crossOrigin: 'anonymous' }
      );
      if (img) {
        img.scaleToWidth(logoSize);
        img.set({ left: logoCenterX, top: logoCenterY, originX: 'center', originY: 'center' });
        addObj(img, { name: 'Team Logo', role: 'logo' });
        canvas.renderAll();
      }
    }
  } catch {
    // Logo loading failed silently — template still works without logo
  }

  canvas.renderAll();
};
