import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hoysala.app',
  appName: 'HDC Portal',
  webDir: 'dist',
  server: {
    url: 'https://bf45966f-1aa1-4ed2-86cd-abc540ba6fab.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
