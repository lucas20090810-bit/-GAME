import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chengcheng.game',
  appName: '丞丞GAME',
  webDir: 'dist',
  plugins: {
    LiveUpdate: {
      autoDeleteBundles: true,
      readyTimeout: 10000,
    },
  },
};

export default config;
