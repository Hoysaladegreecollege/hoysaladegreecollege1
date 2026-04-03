import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hoysala.app',
  appName: 'HDC Portal',
  webDir: 'dist',
  // For production: app loads from local built files (no Chrome redirect)
  // For development/hot-reload, uncomment the server block below:
  // server: {
  //   url: 'https://hoysaladegreecollege1.lovable.app',
  //   cleartext: true,
  // },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
