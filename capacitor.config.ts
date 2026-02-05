import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chengcheng.game',
  appName: '丞丞GAME',
  webDir: 'dist',
  plugins: {
    LiveUpdate: {
      enabled: true,
      autoUpdate: true,
      location: 'https://game-xhnj.onrender.com',
    },
  },
};

export default config;
