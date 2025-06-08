
export interface Theme {
  label: string;
  background: string;
  title: string;
  typeBoxText: string;
  stats: string;
  keyboardBackground: string;
  keyBackground: string;
  keyText: string;
  keyPressed: string;
  cursor: string;
  isDark?: boolean;
}

export const themes: Record<string, Theme> = {
  vantaBlack: {
    label: 'Vanta Black',
    background: '#2B2B2B',
    title: '#FFFFFF',
    typeBoxText: '#D4D4D4',
    stats: '#FFFFFF',
    keyboardBackground: 'transparent',
    keyBackground: '#404040',
    keyText: '#FFFFFF',
    keyPressed: '#606060',
    cursor: '#FFFFFF',
    isDark: true
  },
  lightGray: {
    label: 'Light Gray',
    background: '#FFFFFF',
    title: '#2B2B2B',
    typeBoxText: '#2B2B2B',
    stats: '#2B2B2B',
    keyboardBackground: 'transparent',
    keyBackground: '#E5E5E5',
    keyText: '#2B2B2B',
    keyPressed: '#B8B8B8',
    cursor: '#2B2B2B',
    isDark: false
  },
  oceanDark: {
    label: 'Ocean Dark',
    background: '#0F172A',
    title: '#38BDF8',
    typeBoxText: '#CBD5E1',
    stats: '#38BDF8',
    keyboardBackground: 'transparent',
    keyBackground: '#1E293B',
    keyText: '#94A3B8',
    keyPressed: '#475569',
    cursor: '#38BDF8',
    isDark: true
  },
  purpleHaze: {
    label: 'Purple Haze',
    background: '#1A0B2E',
    title: '#A855F7',
    typeBoxText: '#C4B5FD',
    stats: '#A855F7',
    keyboardBackground: 'transparent',
    keyBackground: '#2D1B69',
    keyText: '#DDD6FE',
    keyPressed: '#4C1D95',
    cursor: '#A855F7',
    isDark: true
  },
  sunsetOrange: {
    label: 'Sunset Orange',
    background: '#FFF7ED',
    title: '#EA580C',
    typeBoxText: '#FB923C',
    stats: '#EA580C',
    keyboardBackground: 'transparent',
    keyBackground: '#FED7AA',
    keyText: '#EA580C',
    keyPressed: '#FDC893',
    cursor: '#EA580C',
    isDark: false
  },
  mintFresh: {
    label: 'Mint Fresh',
    background: '#F0FDF4',
    title: '#059669',
    typeBoxText: '#10B981',
    stats: '#059669',
    keyboardBackground: 'transparent',
    keyBackground: '#BBF7D0',
    keyText: '#059669',
    keyPressed: '#A7F3D0',
    cursor: '#059669',
    isDark: false
  },
  cyberpunkNeon: {
    label: 'Cyberpunk Neon',
    background: '#0C0C0C',
    title: '#00FF9F',
    typeBoxText: '#00FFFF',
    stats: '#00FF9F',
    keyboardBackground: 'transparent',
    keyBackground: '#1A1A1A',
    keyText: '#00FFFF',
    keyPressed: '#333333',
    cursor: '#00FF9F',
    isDark: true
  },
  rosePetals: {
    label: 'Rose Petals',
    background: '#FFF1F2',
    title: '#E11D48',
    typeBoxText: '#F43F5E',
    stats: '#E11D48',
    keyboardBackground: 'transparent',
    keyBackground: '#FECDD3',
    keyText: '#E11D48',
    keyPressed: '#FDA4AF',
    cursor: '#E11D48',
    isDark: false
  },
  twilightPurple: {
    label: 'Twilight Purple',
    background: '#1E1B4B',
    title: '#C084FC',
    typeBoxText: '#DDD6FE',
    stats: '#C084FC',
    keyboardBackground: 'transparent',
    keyBackground: '#312E81',
    keyText: '#DDD6FE',
    keyPressed: '#4338CA',
    cursor: '#C084FC',
    isDark: true
  },
  arcticFrost: {
    label: 'Arctic Frost',
    background: '#F0F9FF',
    title: '#0284C7',
    typeBoxText: '#0369A1',
    stats: '#0284C7',
    keyboardBackground: 'transparent',
    keyBackground: '#E0F2FE',
    keyText: '#0369A1',
    keyPressed: '#BAE6FD',
    cursor: '#0284C7',
    isDark: false
  },
  emberGlow: {
    label: 'Ember Glow',
    background: '#0C0A09',
    title: '#F97316',
    typeBoxText: '#FDBA74',
    stats: '#F97316',
    keyboardBackground: 'transparent',
    keyBackground: '#1C1917',
    keyText: '#FDBA74',
    keyPressed: '#292524',
    cursor: '#F97316',
    isDark: true
  },
  neonCity: {
    label: 'Neon City',
    background: '#0A0A0F',
    title: '#8B5CF6',
    typeBoxText: '#06B6D4',
    stats: '#8B5CF6',
    keyboardBackground: 'transparent',
    keyBackground: '#1E1B4B',
    keyText: '#06B6D4',
    keyPressed: '#3730A3',
    cursor: '#8B5CF6',
    isDark: true
  },
  goldenHour: {
    label: 'Golden Hour',
    background: '#FFFBEB',
    title: '#D97706',
    typeBoxText: '#F59E0B',
    stats: '#D97706',
    keyboardBackground: 'transparent',
    keyBackground: '#FEF3C7',
    keyText: '#D97706',
    keyPressed: '#FDE68A',
    cursor: '#D97706',
    isDark: false
  },
  midnightOcean: {
    label: 'Midnight Ocean',
    background: '#0F172A',
    title: '#06B6D4',
    typeBoxText: '#67E8F9',
    stats: '#06B6D4',
    keyboardBackground: 'transparent',
    keyBackground: '#1E293B',
    keyText: '#67E8F9',
    keyPressed: '#334155',
    cursor: '#06B6D4',
    isDark: true
  }
};

export const themeOptions = Object.entries(themes).map(([value, theme]) => ({
  value,
  label: theme.label
}));
