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
    case 'Game Day': {
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
    }

    case 'Rivalry Matchup': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#111827', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const leftPanel = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 580, y: 0 }, { x: 480, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#dc2626', opacity: 0.9 });
      addObj(leftPanel, { name: 'Left Panel', role: 'primary' });

      const rightPanel = new fabric.Polygon([
        { x: 600, y: 0 }, { x: 1080, y: 0 }, { x: 1080, y: 1080 }, { x: 500, y: 1080 }
      ], { fill: '#1e293b', opacity: 0.9 });
      addObj(rightPanel, { name: 'Right Panel', role: 'secondary' });

      const vsCircle = new fabric.Circle({
        radius: 60, fill: '#f59e0b', left: 540, top: 540,
        originX: 'center', originY: 'center'
      });
      addObj(vsCircle, { name: 'VS Badge', role: 'accent' });

      const vsLabel = new fabric.Textbox('VS', {
        fontFamily: 'Teko', fontSize: 70, fill: '#111827',
        left: 540, top: 540, originX: 'center', originY: 'center',
        fontWeight: 'bold'
      });
      addObj(vsLabel, { name: 'VS Text', role: 'text' });

      const rivalryTitle = new fabric.Textbox('RIVALRY\nWEEK', {
        fontFamily: 'Teko', fontSize: 160, fill: '#ffffff',
        left: 50, top: 80, fontWeight: 'bold', lineHeight: 0.85
      });
      addObj(rivalryTitle, { name: 'Title', role: 'text' });

      const team1 = new fabric.Textbox('HOME', {
        fontFamily: 'Teko', fontSize: 100, fill: '#ffffff',
        left: 200, top: 850, originX: 'center', fontWeight: 'bold'
      });
      addObj(team1, { name: 'Home Team', role: 'text' });

      const team2 = new fabric.Textbox('AWAY', {
        fontFamily: 'Teko', fontSize: 100, fill: '#ffffff',
        left: 850, top: 850, originX: 'center', fontWeight: 'bold'
      });
      addObj(team2, { name: 'Away Team', role: 'text' });

      const dateBar = new fabric.Rect({
        width: 1080, height: 80, fill: '#f59e0b', left: 0, top: 1000
      });
      addObj(dateBar, { name: 'Date Bar', role: 'accent' });

      const dateText = new fabric.Textbox('FRIDAY • 7:00 PM • HOME STADIUM', {
        fontFamily: 'Inter', fontSize: 30, fill: '#111827',
        left: 540, top: 1040, originX: 'center', originY: 'center',
        fontWeight: 'bold', charSpacing: 80
      });
      addObj(dateText, { name: 'Date Info', role: 'text' });
      break;
    }

    case 'Conference Tournament': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#0f172a', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const topGrad = new fabric.Rect({
        width: 1080, height: 400, fill: '#7c3aed', left: 0, top: 0, opacity: 0.6
      });
      addObj(topGrad, { name: 'Top Overlay', role: 'primary' });

      const centerBadge = new fabric.Rect({
        width: 700, height: 250, fill: '#7c3aed',
        left: 540, top: 440, originX: 'center', originY: 'center', rx: 16, ry: 16
      });
      addObj(centerBadge, { name: 'Center Badge', role: 'primary' });

      const confTitle = new fabric.Textbox('CONFERENCE\nTOURNAMENT', {
        fontFamily: 'Teko', fontSize: 120, fill: '#ffffff',
        left: 540, top: 440, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center', lineHeight: 0.85
      });
      addObj(confTitle, { name: 'Title', role: 'text' });

      const yearText = new fabric.Textbox('2026', {
        fontFamily: 'Teko', fontSize: 300, fill: '#fbbf24', opacity: 0.15,
        left: 540, top: 200, originX: 'center', originY: 'center',
        fontWeight: 'bold'
      });
      addObj(yearText, { name: 'Year Watermark', role: 'accent' });

      const bracketLine1 = new fabric.Rect({
        width: 300, height: 60, fill: '#1e293b',
        left: 100, top: 650, rx: 8, ry: 8
      });
      addObj(bracketLine1, { name: 'Bracket Slot 1', role: 'secondary' });

      const bracketLine2 = new fabric.Rect({
        width: 300, height: 60, fill: '#1e293b',
        left: 100, top: 730, rx: 8, ry: 8
      });
      addObj(bracketLine2, { name: 'Bracket Slot 2', role: 'secondary' });

      const bracketLine3 = new fabric.Rect({
        width: 300, height: 60, fill: '#1e293b',
        left: 680, top: 650, rx: 8, ry: 8
      });
      addObj(bracketLine3, { name: 'Bracket Slot 3', role: 'secondary' });

      const bracketLine4 = new fabric.Rect({
        width: 300, height: 60, fill: '#1e293b',
        left: 680, top: 730, rx: 8, ry: 8
      });
      addObj(bracketLine4, { name: 'Bracket Slot 4', role: 'secondary' });

      const slot1Text = new fabric.Textbox('TEAM A', {
        fontFamily: 'Inter', fontSize: 24, fill: '#ffffff',
        left: 250, top: 680, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(slot1Text, { name: 'Slot 1 Text', role: 'text' });

      const slot2Text = new fabric.Textbox('TEAM B', {
        fontFamily: 'Inter', fontSize: 24, fill: '#ffffff',
        left: 250, top: 760, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(slot2Text, { name: 'Slot 2 Text', role: 'text' });

      const slot3Text = new fabric.Textbox('TEAM C', {
        fontFamily: 'Inter', fontSize: 24, fill: '#ffffff',
        left: 830, top: 680, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(slot3Text, { name: 'Slot 3 Text', role: 'text' });

      const slot4Text = new fabric.Textbox('TEAM D', {
        fontFamily: 'Inter', fontSize: 24, fill: '#ffffff',
        left: 830, top: 760, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(slot4Text, { name: 'Slot 4 Text', role: 'text' });

      const finalBox = new fabric.Rect({
        width: 350, height: 70, fill: '#fbbf24',
        left: 540, top: 880, originX: 'center', originY: 'center', rx: 8, ry: 8
      });
      addObj(finalBox, { name: 'Final Box', role: 'accent' });

      const finalText = new fabric.Textbox('CHAMPIONSHIP', {
        fontFamily: 'Teko', fontSize: 40, fill: '#0f172a',
        left: 540, top: 880, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(finalText, { name: 'Final Label', role: 'text' });
      break;
    }

    case 'Score Announcement': {
      const scoreBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: defaultColors.secondary, selectable: false });
      addObj(scoreBg, { name: 'Background', role: 'background', locked: true });

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
    }

    case 'Weekly Recap': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#0f172a', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const headerBar = new fabric.Rect({
        width: 1080, height: 200, fill: '#059669', left: 0, top: 0
      });
      addObj(headerBar, { name: 'Header Bar', role: 'primary' });

      const recapTitle = new fabric.Textbox('WEEKLY RECAP', {
        fontFamily: 'Teko', fontSize: 140, fill: '#ffffff',
        left: 540, top: 100, originX: 'center', originY: 'center',
        fontWeight: 'bold'
      });
      addObj(recapTitle, { name: 'Title', role: 'text' });

      const weekLabel = new fabric.Textbox('WEEK 8 RESULTS', {
        fontFamily: 'Inter', fontSize: 28, fill: '#f0fdf4',
        left: 540, top: 240, originX: 'center', fontWeight: 'bold', charSpacing: 150
      });
      addObj(weekLabel, { name: 'Week Label', role: 'accent' });

      const gameRows = [
        { y: 320, teams: 'EAGLES vs HAWKS', score: 'W 35 - 21' },
        { y: 460, teams: 'EAGLES vs TIGERS', score: 'W 28 - 14' },
        { y: 600, teams: 'EAGLES vs BEARS', score: 'L 17 - 24' },
      ];

      gameRows.forEach((row, i) => {
        const rowBg = new fabric.Rect({
          width: 920, height: 100, fill: i % 2 === 0 ? '#1e293b' : '#334155',
          left: 80, top: row.y, rx: 8, ry: 8
        });
        addObj(rowBg, { name: `Row ${i + 1} Bg`, role: 'secondary' });

        const teamText = new fabric.Textbox(row.teams, {
          fontFamily: 'Inter', fontSize: 30, fill: '#ffffff',
          left: 120, top: row.y + 35, fontWeight: 'bold'
        });
        addObj(teamText, { name: `Game ${i + 1} Teams`, role: 'text' });

        const scoreText = new fabric.Textbox(row.score, {
          fontFamily: 'Teko', fontSize: 45, fill: row.score.startsWith('W') ? '#4ade80' : '#f87171',
          left: 870, top: row.y + 50, originX: 'center', originY: 'center', fontWeight: 'bold'
        });
        addObj(scoreText, { name: `Game ${i + 1} Score`, role: 'accent' });
      });

      const recordBox = new fabric.Rect({
        width: 400, height: 120, fill: '#059669',
        left: 540, top: 830, originX: 'center', originY: 'center', rx: 12, ry: 12
      });
      addObj(recordBox, { name: 'Record Box', role: 'primary' });

      const recordText = new fabric.Textbox('SEASON: 6-2', {
        fontFamily: 'Teko', fontSize: 60, fill: '#ffffff',
        left: 540, top: 830, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(recordText, { name: 'Season Record', role: 'text' });
      break;
    }

    case 'Championship': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1c1917', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const goldOverlay = new fabric.Rect({
        width: 1080, height: 1080, fill: '#d97706', opacity: 0.1
      });
      addObj(goldOverlay, { name: 'Gold Overlay', role: 'accent' });

      const topBorder = new fabric.Rect({
        width: 1080, height: 12, fill: '#d97706', left: 0, top: 0
      });
      addObj(topBorder, { name: 'Top Border', role: 'accent' });

      const bottomBorder = new fabric.Rect({
        width: 1080, height: 12, fill: '#d97706', left: 0, top: 1068
      });
      addObj(bottomBorder, { name: 'Bottom Border', role: 'accent' });

      const champLabel = new fabric.Textbox('CHAMPIONS', {
        fontFamily: 'Teko', fontSize: 180, fill: '#d97706',
        left: 540, top: 180, originX: 'center', originY: 'center',
        fontWeight: 'bold'
      });
      addObj(champLabel, { name: 'Champions Title', role: 'accent' });

      const yearWatermark = new fabric.Textbox('2026', {
        fontFamily: 'Teko', fontSize: 400, fill: '#ffffff', opacity: 0.05,
        left: 540, top: 540, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(yearWatermark, { name: 'Year Watermark', role: 'text' });

      const trophyBg = new fabric.Circle({
        radius: 150, fill: '#d97706', opacity: 0.2,
        left: 540, top: 480, originX: 'center', originY: 'center'
      });
      addObj(trophyBg, { name: 'Trophy Circle', role: 'primary' });

      const trophyText = new fabric.Textbox('🏆', {
        fontSize: 180,
        left: 540, top: 480, originX: 'center', originY: 'center'
      });
      addObj(trophyText, { name: 'Trophy Icon', role: 'none' });

      const teamNameChamp = new fabric.Textbox('TEAM NAME', {
        fontFamily: 'Teko', fontSize: 120, fill: '#ffffff',
        left: 540, top: 700, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(teamNameChamp, { name: 'Team Name', role: 'text' });

      const confLabel = new fabric.Textbox('CONFERENCE CHAMPIONS', {
        fontFamily: 'Inter', fontSize: 30, fill: '#fef3c7',
        left: 540, top: 790, originX: 'center', fontWeight: 'bold', charSpacing: 200
      });
      addObj(confLabel, { name: 'Conference Label', role: 'accent' });

      const recordChamp = new fabric.Textbox('UNDEFEATED • 12-0', {
        fontFamily: 'Inter', fontSize: 28, fill: '#d97706',
        left: 540, top: 900, originX: 'center', fontWeight: 'bold', charSpacing: 100
      });
      addObj(recordChamp, { name: 'Record', role: 'accent' });
      break;
    }

    case 'Player Spotlight': {
      const spotBg = new fabric.Rect({ width: dims.width, height: dims.height, fill: '#111', selectable: false });
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
    }

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

    case 'Senior Night': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1c1917', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const topFrame = new fabric.Rect({
        width: 1000, height: 1000, fill: 'transparent',
        left: 40, top: 40, rx: 0, ry: 0,
        stroke: '#fde68a', strokeWidth: 4
      });
      addObj(topFrame, { name: 'Decorative Frame', role: 'accent' });

      const seniorBanner = new fabric.Rect({
        width: 600, height: 100, fill: '#b91c1c',
        left: 540, top: 120, originX: 'center', originY: 'center', rx: 0, ry: 0
      });
      addObj(seniorBanner, { name: 'Senior Banner', role: 'primary' });

      const seniorLabel = new fabric.Textbox('SENIOR NIGHT', {
        fontFamily: 'Teko', fontSize: 80, fill: '#ffffff',
        left: 540, top: 120, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(seniorLabel, { name: 'Senior Label', role: 'text' });

      const classOf = new fabric.Textbox('CLASS OF 2026', {
        fontFamily: 'Inter', fontSize: 30, fill: '#fde68a',
        left: 540, top: 200, originX: 'center', fontWeight: 'bold', charSpacing: 200
      });
      addObj(classOf, { name: 'Class Of', role: 'accent' });

      const playerPlaceholder = new fabric.Rect({
        width: 500, height: 500, fill: '#292524',
        left: 540, top: 520, originX: 'center', originY: 'center', rx: 12, ry: 12
      });
      addObj(playerPlaceholder, { name: 'Photo Area', role: 'secondary' });

      const photoLabel = new fabric.Textbox('PLAYER\nPHOTO', {
        fontFamily: 'Inter', fontSize: 40, fill: '#78716c',
        left: 540, top: 520, originX: 'center', originY: 'center',
        textAlign: 'center'
      });
      addObj(photoLabel, { name: 'Photo Label', role: 'none' });

      const seniorName = new fabric.Textbox('PLAYER NAME', {
        fontFamily: 'Teko', fontSize: 100, fill: '#ffffff',
        left: 540, top: 820, originX: 'center', fontWeight: 'bold'
      });
      addObj(seniorName, { name: 'Player Name', role: 'text' });

      const seniorInfo = new fabric.Textbox('#00 • POSITION • 4 YEARS', {
        fontFamily: 'Inter', fontSize: 24, fill: '#fde68a',
        left: 540, top: 920, originX: 'center', fontWeight: 'bold', charSpacing: 80
      });
      addObj(seniorInfo, { name: 'Player Info', role: 'accent' });

      const thankYou = new fabric.Textbox('THANK YOU FOR YOUR DEDICATION', {
        fontFamily: 'Inter', fontSize: 20, fill: '#a8a29e',
        left: 540, top: 980, originX: 'center', charSpacing: 100
      });
      addObj(thankYou, { name: 'Thank You', role: 'text' });
      break;
    }

    case 'Stat Leader Board': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#020617', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const headerBg = new fabric.Rect({
        width: 1080, height: 180, fill: '#0ea5e9', left: 0, top: 0
      });
      addObj(headerBg, { name: 'Header', role: 'primary' });

      const lbTitle = new fabric.Textbox('STAT LEADERS', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        left: 540, top: 90, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(lbTitle, { name: 'Title', role: 'text' });

      const players = [
        { rank: '1', name: 'J. SMITH', stat: '28.5 PPG', y: 260 },
        { rank: '2', name: 'M. JOHNSON', stat: '24.2 PPG', y: 400 },
        { rank: '3', name: 'D. WILLIAMS', stat: '21.8 PPG', y: 540 },
        { rank: '4', name: 'A. BROWN', stat: '19.4 PPG', y: 680 },
        { rank: '5', name: 'K. DAVIS', stat: '17.1 PPG', y: 820 },
      ];

      players.forEach((p, i) => {
        const rowBg = new fabric.Rect({
          width: 920, height: 100, fill: i % 2 === 0 ? '#0f172a' : '#1e293b',
          left: 80, top: p.y, rx: 8, ry: 8
        });
        addObj(rowBg, { name: `Row ${i + 1}`, role: 'secondary' });

        const rankText = new fabric.Textbox(p.rank, {
          fontFamily: 'Teko', fontSize: 60, fill: '#0ea5e9',
          left: 130, top: p.y + 50, originY: 'center', fontWeight: 'bold'
        });
        addObj(rankText, { name: `Rank ${i + 1}`, role: 'accent' });

        const nameText = new fabric.Textbox(p.name, {
          fontFamily: 'Inter', fontSize: 32, fill: '#ffffff',
          left: 210, top: p.y + 35, fontWeight: 'bold'
        });
        addObj(nameText, { name: `Player ${i + 1} Name`, role: 'text' });

        const statText = new fabric.Textbox(p.stat, {
          fontFamily: 'Teko', fontSize: 45, fill: '#e0f2fe',
          left: 900, top: p.y + 50, originX: 'center', originY: 'center', fontWeight: 'bold'
        });
        addObj(statText, { name: `Player ${i + 1} Stat`, role: 'text' });
      });
      break;
    }

    case 'Season Schedule': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#0f172a', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const sideBand = new fabric.Rect({
        width: 80, height: 1080, fill: '#1e40af', left: 0, top: 0
      });
      addObj(sideBand, { name: 'Side Band', role: 'primary' });

      const schedTitle = new fabric.Textbox('2026\nSEASON', {
        fontFamily: 'Teko', fontSize: 120, fill: '#ffffff',
        left: 140, top: 60, fontWeight: 'bold', lineHeight: 0.85
      });
      addObj(schedTitle, { name: 'Title', role: 'text' });

      const schedLabel = new fabric.Textbox('SCHEDULE', {
        fontFamily: 'Inter', fontSize: 24, fill: '#dbeafe',
        left: 145, top: 280, fontWeight: 'bold', charSpacing: 300
      });
      addObj(schedLabel, { name: 'Schedule Label', role: 'accent' });

      const games = [
        { date: 'SEP 5', opp: 'vs HAWKS', loc: 'HOME' },
        { date: 'SEP 12', opp: 'at TIGERS', loc: 'AWAY' },
        { date: 'SEP 19', opp: 'vs BEARS', loc: 'HOME' },
        { date: 'SEP 26', opp: 'at WOLVES', loc: 'AWAY' },
        { date: 'OCT 3', opp: 'vs LIONS', loc: 'HOME' },
        { date: 'OCT 10', opp: 'at PANTHERS', loc: 'AWAY' },
      ];

      games.forEach((g, i) => {
        const y = 360 + i * 105;
        const rowBg = new fabric.Rect({
          width: 860, height: 80, fill: i % 2 === 0 ? '#1e293b' : '#0f172a',
          left: 140, top: y, rx: 6, ry: 6
        });
        addObj(rowBg, { name: `Game ${i + 1} Row`, role: 'secondary' });

        const dateText = new fabric.Textbox(g.date, {
          fontFamily: 'Inter', fontSize: 22, fill: '#dbeafe',
          left: 170, top: y + 28, fontWeight: 'bold'
        });
        addObj(dateText, { name: `Game ${i + 1} Date`, role: 'accent' });

        const oppText = new fabric.Textbox(g.opp, {
          fontFamily: 'Teko', fontSize: 40, fill: '#ffffff',
          left: 400, top: y + 40, originY: 'center', fontWeight: 'bold'
        });
        addObj(oppText, { name: `Game ${i + 1} Opponent`, role: 'text' });

        const locText = new fabric.Textbox(g.loc, {
          fontFamily: 'Inter', fontSize: 18, fill: g.loc === 'HOME' ? '#4ade80' : '#fbbf24',
          left: 900, top: y + 28, fontWeight: 'bold'
        });
        addObj(locText, { name: `Game ${i + 1} Location`, role: 'accent' });
      });
      break;
    }

    case 'Practice Update': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#14532d', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const mainCard = new fabric.Rect({
        width: 920, height: 920, fill: '#0f172a',
        left: 540, top: 540, originX: 'center', originY: 'center', rx: 20, ry: 20
      });
      addObj(mainCard, { name: 'Main Card', role: 'secondary' });

      const accentLine = new fabric.Rect({
        width: 920, height: 8, fill: '#16a34a',
        left: 540, top: 130, originX: 'center'
      });
      addObj(accentLine, { name: 'Accent Line', role: 'primary' });

      const practiceTitle = new fabric.Textbox('PRACTICE\nUPDATE', {
        fontFamily: 'Teko', fontSize: 140, fill: '#ffffff',
        left: 540, top: 250, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center', lineHeight: 0.85
      });
      addObj(practiceTitle, { name: 'Title', role: 'text' });

      const divider = new fabric.Rect({
        width: 200, height: 4, fill: '#16a34a',
        left: 540, top: 360, originX: 'center'
      });
      addObj(divider, { name: 'Divider', role: 'primary' });

      const infoBlock = new fabric.Textbox('DATE: TUESDAY, MARCH 10\nTIME: 3:30 PM - 5:30 PM\nLOCATION: MAIN FIELD', {
        fontFamily: 'Inter', fontSize: 28, fill: '#bbf7d0',
        left: 540, top: 450, originX: 'center', fontWeight: 'bold',
        textAlign: 'center', lineHeight: 1.8
      });
      addObj(infoBlock, { name: 'Info Block', role: 'accent' });

      const noteBox = new fabric.Rect({
        width: 700, height: 180, fill: '#1e293b',
        left: 540, top: 700, originX: 'center', originY: 'center', rx: 12, ry: 12
      });
      addObj(noteBox, { name: 'Note Box', role: 'secondary' });

      const noteText = new fabric.Textbox('BRING FULL GEAR\nFOCUS: DEFENSIVE DRILLS', {
        fontFamily: 'Teko', fontSize: 50, fill: '#ffffff',
        left: 540, top: 700, originX: 'center', originY: 'center',
        fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2
      });
      addObj(noteText, { name: 'Note Text', role: 'text' });

      const footer = new fabric.Textbox('BE ON TIME • BE PREPARED • BE GREAT', {
        fontFamily: 'Inter', fontSize: 18, fill: '#16a34a',
        left: 540, top: 880, originX: 'center', fontWeight: 'bold', charSpacing: 100
      });
      addObj(footer, { name: 'Footer', role: 'accent' });
      break;
    }

    case 'Team Roster Reveal': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1e1b4b', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const headerStripe = new fabric.Rect({
        width: 1080, height: 200, fill: '#7c3aed', left: 0, top: 0
      });
      addObj(headerStripe, { name: 'Header', role: 'primary' });

      const rosterTitle = new fabric.Textbox('ROSTER REVEAL', {
        fontFamily: 'Teko', fontSize: 130, fill: '#ffffff',
        left: 540, top: 100, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(rosterTitle, { name: 'Title', role: 'text' });

      const seasonLabel = new fabric.Textbox('2025-2026 SEASON', {
        fontFamily: 'Inter', fontSize: 24, fill: '#ede9fe',
        left: 540, top: 240, originX: 'center', fontWeight: 'bold', charSpacing: 200
      });
      addObj(seasonLabel, { name: 'Season Label', role: 'accent' });

      const gridData = [
        ['#1 SMITH', '#2 JONES', '#3 DAVIS'],
        ['#4 WILSON', '#5 BROWN', '#6 GARCIA'],
        ['#7 MILLER', '#8 TAYLOR', '#9 THOMAS'],
      ];

      gridData.forEach((row, ri) => {
        row.forEach((player, ci) => {
          const x = 130 + ci * 300;
          const y = 320 + ri * 220;

          const cell = new fabric.Rect({
            width: 260, height: 180, fill: '#312e81',
            left: x, top: y, rx: 10, ry: 10
          });
          addObj(cell, { name: `Cell ${ri * 3 + ci + 1}`, role: 'secondary' });

          const playerText = new fabric.Textbox(player, {
            fontFamily: 'Teko', fontSize: 36, fill: '#ffffff',
            left: x + 130, top: y + 90, originX: 'center', originY: 'center',
            fontWeight: 'bold', textAlign: 'center'
          });
          addObj(playerText, { name: `Player ${ri * 3 + ci + 1}`, role: 'text' });
        });
      });

      const bottomBar = new fabric.Rect({
        width: 1080, height: 60, fill: '#7c3aed', left: 0, top: 1020
      });
      addObj(bottomBar, { name: 'Bottom Bar', role: 'primary' });
      break;
    }

    case 'Recruitment Graphic': {
      const bg = new fabric.Rect({ width: 1080, height: 1080, fill: '#1c1917', selectable: false });
      addObj(bg, { name: 'Background', role: 'background', locked: true });

      const diag1 = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 1080, y: 0 }, { x: 1080, y: 300 }, { x: 0, y: 500 }
      ], { fill: '#ea580c', opacity: 0.8 });
      addObj(diag1, { name: 'Top Diagonal', role: 'primary' });

      const diag2 = new fabric.Polygon([
        { x: 0, y: 780 }, { x: 1080, y: 580 }, { x: 1080, y: 1080 }, { x: 0, y: 1080 }
      ], { fill: '#ea580c', opacity: 0.6 });
      addObj(diag2, { name: 'Bottom Diagonal', role: 'primary' });

      const recruitTitle = new fabric.Textbox('JOIN\nTHE\nTEAM', {
        fontFamily: 'Teko', fontSize: 200, fill: '#ffffff',
        left: 80, top: 300, fontWeight: 'bold', lineHeight: 0.8
      });
      addObj(recruitTitle, { name: 'Title', role: 'text' });

      const ctaBox = new fabric.Rect({
        width: 420, height: 80, fill: '#fff7ed',
        left: 600, top: 700, rx: 8, ry: 8
      });
      addObj(ctaBox, { name: 'CTA Box', role: 'accent' });

      const ctaText = new fabric.Textbox('TRYOUTS: MAR 15', {
        fontFamily: 'Teko', fontSize: 45, fill: '#1c1917',
        left: 810, top: 740, originX: 'center', originY: 'center', fontWeight: 'bold'
      });
      addObj(ctaText, { name: 'CTA Text', role: 'text' });

      const contactInfo = new fabric.Textbox('CONTACT: COACH@SCHOOL.EDU', {
        fontFamily: 'Inter', fontSize: 22, fill: '#fff7ed',
        left: 810, top: 810, originX: 'center', fontWeight: 'bold', charSpacing: 60
      });
      addObj(contactInfo, { name: 'Contact', role: 'accent' });

      const tagline = new fabric.Textbox('BE PART OF SOMETHING GREATER', {
        fontFamily: 'Inter', fontSize: 18, fill: '#ea580c',
        left: 540, top: 1030, originX: 'center', fontWeight: 'bold', charSpacing: 150
      });
      addObj(tagline, { name: 'Tagline', role: 'accent' });
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
