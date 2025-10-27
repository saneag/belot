import { Theme } from '@react-navigation/native';

export const DarkTheme: Theme = {
  colors: {
    background: '#2b2b2bff',
    text: '#ffffffff',
    border: '#3f3f3fff',
    card: '#1c1c1cff',
    notification: '#ff453aff',
    primary: '#0a84ff',
  },
  dark: true,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
  },
};

export const LightTheme: Theme = {
  colors: {
    background: '#cacacaff',
    text: '#2b2b2bff',
    border: '#8e8e93ff',
    card: '#ffffffff',
    notification: '#ff3b30ff',
    primary: '#007aff',
  },
  dark: false,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
  },
};
